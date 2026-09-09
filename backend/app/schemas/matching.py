from pydantic import BaseModel


class ResumeJobMatchResponse(BaseModel):
    resume_id: int
    candidate_id: int
    job_id: int
    job_title: str

    candidate_skills: list[str]
    required_skills: list[str]
    matched_skills: list[str]
    missing_skills: list[str]

    matched_weight: float
    total_weight: float
    match_percentage: float
    skill_match_percentage: float
    semantic_similarity_percentage: float
    experience_percentage: float
    education_percentage: float
    project_percentage: float
    match_percentage: float
    explanation: str
class ApplicantMatchResponse(BaseModel):
    application_id: int
    candidate_id: int
    candidate_name: str
    candidate_email: str
    application_status: str
    resume_id: int | None
    matched_skills: list[str]
    missing_skills: list[str]
    skill_match_percentage: float
    semantic_similarity_percentage: float
    experience_percentage: float
    education_percentage: float
    project_percentage: float
    match_percentage: float
    explanation: str