# Project Overview

Songer is a hum-to-search application that allows users to find songs by humming them. The application extracts pitch contours from audio recordings and matches them against enrolled songs using Dynamic Time Warping (DTW).

## Architecture

- **/frontend** — Next.js app with TypeScript, communicates with Supabase directly and with /backend
- **/backend** — FastAPI microservice, called by Supabase or frontend, calls /model layer
- **/model** — HuggingFace model integration (in progress, not production-ready)
- **/supabase** — PostgreSQL database with migrations and edge functions

## Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components (shadcn/ui ready)
- **Testing**: Jest + React Testing Library
- **Package Manager**: npm

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Package Manager**: pip (with pyproject.toml)
- **Linting**: ruff
- **Type Checking**: mypy
- **Testing**: pytest with coverage
- **ORM**: None (direct Supabase client)

### Database
- **Provider**: Supabase (PostgreSQL)
- **Migrations**: Supabase CLI
- **Authentication**: Supabase Auth

### Model Layer
- **Current**: Local DTW-based matching
- **Future**: HuggingFace integration (provider not finalized)
- **Audio Processing**: librosa, sounddevice
- **Pitch Extraction**: CREPE (optional) or librosa.pyin

## Coding Conventions

### General
- Always write tests for new features (pytest for backend, Jest for frontend)
- Never modify existing tests without explaining why in the PR description
- Keep functions under 50 lines — split if longer
- Use conventional commit prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `migration:`
- Every PR must reference an issue: `Closes #number`

### Frontend
- Components must be typed (TypeScript strict mode)
- Use functional components with hooks
- Prefer server components when possible
- Keep UI components in `src/components`
- Tests in `__tests__` directory

### Backend
- Functions must have type hints (mypy enforced)
- Use Pydantic models for request/response
- Organize by feature in routers
- Tests in `tests` directory
- Use async/await for I/O operations

### Database
- Supabase migrations must be created for any schema change
- Never modify the database directly
- Migration files in `supabase/migrations/`
- Include descriptive comments in migrations

## How to Run Locally

### Prerequisites
- Python 3.9+
- Node.js 20+
- Supabase CLI (optional, for local development)

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd songer

# Setup environment
cp .env.example .env
# Edit .env with your values

# Frontend
cd frontend
npm install
npm run dev

# Backend (new terminal)
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
uvicorn songer_backend.main:app --reload

# Model (new terminal)
cd model
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

### Testing

```bash
# Frontend tests
cd frontend
npm test
npm run test:coverage

# Backend tests
cd backend
pytest

# Model tests
cd model
pytest
```

## Model Layer Conventions

- The /model service is a placeholder — mark any model-related code with `# TODO: finalize when model is chosen`
- Never hardcode model names — always use MODEL_NAME env variable
- Abstract the model interface behind a ModelClient class
- This allows switching providers (HuggingFace → OpenAI → local) by changing only one file
- Current implementation uses local DTW matching from `hum_search.py`

## CI/CD Pipeline

- **Frontend**: ESLint, TypeScript check, Jest tests (80% coverage), Next.js build
- **Backend**: ruff, mypy, pytest (80% coverage), health endpoint test
- **Model**: Placeholder tests (not enforced)
- **Integration**: Cross-service connectivity checks
- **Secrets**: TruffleHog and Gitleaks scanning
- **Deploy**: Vercel (frontend), placeholder for backend

## AI Agent Workflow

- Use issue templates for AI tasks (`[AI]` prefix)
- Label with `codex` or `claude` to auto-create branch
- Label with `feedback` to see related activity
- Issues auto-close when linked PR is merged

---

## Agent Instructions

Always use CLI to do something rather than writting file yourself : for boostraping the project, installing dependencies, check something in the code

After receiving instructions, split tasks into smaller tasks and create a MD file with the list of tasks.
Create a dependency tree of the task so multiple agents can run in parallele
Once its done check tasks done so everyone knows which task are remaining

Create atomics commits following semantic commit like : feat, fix, chore, doc, test
Each commit should containining a full working applications
