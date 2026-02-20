"""Dynamic Time Warping matching utilities."""

from __future__ import annotations

from typing import List, Tuple

import numpy as np
from scipy.spatial.distance import euclidean
from fastdtw import fastdtw


def dtw_match(
    query_contour: np.ndarray,
    enrolled_contours: List[Tuple[str, np.ndarray]],
) -> List[Tuple[str, float]]:
    """Match query contour against enrolled contours using DTW.
    
    Args:
        query_contour: Query pitch contour
        enrolled_contours: List of (song_id, contour) tuples
        
    Returns:
        List of (song_id, distance) tuples sorted by distance
    """
    # TODO: Move DTW matching logic from hum_search.py here
    # This is a placeholder implementation
    results = []
    for song_id, contour in enrolled_contours:
        # Simple placeholder distance
        distance = euclidean(query_contour[:len(contour)], contour)
        results.append((song_id, distance))
    
    # Sort by distance (lower is better)
    results.sort(key=lambda x: x[1])
    return results
