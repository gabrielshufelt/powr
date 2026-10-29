# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Unit tests for GET /health, with the database session replaced by a stub."""

import logging

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.exc import OperationalError

from app.core.config import Settings, get_settings
from app.core.database import get_db

FRONTEND_ORIGIN = "http://localhost:5173"
DATABASE_URL = "postgresql://powr:powr@localhost:5432/powr_test"


class StubSession:
    def __init__(self, error: Exception | None = None) -> None:
        self._error = error

    def execute(self, statement: object) -> None:
        if self._error is not None:
            raise self._error


def use_session(app: FastAPI, session: StubSession) -> None:
    app.dependency_overrides[get_db] = lambda: session


def use_settings(app: FastAPI, settings: Settings) -> None:
    app.dependency_overrides[get_settings] = lambda: settings


def test_health_reports_ok_when_database_is_reachable(
    app: FastAPI, client: TestClient, settings: Settings
) -> None:
    use_session(app, StubSession())
    use_settings(app, settings)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok", "commit": None}


def test_health_reports_the_deployed_commit(app: FastAPI, client: TestClient) -> None:
    use_session(app, StubSession())
    use_settings(
        app,
        Settings(_env_file=None, database_url=DATABASE_URL, RENDER_GIT_COMMIT="0123abc"),
    )

    response = client.get("/health")

    assert response.json()["commit"] == "0123abc"


def test_health_returns_503_without_leaking_error_details(
    app: FastAPI, client: TestClient, settings: Settings, caplog: pytest.LogCaptureFixture
) -> None:
    error = OperationalError("SELECT 1", {}, Exception("could not connect to db-secret-host"))
    use_session(app, StubSession(error))
    use_settings(app, settings)

    response = client.get("/health")

    assert response.status_code == 503
    assert response.json() == {"status": "degraded", "database": "unavailable", "commit": None}
    assert "db-secret-host" not in response.text
    assert any(
        record.levelno == logging.ERROR and record.name == "app.core.database"
        for record in caplog.records
    )


def test_cors_allows_the_configured_frontend_origin(app: FastAPI, client: TestClient) -> None:
    use_session(app, StubSession())

    response = client.get("/health", headers={"Origin": FRONTEND_ORIGIN})

    assert response.headers["access-control-allow-origin"] == FRONTEND_ORIGIN


def test_cors_ignores_unknown_origins(app: FastAPI, client: TestClient) -> None:
    use_session(app, StubSession())

    response = client.get("/health", headers={"Origin": "https://evil.example.com"})

    assert "access-control-allow-origin" not in response.headers
