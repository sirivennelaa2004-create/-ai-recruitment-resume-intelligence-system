from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.application import Application
from backend.app.models.job import Job
from backend.app.models.user import User
from backend.app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicantResponse,
    ApplicationStatusUpdate
    
)
from backend.app.utils.auth_dependency import get_current_user


router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


@router.post(
    "/",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED
)
def apply_for_job(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only candidates can apply
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can apply for jobs"
        )

    # Check whether the job exists
    job = db.query(Job).filter(
        Job.id == application_data.job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Candidate cannot apply to a closed job
    if job.status != "open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot apply to a closed job"
        )

    # Prevent duplicate applications
    existing_application = db.query(Application).filter(
        Application.candidate_id == current_user.id,
        Application.job_id == application_data.job_id
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied for this job"
        )

    # Create application
    new_application = Application(
        candidate_id=current_user.id,
        job_id=application_data.job_id,
        status="applied"
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application
@router.get("/my", response_model=list[ApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only candidates can view their applications
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can view applications"
        )

    applications = db.query(Application).filter(
        Application.candidate_id == current_user.id
    ).all()

    return applications

@router.get(
    "/job/{job_id}/applicants",
    response_model=list[ApplicantResponse]
)
def get_job_applicants(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only recruiters can view applicants
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can view applicants"
        )

    # Find the job
    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Recruiter can only view applicants for their own job
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view applicants for your own jobs"
        )

    applications = (
        db.query(Application, User)
        .join(User, Application.candidate_id == User.id)
        .filter(Application.job_id == job_id)
        .all()
    )

    return [
        {
            "application_id": application.id,
            "candidate_id": candidate.id,
            "candidate_name": candidate.full_name,
            "candidate_email": candidate.email,
            "job_id": job_id,
            "status": application.status
        }
        for application, candidate in applications
    ]
@router.patch(
    "/{application_id}/status",
    response_model=ApplicationResponse
)
def update_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only recruiters can update application status
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can update application status"
        )

    # Find application
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Find the related job
    job = db.query(Job).filter(
        Job.id == application.job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Recruiter can only update applications for their own job
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update applications for your own jobs"
        )

    allowed_statuses = [
        "applied",
        "shortlisted",
        "interview",
        "hired",
        "rejected"
    ]

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application status"
        )

    application.status = status_data.status

    db.commit()
    db.refresh(application)

    return application