"""Placeholder tests for the model service."""

from __future__ import annotations

import pytest


def test_model_layer_placeholder() -> None:
    """Placeholder test that always passes.
    
    TODO: Add real tests when model integration is implemented.
    """
    assert True


@pytest.mark.asyncio
async def test_model_client_interface() -> None:
    """Test that the model client interface exists."""
    from songer_model.model_client import ModelClient
    
    # Verify the abstract base class exists
    assert ModelClient is not None
    assert hasattr(ModelClient, 'enroll')
    assert hasattr(ModelClient, 'identify')
    assert hasattr(ModelClient, 'health_check')
