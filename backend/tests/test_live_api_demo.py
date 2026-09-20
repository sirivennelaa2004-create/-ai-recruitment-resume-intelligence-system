import fitz
import uuid
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


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    close_all_sessions()
    Base.metadata.drop_all(bind=engine)


def create_valid_pdf_bytes():
    doc = fitz.open()
    page = doc.new_page()
    text = (
        "Live Candidate Test Resume\n"
        "Email: livecandidate@example.com\n"
        "Skills: Python, FastAPI, PostgreSQL, React, Docker, Git\n"
        "Experience: Senior Software Engineer with 4 years building scalable microservices\n"
        "Education: Bachelor of Science in Computer Science\n"
        "Projects: AI-Powered Resume Intelligence Platform\n"
    )
    page.insert_text((50, 50), text)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def test_live_full_platform_workflow():
    # 1. Health check
    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"

    # Unique email per test run
    uid = uuid.uuid4().hex[:6]
    cand_email = f"cand_{uid}@demo.com"
    rec_email = f"rec_{uid}@demo.com"

    # 2. Candidate Registration & Login
    reg_cand = client.post("/auth/register", json={
        "full_name": "Demo Candidate",
        "email": cand_email,
        "password": "Password123!",
        "role": "candidate"
    })
    assert reg_cand.status_code == 201

    login_cand = client.post("/auth/login", json={"email": cand_email, "password": "Password123!"})
    assert login_cand.status_code == 200
    cand_token = login_cand.json()["access_token"]
    cand_headers = {"Authorization": f"Bearer {cand_token}"}

    # 3. Verify /auth/me
    me_resp = client.get("/auth/me", headers=cand_headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == cand_email

    # 4. Upload Resume
    pdf_bytes = create_valid_pdf_bytes()
    upload_resp = client.post(
        "/resumes/upload",
        headers=cand_headers,
        files={"file": ("live_resume.pdf", pdf_bytes, "application/pdf")}
    )
    assert upload_resp.status_code == 200
    resume_id = upload_resp.json()["resume_id"]

    # 5. Verify GET /resumes/my
    my_resume_resp = client.get("/resumes/my", headers=cand_headers)
    assert my_resume_resp.status_code == 200
    assert my_resume_resp.json()["id"] == resume_id
    assert "python" in my_resume_resp.json()["skills"].lower()

    # 6. Recruiter Registration & Login
    reg_rec = client.post("/auth/register", json={
        "full_name": "Demo Recruiter",
        "email": rec_email,
        "password": "Password123!",
        "role": "recruiter"
    })
    assert reg_rec.status_code == 201

    login_rec = client.post("/auth/login", json={"email": rec_email, "password": "Password123!"})
    assert login_rec.status_code == 200
    rec_token = login_rec.json()["access_token"]
    rec_headers = {"Authorization": f"Bearer {rec_token}"}

    # 7. Recruiter Post Job
    job_resp = client.post("/jobs/", headers=rec_headers, json={
        "title": "Lead Python Engineer",
        "description": "Building AI-driven platform APIs with Python, FastAPI, and PostgreSQL database.",
        "required_skills": "python, fastapi, postgresql, docker",
        "experience_required": "3+ years",
        "education_required": "BS Computer Science",
        "location": "San Francisco / Remote",
        "salary": "$140k - $170k"
    })
    assert job_resp.status_code == 201
    job_id = job_resp.json()["id"]

    # 8. Candidate AI Matching
    match_resp = client.get(f"/matching/jobs/{job_id}/resumes/{resume_id}", headers=cand_headers)
    assert match_resp.status_code == 200
    match_data = match_resp.json()
    assert match_data["match_percentage"] > 0
    assert "matched_skills" in match_data
    assert "missing_skills" in match_data

    # Verify matching API fields required:
    # skill_score, semantic_score, experience_score, education_score, project_score, final_score, matched_skills, missing_skills, explanation
    assert "skill_score" in match_data or "skill_match_percentage" in match_data
    assert "semantic_score" in match_data or "semantic_similarity_percentage" in match_data
    assert "experience_score" in match_data or "experience_percentage" in match_data
    assert "education_score" in match_data or "education_percentage" in match_data
    assert "project_score" in match_data or "project_percentage" in match_data
    assert "final_score" in match_data or "match_percentage" in match_data

    # 9. Candidate Application
    apply_resp = client.post("/applications/", headers=cand_headers, json={"job_id": job_id})
    assert apply_resp.status_code == 201
    app_id = apply_resp.json()["id"]

    # 10. Recruiter AI Ranking
    ranking_resp = client.get(f"/matching/jobs/{job_id}/applicants", headers=rec_headers)
    assert ranking_resp.status_code == 200
    ranked = ranking_resp.json()
    assert len(ranked) >= 1
    assert ranked[0]["application_id"] == app_id

    # 11. Recruiter Update Application Status to 'shortlisted'
    status_resp = client.patch(f"/applications/{app_id}/status", headers=rec_headers, json={"status": "shortlisted"})
    assert status_resp.status_code == 200

    # 12. Candidate Verify Status Change
    my_apps = client.get("/applications/my", headers=cand_headers)
    assert my_apps.status_code == 200
    matching_app = [a for a in my_apps.json() if a["id"] == app_id][0]
    assert matching_app["status"] == "shortlisted"

    # 13. Recruiter Analytics Verification
    analytics_resp = client.get("/analytics/recruiter", headers=rec_headers)
    assert analytics_resp.status_code == 200
    assert analytics_resp.json()["total_jobs"] >= 1

    # 14. Candidate Interview Prep Questions
    prep_resp = client.get(f"/interview-prep/job/{job_id}", headers=cand_headers)
    assert prep_resp.status_code == 200
    assert len(prep_resp.json()["technical_questions"]) > 0

    print("FULL PLATFORM TEST WORKFLOW COMPLETED SUCCESSFULLY!")
