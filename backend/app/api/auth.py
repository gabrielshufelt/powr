# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Authentication endpoints: sign-up, login, and logout."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.database import get_db
from app.core.security import (
    DUMMY_PASSWORD_HASH,
    create_session_token,
    hash_password,
    revoke_session_token,
    validate_password_policy,
    verify_password,
)
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    SignupRequest,
    SignupResponse,
)

logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/auth", tags=["auth"])

GENERIC_AUTH_ERROR = "Invalid email or password."

DbSession = Annotated[Session, Depends(get_db)]
AppSettings = Annotated[Settings, Depends(get_settings)]


def _set_session_cookie(response: Response, token: str, settings: Settings) -> None:
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.session_max_age_seconds,
        path="/",
    )


@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(
    payload: SignupRequest,
    response: Response,
    db: DbSession,
    settings: AppSettings,
) -> SignupResponse:
    if not payload.eula_accepted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="EULA acceptance is required to create an account.",
        )

    restaurant_name = payload.restaurant_name.strip()
    if not restaurant_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Restaurant name cannot be blank.",
        )

    try:
        validate_password_policy(payload.password)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    normalized_email = payload.email.strip().lower()
    password_hash = hash_password(payload.password)

    try:
        existing_user = db.execute(
            text("SELECT id FROM users WHERE LOWER(email) = :email"),
            {"email": normalized_email},
        ).first()
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Unable to complete sign-up with the provided credentials.",
            )

        restaurant_row = db.execute(
            text(
                """
                INSERT INTO restaurants (name)
                VALUES (:name)
                RETURNING id, name
                """
            ),
            {"name": restaurant_name},
        ).one()

        user_row = db.execute(
            text(
                """
                INSERT INTO users (email, password_hash)
                VALUES (:email, :password_hash)
                RETURNING id, email
                """
            ),
            {"email": normalized_email, "password_hash": password_hash},
        ).one()

        role = "owner"
        db.execute(
            text(
                """
                INSERT INTO restaurant_memberships (restaurant_id, user_id, role)
                VALUES (:restaurant_id, :user_id, :role)
                """
            ),
            {
                "restaurant_id": restaurant_row.id,
                "user_id": user_row.id,
                "role": role,
            },
        )

        db.execute(
            text(
                """
                INSERT INTO eula_acceptances (user_id, eula_version)
                VALUES (:user_id, :eula_version)
                """
            ),
            {
                "user_id": user_row.id,
                "eula_version": payload.eula_version,
            },
        )

        db.commit()
    except HTTPException:
        db.rollback()
        raise
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Unable to complete sign-up with the provided credentials.",
        ) from exc
    except SQLAlchemyError as exc:
        db.rollback()
        logger.exception("Database error during sign-up transaction")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during sign-up.",
        ) from exc

    token = create_session_token(
        user_id=str(user_row.id),
        restaurant_id=str(restaurant_row.id),
        role=role,
        secret_key=settings.session_secret_key,
    )
    _set_session_cookie(response, token, settings)

    return SignupResponse(
        user_id=user_row.id,
        restaurant_id=restaurant_row.id,
        restaurant_name=restaurant_row.name,
        email=user_row.email,
        role=role,
    )


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
def login(
    request: Request,
    payload: LoginRequest,
    response: Response,
    db: DbSession,
    settings: AppSettings,
) -> LoginResponse:
    normalized_email = payload.email.strip().lower()

    row = db.execute(
        text(
            """
            SELECT u.id AS user_id,
                   u.email,
                   u.password_hash,
                   rm.restaurant_id,
                   rm.role
            FROM users u
            JOIN restaurant_memberships rm ON rm.user_id = u.id
            WHERE LOWER(u.email) = :email
            ORDER BY rm.created_at ASC
            LIMIT 1
            """
        ),
        {"email": normalized_email},
    ).first()

    if row is None:
        # Constant-time dummy check to mitigate user enumeration via timing side-channels
        verify_password(payload.password, DUMMY_PASSWORD_HASH)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=GENERIC_AUTH_ERROR,
        )

    if not verify_password(payload.password, row.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=GENERIC_AUTH_ERROR,
        )

    token = create_session_token(
        user_id=str(row.user_id),
        restaurant_id=str(row.restaurant_id),
        role=row.role,
        secret_key=settings.session_secret_key,
    )
    _set_session_cookie(response, token, settings)

    return LoginResponse(
        user_id=row.user_id,
        restaurant_id=row.restaurant_id,
        email=row.email,
        role=row.role,
    )


@router.post("/logout", response_model=LogoutResponse, status_code=status.HTTP_200_OK)
def logout(
    request: Request,
    response: Response,
    settings: AppSettings,
) -> LogoutResponse:
    token = request.cookies.get(settings.session_cookie_name)
    if token:
        revoke_session_token(token)

    response.delete_cookie(
        key=settings.session_cookie_name,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        path="/",
    )
    return LogoutResponse()
