# REST API Specification & Endpoints Reference

Interactive Swagger UI documentation is available at:
- **Live Production Docs**: [https://ai-recruitment-backend-tc14.onrender.com/docs](https://ai-recruitment-backend-tc14.onrender.com/docs)
- **Local Dev Docs**: `http://127.0.0.1:8000/docs`

---

## Base URLs
- **Production Backend**: `https://ai-recruitment-backend-tc14.onrender.com`
- **Production Frontend**: `https://ai-recruitment-resume-intelligence.vercel.app`
- **Local Development**: `http://127.0.0.1:8000`

---

## 1. Authentication Endpoints (`/auth`)

### `POST /auth/register`
- **Description**: Registers a new user account (Candidate or Recruiter).
- **Body**: `{ "full_name": "string", "email": "user@example.com", "password": "string", "role": "candidate" | "recruiter" }`
- **Response**: `201 Created` with `UserResponse`. Returns `409 Conflict` if email exists.

### `POST /auth/login`
- **Description**: Authenticates user and returns JWT Bearer token.
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `200 OK` with `{ "access_token": "string", "token_type": "bearer" }`.

### `GET /auth/me`
- **Description**: Fetches profile data of current authenticated user.
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with `UserResponse`.

### `PUT /auth/profile`
- **Description**: Updates user display full name.
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{ "full_name": "string" }`

---

## 2. Resume Endpoints (`/resumes`)

### `POST /resumes/upload`
- **Description**: Uploads a PDF resume (max 5MB limit), extracts raw text via PyMuPDF, and automatically parses skills, education background, work experience, and project entries.
- **Header**: `Authorization: Bearer <token>` (Candidate role required)
- **Form Data**: `file` (.pdf file)
- **Response**: `200 OK` with parsed resume payload.

### `GET /resumes/my`
- **Description**: Fetches candidate's latest uploaded resume profile.
- **Header**: `Authorization: Bearer <token>`

---

## 3. Job Endpoints (`/jobs`)

### `POST /jobs/`
- **Description**: Creates a new job requisition (Recruiter only).
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "string", "description": "string", "required_skills": "string", "experience_required": "string", "education_required": "string", "location": "string", "salary": "string" }`

### `GET /jobs/`
- **Description**: Lists all active open job requisitions.
- **Header**: `Authorization: Bearer <token>`

### `GET /jobs/my`
- **Description**: Lists jobs posted by logged-in recruiter.
- **Header**: `Authorization: Bearer <token>` (Recruiter only)

### `PUT /jobs/{job_id}`
- **Description**: Updates an existing job requisition (Recruiter only for own jobs).

### `PATCH /jobs/{job_id}/close`
- **Description**: Marks a job requisition as closed.

---

## 4. Application Endpoints (`/applications`)

### `POST /applications/`
- **Description**: Candidate submits job application.
- **Body**: `{ "job_id": int }`
- **Errors**: `409 Conflict` if duplicate application or job closed.

### `GET /applications/my`
- **Description**: Fetches candidate's job applications.

### `GET /applications/job/{job_id}/applicants`
- **Description**: Recruiter fetches applicant list for job.

### `PATCH /applications/{application_id}/status`
- **Description**: Updates application status (`applied`, `shortlisted`, `interview`, `hired`, `rejected`).

---

## 5. AI Matching & Ranking (`/matching`)

### `GET /matching/jobs/{job_id}/resumes/{resume_id}`
- **Description**: Calculates explainable 5-factor AI match score between job and resume.
- **Response**: Returns 5 sub-scores (`skill_score`, `semantic_score`, `experience_score`, `education_score`, `project_score`), final score (`final_score` / `match_percentage`), matched skills, missing skills, and detailed text explanation.

### `GET /matching/jobs/{job_id}/applicants`
- **Description**: Returns all applicants for job ranked by AI `match_percentage` DESC (Recruiter only).

---

## 6. Recruiter Analytics (`/analytics`)

### `GET /analytics/recruiter`
- **Description**: Returns overview hiring stats, candidate pipeline status breakdown, and candidate pool average AI match score.

---

## 7. Candidate Interview Prep (`/interview-prep`)

### `GET /interview-prep/job/{job_id}`
- **Description**: Generates role-tailored technical questions, STAR behavioral scenarios, and targeted skill-gap advice based on missing skills.
