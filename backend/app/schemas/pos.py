# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Pydantic request and response models for POS credentials endpoints."""

from typing import Literal
from pydantic import BaseModel, Field


class PosCredentialsRequest(BaseModel):
    pos_name: Literal["TOAST", "SQUARE"]
    client_id: str = Field(..., min_length=1)
    client_secret: str = Field(..., min_length=1)


class SetPosResponse(BaseModel):
    message: str
