import fitz
from fastapi import HTTPException, status


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from all pages of a PDF safely.
    """
    try:
        document = fitz.open(file_path)
        extracted_text = ""

        for page in document:
            text = page.get_text()
            if text:
                extracted_text += text + "\n"

        document.close()
        return extracted_text.strip()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unable to read or parse PDF file: {str(e)}"
        )