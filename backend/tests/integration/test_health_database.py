# Copyright 2026 POWR Contributors
# AI contribution: 50% or more AI-generated
"""Integration tests for GET /health against real PostgreSQL connections."""

from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app

# Nothing listens on port 1, so the driver fails with a real connection error.
UNREACHABLE_DATABASE_URL = "postgresql://powr:powr@127.0.0.1:1/powr"


def test_health_reports_ok_against_a_running_database(integration_database_url: str) -> None:
    app = create_app(Settings(_env_file=None, database_url=integration_database_url))

    with TestClient(app) as client:
        response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


def test_health_reports_unavailable_when_database_refuses_connections() -> None:
    app = create_app(Settings(_env_file=None, database_url=UNREACHABLE_DATABASE_URL))

    with TestClient(app) as client:
        response = client.get("/health")

    assert response.status_code == 503
    assert response.json() == {"status": "degraded", "database": "unavailable"}
