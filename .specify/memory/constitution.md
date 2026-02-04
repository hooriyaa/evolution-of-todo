
<!-- Sync Impact Report:
- Version change: 2.2.0 → 3.0.0 (major update for cloud native architecture transition)
- Modified principles: Full-Stack Architecture, Technology Stack Standardization, Deliverable Assurance, Containerization & Orchestration Standards
- Added principles: Event-Driven Architecture Standard, Distributed Runtime Standard, Advanced Feature Requirements
- Templates requiring updates: ⚠ pending .specify/templates/plan-template.md | ⚠ pending .specify/templates/spec-template.md | ⚠ pending .specify/templates/tasks-template.md | ⚠ pending .specify/templates/commands/*.md
- Follow-up TODOs: Update all template files to reflect new architecture and feature requirements
-->
# Hackathon II: Cloud Native Event-Driven Todo Chatbot Constitution

## Core Principles

### Spec-Driven Development (SDD)
The System Architect (User) provides Specifications. The Implementation Engine (AI) executes from these Specs using the `phase5-cloud-architect` persona. Golden Rule: Do NOT write or modify code without a corresponding update in the Specification Markdown files. Code must always reflect the Specs. This is especially critical during cloud deployment phases to maintain quality and direction.

### Full-Stack Architecture
Pattern: Monorepo Architecture with clear separation of concerns. Folder Structure: `/frontend`: Next.js 16+ (App Router), Tailwind CSS, TypeScript. `/backend`: Python FastAPI, SQLModel, Pydantic. `/specs`: Organized into subfolders (features, api, database, ui). Database: Neon Serverless PostgreSQL using SQLModel ORM for backend persistence. This architecture enables rapid iteration during cloud deployment phases.

### Technology Stack Standardization
Frontend: Next.js 16+ (App Router), Tailwind CSS, TypeScript. Backend: Python 3.13+, FastAPI, SQLModel, Pydantic, UV dependency manager. Authentication: Better Auth with JWT tokens. Testing Framework: pytest for backend, Jest/React Testing Library for frontend. UI Framework: Server Components by default, Client Components only when needed. AI Integration: Google Gemini API for intelligent task management features. Event Streaming: Apache Kafka or Redpanda for asynchronous communication. Distributed Runtime: Dapr (Distributed Application Runtime) for abstracting pub/sub, state management, and bindings.

### Authentication Standard
All user authentication must be implemented with Better Auth. Secure token management using JWT. All protected routes and API endpoints must validate user authentication status. User sessions must be properly managed and securely stored. Session management must be robust to handle cloud deployment without compromising security.

### Coding Standards & Quality
Backend: Follow PEP 8, strict Type Hints, async/await for DB operations. Frontend: Use Server Components by default, Client Components only when needed. Use 'lib/api.ts' for backend calls. API: RESTful design. Type Safety: MANDATORY Python Type Hints and TypeScript for all function arguments and return values. Documentation: Every class and function must have a docstring explaining its purpose, arguments, and returns. Error Handling: Implement robust try-except blocks. The app should never crash; it should display user-friendly error messages. During cloud deployment, maintain these standards to prevent technical debt accumulation.

### Modular Architecture Design
Pattern: Modular Design (Separation of Concerns) with clear boundaries between frontend and backend. Folder Structure: `/specs` (Documentation & Requirements), `/frontend` (Next.js app), `/backend` (FastAPI app), `/tests` (Unit Tests). Imports: Use absolute imports. Avoid circular dependencies. API Endpoints: All endpoints must be under `/api`. This modularity is essential for cloud deployment phases.

### Event-Driven Architecture Standard
The application must implement an event-driven architecture using Kafka (or Redpanda) for handling asynchronous events like `task-events`, `reminders`, and `task-updates`. All inter-service communication should leverage pub/sub patterns where appropriate. Events must be designed with schema evolution in mind. Proper error handling and dead-letter queues must be implemented for failed events. Event sourcing patterns should be considered for audit trails and state reconstruction.

### Distributed Runtime Standard
The application must utilize Dapr (Distributed Application Runtime) for abstracting common distributed system challenges. Dapr sidecars should handle service invocation, pub/sub messaging, state management, and external system bindings. State management should leverage Dapr State Store (Redis/Postgres) instead of direct database calls where applicable. Proper component configuration for different environments (dev, staging, prod) must be maintained. Dapr should simplify microservice development while maintaining loose coupling.

### Deliverable Assurance
Ensure the app can: Add, Delete, Update, View, and Mark Tasks as Complete, with persistent storage in PostgreSQL. All Phase I features must be ported to the Web App. User Authentication (Signup/Login) must be implemented. Each feature must be tested before implementation is considered complete. For cloud deployment, implement a minimum viable version first, then iterate with additional features.

### Advanced Feature Requirements
The application must support: Recurring Tasks (Auto-reschedule logic), Due Dates & Time Reminders, Priorities, Tags/Categories, Search & Filter, and Sort Tasks. These features must be implemented with scalability in mind, leveraging the event-driven architecture and distributed runtime. All advanced features must be properly tested and documented.

### Urgent Project Priorities
During urgent project phases, prioritize: 1) Core functionality (task management, authentication) 2) Security and data integrity 3) Performance and user experience 4) Scalability considerations. All urgent features must pass basic tests before deployment. Maintain a stable main branch at all times, using feature branches for urgent development.

### AI Integration Standard
AI features must be implemented using Google Gemini API through the defined agent system. All AI interactions must be logged for debugging and improvement. AI responses should be validated before being presented to users. The AI should enhance, not replace, core application functionality. Implement proper error handling when AI services are unavailable.

### Security & Performance Standards
All inputs must be validated and sanitized to prevent injection attacks. Implement proper authentication and authorization for all endpoints. Use HTTPS in production. Optimize database queries to prevent performance bottlenecks. Implement proper error handling without exposing sensitive information. For cloud deployment, security must never be compromised for speed of delivery.

### Containerization & Orchestration Standards (Phase 5)
For DigitalOcean Kubernetes (DOKS) deployment, all services must be containerized using Docker. Frontend, backend, and supporting services (Kafka/Redpanda, Dapr, Redis) must have separate Docker images. Use multi-stage builds for optimized images. Store sensitive data (database URLs, API keys) in Kubernetes Secrets, not in environment variables or image layers. Implement proper resource limits and requests for containers. Use Kubernetes best practices for deployments, services, and networking. Implement proper monitoring and logging for cloud-native observability.

## Additional Requirements
All components must be testable in isolation. Performance requirements include responsive web interactions with no noticeable lag. Security considerations include input validation, protection against injection attacks, secure authentication, and proper data sanitization. During cloud deployment, maintain a security-first approach. The system must be resilient to partial failures and maintain high availability.

## Development Workflow
All code submissions must include corresponding tests. Spec-Driven: Updates must be made in specs first using the `phase5-cloud-architect` persona. Run commands: Frontend via `npm run dev`, Backend via `uvicorn main:app --reload`. Code reviews must verify compliance with all constitution principles. Development follows an iterative approach with frequent testing and validation. For cloud deployment, implement a streamlined review process while maintaining quality standards.

## Deployment Strategy
Cloud: Deploy on DigitalOcean Kubernetes (DOKS). Messaging: Use Redpanda Cloud (Kafka) for event streaming. CI/CD: Implement GitHub Actions for automated testing and deployment. All deployments must follow blue-green or canary release patterns to minimize downtime. Proper rollback procedures must be in place for each deployment.

## Governance
Constitution supersedes all other practices. Amendments require formal documentation and approval. All PRs/reviews must verify compliance with constitution principles. Breaking changes must follow semantic versioning. During cloud deployment phases, maintain flexibility while adhering to core principles.

**Version**: 3.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2026-01-16
