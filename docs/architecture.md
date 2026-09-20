# System Architecture — AI-Powered Recruitment & Resume Intelligence System

## Overview
The AI-Powered Recruitment & Resume Intelligence System is a modern full-stack web application designed to automate resume parsing, calculate explainable AI job-candidate match scores, rank applicants for recruiters, and provide interview preparation tools for candidates.

```
+-----------------------------------------------------------------------+
|                            React Frontend                             |
|    (Vite, React Router v6, Axios, AuthContext, Glassmorphism UI)      |
+-----------------------------------------------------------------------+
                                   |
                                   | REST API (JWT Bearer Auth)
                                   v
+-----------------------------------------------------------------------+
|                            FastAPI Backend                            |
|  (Auth, Resumes, Jobs, Applications, AI Matching, Analytics, Prep)    |
+-----------------------------------------------------------------------+
            |                              |                   |
            v                              v                   v
+-----------------------+     +--------------------+   +----------------+
| PyMuPDF / Text Parser |     | scikit-learn TF-IDF|   | PostgreSQL DB  |
|  (Resume Extraction)  |     | (Cosine Similarity)|   |  (SQLAlchemy)  |
+-----------------------+     +--------------------+   +----------------+
```

## Core Subsystems

### 1. Backend Layer (Python 3.13 / FastAPI)
- **FastAPI Framework**: High performance async-ready RESTful web service.
- **SQLAlchemy ORM**: Relational mapping for PostgreSQL database.
- **PyMuPDF (`fitz`)**: High accuracy PDF text extraction.
- **JWT Authentication**: Password hashing with `passlib[bcrypt]` and JWT tokens with `python-jose`.

### 2. AI & NLP Matching Engine
- **scikit-learn TF-IDF & Cosine Similarity**: Generates lightweight text feature vectors for semantic similarity scoring.
- **Exact Skill Weighting**: Normalizes skill sets, applies skill importance weights, and computes candidate matched vs missing skills.
- **Explainable 5-Factor Score**:
  - **Skill Match**: 40%
  - **Semantic Similarity**: 30%
  - **Experience Similarity**: 15%
  - **Education Similarity**: 5%
  - **Project Similarity**: 10%

### 3. Frontend Layer (React / Vite)
- **Design Tokens & Vanilla CSS**: Custom CSS theme tokens for rich aesthetics, glassmorphism, responsive tables, and badges.
- **AuthContext**: Centralized user session management and automatic token expiration interceptors.
- **Role-Aware Portals**:
  - **Candidate Portal**: Dashboard, Resume Upload/Intelligence, Job Search & AI Match Drawer, Applications Tracker, Candidate Interview Prep.
  - **Recruiter Portal**: Dashboard, Requisition Management (Create/Edit/Close), AI Applicant Rankings (Sorted by match score DESC), Recruitment Analytics.
