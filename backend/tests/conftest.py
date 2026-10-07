# Copyright 2026 POWR Contributors
# AI contribution: 50% or more AI-generated
"""Shared pytest fixtures."""

import os
from collections.abc import Iterator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

# Read before the default below is applied: only a DATABASE_URL provided by the caller
# (CI, or a developer exporting it) points at a real database for integration tests.
INTEGRATION_DATABASE_URL = os.environ.get("DATABASE_URL")

# app.main builds the module-level app at import time, which requires a database URL.
# Creating the engine does not connect, so a placeholder is enough for unit tests.
UNIT_TEST_DATABASE_URL = "postgresql://powr:powr@localhost:5432/powr_test"
os.environ.setdefault("DATABASE_URL", UNIT_TEST_DATABASE_URL)

from app.core.config import Settings  # noqa: E402
from app.main import create_app  # noqa: E402


@pytest.fixture
def settings() -> Settings:
    return Settings(_env_file=None, database_url=UNIT_TEST_DATABASE_URL)


@pytest.fixture
def app(settings: Settings) -> FastAPI:
    return create_app(settings)


@pytest.fixture
def client(app: FastAPI) -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def integration_database_url() -> str:
    if INTEGRATION_DATABASE_URL is None:
        pytest.skip("DATABASE_URL is not set; integration tests need a running PostgreSQL")
    return INTEGRATION_DATABASE_URL
