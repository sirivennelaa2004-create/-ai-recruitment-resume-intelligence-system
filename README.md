# AI-Powered Recruitment & Resume Intelligence System

An end-to-end full-stack AI recruitment platform built with **FastAPI**, **PostgreSQL**, **scikit-learn (TF-IDF + Cosine Similarity)**, **PyMuPDF**, and **React (Vite)**.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.13-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-green.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![Status](https://img.shields.io/badge/Production-Live-success.svg)

---

## 🌐 Live Production Deployment

- 🚀 **Live Frontend Web Application**: [https://ai-recruitment-resume-intelligence.vercel.app](https://ai-recruitment-resume-intelligence.vercel.app)
- ⚡ **Live Backend API Swagger UI**: [https://ai-recruitment-backend-tc14.onrender.com/docs](https://ai-recruitment-backend-tc14.onrender.com/docs)

---

## 🎯 Executive Summary & Problem Statement

Traditional applicant tracking systems (ATS) rely on rigid keyword matching, frequently filtering out qualified candidates due to simple formatting differences or phrasing variations. Conversely, recruiters face hundreds of unstructured PDF resumes per job opening, leading to high screening latency and biased evaluations.

The **AI-Powered Recruitment & Resume Intelligence System** solves this by providing:
1. **Automated Resume Intelligence**: Extracting structured text, skills, education, work experience, and projects directly from uploaded PDF resumes.
2. **Explainable 5-Factor AI Matching**: Evaluating candidates against job requisitions using transparent weighted scoring combining normalized skill overlap and CPU-friendly TF-IDF vector similarity.
3. **Automated Recruiter Leaderboards**: Instant applicant ranking sorted by match score to accelerate talent discovery.
4. **Tailored Interview Preparation**: Generating candidate technical questions, behavioral STAR scenarios, and targeted skill-gap guidance based on missing requirements.

---

## 🌟 Key Features

### 👤 Candidate Experience Portal
- **JWT Authentication & Profile Management**: Secure role-based login, registration, and profile customization.
- **PDF Resume Intelligence**: Upload PDF resumes (5MB limit with size/type validation) to automatically parse skills, education background, work experience, and project entries.
- **Job Search & Dynamic Filters**: Search open jobs by keywords, title, location, and required skills.
- **Explainable 5-Factor AI Job Match**: Instant breakdown of overall match percentage, Skill Match (40%), Semantic Similarity (30%), Experience (15%), Education (5%), Projects (10%), matched skills, and missing skills.
- **Application Tracker**: Submit job applications with duplicate prevention and track recruitment statuses (`applied`, `shortlisted`, `interview`, `hired`, `rejected`).
- **Interview Preparation Generator**: Role-tailored technical questions, STAR behavioral scenarios, and targeted skill-gap advice based on missing skills.

### 👔 Recruiter Experience Portal
- **Requisition Management Hub**: Create new job postings, update requirements/salaries, and close requisitions.
- **AI Applicant Ranking Leaderboard**: View applicants sorted by AI `match_percentage` DESC with one-click status transitions.
- **Interactive Score Breakdown Drawers**: Inspect exact candidate-job match components and skills gap analysis.
- **Executive Recruitment Analytics**: Monitor job counts, applicant volume, funnel pipeline breakdown, hire conversion, and candidate pool average match score.

### 🤖 AI / ML Intelligence Features
- **Normalized Skill Parser**: Case-insensitive normalization, whitespace cleanup, deduplication, and skill importance weighting (`python: 1.5`, `fastapi: 1.5`, `postgresql: 1.5`, `react: 1.2`, default: `1.0`).
- **CPU-Friendly TF-IDF Vector Similarity Engine**: Lightweight `scikit-learn` `TfidfVectorizer` + `cosine_similarity` optimized for low-memory CPU environments (< 100MB RAM footprint).
- **Graceful Error Recovery**: Fallback vocabulary checking to safely handle empty texts or non-alphanumeric inputs without crashing.

---

## 🧠 5-Factor Weighted Score Formula

```
           +-------------------------------------------------------+
           |                 Candidate Resume Text                 |
           +-------------------------------------------------------+
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
         Normalized Skill Parser                 TF-IDF Vectorizer
      (Case-insensitive, weighted)             (scikit-learn English)
                   │                                       │
                   v                                       v
          Exact Skill Score (40%)                 Cosine Similarity (30%)
                   │                                       │
                   +-------------------+-------------------+
                                       |
                                       v
                       Explainable 5-Factor Final Score
```

$$ \text{Final Match Score} = (S \times 0.40) + (M \times 0.30) + (E \times 0.15) + (D \times 0.05) + (P \times 0.10) $$

- **Skill Match ($40\%$)**: Weighted exact overlap of candidate skills vs required job skills.
- **Semantic Similarity ($30\%$)**: Cosine similarity between TF-IDF text feature vectors generated by `scikit-learn`.
- **Experience Similarity ($15\%$)**: TF-IDF vector similarity of candidate experience section vs required job experience.
- **Education Similarity ($5\%$)**: TF-IDF vector similarity of education credentials.
- **Project Similarity ($10\%$)**: TF-IDF vector similarity of project descriptions.

---

## 🛠️ Technology Stack

- **Backend Framework**: Python 3.13, FastAPI, Uvicorn.
- **Database & ORM**: PostgreSQL, SQLAlchemy ORM, psycopg v3.
- **AI/ML Engine**: `scikit-learn` (TF-IDF Vectorizer & Cosine Similarity), PyMuPDF (`fitz`).
- **Security & Auth**: PyJWT, Passlib (`bcrypt`), Python-Multipart, CORS Middleware.
- **Frontend Framework**: React 18, Vite, Axios, React Router v6.
- **Design System**: Vanilla CSS tokens, Dark Mode palette, Glassmorphism cards, Responsive UI.
- **Deployment & Hosting**: Vercel (Frontend), Render (Backend Web Service), Neon PostgreSQL (Cloud Database).
- **Testing & Quality**: Pytest, FastAPI TestClient, Oxlint.

---

## 📐 System Architecture

```
+-----------------------------------------------------------------------+
|                            React Frontend                             |
|       (Vercel: https://ai-recruitment-resume-intelligence.vercel.app) |
+-----------------------------------------------------------------------+
                                   |
                                   | REST API (JWT Bearer Auth)
                                   v
+-----------------------------------------------------------------------+
|                            FastAPI Backend                            |
|       (Render: https://ai-recruitment-backend-tc14.onrender.com)      |
+-----------------------------------------------------------------------+
            |                              |                   |
            v                              v                   v
+-----------------------+     +--------------------+   +----------------+
| PyMuPDF / Text Parser |     | scikit-learn TF-IDF|   | PostgreSQL DB  |
|  (Resume Extraction)  |     | (Cosine Similarity)|   |  (Neon Cloud)  |
+-----------------------+     +--------------------+   +----------------+
```

---

## 🗄️ Database & API Overview

### Database Schema (`PostgreSQL`)
- **`users`**: Account data, role (`candidate` / `recruiter`), password hash, active status.
- **`resumes`**: Extracted text, normalized skills list, experience, education, projects.
- **`jobs`**: Requisitions, required skills, salary, location, recruiter reference, status (`open` / `closed`).
- **`applications`**: Candidate job applications, recruitment status (`applied`, `shortlisted`, `interview`, `hired`, `rejected`).

### Key REST Endpoints
- `POST /auth/register` & `POST /auth/login`: Authentication & JWT issuance.
- `POST /resumes/upload`: PDF resume parsing & intelligence extraction.
- `POST /jobs/`: Job requisition posting (Recruiter).
- `GET /matching/jobs/{job_id}/resumes/{resume_id}`: Explainable 5-factor AI matching.
- `GET /matching/jobs/{job_id}/applicants`: Ranked applicant leaderboard.
- `GET /analytics/recruiter`: Executive hiring funnel analytics.
- `GET /interview-prep/job/{job_id}`: Customized candidate interview prep questions.

---

## 🔒 Security Features & Data Protection

- **Password Hashing**: Passlib with salted `bcrypt` hashes.
- **Stateless Authorization**: JWT Bearer tokens with configurable expiration (`JWT_ACCESS_TOKEN_EXPIRE_MINUTES`).
- **Role-Based Access Control (RBAC)**: Strict permission enforcement on routes (Candidates cannot post jobs or view full recruiter leaderboards).
- **Environment & Secret Protection**: All database credentials, secrets, and private tokens are isolated in environment variables and protected by `.gitignore`.
- **CORS Defense**: Restricted domain origin checking via FastAPI CORSMiddleware.

---

## 🧪 Testing & Verification

Comprehensive automated test suites cover route handling, API workflows, security, PDF extraction, and TF-IDF matching:

```bash
# Run pytest suite
$env:PYTHONPATH="."
.venv\Scripts\pytest.exe

# Run Frontend build check
cd frontend
npm run build
```

---

## ⚙️ Local Development Setup

### 1. Backend Setup
```bash
# Navigate to project root
cd AI-Recruitment-System

# Create virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1  # On Windows

# Install backend dependencies
pip install -r backend/requirements.txt

# Start FastAPI dev server
uvicorn backend.app.main:app --reload --port 8000
```
Interactive Swagger documentation: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend live at: `http://localhost:5173`

---

## 📂 Project Structure

```
AI-Recruitment-System/
├── backend/
│   ├── app/
│   │   ├── database/       # Database connection & Session
│   │   ├── models/         # User, Resume, Job, Application SQLAlchemy models
│   │   ├── routes/         # auth, resumes, job, application, matching, analytics, interview_prep
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # pdf, text, skill, semantic_similarity, matching services
│   │   ├── utils/          # auth_dependency, security, config
│   │   └── main.py         # FastAPI application entrypoint
│   ├── requirements.txt    # Clean production requirements file
│   └── tests/              # Pytest automated workflow test suite
├── docs/                   # Architecture, AI math, API specs, Setup, Deployment docs
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, ProtectedRoute, ScoreBreakdownCard
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Candidate & Recruiter dashboards, Resume, JobSearch, etc.
│   │   ├── services/       # Axios API client
│   │   └── App.jsx
│   └── package.json
├── Dockerfile              # Backend multi-stage docker container
└── README.md
```

---

## 🚀 Documentation Links
- 📐 [System Architecture](docs/architecture.md)
- 🤖 [AI Matching Methodology](docs/ai-matching.md)
- 🔌 [REST API Specification](docs/api-documentation.md)
- ⚙️ [Local Setup Guide](docs/setup.md)
- 🚀 [Production Deployment Guide](docs/deployment.md)

---

## 🔮 Future Improvements
- **Multi-Resume Profiles**: Allow candidates to store multiple resume versions targeted for different job families.
- **Asynchronous Processing**: Queue heavy PDF parsing jobs with Celery / Redis for high-throughput batch uploads.
- **Advanced Semantic Fine-Tuning**: Support optional GPU microservices for domain-specific embedding re-ranking in enterprise deployments.
