# TruthLens

TruthLens is a full-stack misinformation analysis platform.

It combines:
- A Next.js web application for users and admins
- A FastAPI AI microservice for NLP tasks
- A PostgreSQL database managed through Prisma
- Hybrid verification logic that uses web search, citations, and AI scoring

The product supports:
- Claim submission and verification
- AI analysis (fake news, sentiment, summary, claim extraction, source credibility)
- AI chat assistant for media literacy
- Admin dashboards for submissions, source management, and platform stats

## Table of Contents

- Project Overview
- Architecture
- Tech Stack
- Repository Structure
- Environment Variables
- Local Development Setup
- Running the Application
- API Reference (Next.js)
- API Reference (FastAPI AI Service)
- AI Model Inventory
- Database Schema Overview
- Authentication and Authorization
- Troubleshooting
- Deployment Notes
- Security Notes
- Contributing

## Project Overview

TruthLens receives a user-submitted claim or text and evaluates it by combining:

1. Search evidence from the web (Serper API or Google News RSS fallback)
2. AI-assisted classification and summarization
3. Citation-backed confidence scoring
4. Source credibility heuristics

Each submission is persisted with trust score, status, and citations, and can later be reviewed by users and admins.

## Architecture

~~~text
Browser
    -> Next.js App Router (UI + API routes)
            -> Prisma Client -> PostgreSQL
            -> verifyNews service (search + Gemini)
            -> FastAPI AI microservice (localhost:8000 by default)
                    -> Hugging Face Transformers models (local)
                    -> Gemini API (chat mode, optional)
~~~

High-level flow for a submission:

1. User sends content to POST /api/submissions
2. Next.js route validates JWT cookie
3. verifyNews searches sources and computes analysis
4. Submission and citations are stored in PostgreSQL
5. Optional AI endpoint calls can add detailed AIAnalysis entries

## Tech Stack

Frontend and API layer:
- Next.js 16.1.6
- React 19.2.3
- TypeScript
- Tailwind CSS 4

Backend services:
- FastAPI
- Uvicorn
- Transformers
- PyTorch
- Httpx

Database and auth:
- PostgreSQL (Prisma datasource)
- Prisma ORM and migrations
- JWT (jose)
- Cookie-based session token

## Repository Structure

~~~text
TruthLens/
    src/
        app/
            api/
                ai/
                auth/
                submissions/
                admin/
                feedback/
                sources/
        lib/
            db.ts
            verify.ts
        proxy.ts
    prisma/
        schema.prisma
        migrations/
    ai-service/
        main.py
        requirements.txt
        models/
            chatbot.py
            fake_news.py
            sentiment.py
            summarizer.py
            claim_extractor.py
            credibility.py
~~~

## Environment Variables

Create one root .env file at the repository root (same level as package.json).

Required variables:

| Variable | Required | Used By | Description |
|---|---|---|---|
| DATABASE_URL | Yes | Prisma / Next.js API | PostgreSQL connection string |
| DIRECT_URL | Recommended | Prisma migrations | Direct DB URL for migration operations |
| AUTH_SECRET | Yes | Next.js auth and middleware | JWT signing and verification secret |

Optional but strongly recommended:

| Variable | Optional | Used By | Description |
|---|---|---|---|
| AI_SERVICE_URL | Optional | Next.js AI routes | FastAPI base URL, defaults to http://localhost:8000 |
| SERPER_API_KEY | Optional | src/lib/verify.ts | Web search API key; improves citation quality |
| GEMINI_API_KEY | Optional | verify.ts and ai-service/models/chatbot.py | Enables Gemini-based reasoning and chat |

Example .env:

~~~env
DATABASE_URL="postgresql://user:password@localhost:5432/truthlens"
DIRECT_URL="postgresql://user:password@localhost:5432/truthlens"
AUTH_SECRET="replace_with_a_long_random_secret"
AI_SERVICE_URL="http://localhost:8000"
SERPER_API_KEY="optional_serper_key"
GEMINI_API_KEY="optional_gemini_key"
~~~

## Local Development Setup

### Prerequisites

- Node.js 20+
- npm
- Python 3.11+ (project currently runs on 3.14 in local environment)
- PostgreSQL

### 1) Install web dependencies

~~~bash
npm install
~~~

### 2) Configure environment

Create and fill .env in the project root.

### 3) Run Prisma migrations

~~~bash
npx prisma migrate dev
~~~

Optional checks:

~~~bash
npx prisma generate
npx prisma studio
~~~

### 4) Set up AI microservice environment

From ai-service directory:

~~~bash
python -m venv venv

# Windows PowerShell
venv\Scripts\Activate.ps1

pip install -r requirements.txt
~~~

### 5) Start services

Terminal A (web app, from project root):

~~~bash
npm run dev
~~~

Terminal B (AI service, from ai-service):

~~~bash
uvicorn app.main:app --reload --port 8000
~~~

Notes:
- app.main:app is supported by a compatibility shim in ai-service/app/main.py
- main:app also works when launched from ai-service

## Running the Application

Default URLs:
- Web app: http://localhost:3000
- AI service: http://127.0.0.1:8000
- AI health check: http://127.0.0.1:8000/health

Suggested manual smoke test:

1. Register a user
2. Login and open dashboard
3. Submit a claim/text
4. Open analyze page and run AI tools
5. Login as admin and validate admin pages

## API Reference (Next.js)

Base: /api

### Auth

- POST /api/auth/register
    - Body: name, email, password, optional role
- POST /api/auth/login
    - Body: email, password
    - Sets auth_token HTTP-only cookie
- POST /api/auth/logout
    - Clears auth_token cookie
- GET /api/auth/me
    - Returns current user from JWT

### Submissions

- POST /api/submissions
    - Protected
    - Body: content, optional title, optional url
    - Triggers verifyNews pipeline and stores submission
- GET /api/submissions
    - Protected
    - Returns current user submissions
- GET /api/submissions/:id
    - Protected
    - Owner or ADMIN only

### AI Proxy Routes (forward to FastAPI)

- POST /api/ai/fake-news
- POST /api/ai/sentiment
- POST /api/ai/summarize
- POST /api/ai/claims
- POST /api/ai/credibility
- POST /api/ai/chat
- GET /api/ai/chat (chat history)

All AI routes require authentication and use AI_SERVICE_URL.

### Admin

- GET /api/admin/stats
- GET /api/admin/submissions
- GET /api/admin/feedback
- GET /api/admin/sources
- POST /api/admin/sources

Admin routes require role ADMIN.

### Public Utility Routes

- POST /api/feedback
- GET /api/sources

## API Reference (FastAPI AI Service)

Base: AI_SERVICE_URL, default http://localhost:8000

- GET /health
- POST /fake-news
    - Input: text
- POST /sentiment
    - Input: text
- POST /summarize
    - Input: text, optional max_length, optional min_length
- POST /claims
    - Input: text
- POST /credibility
    - Input: domain
- POST /chat
    - Input: message, optional context, optional history

The AI service loads root .env from parent directory and supports local model inference plus Gemini chat fallback.

## AI Model Inventory

Local Hugging Face models:

- facebook/bart-large-mnli
    - Task: fake news zero-shot classification
- distilbert-base-uncased-finetuned-sst-2-english
    - Task: sentiment analysis
- facebook/bart-large-cnn
    - Task: summarization via AutoTokenizer and AutoModelForSeq2SeqLM
- dslim/bert-base-NER
    - Task: entity and claim extraction

Cloud model usage:

- Gemini 2.0 Flash
    - Used in chatbot and verifyNews reasoning when GEMINI_API_KEY is configured

Rule-based AI component:

- Source credibility scoring for domains (heuristic and known-source table)

## Database Schema Overview

Main models:

- User
- Submission
- AIAnalysis
- ChatMessage
- Source
- Feedback

Status values in Submission:

- VERIFIED
- RELIABLE
- FLAGGED
- FAKE

AIAnalysis type values:

- FAKE_NEWS
- SENTIMENT
- SUMMARY
- CLAIMS

Important note:
- Prisma datasource is PostgreSQL (not SQLite)

## Authentication and Authorization

- JWT token stored in auth_token HTTP-only cookie
- Token includes userId, email, role
- Middleware/proxy protects:
    - /dashboard/*
    - /report/*
    - /admin/*
- Non-admin users are redirected away from admin pages

## Troubleshooting

### 1) AI summarize returns 502 from Next.js

Likely cause:
- FastAPI /summarize failed (502 is proxy-level wrapper)

Checks:
1. Confirm AI service is running on port 8000
2. Open /health on AI service
3. Inspect AI logs for model load errors
4. Retry after first model download (first run can be slow)

### 2) No module named app when running uvicorn

Use:

~~~bash
uvicorn app.main:app --reload --port 8000
~~~

or:

~~~bash
uvicorn main:app --reload --port 8000
~~~

from ai-service directory.

### 3) Auth errors (401/403)

Checks:
1. AUTH_SECRET exists and is identical across app runtime
2. Login route is setting auth_token
3. Browser is sending cookie to API routes

### 4) Prisma connection issues

Checks:
1. DATABASE_URL points to a reachable PostgreSQL instance
2. Run npx prisma migrate dev
3. Verify DIRECT_URL for migration workflows

### 5) First AI request is slow

Expected behavior:
- Initial model download and warm-up can take significant time
- Subsequent requests are much faster due to local cache

## Deployment Notes

For production deployment:

1. Deploy Next.js app and AI microservice as separate services
2. Set AI_SERVICE_URL in web app environment to the AI service URL
3. Use managed PostgreSQL and secure credentials
4. Set strong AUTH_SECRET
5. Use HTTPS so secure cookies behave correctly
6. Add process manager/health checks for both services

## Security Notes

- Never commit .env files
- Rotate AUTH_SECRET and API keys periodically
- Restrict admin account creation and role assignment
- Validate and sanitize all user input (already partly handled)

## Contributing

Suggested contribution workflow:

1. Create a feature branch
2. Implement and test locally (web + AI service)
3. Run lint and verify critical API routes
4. Open PR with clear test notes and screenshots

---

If you are onboarding quickly, start with:

1. Environment Variables
2. Local Development Setup
3. Running the Application
4. API Reference sections
