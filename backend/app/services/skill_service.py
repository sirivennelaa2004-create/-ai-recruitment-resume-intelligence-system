import re


SKILL_LIST = [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C",
    "C++",
    "C#",
    "SQL",
    "HTML",
    "CSS",
    "React",
    "FastAPI",
    "Flask",
    "Django",
    "Spring",
    "Spring Boot",
    "Node.js",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Git",
    "GitHub",
    "Docker",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "Data Science",
    "Data Analysis",
    "Natural Language Processing",
    "NLP",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
]


def extract_skills(text: str) -> list[str]:
    """
    Extract known technical skills from resume text.
    """

    found_skills = []

    for skill in SKILL_LIST:
        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills