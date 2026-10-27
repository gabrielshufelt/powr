# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""POS credential rules and transactions, independent of HTTP handling."""

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.modules.pos import repository


class CredentialsAlreadyExistError(Exception):
    """Credentials have already been configured for the provider."""


class CredentialsIntegrityError(Exception):
    """The database rejected the credentials because of an integrity constraint."""


class CredentialsStorageError(Exception):
    """The credentials could not be stored due to a database failure."""


def save_credentials(db: Session, *, pos_name: str, client_id: str, client_secret: str) -> None:
    try:
        if repository.credentials_exist(db, pos_name):
            raise CredentialsAlreadyExistError
        repository.insert_credentials(
            db, pos_name=pos_name, client_id=client_id, client_secret=client_secret
        )
        db.commit()
    except CredentialsAlreadyExistError:
        db.rollback()
        raise
    except IntegrityError as exc:
        db.rollback()
        raise CredentialsIntegrityError from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise CredentialsStorageError from exc
