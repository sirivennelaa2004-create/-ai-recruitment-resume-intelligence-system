# Testing & Verification Guide

## Test Suite Overview

The project maintains comprehensive test suites for backend logic, API routes, database operations, security policies, and frontend builds.

### Backend Automated Test Suites
1. **`backend/tests/test_api_workflows.py`**:
   - User Registration & Duplicate Email handling (`409 Conflict`).
   - Login authentication & JWT Bearer token verification.
   - `/auth/me` security dependency check.
   - Job creation, editing, closing, and candidate access guards (`403 Forbidden`).
   - Application creation & duplicate submission prevention (`409 Conflict`).
   - Recruiter application status updating (`applied`, `shortlisted`, `interview`, `hired`, `rejected`).
   - Recruiter analytics compilation.
2. **`backend/test_matching.py`**:
   - Exact skill match scoring, case insensitivity, whitespace normalization, and matched/missing skill lists.
   - Weighted score formula precision.
3. **`backend/test_security.py`**:
   - Password hashing and bcrypt verification.
4. **`backend/test_resume_parser.py`**, `test_skill.py`, `test_education.py`, `test_experience.py`, `test_project.py`, `test_pdf.py`, `test_embedding.py`.

---

## Running Backend Tests

Run all tests using pytest with pythonpath configured:

```bash
# Windows PowerShell
$env:PYTHONPATH="."
.venv\Scripts\pytest.exe

# Linux / macOS
PYTHONPATH=. pytest
```

---

## Frontend Build Verification

To verify frontend components and Vite bundling:

```bash
cd frontend
npm run build
```
