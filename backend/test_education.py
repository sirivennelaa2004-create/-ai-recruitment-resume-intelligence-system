from backend.app.services.education_service import extract_education


sample_text = """
John Doe

Skills
Python
SQL
FastAPI

Education
B.Tech in Computer Science - ABC University
Bachelor of Technology - XYZ University

Experience
Python Developer
"""


education = extract_education(sample_text)

print("----- EXTRACTED EDUCATION -----")
print(education)
print("----- END -----")