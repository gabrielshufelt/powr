# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Password hashing (Argon2id), password policy validation, and session token helpers."""

import re
import secrets
import time
from collections import defaultdict, deque
from typing import Any

from argon2 import PasswordHasher, Type
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.core.config import get_settings

# Explicitly configure Argon2id
# NOTE: Tune `parallelism` to match the number of available CPU cores on the
# production auth server when releasing to prod.
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

# Sliding-window tracker of failed login timestamps keyed by (client_ip, normalized_email)
# so kitchen staff sharing Wi-Fi are not locked out by others' activity or successful logins.
_failed_login_attempts: dict[tuple[str, str], deque[float]] = defaultdict(deque)

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


def _prune_expired_attempts(attempts: deque[float], now: float, window_seconds: int) -> None:
    cutoff = now - window_seconds
    while attempts and attempts[0] <= cutoff:
        attempts.popleft()


def is_login_rate_limited(
    client_ip: str,
    email: str,
    max_attempts: int | None = None,
    window_seconds: int | None = None,
) -> bool:
    """Checks if (client_ip, email) has reached the failed login limit in the active window."""
    settings = get_settings()
    limit = max_attempts if max_attempts is not None else settings.login_max_failed_attempts
    window = window_seconds if window_seconds is not None else settings.login_lockout_window_seconds

    key = (client_ip, email.strip().lower())
    attempts = _failed_login_attempts.get(key)
    if not attempts:
        return False

    _prune_expired_attempts(attempts, time.monotonic(), window)
    if not attempts:
        _failed_login_attempts.pop(key, None)
        return False

    return len(attempts) >= limit


def record_failed_login(
    client_ip: str,
    email: str,
    window_seconds: int | None = None,
) -> int:
    """Records a failed login attempt and returns the active failure count."""
    window = (
        window_seconds
        if window_seconds is not None
        else get_settings().login_lockout_window_seconds
    )
    now = time.monotonic()
    key = (client_ip, email.strip().lower())
    attempts = _failed_login_attempts[key]
    _prune_expired_attempts(attempts, now, window)
    attempts.append(now)
    return len(attempts)


def clear_failed_logins(client_ip: str, email: str) -> None:
    """Clears recorded failed login attempts after a successful login."""
    key = (client_ip, email.strip().lower())
    _failed_login_attempts.pop(key, None)
