# Songer - Hum-to-Search POC

Find the song that "t'avais pas Shazam" - by humming it.

Record a hum, extract the pitch contour, and match it against enrolled songs
using Dynamic Time Warping (DTW).

## How it works

1. **Enroll**: hum a song for 8 seconds. The pitch contour is extracted,
   normalized (log-frequency, z-score), and saved to `hum_db.json`.
2. **Identify**: hum a query for 8 seconds. The contour is compared against
   all enrolled songs via DTW. Ranked results are printed.

Pitch extraction uses **CREPE** (if installed) or falls back to
**librosa.pyin** (always available).

## Prerequisites

| Requirement | macOS | Linux (Debian/Ubuntu) | Windows |
|---|---|---|---|
| Python 3.9+ | `brew install python` | `sudo apt install python3 python3-venv` | python.org installer |
| PortAudio | `brew install portaudio` | `sudo apt install libportaudio2 portaudio19-dev` | Bundled with sounddevice wheel |
| ffmpeg (optional, for mp3 input) | `brew install ffmpeg` | `sudo apt install ffmpeg` | choco install ffmpeg |

## Setup

```bash
# 1. Clone and enter the project
cd songer

# 2. Create a virtual environment
python3 -m venv .venv

# 3. Activate it
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows (cmd)
# .venv\Scripts\Activate.ps1     # Windows (PowerShell)

# 4. Install dependencies
pip install -r requirements.txt
```

### Optional: install CREPE for better pitch accuracy

CREPE uses a neural network and gives more robust pitch tracking than pyin,
but it pulls in TensorFlow (~500 MB).

```bash
pip install crepe tensorflow
```

If you skip this, librosa.pyin is used automatically - works fine for a POC.

## Usage

### Enroll a song

Hum the melody for 8 seconds when prompted:

```bash
python hum_search.py enroll "happy-birthday"
python hum_search.py enroll "twinkle-twinkle"
python hum_search.py enroll "la-marseillaise"
```

### Identify a song

Hum the melody, get ranked matches:

```bash
python hum_search.py identify --topk 3
```

### Quick test with WAV files (no microphone needed)

Use `--wav` to bypass the microphone - useful for CI or headless testing:

```bash
# Enroll from file
python hum_search.py enroll "test-song" --wav samples/hum1.wav

# Identify from file
python hum_search.py identify --wav samples/query.wav --topk 3
```

### Other commands

```bash
python hum_search.py list    # show enrolled songs
python hum_search.py reset   # clear database
```

## Example session

```
$ python hum_search.py enroll "happy-birthday"
Recording 8s - hum now! done (peak amplitude: 0.3412)
  Extracting pitch contour...
  Pitch extraction: librosa.pyin
  Enrolled 'happy-birthday' - 47 contour frames saved to hum_db.json

$ python hum_search.py enroll "twinkle-twinkle"
Recording 8s - hum now! done (peak amplitude: 0.2891)
  Extracting pitch contour...
  Pitch extraction: librosa.pyin
  Enrolled 'twinkle-twinkle' - 52 contour frames saved to hum_db.json

$ python hum_search.py enroll "la-marseillaise"
Recording 8s - hum now! done (peak amplitude: 0.4103)
  Extracting pitch contour...
  Pitch extraction: librosa.pyin
  Enrolled 'la-marseillaise' - 44 contour frames saved to hum_db.json

$ python hum_search.py identify --topk 3
Recording 8s - hum now! done (peak amplitude: 0.3017)
  Extracting pitch contour...
  Pitch extraction: librosa.pyin
  Matching against 3 enrolled song(s)...

Rank  Song                          DTW Distance
----------------------------------------------------
1     happy-birthday                0.1823 <-- best match
2     twinkle-twinkle               0.4291
3     la-marseillaise               0.6814
```

## Troubleshooting

### macOS: "This app would like to access the microphone"

Your terminal (Terminal.app, iTerm2, Warp, VS Code) needs microphone
permission:

**System Settings > Privacy & Security > Microphone** - toggle ON for your
terminal app. You may need to restart the terminal after granting access.

### Linux: no sound / PortAudio errors

```bash
# Check PulseAudio / PipeWire is running
pactl info

# Install PortAudio dev headers if pip install sounddevice fails
sudo apt install libportaudio2 portaudio19-dev   # Debian/Ubuntu
sudo dnf install portaudio portaudio-devel        # Fedora
```

### Windows: sounddevice install fails

Pre-built wheels usually work out of the box. If not:

```
pip install sounddevice --only-binary :all:
```

If that fails, install the Microsoft Visual C++ redistributable from
https://aka.ms/vs/17/release/vc_redist.x64.exe

### "No usable pitch contour detected"

- Hum a clear melody, don't whisper or speak
- Get closer to the microphone
- Avoid background noise
- Check that your mic input level is not too low (OS sound settings)

## Project structure

```
songer/
  hum_search.py       # Main script (record, extract, enroll, identify)
  requirements.txt    # Pinned dependencies
  hum_db.json         # Auto-created song database (gitignored)
  README.md           # This file
```
