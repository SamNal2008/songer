#!/usr/bin/env python3
"""
hum_search.py - Hum-to-Search POC
Record a hum, extract pitch contour, match against enrolled songs via DTW.

Usage:
    python hum_search.py enroll <song_id>          # record 8s and enroll
    python hum_search.py identify --topk 3          # record 8s and match
    python hum_search.py enroll <song_id> --wav f.wav   # enroll from file
    python hum_search.py identify --wav f.wav           # identify from file
"""

import argparse
import json
import os
import sys
import warnings
from pathlib import Path

import numpy as np

# ── Constants ──────────────────────────────────────────────────────────────
SAMPLE_RATE = 16000
DURATION = 8          # seconds
DB_PATH = Path("hum_db.json")
HOP_LENGTH = 512
FMIN = 65.0           # C2 - lowest expected hum
FMAX = 800.0          # ~G5 - highest expected hum
DOWNSAMPLE_FACTOR = 4 # downsample contour for faster DTW
CREPE_CONFIDENCE = 0.5


# ── Audio I/O ──────────────────────────────────────────────────────────────

def record_audio(duration=DURATION, sr=SAMPLE_RATE):
    """Record audio from the default microphone."""
    try:
        import sounddevice as sd
    except ImportError:
        sys.exit(
            "ERROR: sounddevice is not installed.\n"
            "  Run: pip install sounddevice\n"
            "  macOS may also need: brew install portaudio"
        )
    except OSError as e:
        sys.exit(
            f"ERROR: PortAudio library not found: {e}\n"
            "  macOS:  brew install portaudio\n"
            "  Linux:  sudo apt install libportaudio2   (Debian/Ubuntu)\n"
            "          sudo dnf install portaudio        (Fedora)"
        )

    print(f"Recording {duration}s - hum now! ", end="", flush=True)
    try:
        audio = sd.rec(
            int(duration * sr), samplerate=sr, channels=1, dtype="float32"
        )
        sd.wait()
    except sd.PortAudioError as e:
        sys.exit(
            f"ERROR: Microphone access failed: {e}\n"
            "  macOS: System Settings > Privacy & Security > Microphone > allow your terminal app\n"
            "  Linux: check PulseAudio/PipeWire is running (`pactl info`)"
        )

    audio = audio.flatten()
    peak = np.max(np.abs(audio))
    if peak < 1e-4:
        sys.exit(
            "ERROR: Recorded audio is silent.\n"
            "  - Is your microphone muted or unplugged?\n"
            "  - macOS: check System Settings > Sound > Input"
        )

    print(f"done (peak amplitude: {peak:.4f})")
    return audio


def load_wav(path):
    """Load a WAV file, convert to mono float32 at SAMPLE_RATE."""
    try:
        import soundfile as sf
    except ImportError:
        sys.exit("ERROR: soundfile is not installed. Run: pip install soundfile")

    if not os.path.isfile(path):
        sys.exit(f"ERROR: File not found: {path}")

    audio, sr = sf.read(path, dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)

    if sr != SAMPLE_RATE:
        import librosa
        audio = librosa.resample(audio, orig_sr=sr, target_sr=SAMPLE_RATE)

    return audio


# ── Pitch Extraction ──────────────────────────────────────────────────────

def extract_pitch(audio, sr=SAMPLE_RATE):
    """
    Extract pitch contour from audio.
    Tries CREPE first (better accuracy), falls back to librosa.pyin.
    Returns an array of f0 values (Hz); unvoiced frames are 0.
    """
    # --- Try CREPE ---
    try:
        import crepe
        print("  Pitch extraction: CREPE")
        _, frequency, confidence, _ = crepe.predict(
            audio, sr, viterbi=True,
            step_size=int(1000 * HOP_LENGTH / sr),  # ms per step
        )
        frequency[confidence < CREPE_CONFIDENCE] = 0.0
        return frequency
    except ImportError:
        pass

    # --- Fallback: librosa.pyin ---
    import librosa
    print("  Pitch extraction: librosa.pyin")
    f0, voiced_flag, voiced_prob = librosa.pyin(
        audio, fmin=FMIN, fmax=FMAX, sr=sr, hop_length=HOP_LENGTH
    )
    f0 = np.where(voiced_flag, f0, 0.0)
    f0 = np.nan_to_num(f0, nan=0.0)
    return f0


# ── Contour Processing ───────────────────────────────────────────────────

def normalize_contour(f0):
    """
    1. Keep only voiced frames (f0 > 0)
    2. Convert to log2 domain (semitone-proportional)
    3. Z-score normalize (removes key/octave bias)
    4. Downsample for DTW speed
    Returns None if too little pitched content.
    """
    voiced = f0[f0 > 0]
    if len(voiced) < 10:
        return None

    log_f0 = np.log2(voiced)
    mean, std = np.mean(log_f0), np.std(log_f0)
    if std < 1e-6:
        return None  # monotone - no melodic content

    normalized = (log_f0 - mean) / std
    normalized = normalized[::DOWNSAMPLE_FACTOR]

    if len(normalized) < 5:
        return None

    return normalized


# ── DTW Matching ──────────────────────────────────────────────────────────

def dtw_distance(contour_a, contour_b):
    """
    Compute normalized DTW distance between two pitch contours
    using librosa.sequence.dtw.
    """
    import librosa

    # Build pairwise cost matrix (absolute difference)
    cost = np.abs(contour_a[:, np.newaxis] - contour_b[np.newaxis, :])
    D, wp = librosa.sequence.dtw(C=cost)

    # Normalize by warping-path length
    return D[-1, -1] / len(wp)


# ── Database ──────────────────────────────────────────────────────────────

def load_db():
    if not DB_PATH.exists():
        return {}
    with open(DB_PATH, "r") as f:
        return json.load(f)


def save_db(db):
    with open(DB_PATH, "w") as f:
        json.dump(db, f, indent=2)


# ── Commands ──────────────────────────────────────────────────────────────

def cmd_enroll(args):
    """Record (or load) a hum and store its pitch contour."""
    song_id = args.song_id

    if args.wav:
        print(f"Loading: {args.wav}")
        audio = load_wav(args.wav)
    else:
        audio = record_audio()

    print("  Extracting pitch contour...")
    f0 = extract_pitch(audio)
    contour = normalize_contour(f0)

    if contour is None:
        sys.exit(
            "ERROR: No usable pitch contour detected.\n"
            "  Tip: hum a clear melody (not speech, not silence)."
        )

    db = load_db()
    db[song_id] = contour.tolist()
    save_db(db)

    print(f"  Enrolled '{song_id}' - {len(contour)} contour frames saved to {DB_PATH}")


def cmd_identify(args):
    """Record (or load) a hum and rank enrolled songs by DTW distance."""
    db = load_db()
    if not db:
        sys.exit(
            "ERROR: Database is empty. Enroll at least one song first:\n"
            "  python hum_search.py enroll my-song"
        )

    if args.wav:
        print(f"Loading query: {args.wav}")
        audio = load_wav(args.wav)
    else:
        audio = record_audio()

    print("  Extracting pitch contour...")
    f0 = extract_pitch(audio)
    query = normalize_contour(f0)

    if query is None:
        sys.exit(
            "ERROR: No usable pitch contour in query.\n"
            "  Tip: hum a clear melody (not speech, not silence)."
        )

    print(f"  Matching against {len(db)} enrolled song(s)...\n")
    results = []
    for song_id, stored in db.items():
        dist = dtw_distance(query, np.array(stored))
        results.append((song_id, dist))

    results.sort(key=lambda x: x[1])
    topk = min(args.topk, len(results))

    print(f"{'Rank':<6}{'Song':<30}{'DTW Distance'}")
    print("-" * 52)
    for i, (song_id, dist) in enumerate(results[:topk], 1):
        marker = " <-- best match" if i == 1 else ""
        print(f"{i:<6}{song_id:<30}{dist:<.4f}{marker}")


def cmd_list(args):
    """Show all enrolled songs."""
    db = load_db()
    if not db:
        print("Database is empty.")
        return
    print(f"Enrolled songs ({len(db)}):")
    for song_id, contour in db.items():
        print(f"  {song_id:<30} {len(contour)} frames")


def cmd_reset(args):
    """Delete the database file."""
    if DB_PATH.exists():
        DB_PATH.unlink()
        print("Database cleared.")
    else:
        print("Nothing to clear.")


# ── CLI entrypoint ────────────────────────────────────────────────────────

def main():
    warnings.filterwarnings("ignore", category=FutureWarning)
    warnings.filterwarnings("ignore", category=UserWarning)

    p = argparse.ArgumentParser(
        description="Hum-to-Search: enroll songs by humming, identify by humming."
    )
    sub = p.add_subparsers(dest="command")

    enroll = sub.add_parser("enroll", help="Enroll a song by humming")
    enroll.add_argument("song_id", help="Unique name for the song")
    enroll.add_argument("--wav", metavar="FILE", help="WAV file instead of mic")

    identify = sub.add_parser("identify", help="Identify a song by humming")
    identify.add_argument("--topk", type=int, default=5, help="Top-K results (default 5)")
    identify.add_argument("--wav", metavar="FILE", help="WAV file instead of mic")

    sub.add_parser("list", help="List enrolled songs")
    sub.add_parser("reset", help="Clear the database")

    args = p.parse_args()
    if args.command is None:
        p.print_help()
        sys.exit(1)

    cmds = {
        "enroll": cmd_enroll,
        "identify": cmd_identify,
        "list": cmd_list,
        "reset": cmd_reset,
    }
    cmds[args.command](args)


if __name__ == "__main__":
    main()
