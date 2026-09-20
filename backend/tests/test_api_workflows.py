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


def test_user_registration_and_duplicate():
    resp = client.post(
        "/auth/register",
        json={
            "full_name": "Test Candidate",
            "email": "candidate@example.com",
            "password": "Password123!",
            "role": "candidate"
        }
    )
    assert resp.status_code == 201
    assert resp.json()["email"] == "candidate@example.com"

    resp_dup = client.post(
        "/auth/register",
        json={
            "full_name": "Test Candidate 2",
            "email": "candidate@example.com",
            "password": "Password123!",
            "role": "candidate"
        }
    )
    assert resp_dup.status_code == 409


def test_login_and_auth_me():
    client.post(
        "/auth/register",
        json={
            "full_name": "Recruiter User",
            "email": "recruiter@example.com",
            "password": "Password123!",
            "role": "recruiter"
        }
    )

    login_resp = client.post(
        "/auth/login",
        json={"email": "recruiter@example.com", "password": "Password123!"}
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    invalid_resp = client.post(
        "/auth/login",
        json={"email": "recruiter@example.com", "password": "WrongPassword"}
    )
    assert invalid_resp.status_code == 401

    headers = {"Authorization": f"Bearer {token}"}
    me_resp = client.get("/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "recruiter@example.com"


def test_job_management_workflow():
    client.post("/auth/register", json={"full_name": "Candidate A", "email": "cand@test.com", "password": "Password123!", "role": "candidate"})
    client.post("/auth/register", json={"full_name": "Recruiter A", "email": "rec@test.com", "password": "Password123!", "role": "recruiter"})

    rec_token = client.post("/auth/login", json={"email": "rec@test.com", "password": "Password123!"}).json()["access_token"]
    cand_token = client.post("/auth/login", json={"email": "cand@test.com", "password": "Password123!"}).json()["access_token"]

    rec_headers = {"Authorization": f"Bearer {rec_token}"}
    cand_headers = {"Authorization": f"Bearer {cand_token}"}

    forbidden_resp = client.post(
        "/jobs/",
        headers=cand_headers,
        json={"title": "Unauthorized Job", "description": "Description text for testing forbidden job creation"}
    )
    assert forbidden_resp.status_code == 403

    job_resp = client.post(
        "/jobs/",
        headers=rec_headers,
        json={
            "title": "Senior Python Developer",
            "description": "Building high performance microservices with Python and FastAPI framework.",
            "required_skills": "python, fastapi, postgresql",
            "location": "Remote",
            "salary": "$130k - $160k"
        }
    )
    assert job_resp.status_code == 201
    job_id = job_resp.json()["id"]

    jobs_list = client.get("/jobs/", headers=cand_headers)
    assert jobs_list.status_code == 200

    app_resp = client.post(
        "/applications/",
        headers=cand_headers,
        json={"job_id": job_id}
    )
    assert app_resp.status_code == 201
    app_id = app_resp.json()["id"]

    dup_app = client.post(
        "/applications/",
        headers=cand_headers,
        json={"job_id": job_id}
    )
    assert dup_app.status_code == 409

    status_resp = client.patch(
        f"/applications/{app_id}/status",
        headers=rec_headers,
        json={"status": "shortlisted"}
    )
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "shortlisted"

    analytics_resp = client.get("/analytics/recruiter", headers=rec_headers)
    assert analytics_resp.status_code == 200
