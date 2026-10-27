# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Database queries for shared POS provider credentials."""

from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session


def credentials_exist(db: Session, pos_name: str) -> bool:
    row = db.execute(
        text("SELECT id FROM pos_credentials WHERE pos_name = :pos_name"),
        {"pos_name": pos_name},
    ).fetchone()
    return row is not None


def get_credentials(db: Session, pos_name: str) -> dict[str, Any] | None:
    row = (
        db.execute(
            text("""
            SELECT id, pos_name, client_id, expires_at
            FROM pos_credentials
            WHERE pos_name = :pos_name
        """),
            {"pos_name": pos_name},
        )
        .mappings()
        .first()
    )
    return dict(row) if row is not None else None


def list_credentials(db: Session) -> list[dict[str, Any]]:
    rows = (
        db.execute(
            text("""
            SELECT id, pos_name, client_id, expires_at
            FROM pos_credentials
            ORDER BY pos_name, id
        """)
        )
        .mappings()
        .all()
    )
    return [dict(row) for row in rows]


def insert_credentials(db: Session, *, pos_name: str, client_id: str, client_secret: str) -> None:
    db.execute(
        text("""
            INSERT INTO pos_credentials (pos_name, client_id, client_secret)
            VALUES (:pos_name, :client_id, :client_secret)
        """),
        {"pos_name": pos_name, "client_id": client_id, "client_secret": client_secret},
    )


def update_credentials(db: Session, *, pos_name: str, client_id: str, client_secret: str) -> None:
    db.execute(
        text("""
            UPDATE pos_credentials
            SET client_id = :client_id, client_secret = :client_secret
            WHERE pos_name = :pos_name
        """),
        {"pos_name": pos_name, "client_id": client_id, "client_secret": client_secret},
    )


def delete_credentials(db: Session, pos_name: str) -> None:
    db.execute(
        text("DELETE FROM pos_credentials WHERE pos_name = :pos_name"),
        {"pos_name": pos_name},
    )
