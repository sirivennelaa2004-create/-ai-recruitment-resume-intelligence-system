# Database Design & Schema Specification

## Overview
The application uses PostgreSQL with SQLAlchemy ORM. The relational schema consists of four core models: `User`, `Resume`, `Job`, and `Application`.

```
           +-----------------+
           |      users      |
           +-----------------+
           | id (PK)         |
           | full_name       |
           | email (Indexed) |
           | password_hash   |
           | role            |
           +-----------------+
             /        |        \
      1:N   /    1:N  |         \  1:N
           v          v          v
+---------------+  +-------+  +--------------+
|    resumes    |  | jobs  |  | applications |
+---------------+  +-------+  +--------------+
| id (PK)       |  | id    |  | id (PK)      |
| user_id (FK)  |  | rec_id|  | cand_id (FK) |
| raw_text      |  | title |  | job_id (FK)  |
| skills        |  | skills|  | status       |
+---------------+  +-------+  +--------------+
```

## Data Models

### 1. `users` Table
- `id` (Integer, Primary Key)
- `full_name` (String 100, Not Null)
- `email` (String 255, Unique, Indexed, Not Null)
- `password_hash` (String 255, Not Null)
- `role` (String 20, Not Null) — `'candidate'` or `'recruiter'`
- `is_active` (Boolean, Default True)
- `created_at` (DateTime, Server Default NOW)

### 2. `resumes` Table
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key -> `users.id`, Not Null)
- `filename` (String 255, Not Null)
- `file_path` (String 500, Not Null)
- `raw_text` (Text, Nullable)
- `cleaned_text` (Text, Nullable)
- `skills` (Text, Nullable)
- `education` (Text, Nullable)
- `experience` (Text, Nullable)
- `projects` (Text, Nullable)

### 3. `jobs` Table
- `id` (Integer, Primary Key)
- `recruiter_id` (Integer, Foreign Key -> `users.id`, Not Null)
- `title` (String 200, Not Null)
- `description` (Text, Not Null)
- `required_skills` (Text, Nullable)
- `experience_required` (String 100, Nullable)
- `education_required` (String 200, Nullable)
- `location` (String 200, Nullable)
- `salary` (String 100, Nullable)
- `status` (String 20, Default `'open'`, Not Null)

### 4. `applications` Table
- `id` (Integer, Primary Key)
- `candidate_id` (Integer, Foreign Key -> `users.id`, Not Null)
- `job_id` (Integer, Foreign Key -> `jobs.id`, Not Null)
- `status` (String 30, Default `'applied'`, Not Null) — `'applied'`, `'shortlisted'`, `'interview'`, `'hired'`, `'rejected'`
