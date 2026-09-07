import re


EXPERIENCE_KEYWORDS = [
    "Software Engineer",
    "Software Developer",
    "Python Developer",
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Data Analyst",
    "Machine Learning Engineer",
    "AI Engineer",
    "Intern",
    "Developer",
    "Engineer",
]


def extract_experience(text: str) -> list[str]:
    """
    Extract experience-related lines from resume text.
    """

    experience = []

    for line in text.splitlines():
        line = line.strip()

        if not line:
            continue

        for keyword in EXPERIENCE_KEYWORDS:
            if re.search(
                re.escape(keyword),
                line,
                re.IGNORECASE
            ):
                experience.append(line)
                break

    return experience