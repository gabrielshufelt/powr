# POWR

[![ci](https://github.com/gabrielshufelt/powr/actions/workflows/ci.yml/badge.svg)](https://github.com/gabrielshufelt/powr/actions/workflows/ci.yml)

Stack: React (TypeScript) frontend, FastAPI (Python) backend, PostgreSQL database.

## CI/CD pipeline

### `ci` workflow ([ci.yml](.github/workflows/ci.yml))

Runs on every pull request and every push to `master`. A failing job blocks merging.

| Job | What it does |
|---|---|
| `lint` | ESLint and type check (frontend), Ruff (backend) |
| `frontend-tests` | Frontend unit tests |
| `backend-tests` | Backend unit tests (pytest) with a PostgreSQL service |
| `end2end-tests` | Starts PostgreSQL and the backend, then runs the Playwright tests |

npm, pip and Playwright dependencies are cached.

### `release` workflow ([release.yml](.github/workflows/release.yml))

On every push to `master`, [release-please](https://github.com/googleapis/release-please) reads the
[Conventional Commits](https://www.conventionalcommits.org/) since the last release and keeps a release PR
up to date with the new version (semantic versioning) and `CHANGELOG.md`. Merging that PR tags the commit
and publishes the GitHub Release.

`fix:` bumps the patch version, `feat:` the minor, and `feat!:` or `BREAKING CHANGE:` the major.
