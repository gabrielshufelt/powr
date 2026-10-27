# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Database queries for shared POS provider credentials."""

from sqlalchemy import text
from sqlalchemy.orm import Session


def credentials_exist(db: Session, pos_name: str) -> bool:
    row = db.execute(
        text("SELECT id FROM pos_credentials WHERE pos_name = :pos_name"),
        {"pos_name": pos_name},
    ).fetchone()
    return row is not None


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