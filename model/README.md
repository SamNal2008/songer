# Songer Model

Model integration layer for the Songer hum-to-search application.

This service handles:
- Pitch extraction from audio
- Dynamic Time Warping (DTW) matching
- Future HuggingFace model integration

## Status

⚠️ **This service is a work in progress and not yet production-ready.**

## Development Setup

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install base dependencies
pip install -e ".[dev]"

# Optional: Install HuggingFace dependencies
pip install -e ".[huggingface]"
```

## Testing

```bash
# Run tests
pytest

# Tests are minimal and placeholder for now
```
