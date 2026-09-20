# Production Deployment Guide

This guide details the live production architecture, environment variables, CORS setup, and step-by-step instructions for hosting the platform on **Render** (Backend API) and **Vercel** (Frontend React App).

---

## Live Production Architecture Overview

- **Frontend Application**: Hosted on **Vercel**
  - **Live URL**: [https://ai-recruitment-resume-intelligence.vercel.app](https://ai-recruitment-resume-intelligence.vercel.app)
  - **Framework**: React 18 + Vite
- **Backend API Service**: Hosted on **Render** (Free / Web Service)
  - **Live URL**: [https://ai-recruitment-backend-tc14.onrender.com](https://ai-recruitment-backend-tc14.onrender.com)
  - **Swagger API Docs**: [https://ai-recruitment-backend-tc14.onrender.com/docs](https://ai-recruitment-backend-tc14.onrender.com/docs)
  - **Runtime**: Python 3.13 / FastAPI / Uvicorn
  - **Memory Footprint**: < 100 MB RAM (Optimized for Render 512 MB Free Instance)

---

## 1. Backend Deployment (Render)

### Environment Variables Matrix (Render)

| Variable Name | Description | Example Production Value |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@ep-xyz.neon.tech/neondb` |
| `JWT_SECRET_KEY` | Secret key for signing JWT tokens | `a_64_character_hex_random_secret_key` |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | `http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,https://ai-recruitment-resume-intelligence.vercel.app` |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration duration | `60` |

### Render Service Setup Steps
1. Connect GitHub repository to **Render**.
2. Select **Web Service** with Environment `Python 3`.
3. Set **Build Command**: `pip install -r backend/requirements.txt`
4. Set **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port 10000`
5. Add required environment variables (`DATABASE_URL`, `JWT_SECRET_KEY`, `CORS_ORIGINS`).

---

## 2. Frontend Deployment (Vercel)

### Environment Variables Matrix (Vercel)

| Variable Name | Description | Value |
|---|---|---|
| `VITE_API_URL` | Base URL of the deployed FastAPI backend | `https://ai-recruitment-backend-tc14.onrender.com` |

### Vercel Deployment Steps
1. Import GitHub repository into **Vercel**.
2. Select **Framework Preset**: `Vite`.
3. Set **Root Directory**: `frontend`.
4. Set **Build Command**: `npm run build`.
5. Set **Output Directory**: `dist`.
6. Add Environment Variable: `VITE_API_URL` = `https://ai-recruitment-backend-tc14.onrender.com`.
7. Click **Deploy**.

---

## 3. CORS Security & Preflight Configuration

The backend `CORSMiddleware` handles preflight and credentials safely. When `CORS_ORIGINS` includes `https://ai-recruitment-resume-intelligence.vercel.app`, FastAPI automatically emits:
- `Access-Control-Allow-Origin: https://ai-recruitment-resume-intelligence.vercel.app`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Headers: *`
- `Access-Control-Allow-Methods: *`
