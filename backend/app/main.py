from fastapi import FastAPI

from backend.app.database.database import Base, engine
from backend.app.models import User, Resume

from backend.app.routes.auth import router as auth_router
from backend.app.routes.resume import router as resume_router
from backend.app.routes.job import router as job_router
from backend.app.models import User, Resume, Job, Application
from backend.app.routes.application import router as application_router

from backend.app.routes.matching import router as matching_router


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Recruitment & Resume Intelligence System",
    description="Backend API for the AI-powered recruitment platform",
    version="1.0.0"
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