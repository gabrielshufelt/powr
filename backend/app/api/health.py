# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Health endpoint used by the frontend, CI and the hosting platform."""

from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Response, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.database import get_db, is_database_reachable

router = APIRouter(tags=["health"])

AppSettings = Annotated[Settings, Depends(get_settings)]


class HealthResponse(BaseModel):
    status: Literal["ok", "degraded"]
    database: Literal["ok", "unavailable"]
    commit: str | None


@router.get(
    "/health",
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"model": HealthResponse}},
)
def health(
    response: Response,
    db: Annotated[Session, Depends(get_db)],
    settings: AppSettings,
) -> HealthResponse:
    if is_database_reachable(db):
        return HealthResponse(status="ok", database="ok", commit=settings.git_commit)
    response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return HealthResponse(status="degraded", database="unavailable", commit=settings.git_commit)
