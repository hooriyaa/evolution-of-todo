# Data Model: Local Kubernetes Deployment

## Overview
The local Kubernetes deployment does not introduce new data entities but rather defines the configuration and deployment structures for existing application components.

## Deployment Configuration Entities

### Backend Deployment Configuration
- **image**: Container image reference for the backend service
- **replicas**: Number of backend pod replicas (default: 1)
- **ports**: Container port configuration (port: 8000)
- **env**: Environment variables mapping to Kubernetes secrets
- **resources**: Resource requests and limits for CPU and memory
- **healthChecks**: Liveness and readiness probe configurations

### Frontend Deployment Configuration
- **image**: Container image reference for the frontend service
- **replicas**: Number of frontend pod replicas (default: 1)
- **ports**: Container port configuration (port: 3000)
- **env**: Environment variables (e.g., NEXT_PUBLIC_API_URL)
- **resources**: Resource requests and limits for CPU and memory
- **healthChecks**: Liveness and readiness probe configurations

### Service Configuration
- **name**: Service name (backend-service, frontend-service)
- **type**: Service type (ClusterIP)
- **ports**: Port and target port mappings
- **selector**: Labels to match deployment pods

### Ingress Configuration
- **host**: Hostname for routing (todo.local)
- **paths**: Path-based routing rules
- **backend**: Service and port for each path

### Secret Configuration
- **databaseUrl**: PostgreSQL connection string
- **geminiApiKey**: Google Gemini API key
- **betterAuthSecret**: Authentication secret key