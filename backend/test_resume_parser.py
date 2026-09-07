from backend.app.services.resume_parser_service import parse_resume


sample_text = """
John Doe

Education
B.Tech in Computer Science - ABC University

Experience
Python Developer at ABC Technologies
Software Engineer at XYZ Solutions

Projects
AI-Powered Recruitment System
Machine Learning Resume Analyzer

Skills
Python
SQL
FastAPI
React
"""


resume = parse_resume(sample_text)

print("========== STRUCTURED RESUME ==========")

print("\n--- SKILLS ---")
print(resume["skills"])

print("\n--- EDUCATION ---")
print(resume["education"])

print("\n--- EXPERIENCE ---")
print(resume["experience"])

print("\n--- PROJECTS ---")
print(resume["projects"])

print("\n========== END ==========")