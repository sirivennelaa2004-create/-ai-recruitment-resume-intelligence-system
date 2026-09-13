from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=128
    )

    role: Literal["candidate", "recruiter"]


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool

    model_config = {
        "from_attributes": True
    }


class LoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=128
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class UserUpdate(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )