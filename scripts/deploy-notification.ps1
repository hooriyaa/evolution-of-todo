# PowerShell script to deploy the notification service to Minikube with Dapr integration

# Ensure we're using Minikube's Docker daemon
Write-Host "Configuring shell to use Minikube's Docker daemon..."
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Build the notification service image
Write-Host "Building the notification service image..."
docker build -t todo-notification:latest ./notification-service

# Check if the build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed!" -ForegroundColor Red
    exit 1
}

# Apply the deployment
Write-Host "Applying the notification service deployment..."
kubectl apply -f infra/local/notification-deployment.yaml

# Check if the apply was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Kubectl apply failed!" -ForegroundColor Red
    exit 1
}

# Wait for rollout
Write-Host "Waiting for notification service deployment rollout..."
kubectl rollout status deployment/todo-notification

# Check if the rollout was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Rollout failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Notification service deployed successfully to Minikube!" -ForegroundColor Green
Write-Host "Dapr integration enabled for the notification service." -ForegroundColor Green