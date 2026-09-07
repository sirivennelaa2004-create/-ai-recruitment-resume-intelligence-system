from backend.app.services.skill_service import extract_skills


sample_text = """
I am a Python developer with experience in SQL,
FastAPI, Machine Learning, React, PostgreSQL and Docker.
"""


skills = extract_skills(sample_text)

print("----- EXTRACTED SKILLS -----")
print(skills)
print("----- END -----")