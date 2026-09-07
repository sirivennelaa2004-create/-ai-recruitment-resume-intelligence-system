import re


def clean_resume_text(text: str) -> str:
    """
    Clean extracted resume text.
    """

    # Replace multiple spaces/tabs with one space
    text = re.sub(r"[ \t]+", " ", text)

    # Remove excessive blank lines
    text = re.sub(r"\n\s*\n+", "\n", text)

    # Remove leading/trailing spaces from each line
    lines = [
        line.strip()
        for line in text.splitlines()
    ]

    # Remove empty lines
    lines = [
        line
        for line in lines
        if line
    ]

    # Join cleaned lines
    cleaned_text = "\n".join(lines)

    return cleaned_text.strip()