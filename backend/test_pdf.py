from backend.app.services.pdf_service import extract_text_from_pdf


pdf_path = "uploads/Siri_vennela_resume.pdf"

text = extract_text_from_pdf(pdf_path)

print("----- EXTRACTED TEXT -----")
print(text)
print("----- END -----")