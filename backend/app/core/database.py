# Copyright 2026 POWR Contributors
# AI contribution: 50% or more AI-generated
"""Database engine, request-scoped sessions and connectivity checks."""

import logging
from collections.abc import Iterator

from fastapi import Request
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker

logger = logging.getLogger(__name__)


def create_session_factory(database_url: str) -> sessionmaker[Session]:
    # pool_pre_ping replaces connections dropped while the free-tier database was suspended.
    engine = create_engine(database_url, pool_pre_ping=True, pool_size=5, max_overflow=5)
    return sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db(request: Request) -> Iterator[Session]:
    session_factory: sessionmaker[Session] = request.app.state.session_factory
    with session_factory() as session:
        yield session


def is_database_reachable(session: Session) -> bool:
    try:
        session.execute(text("SELECT 1"))
    except SQLAlchemyError:
        logger.exception("Database connectivity check failed")
        return False
    return True
