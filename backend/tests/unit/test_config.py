# Copyright 2026 POWR Contributors
# AI contribution: 50% or more AI-generated
"""Unit tests for settings validation."""

import pytest
from pydantic import ValidationError

from app.core.config import Settings


@pytest.mark.parametrize(
    "database_url",
    ["not-a-url", "mysql://user:password@localhost:3306/powr", ""],
)
def test_rejects_database_urls_that_are_not_postgres(database_url: str) -> None:
    with pytest.raises(ValidationError):
        Settings(_env_file=None, database_url=database_url)


def test_rejects_unknown_log_level() -> None:
    with pytest.raises(ValidationError):
        Settings(
            _env_file=None,
            database_url="postgresql://powr:powr@localhost:5432/powr",
            log_level="VERBOSE",
        )


def test_reads_cors_origins_from_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DATABASE_URL", "postgresql://powr:powr@localhost:5432/powr")
    monkeypatch.setenv("CORS_ORIGINS", '["https://powr.example.com", "http://localhost:3000"]')

    settings = Settings(_env_file=None)

    assert settings.cors_origins == ["https://powr.example.com", "http://localhost:3000"]
