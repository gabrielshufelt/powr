# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""POS credentials authentication with real signed cookies and a stubbed database."""

from types import SimpleNamespace
from unittest.mock import Mock
from uuid import uuid4

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from itsdangerous import TimestampSigner
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.database import get_db
from app.core.security import create_session_token, revoke_session_token

PAYLOAD = {"pos_name": "toast", "client_id": "test-client", "client_secret": "test-secret"}
ENDPOINT = "/api/pos/credentials"


@pytest.fixture
def db(app: FastAPI, settings: Settings) -> Mock:
    session = Mock(spec=Session)
    app.dependency_overrides[get_db] = lambda: session
    app.dependency_overrides[get_settings] = lambda: settings
    return session


def session_token(settings: Settings) -> str:
    return create_session_token(str(uuid4()), str(uuid4()), secret_key=settings.session_secret_key)


@pytest.mark.parametrize("cookie_state", ["missing", "tampered", "expired", "revoked"])
def test_invalid_sessions_cannot_access_credentials(
    client: TestClient,
    settings: Settings,
    db: Mock,
    monkeypatch: pytest.MonkeyPatch,
    cookie_state: str,
) -> None:
    if cookie_state == "tampered":
        client.cookies.set(settings.session_cookie_name, "not-a-valid-token")
    elif cookie_state == "expired":
        with monkeypatch.context() as patch:
            patch.setattr(TimestampSigner, "get_timestamp", lambda self: 0)
            token = session_token(settings)
        client.cookies.set(settings.session_cookie_name, token)
    elif cookie_state == "revoked":
        token = session_token(settings)
        revoke_session_token(token)
        client.cookies.set(settings.session_cookie_name, token)

    response = client.post(ENDPOINT, json=PAYLOAD)

    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated."}
    db.execute.assert_not_called()
    db.commit.assert_not_called()


def test_removed_membership_cannot_access_credentials(
    client: TestClient, settings: Settings, db: Mock
) -> None:
    db.execute.return_value.first.return_value = None
    client.cookies.set(settings.session_cookie_name, session_token(settings))

    response = client.post(ENDPOINT, json=PAYLOAD)

    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated."}
    assert db.execute.call_count == 1
    db.commit.assert_not_called()


@pytest.mark.parametrize("role, expected_status", [("owner", 200), ("kitchen_manager", 403)])
def test_only_authenticated_owner_can_set_credentials(
    client: TestClient, settings: Settings, db: Mock, role: str, expected_status: int
) -> None:
    user_id, restaurant_id = uuid4(), uuid4()
    db.execute.return_value.first.return_value = SimpleNamespace(
        user_id=user_id,
        email="member@example.com",
        restaurant_id=restaurant_id,
        restaurant_name="Test restaurant",
        role=role,
    )
    db.execute.return_value.fetchone.return_value = None
    token = create_session_token(
        str(user_id), str(restaurant_id), role="owner", secret_key=settings.session_secret_key
    )
    client.cookies.set(settings.session_cookie_name, token)

    response = client.post(ENDPOINT, json=PAYLOAD)

    assert response.status_code == expected_status
    assert db.execute.call_args_list[0].args[1] == {
        "user_id": user_id,
        "restaurant_id": restaurant_id,
    }
    if role != "owner":
        assert response.json() == {"detail": "You do not have permission to do this."}
        assert db.execute.call_count == 1
        db.commit.assert_not_called()
        return
    assert response.json() == {"message": "POS credentials set successfully."}
    assert db.execute.call_args_list[2].args[1] == PAYLOAD
    db.commit.assert_called_once_with()


def test_logged_out_session_cannot_access_credentials(
    client: TestClient, settings: Settings, db: Mock
) -> None:
    token = session_token(settings)
    client.cookies.set(settings.session_cookie_name, token)
    assert client.post("/api/auth/logout").status_code == 200
    # A replayed cookie must also fail after logout.
    client.cookies.set(settings.session_cookie_name, token)

    response = client.post(ENDPOINT, json=PAYLOAD)

    assert response.status_code == 401
    db.execute.assert_not_called()
    db.commit.assert_not_called()
