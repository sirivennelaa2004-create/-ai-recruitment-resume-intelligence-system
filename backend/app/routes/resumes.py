from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.resume import Resume
from backend.app.models.user import User
from backend.app.services.pdf_service import extract_text_from_pdf
from backend.app.services.resume_parser_service import parse_resume
from backend.app.utils.auth_dependency import get_current_user


router = APIRouter(prefix="/resumes", tags=["Resumes"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check whether a file was selected
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file selected"
        )

    # Only PDF files are allowed
    safe_name = Path(file.filename).name
    if not safe_name.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )

    # Read uploaded file content
    file_content = await file.read()

    # Limit file size to 5 MB
    MAX_FILE_SIZE = 5 * 1024 * 1024
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed limit of 5 MB"
        )

    # Create a unique filename safely
    unique_filename = f"{uuid4()}_{safe_name}"
    file_path = UPLOAD_DIR / unique_filename

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    # Extract text from PDF
    extracted_text = extract_text_from_pdf(str(file_path))

    # Parse complete resume
    resume_data = parse_resume(extracted_text)

    # Create database record
    new_resume = Resume(
        user_id=current_user.id,
        filename=unique_filename,
        file_path=str(file_path),
        raw_text=resume_data["raw_text"],
        cleaned_text=resume_data["cleaned_text"],
        skills=", ".join(resume_data["skills"]),
        education="\n".join(resume_data["education"]),
        experience="\n".join(resume_data["experience"]),
        projects="\n".join(resume_data["projects"])
    )

    # Save resume to database
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return {
        "message": "Resume uploaded and saved successfully",
        "resume_id": new_resume.id,
        "user_id": current_user.id,
        "filename": unique_filename,
        "resume": resume_data
    }


@router.get("/my")
def get_my_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.id.desc())
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume found. Please upload your resume first."
        )

    return {
        "id": resume.id,
        "user_id": resume.user_id,
        "filename": resume.filename,
        "skills": resume.skills,
        "education": resume.education,
        "experience": resume.experience,
        "projects": resume.projects
    }