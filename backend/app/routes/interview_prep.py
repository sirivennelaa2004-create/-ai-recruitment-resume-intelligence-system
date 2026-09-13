from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.job import Job
from backend.app.models.resume import Resume
from backend.app.models.user import User
from backend.app.utils.auth_dependency import get_current_user
from backend.app.services.matching_service import calculate_skill_match

router = APIRouter(
    prefix="/interview-prep",
    tags=["Interview Preparation"]
)


@router.get("/job/{job_id}")
def get_interview_prep(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access interview preparation"
        )

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).first()

    skills_analysis = calculate_skill_match(
        resume.skills if resume else "",
        job.required_skills
    )

    matched_skills = skills_analysis["matched_skills"]
    missing_skills = skills_analysis["missing_skills"]
    required_skills = skills_analysis["required_skills"]

    # Generate Technical Questions
    technical_questions = []
    for skill in required_skills[:5]:
        technical_questions.append({
            "skill": skill.capitalize(),
            "question": f"How do you implement core architecture pattern and error handling in {skill.capitalize()}?",
            "sample_topic": f"Best practices, performance optimization, and real-world trade-offs in {skill.capitalize()}."
        })

    # Generate Skill Gap Questions (for missing skills)
    gap_questions = []
    for skill in missing_skills[:4]:
        gap_questions.append({
            "skill": skill.capitalize(),
            "question": f"Although your profile doesn't explicitly list {skill.capitalize()}, how quickly could you ramp up and apply key concepts in a production environment?",
            "tip": f"Be ready to mention complementary experience or quick learning frameworks for {skill.capitalize()}."
        })

    # Behavioral Questions based on Job Title / Description
    behavioral_questions = [
        {
            "category": "Problem Solving",
            "question": f"Describe a challenging technical problem you encountered in a previous project related to {job.title} and how you resolved it."
        },
        {
            "category": "Team Collaboration",
            "question": "How do you handle technical disagreements or pull request reviews within an engineering team?"
        },
        {
            "category": "Adaptability",
            "question": f"How do you prioritize competing deadlines when developing for a role like {job.title}?"
        }
    ]

    return {
        "job_id": job.id,
        "job_title": job.title,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "technical_questions": technical_questions,
        "skill_gap_questions": gap_questions,
        "behavioral_questions": behavioral_questions,
        "preparation_tips": [
            f"Review fundamental concepts in {', '.join(required_skills[:3]) if required_skills else 'core role domain'}.",
            "Prepare STAR-format stories (Situation, Task, Action, Result) for behavioral questions.",
            "Be honest about skill gaps and emphasize your rapid learning ability and enthusiasm."
        ]
    }
