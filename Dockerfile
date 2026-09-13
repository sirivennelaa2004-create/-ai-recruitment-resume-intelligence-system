FROM python:3.13-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install system dependencies required for PyMuPDF and C extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/ /app/backend/

# Install python packages
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    sqlalchemy \
    psycopg[binary] \
    pydantic \
    email-validator \
    python-jose[cryptography] \
    passlib[bcrypt] \
    pymupdf \
    python-multipart \
    python-dotenv \
    sentence-transformers \
    scikit-learn \
    httpx \
    pytest

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
