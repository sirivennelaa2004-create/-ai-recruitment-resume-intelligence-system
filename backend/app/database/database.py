from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus

from backend.app.utils.config import (
    DATABASE_URL_ENV,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD
)

# Resolve connection URL
if DATABASE_URL_ENV:
    url = DATABASE_URL_ENV
    # Convert legacy postgres:// or postgresql:// scheme to postgresql+psycopg://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg://", 1)
    elif url.startswith("postgresql://") and not url.startswith("postgresql+psycopg://"):
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    DATABASE_URL = url
else:
    # Safely encode the username and password
    encoded_user = quote_plus(DATABASE_USER)
    encoded_password = quote_plus(DATABASE_PASSWORD)
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