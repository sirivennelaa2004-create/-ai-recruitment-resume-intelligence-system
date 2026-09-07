import os
from pathlib import Path

from dotenv import load_dotenv


# Find the backend folder
BASE_DIR = Path(__file__).resolve().parents[2]

# Load backend/.env
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)


# Application settings
APP_NAME = os.getenv(
    "APP_NAME",
    "AI Recruitment & Resume Intelligence System"
)

APP_VERSION = os.getenv(
    "APP_VERSION",
    "1.0.0"
)


# Database settings
DATABASE_HOST = os.getenv(
    "DATABASE_HOST",
    "localhost"
)

DATABASE_PORT = os.getenv(
    "DATABASE_PORT",
    "5432"
)

DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "ai_recruitment_db"
)

DATABASE_USER = os.getenv(
    "DATABASE_USER",
    "postgres"
)

DATABASE_PASSWORD = os.getenv(
    "DATABASE_PASSWORD"
)
JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY"
)

JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)

JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "JWT_ACCESS_TOKEN_EXPIRE_MINUTES",
        "60"
    )
)