import re


EDUCATION_KEYWORDS = [
    "B.Tech",
    "B.E",
    "Bachelor of Technology",
    "Bachelor of Engineering",
    "M.Tech",
    "M.E",
    "Master of Technology",
    "Master of Engineering",
    "B.Sc",
    "BCA",
    "M.Sc",
    "MCA",
    "MBA",
    "Ph.D",
    "Bachelor's",
    "Master's",
    "Degree",
]


def extract_education(text: str) -> list[str]:
    """
    Extract education-related lines from resume text.
    """

    education = []

    for line in text.splitlines():
        line = line.strip()

        if not line:
            continue

        for keyword in EDUCATION_KEYWORDS:
            if re.search(
                re.escape(keyword),
                line,
                re.IGNORECASE
            ):
                education.append(line)
                break

    return education