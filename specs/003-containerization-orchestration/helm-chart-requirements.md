# Helm Chart Requirements for Todo App

## Overview
This document outlines the requirements for creating Helm Charts to deploy the Todo App on Kubernetes.

## Chart Structure
```
todo-app/
├── Chart.yaml
├── values.yaml
├── charts/
├── templates/
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   ├── deployment-frontend.yaml
│   ├── deployment-backend.yaml
│   ├── service-frontend.yaml
│   ├── service-backend.yaml
│   ├── ingress.yaml
│   ├── secret.yaml
│   └── configmap.yaml
└── README.md
```

## Chart.yaml Requirements
- Name: `todo-app`
- Version: Follow semantic versioning (e.g., 0.1.0)
- AppVersion: Match the application version
- Description: "Todo App Helm Chart for Kubernetes Deployment"
- API Version: v2

## Values.yaml Requirements
### Frontend Configuration
- `frontend.image.repository`: Frontend Docker image repository
- `frontend.image.tag`: Frontend Docker image tag (default: "latest")
- `frontend.image.pullPolicy`: Image pull policy (default: "IfNotPresent")
- `frontend.service.port`: Frontend service port (default: 3000)
- `frontend.service.type`: Service type (default: "ClusterIP")
- `frontend.resources`: Resource requests and limits
- `frontend.replicaCount`: Number of frontend replicas (default: 1)
- `frontend.env`: Environment variables for frontend

### Backend Configuration
- `backend.image.repository`: Backend Docker image repository
- `backend.image.tag`: Backend Docker image tag (default: "latest")
- `backend.image.pullPolicy`: Image pull policy (default: "IfNotPresent")
- `backend.service.port`: Backend service port (default: 8000)
- `backend.service.targetPort`: Backend target port (default: 8000)
- `backend.service.type`: Service type (default: "ClusterIP")
- `backend.resources`: Resource requests and limits
- `backend.replicaCount`: Number of backend replicas (default: 1)
- `backend.env`: Environment variables for backend

### Ingress Configuration
- `ingress.enabled`: Enable ingress (default: true)
- `ingress.className`: Ingress class name
- `ingress.hosts`: List of hostnames
- `ingress.tls`: TLS configuration

### Database Configuration
- `database.url.secretKeyRef`: Reference to database URL in secret
- `database.url.value`: Default database URL (for development)

### Security Configuration
- `secret.jwtSecret`: JWT secret key (should be provided as a secret)
- `secret.databaseUrl`: Database URL (should be provided as a secret)

## Template Requirements

### Deployment Templates
- Create separate deployments for frontend and backend
- Use configurable replica counts
- Implement proper resource requests and limits
- Set environment variables from values or secrets
- Use configurable image pull secrets if needed
- Implement proper liveness and readiness probes

### Service Templates
- Create ClusterIP services for internal communication
- Frontend service should expose port 3000
- Backend service should expose port 8000
- Use proper selectors to match deployments

### Ingress Template
- Create ingress resource for external access
- Route `/api/*` to backend service
- Route `/` and other paths to frontend service
- Implement proper TLS configuration if enabled

### Secret Template
- Store sensitive information like JWT secret and database URL
- Use values or generate secrets if not provided
- Ensure secrets are not stored in plain text in values

### ConfigMap Template
- Store non-sensitive configuration
- Include any configuration files needed by the application

## Security Requirements
- Store all sensitive data in Kubernetes Secrets
- Do not expose secrets in plain text in values.yaml
- Use non-root users in containers
- Implement proper RBAC if needed
- Ensure images are from trusted sources

## Best Practices
- Use semantic versioning for chart versions
- Implement proper validation in templates
- Include NOTES.txt with deployment instructions
- Use helpers for common naming patterns
- Implement configurable resource limits
- Include health checks (liveness and readiness probes)
- Use configurable image pull policies
- Implement proper service discovery between frontend and backend