# PowerShell script to deploy the updated backend to Minikube with Dapr integration

# Ensure we're using Minikube's Docker daemon
Write-Host "Configuring shell to use Minikube's Docker daemon..."
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Build the backend image
Write-Host "Building the backend image..."
docker build -t todo-backend:latest ./backend

# Check if the build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed!" -ForegroundColor Red
    exit 1
}

# Apply the deployment
Write-Host "Applying the deployment..."
kubectl apply -f infra/local/backend-deployment.yaml

# Check if the apply was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Kubectl apply failed!" -ForegroundColor Red
    exit 1
}

# Wait for rollout
Write-Host "Waiting for deployment rollout..."
kubectl rollout status deployment/todo-backend

# Check if the rollout was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Rollout failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Backend deployed successfully to Minikube!" -ForegroundColor Green
Write-Host "Dapr integration enabled for the backend service." -ForegroundColor Green