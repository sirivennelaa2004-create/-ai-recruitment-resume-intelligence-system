from backend.app.services.experience_service import extract_experience


sample_text = """
John Doe

Education
B.Tech in Computer Science - ABC University

Experience
Python Developer at ABC Technologies
Software Engineer at XYZ Solutions
Machine Learning Intern at Data Labs

Skills
Python
SQL
FastAPI
"""


experience = extract_experience(sample_text)

print("----- EXTRACTED EXPERIENCE -----")
print(experience)
print("----- END -----")