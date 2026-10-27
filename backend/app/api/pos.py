# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Api endpoints for managing POS credentials for integration."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import OwnerDep
from app.core.database import get_db
from app.modules.pos import service
from app.schemas.pos import PosCredentialsRequest, SetPosResponse

router = APIRouter(prefix="/api/pos", tags=["pos"])
DbSession = Annotated[Session, Depends(get_db)]


@router.post("/credentials", response_model=SetPosResponse)
def set_pos_credentials(
    payload: PosCredentialsRequest,
    user: OwnerDep,
    db: DbSession,
) -> SetPosResponse:
    """Set POS credentials after verifying the caller is an owner."""
    try:
        service.save_credentials(
            db,
            pos_name=payload.pos_name,
            client_id=payload.client_id,
            client_secret=payload.client_secret,
        )
    except service.CredentialsAlreadyExistError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="POS credentials already exist for this provider.",
        ) from exc
    except service.CredentialsIntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to set POS credentials due to integrity error.",
        ) from exc
    except service.CredentialsStorageError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to set POS credentials due to a database error.",
        ) from exc

    return SetPosResponse(message="POS credentials set successfully.")

@router.patch("/credentials", response_model=SetPosResponse)
def update_pos_credentials(
    payload: PosCredentialsRequest,
    user: OwnerDep,
    db: DbSession,
) -> SetPosResponse:
    """Update POS credentials after verifying the caller is an owner."""
    try:
        service.update_credentials(
            db,
            pos_name=payload.pos_name,
            client_id=payload.client_id,
            client_secret=payload.client_secret,
        )
    except service.CredentialsNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POS credentials not found for this provider.",
        ) from exc
    except service.CredentialsIntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update POS credentials due to integrity error.",
        ) from exc
    except service.CredentialsStorageError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update POS credentials due to a database error.",
        ) from exc

    return SetPosResponse(message="POS credentials updated successfully.")

@router.delete("/credentials", response_model=SetPosResponse)
def delete_pos_credentials(
    pos_name: str,
    user: OwnerDep,
    db: DbSession,
) -> SetPosResponse:
    """Delete POS credentials after verifying the caller is an owner."""
    try:
        service.delete_credentials(db, pos_name=pos_name)
    except service.CredentialsNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POS credentials not found for this provider.",
        ) from exc
    except service.CredentialsStorageError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete POS credentials due to a database error.",
        ) from exc

    return SetPosResponse(message="POS credentials deleted successfully.")
