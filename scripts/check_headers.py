# Copyright 2026 POWR Contributors
# AI contribution: 50% or more AI-generated

"""
Check that every source file starts with the AI-contribution header.

Prints the files missing the header and exits with code 1, so CI fails the build.
Run it from the repository root:

    python scripts/check_headers.py
"""

import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

COPYRIGHT_PATTERN = re.compile(r"Copyright \d{4} POWR Contributors")
AI_LEVELS = (
    "No substantial AI-generated code",
    "Below 50% AI-generated",
    "50% or more AI-generated",
)
HEADER_SEARCH_LINES = 5

SOURCE_SUFFIXES = {".py", ".sql", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"}
SOURCE_NAMES = {"Dockerfile", "docker-compose.yml"}
# Generated or third-party code is exempt from the declaration requirement.
EXCLUDED_DIRS = {"node_modules", "dist", "build", ".venv", "venv"}
EXCLUDED_PREFIXES = ("backend/migrations/versions/",)


def list_repository_files() -> list[str]:
    result = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout.splitlines()


def is_source_file(relative_path: str) -> bool:
    path = Path(relative_path)
    if EXCLUDED_DIRS.intersection(path.parts) or relative_path.startswith(EXCLUDED_PREFIXES):
        return False
    return path.suffix in SOURCE_SUFFIXES or path.name in SOURCE_NAMES


def has_valid_header(path: Path) -> bool:
    head_lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    head = "\n".join(head_lines[:HEADER_SEARCH_LINES])
    has_copyright = COPYRIGHT_PATTERN.search(head) is not None
    has_ai_level = any(f"AI contribution: {level}" in head for level in AI_LEVELS)
    return has_copyright and has_ai_level


def main() -> int:
    missing = [
        relative_path
        for relative_path in list_repository_files()
        if is_source_file(relative_path)
        and (REPO_ROOT / relative_path).is_file()
        and not has_valid_header(REPO_ROOT / relative_path)
    ]
    if missing:
        print("Missing or invalid file header in:")
        for relative_path in missing:
            print(f"  {relative_path}")
        print(
            "\nEach source file must start with:\n"
            "  Copyright <year> POWR Contributors\n"
            f"  AI contribution: <one of: {', '.join(AI_LEVELS)}>"
        )
        return 1
    print("All source files have a valid header.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
