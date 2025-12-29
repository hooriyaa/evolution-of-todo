
<!-- Sync Impact Report:
- Version change: 2.0.0 → 2.1.0 (minor update for urgent project enhancements)
- Modified principles: Technology Stack, Coding Standards & Quality, Deliverable Assurance
- Added principles: Urgent Project Priorities, AI Integration Standard, Security & Performance Standards
- Templates requiring updates: ⚠ pending .specify/templates/plan-template.md | ⚠ pending .specify/templates/spec-template.md | ⚠ pending .specify/templates/tasks-template.md | ⚠ pending .specify/templates/commands/*.md
- Follow-up TODOs: None
-->
# Hackathon II: Full-Stack Web Application Constitution

## Core Principles

### Spec-Driven Development (SDD)
The System Architect (User) provides Specifications. The Implementation Engine (AI) executes from these Specs. Golden Rule: Do NOT write or modify code without a corresponding update in the Specification Markdown files. Code must always reflect the Specs. This is especially critical during urgent development cycles to maintain quality and direction.

### Full-Stack Architecture
Pattern: Monorepo Architecture with clear separation of concerns. Folder Structure: `/frontend`: Next.js 16+ (App Router), Tailwind CSS, TypeScript. `/backend`: Python FastAPI, SQLModel, Pydantic. `/specs`: Organized into subfolders (features, api, database, ui). Database: Neon Serverless PostgreSQL using SQLModel ORM for backend persistence. This architecture enables rapid iteration during urgent project phases.

### Technology Stack Standardization
Frontend: Next.js 16+ (App Router), Tailwind CSS, TypeScript. Backend: Python 3.13+, FastAPI, SQLModel, Pydantic, UV dependency manager. Authentication: Better Auth with JWT tokens. Testing Framework: pytest for backend, Jest/React Testing Library for frontend. UI Framework: Server Components by default, Client Components only when needed. AI Integration: Google Gemini API for intelligent task management features.

### Authentication Standard
All user authentication must be implemented with Better Auth. Secure token management using JWT. All protected routes and API endpoints must validate user authentication status. User sessions must be properly managed and securely stored. Session management must be robust to handle urgent feature deployments without compromising security.

### Coding Standards & Quality
Backend: Follow PEP 8, strict Type Hints, async/await for DB operations. Frontend: Use Server Components by default, Client Components only when needed. Use 'lib/api.ts' for backend calls. API: RESTful design. Type Safety: MANDATORY Python Type Hints and TypeScript for all function arguments and return values. Documentation: Every class and function must have a docstring explaining its purpose, arguments, and returns. Error Handling: Implement robust try-except blocks. The app should never crash; it should display user-friendly error messages. During urgent development, maintain these standards to prevent technical debt accumulation.

### Modular Architecture Design
Pattern: Modular Design (Separation of Concerns) with clear boundaries between frontend and backend. Folder Structure: `/specs` (Documentation & Requirements), `/frontend` (Next.js app), `/backend` (FastAPI app), `/tests` (Unit Tests). Imports: Use absolute imports. Avoid circular dependencies. API Endpoints: All endpoints must be under `/api`. This modularity is essential for rapid development during urgent project phases.

### Deliverable Assurance
Ensure the app can: Add, Delete, Update, View, and Mark Tasks as Complete, with persistent storage in PostgreSQL. All Phase I features must be ported to the Web App. User Authentication (Signup/Login) must be implemented. Each feature must be tested before implementation is considered complete. For urgent projects, implement a minimum viable version first, then iterate with additional features.

### Urgent Project Priorities
During urgent project phases, prioritize: 1) Core functionality (task management, authentication) 2) Security and data integrity 3) Performance and user experience 4) Scalability considerations. All urgent features must pass basic tests before deployment. Maintain a stable main branch at all times, using feature branches for urgent development.

### AI Integration Standard
AI features must be implemented using Google Gemini API through the defined agent system. All AI interactions must be logged for debugging and improvement. AI responses should be validated before being presented to users. The AI should enhance, not replace, core application functionality. Implement proper error handling when AI services are unavailable.

### Security & Performance Standards
All inputs must be validated and sanitized to prevent injection attacks. Implement proper authentication and authorization for all endpoints. Use HTTPS in production. Optimize database queries to prevent performance bottlenecks. Implement proper error handling without exposing sensitive information. For urgent projects, security must never be compromised for speed of delivery.

## Additional Requirements
All components must be testable in isolation. Performance requirements include responsive web interactions with no noticeable lag. Security considerations include input validation, protection against injection attacks, secure authentication, and proper data sanitization. During urgent development, maintain a security-first approach.

## Development Workflow
All code submissions must include corresponding tests. Spec-Driven: Updates must be made in specs first. Run commands: Frontend via `npm run dev`, Backend via `uvicorn main:app --reload`. Code reviews must verify compliance with all constitution principles. Development follows an iterative approach with frequent testing and validation. For urgent projects, implement a streamlined review process while maintaining quality standards.

## Governance
Constitution supersedes all other practices. Amendments require formal documentation and approval. All PRs/reviews must verify compliance with constitution principles. Breaking changes must follow semantic versioning. During urgent project phases, maintain flexibility while adhering to core principles.

**Version**: 2.1.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-29
