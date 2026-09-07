from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.database.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    recruiter_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    title = Column(
        String(200),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    required_skills = Column(
        Text,
        nullable=True
    )

    experience_required = Column(
        String(100),
        nullable=True
    )

    education_required = Column(
        String(200),
        nullable=True
    )

    location = Column(
        String(200),
        nullable=True
    )

    salary = Column(
        String(100),
        nullable=True
    )

    status = Column(
        String(20),
        default="open",
        nullable=False
    )

    recruiter = relationship(
        "User",
        back_populates="jobs"
    )
    
    applications = relationship("Application", back_populates="job")