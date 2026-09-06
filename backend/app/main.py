from fastapi import FastAPI

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