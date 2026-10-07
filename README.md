# POWR

[![ci](https://github.com/gabrielshufelt/powr/actions/workflows/ci.yml/badge.svg)](https://github.com/gabrielshufelt/powr/actions/workflows/ci.yml)

Stack: React (TypeScript) frontend, FastAPI (Python) backend, PostgreSQL database.

## CI/CD pipeline

### `ci` workflow ([ci.yml](.github/workflows/ci.yml))

Runs on every pull request and every push to `master`. A failing job blocks merging.

| Job | What it does |
|---|---|
| `lint` | ESLint (will be enabled once there is a frontend) and type check (frontend), Ruff (backend) |
| `frontend-tests` | Frontend unit tests (will be enabled once there is a frontend) |
| `backend-tests` | Backend unit tests (pytest) with a PostgreSQL service |
| `end2end-tests` | Starts PostgreSQL and the backend, then runs the Playwright tests (will be enabled once there is a frontend and backend/app/main.py has a real app and /health route)  |

npm, pip and Playwright dependencies are cached.

### `release` workflow ([release.yml](.github/workflows/release.yml))

On every push to `master`, [release-please](https://github.com/googleapis/release-please) reads the
[Conventional Commits](https://www.conventionalcommits.org/) since the last release and keeps a release PR
up to date with the new version (semantic versioning) and `CHANGELOG.md`. Merging that PR tags the commit
and publishes the GitHub Release.

`fix:` bumps the patch version, `feat:` the minor, and `feat!:` or `BREAKING CHANGE:` the major.

## Contributing

### Branch naming
Branches for the most part will be created directly from the issue on GitHub, by clicking on "Create a branch" from the development section on the right.

<img width=400 src=https://docs.github.com/assets/cb-28712/mw-1440/images/help/issues/create-a-branch.webp />

This will automatically create a branch and assign it a name like `8-set-up-basic-project-structure`.

Otherwise, follow the conventions listed below:
- small tasks or chores without an issue: `chore/task-title`, for example `chore/update-readme`
- user story branches containing many tasks: `us/issue-number-and-title`, for example `us/34-new-admin-page`

TODO: detail this section once we have versioning system in place.

### Commit messages
No specific commit-message syntax is required. However, make sure that feature and fix commit messages follow these rules:
- describes the actual change rather than using vague wording.
- identifies the affected functionality or component.
- uses a clear action-oriented description.

Obviously, merge commits and automated dependency-update commits are excluded.

### Pull request process
When about to open a pull request, make sure the title includes the issue number in brackets, for example "[#8] Set up basic project structure".
Make sure you assign at least 2 reviewers, ideally people that are in your subteam, or people that have worked on said feature recently.

**Before merging**: Make sure your PR has the following:
- Approval by at least 1 member.
- All checks pass (linter, unit tests, code quality report, etc.).
- Most importantly, your branch is up to date with and REBASED on master.

Finally, do not "squash & merge", always "Merge pull request". This is for better traceability.
