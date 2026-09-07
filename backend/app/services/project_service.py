import re

PROJECT_KEYWORDS = [
    "AI",
    "Machine Learning",
    "Deep Learning",
    "Web Application",
    "Web Development",
    "Application",
    "System",
    "Platform",
    "Website",
]


def extract_projects(text: str) -> list[str]:
    """
    Extract project-related lines from resume text.
    """
    projects = []

    for line in text.splitlines():
        line = line.strip()

        if not line:
            continue

        # Ignore section headings
        if line.lower() in ["project", "projects"]:
            continue

        for keyword in PROJECT_KEYWORDS:
            if re.search(re.escape(keyword), line, re.IGNORECASE):
                projects.append(line)
                break

    return projects