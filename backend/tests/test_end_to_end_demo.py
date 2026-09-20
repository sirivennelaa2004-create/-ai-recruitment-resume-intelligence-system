import fitz
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, close_all_sessions
from sqlalchemy.pool import StaticPool

from backend.app.main import app
from backend.app.database.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    yield
    close_all_sessions()
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


def create_valid_pdf_bytes():
    doc = fitz.open()
    page = doc.new_page()
    text = (
        "Alice Candidate\n"
        "Email: alice@candidate.com\n"
        "Skills: Python, FastAPI, PostgreSQL, React, Docker\n"
        "Experience: 3 years as Full Stack Engineer building web applications\n"
        "Education: BS in Computer Science from Tech University\n"
        "Projects: Built AI Recruitment & Resume Intelligence System\n"
    )
    page.insert_text((50, 50), text)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def test_full_candidate_and_recruiter_demo_scenario():
    # 1. Candidate Registration
    cand_reg = client.post(
        "/auth/register",
        json={
            "full_name": "Alice Candidate",
            "email": "alice@candidate.com",
            "password": "CandidatePassword123!",
            "role": "candidate"
        }
    )
    assert cand_reg.status_code == 201
    cand_user = cand_reg.json()

    # 2. Candidate Login
    cand_login = client.post(
        "/auth/login",
        json={"email": "alice@candidate.com", "password": "CandidatePassword123!"}
    )
    assert cand_login.status_code == 200
    cand_token = cand_login.json()["access_token"]
    cand_headers = {"Authorization": f"Bearer {cand_token}"}

    # 3. Resume Upload & PDF Parsing
    pdf_bytes = create_valid_pdf_bytes()
    upload_resp = client.post(
        "/resumes/upload",
        headers=cand_headers,
        files={"file": ("alice_resume.pdf", pdf_bytes, "application/pdf")}
    )
    assert upload_resp.status_code == 200
    resume_data = upload_resp.json()
    assert "resume_id" in resume_data
    resume_id = resume_data["resume_id"]

    # 4. Verify GET /resumes/my
    my_resume_resp = client.get("/resumes/my", headers=cand_headers)
    assert my_resume_resp.status_code == 200
    assert my_resume_resp.json()["id"] == resume_id

    # 5. Recruiter Registration & Login
    client.post(
        "/auth/register",
        json={
            "full_name": "Bob Recruiter",
            "email": "bob@recruiter.com",
            "password": "RecruiterPassword123!",
            "role": "recruiter"
        }
    )
    rec_token = client.post(
        "/auth/login",
        json={"email": "bob@recruiter.com", "password": "RecruiterPassword123!"}
    ).json()["access_token"]
    rec_headers = {"Authorization": f"Bearer {rec_token}"}

    # 6. Recruiter Post Job Requisition
    job_post = client.post(
        "/jobs/",
        headers=rec_headers,
        json={
            "title": "Backend Software Engineer",
            "description": "Designing and deploying high-scale API endpoints in Python using FastAPI, PostgreSQL, and Docker.",
            "required_skills": "python, fastapi, postgresql, docker",
            "experience_required": "3+ years API development",
            "education_required": "BS Computer Science",
            "location": "Remote",
            "salary": "$120,000 - $150,000"
        }
    )
    assert job_post.status_code == 201
    job_id = job_post.json()["id"]

    # 7. Candidate AI Match
    match_resp = client.get(f"/matching/jobs/{job_id}/resumes/{resume_id}", headers=cand_headers)
    assert match_resp.status_code == 200
    match_data = match_resp.json()
    assert match_data["match_percentage"] > 0
    assert len(match_data["matched_skills"]) > 0

    # 8. Candidate Apply
    apply_resp = client.post(
        "/applications/",
        headers=cand_headers,
        json={"job_id": job_id}
    )
    assert apply_resp.status_code == 201
    app_id = apply_resp.json()["id"]

    # 9. Recruiter Applicant AI Ranking
    ranking_resp = client.get(f"/matching/jobs/{job_id}/applicants", headers=rec_headers)
    assert ranking_resp.status_code == 200
    ranked = ranking_resp.json()
    assert len(ranked) == 1
    assert ranked[0]["candidate_id"] == cand_user["id"]

    # 10. Recruiter Update Application Status
    status_update = client.patch(
        f"/applications/{app_id}/status",
        headers=rec_headers,
        json={"status": "shortlisted"}
    )
    assert status_update.status_code == 200

    # 11. Candidate Status Verification
    cand_apps = client.get("/applications/my", headers=cand_headers)
    assert cand_apps.status_code == 200
    assert cand_apps.json()[0]["status"] == "shortlisted"

    # 12. Recruiter Analytics Verification
    analytics_resp = client.get("/analytics/recruiter", headers=rec_headers)
    assert analytics_resp.status_code == 200
    assert analytics_resp.json()["total_applications"] == 1

    # 13. Candidate Interview Prep Questions
    prep_resp = client.get(f"/interview-prep/job/{job_id}", headers=cand_headers)
    assert prep_resp.status_code == 200
    assert len(prep_resp.json()["technical_questions"]) > 0
