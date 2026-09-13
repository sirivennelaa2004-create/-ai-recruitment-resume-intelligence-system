from fastapi import FastAPI

from backend.app.database.database import Base, engine
from backend.app.models import User, Resume

from backend.app.routes.auth import router as auth_router
from backend.app.routes.resumes import router as resume_router
from backend.app.routes.job import router as job_router
from backend.app.models import User, Resume, Job, Application
from backend.app.routes.application import router as application_router
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.matching import router as matching_router
from backend.app.routes.analytics import router as analytics_router
from backend.app.routes.interview_prep import router as interview_prep_router


from backend.app.utils.config import CORS_ORIGINS


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Recruitment & Resume Intelligence System",
    description="Backend API for the AI-powered recruitment platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "AI Recruitment API is running"
    }


app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(job_router)
app.include_router(application_router)
app.include_router(matching_router)
app.include_router(analytics_router)
app.include_router(interview_prep_router)