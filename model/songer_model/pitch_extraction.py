"""Pitch extraction utilities."""

from __future__ import annotations

from typing import Tuple

import numpy as np


def extract_pitch_contour(
    audio: np.ndarray,
    sr: int = 16000,
    hop_length: int = 512,
    fmin: float = 65.0,
    fmax: float = 800.0,
    use_crepe: bool = False,
) -> Tuple[np.ndarray, np.ndarray]:
    """Extract pitch contour from audio.
    
    Args:
        audio: Audio data as numpy array
        sr: Sample rate
        hop_length: Hop length for pitch extraction
        fmin: Minimum frequency
        fmax: Maximum frequency
        use_crepe: Whether to use CREPE for pitch extraction
        
    Returns:
        Tuple of (times, frequencies)
    """
    # TODO: Move pitch extraction logic from hum_search.py here
    # This is a placeholder implementation
    times = np.arange(0, len(audio) / sr, hop_length / sr)
    frequencies = np.zeros_like(times)
    
    return times, frequencies
