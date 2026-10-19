# Source-File AI Declaration
# AI contribution: 50% or more AI-generated
"""Pydantic request and response models for authentication endpoints."""

from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    restaurant_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str
    eula_accepted: bool = False
    eula_version: str = Field(default="1.0", max_length=50)


class SignupResponse(BaseModel):
    user_id: UUID
    restaurant_id: UUID
    restaurant_name: str
    email: EmailStr
    role: str
    message: str = "Restaurant and owner account created."


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class LoginResponse(BaseModel):
    user_id: UUID
    restaurant_id: UUID
    email: EmailStr
    role: str
    message: str = "Logged in successfully."


class MeResponse(BaseModel):
    user_id: UUID
    restaurant_id: UUID
    restaurant_name: str
    email: EmailStr
    role: str


class LogoutResponse(BaseModel):
    message: str = "Logged out successfully."
