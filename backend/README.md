# powr backend

FastAPI service for powr. See `CLAUDE.md` at the repository root for architecture rules.

## Prerequisites

- Python 3.12
- Docker (for the local PostgreSQL database)

## Setup

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
```

## Running with Docker

From the repository root:

```bash
cp .env.example .env
docker compose up
```

## Quality checks

These are the same checks CI runs:

```bash
ruff check .
ruff format --check .
mypy
pytest
```

Use `ruff format .` and `ruff check --fix .` to fix formatting and safe lint issues automatically.
