# powr backend

The powr API: a FastAPI application backed by PostgreSQL. Architecture rules and
conventions are in [`CLAUDE.md`](../CLAUDE.md) at the repository root.

You can run the backend in one of two ways:

- **Option A, Docker**: one command starts PostgreSQL and the backend. Easiest.
- **Option B, directly on your machine**: faster reloads and needed for running tests,
  linting and type checks locally.

Most people use Option A to run the app and Option B's setup (steps B1 to B3) for
development tools. All commands below assume macOS or Linux; Windows differences are noted.

---

## 1. Prerequisites

| Tool | Version | Check with | Needed for |
|---|---|---|---|
| Git | any | `git --version` | everything |
| Python | 3.12 | `python3.12 --version` | Option B, tests, linting |
| Docker Desktop | any recent | `docker --version` | Option A |
| PostgreSQL | 16 | `psql --version` | Option B only |

Installing on macOS with Homebrew: `brew install python@3.12 postgresql@16`, and Docker
Desktop from [docker.com](https://www.docker.com/products/docker-desktop/).

## 2. Get the code and create your `.env`

```bash
git clone git@github.com:gabrielshufelt/powr.git
cd powr
cp .env.example .env
```

`.env` holds your local settings and is never committed. The defaults work as-is; every
variable is explained in [`.env.example`](../.env.example).

---

## Option A: run with Docker

From the repository root:

```bash
docker compose up --build
```

This starts PostgreSQL on port 5432 and the backend on port 8000, with code reloading when
you edit files. Continue with [step 3, Verify it works](#3-verify-it-works).

- Stop everything: `Ctrl+C`, then `docker compose down`.
- Reset the database completely: `docker compose down -v` (deletes all local data).

---

## Option B: run directly on your machine

### B1. Create a virtual environment and install dependencies

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
```

Your prompt now starts with `(.venv)`. **Run `source .venv/bin/activate` again in every new
terminal** before using `uvicorn`, `pytest`, `ruff` or `mypy`.

### B2. Create the local database

Start PostgreSQL (`brew services start postgresql@16` on macOS), then create the user and
database that `.env` expects:

```bash
psql -h localhost -d postgres -c "CREATE USER powr_user WITH PASSWORD 'powr_password';"
psql -h localhost -d postgres -c "CREATE DATABASE powr_dev OWNER powr_user;"
```

If you changed the credentials in `.env`, use your values instead.

### B3. Start the backend

From `backend/`, with the virtual environment active:

```bash
uvicorn app.main:app --reload
```

The backend reads its settings from the `.env` file in the repository root.

---

## 3. Verify it works

With the backend running (Option A or B), open a second terminal:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{"status": "ok", "database": "ok"}
```

If you see `{"status": "degraded", "database": "unavailable"}` (HTTP 503), the backend is
running but cannot reach PostgreSQL; see [Troubleshooting](#troubleshooting).

Interactive API documentation is available at <http://localhost:8000/docs>.

---

## 4. Tests and code quality

Run from `backend/` with the virtual environment active. These are the same checks CI runs,
so a pull request passes CI if they pass locally.

| Command | What it does |
|---|---|
| `pytest` | Runs all tests |
| `ruff check .` | Lints for bugs, unused code, import order and complexity limits |
| `ruff format --check .` | Checks formatting (`ruff format .` fixes it) |
| `mypy` | Checks type hints in strict mode |
| `python ../scripts/check_headers.py` | Checks every source file has the copyright and AI-contribution header |

Tests are split into:

- `tests/unit/`: no database needed; external dependencies are replaced with stubs.
- `tests/integration/`: use real PostgreSQL connections. The test that needs a running
  database is **skipped** unless `DATABASE_URL` is set in your shell. To include it:

  ```bash
  DATABASE_URL=postgresql://powr_user:powr_password@localhost:5432/powr_dev pytest
  ```

---

## Project layout

```
backend/
├── app/
│   ├── main.py            Application entry point (create_app factory)
│   ├── core/              Settings, database sessions, logging
│   ├── api/               App-wide endpoints such as /health
│   └── modules/           Business features, one package each (pos, forecasting, ...)
├── db/01_init.sql         Initial schema, applied by Docker on first database start
├── tests/                 unit/ and integration/ tests
├── requirements.txt       Runtime dependencies (pinned)
├── requirements-dev.txt   Runtime + test and lint tools
└── pyproject.toml         Ruff and mypy configuration
```

---

## Troubleshooting

**`command not found: uvicorn` (or `pytest`, `ruff`, `mypy`)**
The virtual environment is not active. From `backend/`, run `source .venv/bin/activate`.
If `.venv` does not exist yet, follow step B1.

**`/health` returns 503 with `"database": "unavailable"`**
PostgreSQL is not reachable with the credentials in `DATABASE_URL`. The backend terminal
logs the exact reason. Check that PostgreSQL is running (`pg_isready -h localhost`), and that
the user and database from step B2 exist.

**`psql` asks for a password you don't know (step B2)**

By default `psql` logs in with your computer's username. Some PostgreSQL installers (such
as the official EnterpriseDB one) only create a user named `postgres`, protected by the
password you chose when installing.

1. **If you remember that password**, run the step B2 commands with `-U postgres` added,
   and enter the password when asked:

   ```bash
   psql -h localhost -U postgres -d postgres -c "CREATE USER powr_user WITH PASSWORD 'powr_password';"
   psql -h localhost -U postgres -d postgres -c "CREATE DATABASE powr_dev OWNER powr_user;"
   ```

2. **If you don't remember it**, create a separate PostgreSQL just for powr on port 5433.
   This needs Homebrew's PostgreSQL (`brew install postgresql@16`) and leaves your existing
   installation untouched.

   1. Set up the database folder (one time only):

      ```bash
      export LC_ALL=en_US.UTF-8
      PG="$(brew --prefix postgresql@16)/bin"
      $PG/initdb -D ~/.local/share/powr-postgres -U postgres --auth-local=trust --auth-host=scram-sha-256
      ```

   2. Start it:

      ```bash
      $PG/pg_ctl -D ~/.local/share/powr-postgres -o "-p 5433" -l ~/.local/share/powr-postgres/server.log start
      ```

   3. Create the powr user and database (no password needed here):

      ```bash
      $PG/psql -p 5433 -U postgres -d postgres -c "CREATE USER powr_user WITH PASSWORD 'powr_password';"
      $PG/psql -p 5433 -U postgres -d postgres -c "CREATE DATABASE powr_dev OWNER powr_user;"
      ```

   4. In your `.env`, change the port in `DATABASE_URL` from `5432` to `5433`:

      ```
      DATABASE_URL=postgresql://powr_user:powr_password@localhost:5433/powr_dev
      ```

   5. Continue with step B3.

   This PostgreSQL does not start automatically after a reboot. Start it again with
   step 2 (run the `export` and `PG=` lines from step 1 first in a new terminal), and
   stop it with `$PG/pg_ctl -D ~/.local/share/powr-postgres stop`.

**`ValidationError` mentioning `database_url` on startup**
`DATABASE_URL` is missing or not a PostgreSQL URL. Check that `.env` exists in the
repository root (step 2) and that the value starts with `postgresql://`.

**Docker: `port is already allocated` for 5432**
Another PostgreSQL is already running on your machine. Either stop it
(`brew services stop postgresql@16`), or set `POSTGRES_PORT=5433` in `.env` and change the
port in `DATABASE_URL` to `5433`.

**Docker: schema changes in `db/01_init.sql` are not applied**
That script only runs when the database is first created. Run `docker compose down -v` to
reset the database, then `docker compose up` again.
