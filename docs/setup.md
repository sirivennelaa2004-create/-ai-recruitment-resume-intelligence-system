# Local Setup & Developer Guide

This guide walks through setting up the AI-Powered Recruitment & Resume Intelligence System locally for development and testing.

---

## System Prerequisites
- **Python**: 3.11+ / 3.13
- **Node.js**: 18+ / 20+
- **Database**: PostgreSQL (or local SQLite for dev testing)
- **Git**: 2.30+

---

## 1. Environment Configuration

### Backend Environment File (`backend/.env`)
Create `backend/.env` with the following variables:

```env
APP_NAME="AI Recruitment & Resume Intelligence System"
APP_VERSION="1.0.0"

# Database Connection (PostgreSQL or SQLite fallback)
DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/ai_recruitment_db"

# JWT Authentication
JWT_SECRET_KEY="your-local-development-secret-key-change-in-prod"
JWT_ALGORITHM="HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60

# Allowed CORS Origins
CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
```

### Frontend Environment File (`frontend/.env`)
Create `frontend/.env`:

```env
# Point to backend FastAPI server
VITE_API_URL=http://127.0.0.1:8000
```

---

## 2. Backend Installation & Run Commands

```bash
# Navigate to repository root
cd AI-Recruitment-System

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Start FastAPI development server
uvicorn backend.app.main:app --reload --port 8000
```

FastAPI interactive Swagger UI will be available at: `http://127.0.0.1:8000/docs`

---

## 3. Frontend Installation & Run Commands

```bash
# Navigate to frontend directory
cd frontend

# Install Node packages
npm install

# Start Vite development server
npm run dev
```

React Web Application will be live at: `http://localhost:5173`

---

## 4. Running Test Suites

```bash
# Set PYTHONPATH to project root
# Windows (PowerShell):
$env:PYTHONPATH="."
.venv\Scripts\pytest.exe

# Linux / macOS:
PYTHONPATH=. pytest

# Run Frontend Build Check
cd frontend
npm run build
```
