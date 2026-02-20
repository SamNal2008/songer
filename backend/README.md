# Songer Backend

FastAPI backend service for the Songer hum-to-search application.

## Development Setup

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"

# Run development server
uvicorn songer_backend.main:app --reload --host 0.0.0.0 --port 8000
```

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=songer_backend --cov-report=html
```

## Linting

```bash
# Run ruff
ruff check .

# Run mypy
mypy .
```
