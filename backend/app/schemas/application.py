from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    job_id: int


class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    status: str

    model_config = {"from_attributes": True}


class ApplicantResponse(BaseModel):
    application_id: int
    candidate_id: int
    candidate_name: str
    candidate_email: str
    job_id: int
    status: str
class ApplicationStatusUpdate(BaseModel):
    status: str