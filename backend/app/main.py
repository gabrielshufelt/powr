# Copyright 2026 POWR Contributors
# AI contribution: 50% or more AI-generated
"""FastAPI application entry point. uvicorn serves ``app.main:app``."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.core.config import Settings, get_settings
from app.core.database import create_session_factory
from app.core.logging_config import configure_logging


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    configure_logging(settings.log_level)

    app = FastAPI(title="powr API", version="0.1.0")
    app.state.session_factory = create_session_factory(str(settings.database_url))
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(health_router)
    return app


app = create_app()
