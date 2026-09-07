# AI Recruitment & Resume Intelligence System

A FastAPI and PostgreSQL backend that helps recruiters manage jobs, applications, resumes, and AI-based candidate matching.

## Features

- Candidate and recruiter registration/login using JWT authentication
- Resume PDF upload, text extraction, and skill parsing
- Recruiter job creation, editing, and closing
- Candidate job applications
- Application status management
- Resume-to-job skill matching
- Matched skills, missing skills, and match percentage
- Recruiter applicant ranking
- Role-based security for candidate and recruiter actions

## Technologies Used

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- PyMuPDF

## AI Matching Logic

The system compares candidate resume skills with a job's required skills.

It returns:

- Match percentage
- Matched skills
- Missing skills
- Explainable weighted score
- Ranked applicants for each job
