# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Password hashing (Argon2id), password policy validation, and session token helpers."""

import re
import secrets
from typing import Any

from argon2 import PasswordHasher, Type
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.core.config import get_settings

# Explicitly configure Argon2id
_password_hasher = PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=4,
    hash_len=32,
    salt_len=16,
    type=Type.ID,
)

# Pre-computed dummy hash used when a user email is not found to prevent timing enumeration.
DUMMY_PASSWORD_HASH = _password_hasher.hash("DummyTimingProtection!123")

# Server-side revocation set for invalidated session tokens before their TTL expires.
_revoked_tokens: set[str] = set()

SESSION_SALT = "powr-auth-session-v1"


def validate_password_policy(password: str) -> None:
    """Validates password strength requirements on the server.

    Policy:
    - 8 to 128 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if len(password) > 128:
        raise ValueError("Password must not exceed 128 characters.")
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        raise ValueError("Password must contain at least one number.")
    if not re.search(r"[^A-Za-z0-9]", password):
        raise ValueError("Password must contain at least one special character.")


def hash_password(password: str) -> str:
    """Hashes a plaintext password using Argon2id."""
    return _password_hasher.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Verifies a plaintext password against an Argon2id hash."""
    try:
        return _password_hasher.verify(password_hash, plain_password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def _get_serializer(secret_key: str | None = None) -> URLSafeTimedSerializer:
    key = secret_key or get_settings().session_secret_key
    return URLSafeTimedSerializer(secret_key=key, salt=SESSION_SALT)


def create_session_token(
    user_id: str,
    restaurant_id: str,
    role: str = "owner",
    secret_key: str | None = None,
) -> str:
    """Creates a cryptographically signed session token containing user and restaurant context."""
    payload = {
        "user_id": str(user_id),
        "restaurant_id": str(restaurant_id),
        "role": role,
        "jti": secrets.token_hex(16),
    }
    return _get_serializer(secret_key).dumps(payload)


def verify_session_token(
    token: str,
    secret_key: str | None = None,
    max_age: int | None = None,
) -> dict[str, Any] | None:
    """Deserializes and verifies a signed session token,
    returning None if invalid, expired, or revoked.
    """
    if not token or token in _revoked_tokens:
        return None

    ttl = max_age if max_age is not None else get_settings().session_max_age_seconds
    try:
        data = _get_serializer(secret_key).loads(token, max_age=ttl)
        if isinstance(data, dict):
            return data
        return None
    except (BadSignature, SignatureExpired):
        return None


def revoke_session_token(token: str) -> None:
    """Marks a session token as revoked on the server."""
    if token:
        _revoked_tokens.add(token)
