# Networking Strategy for Todo App on Kubernetes

## Overview
This document outlines the networking strategy for the Todo App deployed on Kubernetes, focusing on internal service communication and external access via Ingress.

## Service Architecture

### Internal Communication
- All internal communication between services must use Kubernetes Service names
- Frontend must call backend using the internal service name: `http://backend-service:8000`
- Never use `localhost` or IP addresses for internal communication
- Services will be accessible within the cluster using DNS names in the format: `<service-name>.<namespace>.svc.cluster.local`

### Service Types
- Use `ClusterIP` service type for internal communication between frontend and backend
- This ensures services are only accessible within the Kubernetes cluster
- External access will be provided through Ingress

## Frontend Service
- Name: `frontend-service`
- Type: `ClusterIP`
- Port: 3000 (external), Target Port: 3000
- Selector: Match frontend deployment labels
- Purpose: Serve the Next.js application to users

## Backend Service
- Name: `backend-service`
- Type: `ClusterIP`
- Port: 8000 (external), Target Port: 8000
- Selector: Match backend deployment labels
- Purpose: Handle API requests from frontend and database operations

## Ingress Configuration

### Ingress Controller
- Use NGINX Ingress Controller or similar
- Ensure Ingress controller is properly installed and configured in the cluster

### Ingress Rules
- Route `/api/*` paths to the backend service (`backend-service:8000`)
- Route all other paths (`/`) to the frontend service (`frontend-service:3000`)
- This allows the frontend to handle client-side routing while API calls are properly directed to the backend

### Example Ingress Configuration
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: todo-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: todo-app.local  # This can be configured via values
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 3000
```

## Environment-Specific Configuration
- In development environments, use `todo-app.local` or similar hostnames
- In production environments, configure proper domain names
- Support TLS/SSL termination at the Ingress level
- Allow configuration of multiple hostnames for different environments

## Security Considerations
- Only the Ingress should be exposed externally
- Internal services (ClusterIP) should not be directly accessible from outside the cluster
- Implement proper TLS/SSL for secure communication
- Use appropriate firewall rules and network policies if required

## Load Balancing
- Kubernetes services provide built-in load balancing to pods
- Ingress controller provides load balancing across services
- Configure health checks to ensure traffic is routed only to healthy pods

## DNS Resolution
- Services are accessible via DNS names within the cluster
- Format: `<service-name>.<namespace>.svc.cluster.local`
- For same-namespace access: `<service-name>`
- Frontend application should use `http://backend-service:8000` to call backend APIs