
<!--
Sync Impact Report:
- Version change: 1.0.0 → 2.0.0 (major update for Phase II architecture)
- Modified principles: Technology Stack, Storage Constraint, Modular Architecture, Deliverable Assurance
- Added principles: Full-Stack Architecture, Authentication Standard
- Removed principles: Phase I Storage Constraint (replaced by new storage strategy)
- Templates requiring updates: ✅ .specify/templates/plan-template.md | ✅ .specify/templates/spec-template.md | ✅ .specify/templates/tasks-template.md | ⚠ pending .specify/templates/commands/*.md
- Follow-up TODOs: None
-->
# Hackathon II: Full-Stack Web Application Constitution

## Core Principles

### Spec-Driven Development (SDD)
The System Architect (User) provides Specifications. The Implementation Engine (AI) executes from these Specs. Golden Rule: Do NOT write or modify code without a corresponding update in the Specification Markdown files. Code must always reflect the Specs.

### Full-Stack Architecture
Pattern: Monorepo Architecture with clear separation of concerns. Folder Structure: `/frontend`: Next.js 16+ (App Router), Tailwind CSS, TypeScript. `/backend`: Python FastAPI, SQLModel, Pydantic. `/specs`: Organized into subfolders (features, api, database, ui). Database: Neon Serverless PostgreSQL using SQLModel ORM for backend persistence.

### Technology Stack Standardization
Frontend: Next.js 16+ (App Router), Tailwind CSS, TypeScript. Backend: Python 3.13+, FastAPI, SQLModel, Pydantic, UV dependency manager. Authentication: Better Auth with JWT tokens. Testing Framework: pytest for backend, Jest/React Testing Library for frontend. UI Framework: Server Components by default, Client Components only when needed.

### Authentication Standard
All user authentication must be implemented with Better Auth. Secure token management using JWT. All protected routes and API endpoints must validate user authentication status. User sessions must be properly managed and securely stored.

### Coding Standards & Quality
Backend: Follow PEP 8, strict Type Hints, async/await for DB operations. Frontend: Use Server Components by default, Client Components only when needed. Use 'lib/api.ts' for backend calls. API: RESTful design. Type Safety: MANDATORY Python Type Hints and TypeScript for all function arguments and return values. Documentation: Every class and function must have a docstring explaining its purpose, arguments, and returns. Error Handling: Implement robust try-except blocks. The app should never crash; it should display user-friendly error messages.

### Modular Architecture Design
Pattern: Modular Design (Separation of Concerns) with clear boundaries between frontend and backend. Folder Structure: `/specs` (Documentation & Requirements), `/frontend` (Next.js app), `/backend` (FastAPI app), `/tests` (Unit Tests). Imports: Use absolute imports. Avoid circular dependencies. API Endpoints: All endpoints must be under `/api`.

### Deliverable Assurance
Ensure the app can: Add, Delete, Update, View, and Mark Tasks as Complete, with persistent storage in PostgreSQL. All Phase I features must be ported to the Web App. User Authentication (Signup/Login) must be implemented. Each feature must be tested before implementation is considered complete.

## Additional Requirements
All components must be testable in isolation. Performance requirements include responsive web interactions with no noticeable lag. Security considerations include input validation, protection against injection attacks, secure authentication, and proper data sanitization.

## Development Workflow
All code submissions must include corresponding tests. Spec-Driven: Updates must be made in specs first. Run commands: Frontend via `npm run dev`, Backend via `uvicorn main:app --reload`. Code reviews must verify compliance with all constitution principles. Development follows an iterative approach with frequent testing and validation.

## Governance
Constitution supersedes all other practices. Amendments require formal documentation and approval. All PRs/reviews must verify compliance with constitution principles. Breaking changes must follow semantic versioning.

**Version**: 2.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-07
