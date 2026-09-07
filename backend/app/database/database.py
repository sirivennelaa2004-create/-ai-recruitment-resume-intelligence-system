from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus

from backend.app.utils.config import (
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD
)


# Safely encode the username and password
encoded_user = quote_plus(DATABASE_USER)
encoded_password = quote_plus(DATABASE_PASSWORD)


# PostgreSQL connection URL
DATABASE_URL = (
    f"postgresql+psycopg://"
    f"{encoded_user}:{encoded_password}"
    f"@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
)


# Create database engine
engine = create_engine(
    DATABASE_URL,
    echo=False
)


# Create database session factory
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)


# Base class for SQLAlchemy models
Base = declarative_base()

# Provide a database session to API routes
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()