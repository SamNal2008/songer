"""Tests for health check endpoints."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from songer_backend.main import app


client = TestClient(app)


def test_health_check() -> None:
    """Test the health check endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert data["version"] == "0.1.0"
