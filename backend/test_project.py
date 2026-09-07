from backend.app.services.project_service import extract_projects


sample_text = """
John Doe

Education
B.Tech in Computer Science - ABC University

Experience
Python Developer at ABC Technologies

Projects
AI-Powered Recruitment System
Machine Learning Resume Analyzer
Web Application for Job Management

Skills
Python
SQL
FastAPI
React
"""


projects = extract_projects(sample_text)

print("----- EXTRACTED PROJECTS -----")
print(projects)
print("----- END -----")