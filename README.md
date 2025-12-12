# Hackathon II: Full-Stack Web Application

This is a full-stack web application built with Next.js and FastAPI, following a monorepo architecture.

## Project Structure

```
hackathon2/
├── .spec-kit/                 # Spec-kit configuration
│   └── config.yaml
├── specs/                    # Specifications organized by domain
│   ├── features/             # Feature specifications
│   ├── api/                  # API specifications
│   ├── database/             # Database schema specifications
│   └── ui/                   # UI specifications
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
└── backend/                  # FastAPI backend application
    ├── src/
    │   ├── main.py          # Main FastAPI application
    │   └── auth.py          # Authentication setup
    └── pyproject.toml
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `uv pip install -e .`
3. Run the development server: `uvicorn src.main:app --reload`

### Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Technology Stack

- **Frontend**: Next.js 16+, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI, SQLModel, Pydantic
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: Better Auth with JWT tokens
- **API**: RESTful design under `/api` endpoints

## Development Workflow

- Updates to specifications should be made in `specs/` first
- Frontend: Run with `npm run dev`
- Backend: Run with `uvicorn src.main:app --reload`