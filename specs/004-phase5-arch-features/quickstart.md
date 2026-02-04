# Quickstart Guide: Phase 5 - Advanced Cloud Deployment

## Prerequisites

- Docker and Docker Compose
- Kubernetes CLI (kubectl)
- Minikube (for local development)
- Dapr CLI
- Node.js 18+ and npm
- Python 3.13+
- DigitalOcean CLI (for cloud deployment)
- GitHub account (for CI/CD)

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hackathon2
```

### 2. Install Dapr Locally
```bash
# Download and install Dapr CLI
# Then initialize Dapr
dapr init
```

### 3. Start Minikube
```bash
minikube start
minikube addons enable ingress
```

### 4. Deploy Local Infrastructure
```bash
# Deploy Redpanda (Kafka-compatible) to Minikube
kubectl apply -f infrastructure/local/redpanda.yaml

# Deploy Dapr components
kubectl apply -f backend/dapr_components/
```

### 5. Set Up Backend
```bash
cd backend
pip install -r requirements.txt

# Run database migrations
python -m src.database.migrate

# Start the backend with Dapr
dapr run --app-id todo-backend --app-port 8000 --dapr-http-port 3500 -- python -m uvicorn src.api.main:app --reload
```

### 6. Set Up Frontend
```bash
cd frontend
npm install
npm run dev
```

## Phase 5.1: Core Advanced Features

### 1. Update Database Schema
```bash
# Run the migration to add new fields to tasks table
python -m src.database.migrate
```

### 2. Test Advanced Features
```bash
# Run backend tests
cd backend
pytest tests/unit/test_advanced_tasks.py

# Run frontend tests
cd frontend
npm run test
```

### 3. Verify New UI Elements
- Navigate to the task list page
- Verify priority indicators are displayed
- Verify due dates are shown
- Test filtering and sorting controls

## Phase 5.2: Local Event-Driven Infrastructure

### 1. Verify Dapr Components
```bash
# Check if Dapr components are running
kubectl get components.dapr.io

# Check Dapr sidecars
kubectl get pods -l app.kubernetes.io/part-of=dapr
```

### 2. Test Event Publishing
```bash
# Publish a test task event
curl -X POST http://localhost:3500/v1.0/publish/pubsub/task-events \
  -H "Content-Type: application/json" \
  -d '{
    "data": {"taskId": "123", "userId": "456", "action": "created"},
    "publishMetadata": {"partitionKey": "456"}
  }'
```

### 3. Test Event Consumption
- Verify that the recurring task service receives and processes events
- Verify that the notification service receives and processes reminder events

## Phase 5.3: Cloud Deployment

### 1. Provision Cloud Resources
```bash
# Set up DigitalOcean access
doctl auth init

# Provision DOKS cluster
terraform -chdir=infrastructure/digitalocean apply

# Provision Redpanda Cloud
terraform -chdir=infrastructure/redpanda apply
```

### 2. Configure CI/CD
```bash
# Set up GitHub secrets for DigitalOcean and Redpanda
# Configure GitHub Actions workflow
```

### 3. Deploy to Production
```bash
# Deploy using Helm charts
helm upgrade --install todo-chatbot ./helm/todo-chatbot \
  --namespace todo-app \
  --set dapr.enabled=true \
  --set image.tag=latest
```

## Useful Commands

### Dapr Commands
```bash
# Check Dapr status
dapr status -k

# View Dapr dashboard
dapr dashboard

# List Dapr apps
dapr list
```

### Kubernetes Commands
```bash
# View all pods
kubectl get pods

# View logs for a specific pod
kubectl logs <pod-name>

# Port forward to a service
kubectl port-forward svc/<service-name> <local-port>:<service-port>
```

### Testing Commands
```bash
# Run all backend tests
cd backend && pytest

# Run all frontend tests
cd frontend && npm run test

# Run contract tests
cd backend && pytest tests/contract/
```

## Troubleshooting

### Common Issues

1. **Dapr sidecar not starting**
   - Ensure Dapr is initialized: `dapr init`
   - Check if Dapr placement service is running

2. **Kafka connection issues**
   - Verify Redpanda is running: `kubectl get pods`
   - Check connection strings in Dapr components

3. **Database migration failures**
   - Ensure PostgreSQL is accessible
   - Check database credentials in environment variables

### Debugging Tips

- Use `dapr logs` to view Dapr sidecar logs
- Check Kubernetes events: `kubectl get events`
- Use Dapr dashboard for visual debugging