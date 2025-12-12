---
id: 1
title: "Update Project Constitution"
stage: constitution
date_iso: "2025-12-07"
surface: "agent"
model: "Qwen"
feature: "none"
branch: "main"
user: "PMLS"
command: "/sp.constitution Update the Project Constitution for Phase II: Full-Stack Web Application"
labels: ["constitution", "architecture", "specification"]
spec: null
ticket: null
adr: null
pr: null
files_yaml:
  - ".specify/memory/constitution.md"
tests_yaml: []
links: []
outcome: "Successfully updated the project constitution to reflect Phase II requirements including full-stack architecture, updated technology stack, authentication standards, and deliverable assurance."
evaluation: "The constitution was successfully updated from v1.0.0 to v2.0.0 to reflect the transition from a CLI application to a full-stack web application. All required architectural changes were incorporated, and dependent templates were checked for consistency."
---

# Update Project Constitution

## User Input

```
/sp.constitution Update the Project Constitution for Phase II: Full-Stack Web Application.

1. ARCHITECTURE & STRUCTURE
   - Pattern: Monorepo Architecture.
   - Folders:
     - `/frontend`: Next.js 16+ (App Router), Tailwind CSS, TypeScript.
     - `/backend`: Python FastAPI, SQLModel, Pydantic.
     - `/specs`: Organized into subfolders (features, api, database, ui).
   - Database: Neon Serverless PostgreSQL (using SQLModel ORM).
   - Authentication: Better Auth with JWT tokens.

2. CODING STANDARDS (UPDATED)
   - Backend: Follow PEP 8, strict Type Hints, async/await for DB operations.
   - Frontend: Use Server Components by default, Client Components only when needed. Use 'lib/api.ts' for backend calls.
   - API: RESTful design. All endpoints must be under `/api`.

3. DEVELOPMENT WORKFLOW
   - Spec-Driven: Updates must be made in specs first.
   - Run commands: Frontend via `npm run dev`, Backend via `uvicorn main:app --reload`.

4. PHASE II DELIVERABLES
   - Port all Phase I features (Add, Update, Delete, View, Complete) to the Web App.
   - Implement Persistent Storage (PostgreSQL).
   - Implement User Authentication (Signup/Login).
```

## Response Summary

Updated the project constitution to reflect Phase II requirements for a Full-Stack Web Application. The constitution now includes:

- Full-Stack Architecture principle with monorepo structure
- Updated Technology Stack Standardization for Next.js/TypeScript frontend and FastAPI/SQLModel backend
- Added Authentication Standard with Better Auth
- Updated Modular Architecture Design for frontend/backend separation
- Enhanced Deliverable Assurance for persistent storage and user authentication
- Updated Development Workflow with appropriate run commands

Version was bumped from 1.0.0 to 2.0.0 to reflect major architectural changes. The constitution maintains the core Spec-Driven Development principle while adapting to the new requirements for Phase II.