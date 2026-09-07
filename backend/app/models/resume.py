from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.database.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    filename = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=False)

    raw_text = Column(Text, nullable=True)

    cleaned_text = Column(Text, nullable=True)

    skills = Column(Text, nullable=True)

    education = Column(Text, nullable=True)

    experience = Column(Text, nullable=True)

    projects = Column(Text, nullable=True)

    user = relationship("User", back_populates="resumes")