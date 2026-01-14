# Quickstart Guide: Local Kubernetes Deployment

## Prerequisites

Before deploying the Todo App to your local Kubernetes cluster, ensure you have the following tools installed:

- **Docker**: Version 20.10 or higher
- **Minikube**: Latest version
- **kubectl**: Kubernetes command-line tool
- **Helm**: Version 3.x
- **Git**: For cloning the repository

## Setup Instructions

### 1. Start Minikube

First, start your local Minikube cluster:

```bash
minikube start
```

### 2. Enable Ingress Addon

Enable the ingress addon to handle external routing:

```bash
minikube addons enable ingress
```

### 3. Configure Local DNS

To access the application at `todo.local`, add an entry to your hosts file:

On Windows (as Administrator):
```
C:\Windows\System32\drivers\etc\hosts
```

On macOS/Linux (as root):
```bash
sudo nano /etc/hosts
```

Add this line to the file:
```
<minikube-ip>  todo.local
```

To get the Minikube IP, run:
```bash
minikube ip
```

### 4. Prepare Your Environment

Clone or navigate to your project directory:

```bash
cd hackathon2
```

## Deployment Process

### 1. Build Docker Images

Build the Docker images for both frontend and backend:

```bash
# Build backend image
docker build -t todo-backend:latest ./backend

# Build frontend image
docker build -t todo-frontend:latest ./frontend
```

### 2. Load Images into Minikube

Load the built images into the Minikube environment:

```bash
# Load backend image
minikube image load todo-backend:latest

# Load frontend image
minikube image load todo-frontend:latest
```

### 3. Create Required Secrets

Create the necessary Kubernetes secrets for the application:

```bash
kubectl create secret generic todo-app-secrets \
  --from-literal=database-url="your-database-connection-string" \
  --from-literal=gemini-api-key="your-gemini-api-key" \
  --from-literal=better-auth-secret="your-auth-secret"
```

### 4. Deploy with Helm

Navigate to the Helm chart directory and install the application:

```bash
cd helm/todo-app

# Install the application
helm install todo-app . \
  --set backend.image.repository=todo-backend \
  --set backend.image.tag=latest \
  --set frontend.image.repository=todo-frontend \
  --set frontend.image.tag=latest
```

## Verification

### 1. Check Pod Status

Verify that all pods are running:

```bash
kubectl get pods
```

All pods should show a "Running" status.

### 2. Check Services

Verify that services are accessible:

```bash
kubectl get services
```

### 3. Access the Application

Open your browser and navigate to `http://todo.local` to access the Todo App.

## Troubleshooting

### Common Issues

1. **Application not accessible at todo.local**:
   - Verify that you've added the correct Minikube IP to your hosts file
   - Check that the ingress controller is running: `kubectl get pods -n ingress-nginx`

2. **Pods stuck in "Pending" state**:
   - Check if Minikube has sufficient resources: `minikube status`
   - Verify that you've loaded the Docker images into Minikube

3. **Secrets not found**:
   - Verify that you've created the secrets with the correct names
   - Check the secret names: `kubectl get secrets`

### Useful Commands

- View pod logs: `kubectl logs <pod-name>`
- Check ingress status: `kubectl get ingress`
- Port forward for direct access: `kubectl port-forward svc/frontend-service 3000:3000`

## Cleanup

To remove the application from your cluster:

```bash
helm uninstall todo-app
kubectl delete secret todo-app-secrets
```

To stop Minikube:

```bash
minikube stop
```