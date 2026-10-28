# Source-File AI Declaration
# AI contribution: 50% or more AI-generated

"""
Check that every applicable source file starts with the Source-File AI Declaration.

The required form and the list of applicable files are defined in AGENTS.md. Prints each
file with a missing or invalid declaration and exits with code 1, so CI fails the build.

Run it from the repository root, optionally limited to some paths:

    python scripts/check_headers.py
    python scripts/check_headers.py backend scripts .github
"""

import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

AI_LEVELS = (
    "No substantial AI-generated code",
    "Below 50% AI-generated",
    "50% or more AI-generated",
)
HUMAN_LEVELS = (
    "No substantial human-written code",
    "Below 50% human-written",
    "50% or more human-written",
)

# A comment marker (#, //, --, <!--, /*) followed by the text, with an optional closing marker.
_COMMENT = r"^\s*(?:#|//|--|<!--|/\*)\s*{text}\s*(?:-->|\*/)?\s*$"
_LEVEL_OPTIONS = "|".join(re.escape(level) for level in AI_LEVELS)
_HUMAN_OPTIONS = "|".join(re.escape(level) for level in HUMAN_LEVELS)
TITLE_LINE = re.compile(_COMMENT.format(text="Source-File AI Declaration"))
AI_LINE = re.compile(_COMMENT.format(text=f"AI contribution: (?:{_LEVEL_OPTIONS})"))
BASELINE_LINE = re.compile(_COMMENT.format(text="Human-authored baseline:.*"))
VALID_BASELINE_LINE = re.compile(
    _COMMENT.format(
        text=f"Human-authored baseline: (?:{_HUMAN_OPTIONS}); human-authors: .+"
    )
)
# Lines allowed before the declaration (see AGENTS.md "Required form").
PREAMBLE_LINE = re.compile(r"^(?:#!|# -\*- coding|# syntax=)")

SOURCE_SUFFIXES = {".py", ".sql", ".sh", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"}
SOURCE_NAMES = {"Dockerfile", "docker-compose.yml", "pyproject.toml", "pytest.ini"}
REQUIREMENTS_PATTERN = re.compile(r"^requirements(?:-[\w-]+)?\.txt$")
WORKFLOWS_DIR = ".github/workflows/"
# Generated or third-party code is exempt from the declaration requirement.
EXCLUDED_DIRS = {"node_modules", "dist", "build", ".venv", "venv"}
EXCLUDED_PREFIXES = ("backend/migrations/versions/",)


def list_repository_files(paths: list[str]) -> list[str]:
    result = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "--", *paths],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout.splitlines()


def is_source_file(relative_path: str) -> bool:
    path = Path(relative_path)
    if EXCLUDED_DIRS.intersection(path.parts) or relative_path.startswith(
        EXCLUDED_PREFIXES
    ):
        return False
    if relative_path.startswith(WORKFLOWS_DIR) and path.suffix in {".yml", ".yaml"}:
        return True
    return (
        path.suffix in SOURCE_SUFFIXES
        or path.name in SOURCE_NAMES
        or REQUIREMENTS_PATTERN.match(path.name) is not None
    )


def declaration_error(path: Path) -> str | None:
    """Return why the file's declaration is invalid, or None when it is valid."""
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    if not any(line.strip() for line in lines):
        return None  # empty files may stay declaration-free
    start = 0
    while start < len(lines) and PREAMBLE_LINE.match(lines[start]):
        start += 1
    head = [*lines[start : start + 3], "", "", ""]
    if not TITLE_LINE.match(head[0]):
        return "first line must be 'Source-File AI Declaration'"
    if not AI_LINE.match(head[1]):
        return (
            f"second line must be 'AI contribution: <one of: {', '.join(AI_LEVELS)}>'"
        )
    if BASELINE_LINE.match(head[2]) and not VALID_BASELINE_LINE.match(head[2]):
        return (
            "human-authored baseline must be "
            f"'<one of: {', '.join(HUMAN_LEVELS)}>; human-authors: <names>'"
        )
    return None


def main(paths: list[str]) -> int:
    failures = []
    for relative_path in list_repository_files(paths):
        full_path = REPO_ROOT / relative_path
        if not is_source_file(relative_path) or not full_path.is_file():
            continue
        error = declaration_error(full_path)
        if error is not None:
            failures.append(f"  {relative_path}: {error}")
    if failures:
        print("Missing or invalid Source-File AI Declaration (see AGENTS.md):")
        print("\n".join(failures))
        return 1
    print("All applicable source files have a valid Source-File AI Declaration.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
