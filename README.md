# Todo App - Local Kubernetes Deployment

This repository contains the infrastructure code to deploy the Todo App on a local Kubernetes cluster using Minikube.

## Architecture

The deployment consists of:
- **Backend**: Python/FastAPI application running in a Docker container
- **Frontend**: Next.js application running in a Docker container
- **Services**: Kubernetes ClusterIP services for internal communication
- **Ingress**: Routes external traffic to the appropriate services
- **Secrets**: Kubernetes secrets for sensitive configuration

## Prerequisites

- Docker
- Minikube
- kubectl
- Helm 3

## Deployment

### Automated Deployment

1. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

The script will:
- Verify prerequisites
- Start Minikube if not running
- Enable the ingress addon
- Configure local DNS for `todo.local`
- Build Docker images for frontend and backend
- Load images into Minikube
- Create required secrets
- Deploy the application using Helm
- Wait for deployments to be ready

### Manual Deployment

1. Start Minikube:
   ```bash
   minikube start
   ```

2. Enable ingress addon:
   ```bash
   minikube addons enable ingress
   ```

3. Add `todo.local` to your hosts file:
   ```bash
   # Get Minikube IP
   minikube ip
   
   # Add to hosts file (Linux/Mac: /etc/hosts, Windows: C:\Windows\System32\drivers\etc\hosts)
   <minikube-ip>  todo.local
   ```

4. Build Docker images:
   ```bash
   docker build -t todo-backend:latest ./backend
   docker build -t todo-frontend:latest ./frontend
   ```

5. Load images into Minikube:
   ```bash
   minikube image load todo-backend:latest
   minikube image load todo-frontend:latest
   ```

6. Create secrets:
   ```bash
   kubectl create secret generic todo-app-secrets \
     --from-literal=database-url="your-database-url" \
     --from-literal=gemini-api-key="your-gemini-api-key" \
     --from-literal=better-auth-secret="your-auth-secret"
   ```

7. Deploy with Helm:
   ```bash
   cd helm/todo-app
   helm install todo-app . \
     --set backend.image.repository=todo-backend \
     --set backend.image.tag=latest \
     --set frontend.image.repository=todo-frontend \
     --set frontend.image.tag=latest
   ```

## Accessing the Application

Once deployed, access the application at `http://todo.local`.

## Troubleshooting

### Application not accessible at todo.local
- Verify that you've added the correct Minikube IP to your hosts file
- Check that the ingress controller is running: `kubectl get pods -n ingress-nginx`

### Pods stuck in "Pending" state
- Check if Minikube has sufficient resources: `minikube status`
- Verify that you've loaded the Docker images into Minikube

### Secrets not found
- Verify that you've created the secrets with the correct names
- Check the secret names: `kubectl get secrets`

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

## Development

### Updating the Application

1. Make changes to the source code
2. Rebuild the Docker images:
   ```bash
   docker build -t todo-backend:latest ./backend
   docker build -t todo-frontend:latest ./frontend
   ```
3. Reload images in Minikube:
   ```bash
   minikube image load todo-backend:latest
   minikube image load todo-frontend:latest
   ```
4. Upgrade the Helm release:
   ```bash
   helm upgrade todo-app . \
     --set backend.image.repository=todo-backend \
     --set backend.image.tag=latest \
     --set frontend.image.repository=todo-frontend \
     --set frontend.image.tag=latest
   ```

## Security

- All containers run as non-root users
- Sensitive configuration is stored in Kubernetes secrets
- Network communication between services is secured within the cluster