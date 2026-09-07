from typing import Iterable


# Change these later if certain skills should matter more.
# Any skill not listed here uses DEFAULT_SKILL_WEIGHT.
SKILL_WEIGHTS = {
    "python": 1.5,
    "fastapi": 1.5,
    "postgresql": 1.5,
    "react": 1.2,
    "git": 1.0,
}

DEFAULT_SKILL_WEIGHT = 1.0


def normalize_skills(skills: str | None) -> list[str]:
    """
    Converts:
    'Python, FastAPI, PostgreSQL'
    into:
    ['python', 'fastapi', 'postgresql']
    """
    if not skills:
        return []

    normalized = {
        skill.strip().lower()
        for skill in skills.split(",")
        if skill.strip()
    }

    return sorted(normalized)


def calculate_skill_match(
    resume_skills: str | None,
    required_skills: str | None
) -> dict:
    candidate_skills = normalize_skills(resume_skills)
    job_skills = normalize_skills(required_skills)

    candidate_skill_set = set(candidate_skills)

    matched_skills = [
        skill for skill in job_skills
        if skill in candidate_skill_set
    ]

    missing_skills = [
        skill for skill in job_skills
        if skill not in candidate_skill_set
    ]

    total_weight = sum(
        SKILL_WEIGHTS.get(skill, DEFAULT_SKILL_WEIGHT)
        for skill in job_skills
    )

    matched_weight = sum(
        SKILL_WEIGHTS.get(skill, DEFAULT_SKILL_WEIGHT)
        for skill in matched_skills
    )

    match_percentage = 0.0

    if total_weight > 0:
        match_percentage = round(
            (matched_weight / total_weight) * 100,
            2
        )

    return {
        "candidate_skills": candidate_skills,
        "required_skills": job_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "matched_weight": matched_weight,
        "total_weight": total_weight,
        "match_percentage": match_percentage
    }