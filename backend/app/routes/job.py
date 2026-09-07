from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.job import Job
from backend.app.models.user import User
from backend.app.schemas.job import JobCreate, JobResponse
from backend.app.utils.auth_dependency import get_current_user


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.post(
    "/",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED
)
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Only recruiters can create jobs
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can create jobs"
        )

    new_job = Job(
        recruiter_id=current_user.id,
        title=job_data.title,
        description=job_data.description,
        required_skills=job_data.required_skills,
        experience_required=job_data.experience_required,
        education_required=job_data.education_required,
        location=job_data.location,
        salary=job_data.salary
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


@router.get(
    "/",
    response_model=list[JobResponse]
)
def get_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    jobs = db.query(Job).filter(
        Job.status == "open"
    ).all()

    return jobs
@router.get(
    "/{job_id}",
    response_model=JobResponse
)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    return job

@router.patch(
    "/{job_id}/close",
    response_model=JobResponse
)
def close_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only close your own jobs"
        )

    job.status = "closed"

    db.commit()
    db.refresh(job)

    return job