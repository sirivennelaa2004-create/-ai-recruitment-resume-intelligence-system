from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=10)
    required_skills: str | None = None
    experience_required: str | None = None
    education_required: str | None = None
    location: str | None = None
    salary: str | None = None


class JobUpdate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=10)
    required_skills: str | None = None
    experience_required: str | None = None
    education_required: str | None = None
    location: str | None = None
    salary: str | None = None
    status: str | None = "open"


class JobResponse(BaseModel):
    id: int
    recruiter_id: int
    title: str
    description: str
    required_skills: str | None
    experience_required: str | None
    education_required: str | None
    location: str | None
    salary: str | None
    status: str

    model_config = {"from_attributes": True}