# Implementation Plan: Phase 5 - Advanced Cloud Deployment

**Branch**: `004-phase5-arch-features` | **Date**: 2026-01-16 | **Spec**: [link to spec.md]
**Input**: Feature specification from `/specs/004-phase5-arch-features/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of Phase 5: Advanced Cloud Deployment featuring event-driven architecture with Kafka/Redpanda and Dapr, advanced task management features, and deployment on DigitalOcean Kubernetes (DOKS). The implementation will be executed in three sub-phases to ensure stability: Phase 5.1 focuses on core advanced features locally, Phase 5.2 introduces local event-driven infrastructure with Dapr, and Phase 5.3 deploys everything to the cloud.

## Technical Context

**Language/Version**: Python 3.13 (backend), TypeScript/JavaScript (frontend), Go (Dapr)
**Primary Dependencies**: FastAPI, SQLModel, Pydantic (backend), Next.js 16+, Tailwind CSS (frontend), Dapr, Kafka/Redpanda, PostgreSQL
**Storage**: Neon Serverless PostgreSQL with SQLModel ORM, Dapr State Store (Redis/PostgreSQL)
**Testing**: pytest (backend), Jest/React Testing Library (frontend), Dapr component tests
**Target Platform**: DigitalOcean Kubernetes (DOKS), with local development on Minikube
**Project Type**: Web application (frontend + backend with microservices)
**Performance Goals**: Support 1000 concurrent users, handle 100 task events per second, <200ms p95 latency for task operations
**Constraints**: Must support event-driven architecture, implement Dapr for distributed runtime, ensure cloud-native deployment
**Scale/Scope**: Support 10k users, 1M tasks, horizontal scaling via Kubernetes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [X] Spec-Driven Development: All changes documented in specs before implementation
- [X] Full-Stack Architecture: Maintains separation between frontend and backend
- [X] Technology Stack Standardization: Uses approved technologies (Python, FastAPI, Next.js)
- [X] Modular Architecture Design: Maintains clear boundaries between components
- [X] Containerization & Orchestration Standards: Will implement Docker containers and Kubernetes deployment
- [X] Event-Driven Architecture Standard: Implements Kafka/Redpanda for asynchronous communication
- [X] Distributed Runtime Standard: Uses Dapr for abstracting distributed system challenges
- [X] Security & Performance Standards: Maintains security-first approach during cloud deployment

## Project Structure

### Documentation (this feature)

```text
specs/004-phase5-arch-features/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py          # Updated with priority, tags, due_date, recurring_rule
│   │   └── user.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── task_service.py  # Updated with filtering, sorting, searching
│   │   ├── recurring_task_service.py  # New service for recurring tasks
│   │   └── notification_service.py    # New service for notifications
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   ├── main.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── tasks.py     # Updated with filtering, sorting, searching endpoints
│   │       └── dapr_routes.py  # New Dapr integration endpoints
│   ├── dapr_components/
│   │   ├── pubsub.yaml      # Kafka/Redpanda pubsub component
│   │   ├── statestore.yaml  # PostgreSQL state store component
│   │   └── bindings.yaml    # Cron bindings component
│   └── utils/
│       ├── __init__.py
│       └── dapr_helper.py   # Dapr integration utilities
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── unit/
│   ├── integration/
│   └── contract/
├── Dockerfile
├── requirements.txt
├── dapr.yaml              # Dapr configuration
└── pyproject.toml

frontend/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── TaskCard.tsx     # Updated with priority, tags, due date display
│   │   ├── TaskFilters.tsx  # New component for filtering controls
│   │   ├── TaskSorter.tsx   # New component for sorting controls
│   │   └── TaskForm.tsx     # Updated with priority, tags, due date inputs
│   ├── lib/
│   │   ├── api.ts           # Updated with filtering, sorting, searching endpoints
│   │   └── types.ts         # Updated with priority, tags, due date types
│   └── hooks/
│       └── useTasks.ts      # Updated with filtering, sorting, searching
├── tests/
├── Dockerfile
├── package.json
├── tsconfig.json
└── tailwind.config.js

helm/
├── todo-chatbot/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── backend-deployment.yaml
│       ├── backend-service.yaml
│       ├── frontend-deployment.yaml
│       ├── frontend-service.yaml
│       ├── dapr-components/
│       │   ├── pubsub.yaml
│       │   ├── statestore.yaml
│       │   └── bindings.yaml
│       └── _helpers.tpl
└── dapr/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        └── [Dapr operator templates]

scripts/
├── minikube-setup.sh        # Script to set up local Minikube with Dapr
├── deploy-doks.sh           # Script to deploy to DigitalOcean Kubernetes
└── ci-cd/
    └── github-actions.yml   # GitHub Actions workflow

.infrastructure/
├── digitalocean/
│   ├── k8s-cluster.tf
│   ├── doks-node-pool.tf
│   ├── variables.tf
│   └── outputs.tf
└── redpanda/
    ├── cloud.tf
    └── variables.tf
```

**Structure Decision**: Web application with separate frontend and backend, following the existing architecture while adding Dapr integration, event-driven components, and cloud deployment configurations. The structure supports the phased approach with local development first, then event-driven infrastructure, and finally cloud deployment.

## Implementation Phases

### Phase 5.1: Core Advanced Features (Local - No Dapr yet)
* **Database**: Update schema for `priority`, `tags`, `due_date`, `recurring_rule`
* **Backend**: Update CRUD endpoints to support Filtering, Sorting, and Searching
* **Frontend**: Update UI to display tags, priorities, and add sort/filter controls

### Phase 5.2: Local Event-Driven Infrastructure (Minikube + Dapr)
* **Infrastructure**: Set up Redpanda (Docker) and Dapr on Minikube
* **Refactoring**: Modify Backend to publish `task-events` via Dapr Pub/Sub instead of direct logic
* **New Services**: Implement "Recurring Task Service" and "Notification Service" as Dapr consumers

### Phase 5.3: Cloud Deployment (DOKS + Redpanda Cloud)
* **Cloud Setup**: Provision DigitalOcean Kubernetes and Redpanda Cloud
* **CI/CD**: Create GitHub Actions for automated deployment
* **Production Launch**: Deploy Helm charts with Dapr sidecars to the cloud

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
