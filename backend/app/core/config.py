# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Application settings, loaded from environment variables and validated at startup."""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

# The repository-root .env is shared with docker-compose. Inside the container this path
# does not exist, and settings come from the environment variables Compose injects.
ROOT_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ROOT_ENV_FILE, extra="ignore")

    environment: Literal["development", "test", "production"] = "development"
    database_url: PostgresDsn
    cors_origins: list[str] = ["http://localhost:5173"]
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    # Session & Cookie Security Settings
    session_secret_key: str = "dev-secret-key-change-me-in-production"
    session_cookie_name: str = "powr_session"
    session_max_age_seconds: int = 86400  # 24 hours
    # set to false for now since not in prod, in thprod we must use True or a dynamic check
    cookie_secure: bool = False
    cookie_samesite: Literal["lax", "strict", "none"] = "lax"
    login_rate_limit: str = "5/minute"


@lru_cache
def get_settings() -> Settings:
    return Settings()
