# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Application settings, loaded from environment variables and validated at startup."""

import base64
from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import PostgresDsn, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# The repository-root .env is shared with docker-compose. Inside the container this path
# does not exist, and settings come from the environment variables Compose injects.
ROOT_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ROOT_ENV_FILE, extra="ignore", hide_input_in_errors=True
    )

    environment: Literal["development", "test", "production"] = "development"
    database_url: PostgresDsn
    cors_origins: list[str] = ["http://localhost:5173"]
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    # No development fallback: POS secret reads/writes require an explicitly configured key.
    pos_credentials_encryption_key: SecretStr | None = None

    @field_validator("pos_credentials_encryption_key")
    @classmethod
    def validate_encryption_key(cls, value: SecretStr | None) -> SecretStr | None:
        if value is None:
            return None
        try:
            decoded = base64.b64decode(value.get_secret_value(), altchars=b"-_", validate=True)
        except ValueError as exc:
            raise ValueError("POS_CREDENTIALS_ENCRYPTION_KEY must be base64-encoded") from exc
        if len(decoded) != 32:
            raise ValueError("POS_CREDENTIALS_ENCRYPTION_KEY must encode exactly 32 bytes")
        return value

    # Session & Cookie Security Settings
    session_secret_key: str = "dev-secret-key-change-me-in-production"
    session_cookie_name: str = "powr_session"
    session_max_age_seconds: int = 86400  # 24 hours
    # set to false for now since not in prod, in thprod we must use True or a dynamic check
    cookie_secure: bool = False
    cookie_samesite: Literal["lax", "strict", "none"] = "lax"

    # Failed login rate-limiting settings (5 failed attempts per 60 seconds)
    login_max_failed_attempts: int = 5
    login_lockout_window_seconds: int = 60


@lru_cache
def get_settings() -> Settings:
    return Settings()
