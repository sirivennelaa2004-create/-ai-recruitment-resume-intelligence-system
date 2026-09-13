from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.job import Job
from backend.app.models.application import Application
from backend.app.models.user import User
from backend.app.models.resume import Resume
from backend.app.utils.auth_dependency import get_current_user
from backend.app.services.matching_service import calculate_skill_match, calculate_final_match_score, safe_text
from backend.app.services.embedding_service import calculate_semantic_similarity

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/recruiter")
def get_recruiter_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can view analytics"
        )

    recruiter_jobs = db.query(Job).filter(Job.recruiter_id == current_user.id).all()
    job_ids = [j.id for j in recruiter_jobs]

    total_jobs = len(recruiter_jobs)
    open_jobs = sum(1 for j in recruiter_jobs if j.status == "open")
    closed_jobs = sum(1 for j in recruiter_jobs if j.status == "closed")

    if not job_ids:
        return {
            "total_jobs": 0,
            "open_jobs": 0,
            "closed_jobs": 0,
            "total_applications": 0,
            "status_breakdown": {
                "applied": 0,
                "shortlisted": 0,
                "interview": 0,
                "hired": 0,
                "rejected": 0
            },
            "average_match_score": 0.0
        }

    applications = db.query(Application).filter(Application.job_id.in_(job_ids)).all()
    total_applications = len(applications)

    status_counts = {
        "applied": 0,
        "shortlisted": 0,
        "interview": 0,
        "hired": 0,
        "rejected": 0
    }

    for app in applications:
        status_counts[app.status] = status_counts.get(app.status, 0) + 1

    # Calculate average match score for applicants with resumes
    match_scores = []
    jobs_dict = {j.id: j for j in recruiter_jobs}

    for app in applications:
        resume = db.query(Resume).filter(Resume.user_id == app.candidate_id).order_by(Resume.id.desc()).first()
        if resume:
            job = jobs_dict.get(app.job_id)
            if job:
                skill_res = calculate_skill_match(resume.skills, job.required_skills)
                sem_score = calculate_semantic_similarity(resume.cleaned_text or resume.raw_text or "", job.description)
                exp_score = calculate_semantic_similarity(safe_text(resume.experience), safe_text(job.experience_required) or job.description)
                edu_score = calculate_semantic_similarity(safe_text(resume.education), safe_text(job.education_required) or job.description)
                proj_score = calculate_semantic_similarity(safe_text(resume.projects), job.description)
                final_score = calculate_final_match_score(
                    skill_res["match_percentage"],
                    sem_score,
                    exp_score,
                    edu_score,
                    proj_score
                )
                match_scores.append(final_score)

    avg_score = round(sum(match_scores) / len(match_scores), 2) if match_scores else 0.0

    return {
        "total_jobs": total_jobs,
        "open_jobs": open_jobs,
        "closed_jobs": closed_jobs,
        "total_applications": total_applications,
        "status_breakdown": status_counts,
        "average_match_score": avg_score
    }
