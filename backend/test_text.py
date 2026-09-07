from backend.app.services.text_service import clean_resume_text


sample_text = """
John Doe


Python     SQL      FastAPI


Machine Learning
   Data Science
"""


cleaned_text = clean_resume_text(sample_text)

print("----- ORIGINAL TEXT -----")
print(sample_text)

print("\n----- CLEANED TEXT -----")
print(cleaned_text)

print("\n----- END -----")