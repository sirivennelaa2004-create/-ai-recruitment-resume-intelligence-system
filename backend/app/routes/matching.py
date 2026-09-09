from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.job import Job
from backend.app.models.resume import Resume
from backend.app.models.user import User
from backend.app.models.application import Application

from backend.app.schemas.matching import (
    ApplicantMatchResponse,
    ResumeJobMatchResponse
)

from backend.app.services.matching_service import (
    calculate_skill_match,
    calculate_final_match_score,
    safe_text
)

from backend.app.services.embedding_service import (
    calculate_semantic_similarity
)

from backend.app.utils.auth_dependency import get_current_user


router = APIRouter(
    prefix="/matching",
    tags=["AI Matching"]
)


@router.get(
    "/jobs/{job_id}/resumes/{resume_id}",
    response_model=ResumeJobMatchResponse
)
def match_resume_to_job(
    job_id: int,
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only recruiters can view candidate-job matching results.
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can view matching results"
        )

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Recruiters can only match candidates to their own jobs.
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view matches for your own jobs"
        )

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    candidate = db.query(User).filter(
        User.id == resume.user_id
    ).first()

    if not candidate or candidate.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume does not belong to a candidate"
        )

    # ---------------------------------------------------------
    # 1. Exact skill matching
    # ---------------------------------------------------------
    result = calculate_skill_match(
        resume_skills=resume.skills,
        required_skills=job.required_skills
    )

    # ---------------------------------------------------------
    # 2. Semantic similarity
    # ---------------------------------------------------------
    semantic_score = calculate_semantic_similarity(
        resume.cleaned_text or resume.raw_text or "",
        job.description
    )

    # ---------------------------------------------------------
    # 3. Experience similarity
    # ---------------------------------------------------------
    experience_score = calculate_semantic_similarity(
        safe_text(resume.experience),
        safe_text(job.experience_required) or job.description
    )

    # ---------------------------------------------------------
    # 4. Education similarity
    # ---------------------------------------------------------
    education_score = calculate_semantic_similarity(
        safe_text(resume.education),
        safe_text(job.education_required) or job.description
    )

    # ---------------------------------------------------------
    # 5. Project similarity
    # ---------------------------------------------------------
    project_score = calculate_semantic_similarity(
        safe_text(resume.projects),
        job.description
    )

    # ---------------------------------------------------------
    # 6. Final weighted score
    # ---------------------------------------------------------
    final_score = calculate_final_match_score(
        skill_match_percentage=result["match_percentage"],
        semantic_similarity_percentage=semantic_score,
        experience_percentage=experience_score,
        education_percentage=education_score,
        project_percentage=project_score
    )

    return {
        "resume_id": resume.id,
        "candidate_id": candidate.id,
        "job_id": job.id,
        "job_title": job.title,

        **result,

        "skill_match_percentage": result["match_percentage"],
        "semantic_similarity_percentage": semantic_score,
        "experience_percentage": experience_score,
        "education_percentage": education_score,
        "project_percentage": project_score,
        "match_percentage": final_score,

        "explanation": (
            f"Skills: {result['match_percentage']}%. "
            f"Semantic similarity: {semantic_score}%. "
            f"Experience: {experience_score}%. "
            f"Education: {education_score}%. "
            f"Projects: {project_score}%. "
            f"Final match score: {final_score}%. "
            f"Matched {len(result['matched_skills'])} of "
            f"{len(result['required_skills'])} required skills."
        )
    }


@router.get(
    "/jobs/{job_id}/applicants",
    response_model=list[ApplicantMatchResponse]
)
def rank_job_applicants(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only recruiters can view applicant rankings.
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can view applicant rankings"
        )

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Recruiters can only view rankings for their own jobs.
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view rankings for your own jobs"
        )

    applicants = (
        db.query(Application, User)
        .join(
            User,
            Application.candidate_id == User.id
        )
        .filter(
            Application.job_id == job_id
        )
        .all()
    )

    rankings = []

    for application, candidate in applicants:

        # Use the candidate's newest uploaded resume.
        resume = (
            db.query(Resume)
            .filter(
                Resume.user_id == candidate.id
            )
            .order_by(
                Resume.id.desc()
            )
            .first()
        )

        # -----------------------------------------------------
        # Candidate has no resume
        # -----------------------------------------------------
        if not resume:
            rankings.append({
                "application_id": application.id,
                "candidate_id": candidate.id,
                "candidate_name": candidate.full_name,
                "candidate_email": candidate.email,
                "application_status": application.status,
                "resume_id": None,

                "matched_skills": [],
                "missing_skills": [],

                "skill_match_percentage": 0.0,
                "semantic_similarity_percentage": 0.0,
                "experience_percentage": 0.0,
                "education_percentage": 0.0,
                "project_percentage": 0.0,

                "match_percentage": 0.0,

                "explanation": (
                    "This candidate has not uploaded a resume."
                )
            })

            continue

        # -----------------------------------------------------
        # 1. Exact skill matching
        # -----------------------------------------------------
        result = calculate_skill_match(
            resume_skills=resume.skills,
            required_skills=job.required_skills
        )

        # -----------------------------------------------------
        # 2. Semantic similarity
        # -----------------------------------------------------
        semantic_score = calculate_semantic_similarity(
            resume.cleaned_text or resume.raw_text or "",
            job.description
        )

        # -----------------------------------------------------
        # 3. Experience similarity
        # -----------------------------------------------------
        experience_score = calculate_semantic_similarity(
            safe_text(resume.experience),
            safe_text(job.experience_required) or job.description
        )

        # -----------------------------------------------------
        # 4. Education similarity
        # -----------------------------------------------------
        education_score = calculate_semantic_similarity(
            safe_text(resume.education),
            safe_text(job.education_required) or job.description
        )

        # -----------------------------------------------------
        # 5. Project similarity
        # -----------------------------------------------------
        project_score = calculate_semantic_similarity(
            safe_text(resume.projects),
            job.description
        )

        # -----------------------------------------------------
        # 6. Final weighted score
        # -----------------------------------------------------
        final_score = calculate_final_match_score(
            skill_match_percentage=result["match_percentage"],
            semantic_similarity_percentage=semantic_score,
            experience_percentage=experience_score,
            education_percentage=education_score,
            project_percentage=project_score
        )

        rankings.append({
            "application_id": application.id,
            "candidate_id": candidate.id,
            "candidate_name": candidate.full_name,
            "candidate_email": candidate.email,
            "application_status": application.status,
            "resume_id": resume.id,

            "matched_skills": result["matched_skills"],
            "missing_skills": result["missing_skills"],

            "skill_match_percentage": result["match_percentage"],
            "semantic_similarity_percentage": semantic_score,
            "experience_percentage": experience_score,
            "education_percentage": education_score,
            "project_percentage": project_score,

            "match_percentage": final_score,

            "explanation": (
                f"Skills: {result['match_percentage']}%. "
                f"Semantic similarity: {semantic_score}%. "
                f"Experience: {experience_score}%. "
                f"Education: {education_score}%. "
                f"Projects: {project_score}%. "
                f"Final match score: {final_score}%. "
                f"Matched {len(result['matched_skills'])} of "
                f"{len(result['required_skills'])} required skills."
            )
        })

    # Rank applicants by final AI match score.
    return sorted(
        rankings,
        key=lambda applicant: applicant["match_percentage"],
        reverse=True
    )