import os
from pathlib import Path

from dotenv import load_dotenv

# Find the backend folder
BASE_DIR = Path(__file__).resolve().parents[2]

# Load backend/.env if present
ENV_FILE = BASE_DIR / ".env"
if ENV_FILE.exists():
    load_dotenv(ENV_FILE)

# Also check root .env
ROOT_ENV = BASE_DIR.parent / ".env"
if ROOT_ENV.exists():
    load_dotenv(ROOT_ENV)


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
DATABASE_URL_ENV = os.getenv("DATABASE_URL")

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
    "DATABASE_PASSWORD",
    "postgres"
)


# Security & JWT settings
JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "default-dev-secret-key-please-change-in-production-123456789"
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


# CORS Allowed Origins
CORS_ORIGINS_RAW = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
)

CORS_ORIGINS = [
    origin.strip()
    for origin in CORS_ORIGINS_RAW.split(",")
    if origin.strip()
]