import fitz


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from all pages of a PDF.
    """

    document = fitz.open(file_path)

    extracted_text = ""

    for page in document:
        extracted_text += page.get_text()

    document.close()

    return extracted_text