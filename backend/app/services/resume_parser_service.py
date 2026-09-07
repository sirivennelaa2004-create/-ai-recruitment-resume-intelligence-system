from backend.app.services.text_service import clean_resume_text
from backend.app.services.skill_service import extract_skills
from backend.app.services.education_service import extract_education
from backend.app.services.experience_service import extract_experience
from backend.app.services.project_service import extract_projects


def parse_resume(text: str) -> dict:
    """
    Convert raw resume text into structured information.
    """

    cleaned_text = clean_resume_text(text)

    skills = extract_skills(cleaned_text)
    education = extract_education(cleaned_text)
    experience = extract_experience(cleaned_text)
    projects = extract_projects(cleaned_text)

    return {
        "raw_text": text,
        "cleaned_text": cleaned_text,
        "skills": skills,
        "education": education,
        "experience": experience,
        "projects": projects,
    }