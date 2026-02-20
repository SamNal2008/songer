"""Model client interface for pluggable model providers."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

import numpy as np
from pydantic import BaseModel


class ModelPrediction(BaseModel):
    """Model prediction result."""
    
    song_id: str
    confidence: float
    metadata: Optional[Dict[str, Any]] = None


class ModelClient(ABC):
    """Abstract base class for model clients."""
    
    def __init__(self, model_name: str, **kwargs: Any) -> None:
        """Initialize the model client.
        
        Args:
            model_name: Name of the model to use
            **kwargs: Additional provider-specific parameters
        """
        self.model_name = model_name
        self.config = kwargs
    
    @abstractmethod
    async def enroll(self, audio: np.ndarray, song_id: str) -> None:
        """Enroll a new song in the model database.
        
        Args:
            audio: Audio data as numpy array
            song_id: Unique identifier for the song
        """
        pass
    
    @abstractmethod
    async def identify(self, audio: np.ndarray, top_k: int = 5) -> List[ModelPrediction]:
        """Identify the most likely songs for the given audio.
        
        Args:
            audio: Audio data as numpy array
            top_k: Number of top results to return
            
        Returns:
            List of predictions sorted by confidence (highest first)
        """
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """Check if the model service is healthy."""
        pass


class HuggingFaceModelClient(ModelClient):
    """HuggingFace model client implementation.
    
    TODO: Implement when HuggingFace model is chosen
    """
    
    def __init__(self, model_name: str, api_key: Optional[str] = None, **kwargs: Any) -> None:
        super().__init__(model_name, **kwargs)
        self.api_key = api_key
        # TODO: Initialize HuggingFace client
    
    async def enroll(self, audio: np.ndarray, song_id: str) -> None:
        # TODO: Implement HuggingFace enrollment
        raise NotImplementedError("HuggingFace enrollment not yet implemented")
    
    async def identify(self, audio: np.ndarray, top_k: int = 5) -> List[ModelPrediction]:
        # TODO: Implement HuggingFace identification
        raise NotImplementedError("HuggingFace identification not yet implemented")
    
    async def health_check(self) -> bool:
        # TODO: Implement HuggingFace health check
        return True


class LocalModelClient(ModelClient):
    """Local model client using DTW matching.
    
    This is the current implementation from hum_search.py
    """
    
    def __init__(self, model_name: str = "local_dtw", **kwargs: Any) -> None:
        super().__init__(model_name, **kwargs)
        # TODO: Initialize local DTW database
    
    async def enroll(self, audio: np.ndarray, song_id: str) -> None:
        # TODO: Implement local enrollment using hum_search.py logic
        pass
    
    async def identify(self, audio: np.ndarray, top_k: int = 5) -> List[ModelPrediction]:
        # TODO: Implement local identification using hum_search.py logic
        pass
    
    async def health_check(self) -> bool:
        return True
