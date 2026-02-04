# Setup script for local event-driven infrastructure (PowerShell version)
# This script sets up Redpanda and Dapr on a local Minikube cluster

try {
    # Add Redpanda Helm repository
    Write-Host "Adding Redpanda Helm repository..."
    helm repo add redpanda https://charts.redpanda.com
    helm repo update

    # Create kafka namespace
    Write-Host "Creating kafka namespace..."
    kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f -

    # Install Redpanda in the kafka namespace (without version constraint)
    Write-Host "Installing Redpanda in kafka namespace..."
    helm upgrade --install redpanda redpanda/redpanda --namespace kafka --create-namespace --values ./infra/local/redpanda-values.yaml --wait

    # Wait for Redpanda to be ready using rollouts status
    Write-Host "Waiting for Redpanda to be ready..."
    kubectl rollout status statefulset/redpanda --namespace kafka --timeout=300s

    # Check if dapr command exists
    if (!(Get-Command dapr -ErrorAction SilentlyContinue)) {
        Write-Host "Error: Please install Dapr CLI first." -ForegroundColor Red
        exit 1
    }

    # Check if Dapr is already installed, skip init if so
    if (kubectl get pods -n dapr-system --no-headers) {
        Write-Host "Dapr is already installed, skipping init..."
    } else {
        # Initialize Dapr on Kubernetes
        Write-Host "Initializing Dapr on Kubernetes..."
        dapr init -k
    }

    # Wait for Dapr to be ready
    Write-Host "Waiting for Dapr to be ready..."
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=dapr-operator --timeout=300s -n dapr-system

    # Apply Dapr components
    Write-Host "Applying Dapr components..."
    kubectl apply -f ./infra/local/dapr-components/

    Write-Host "Local event-driven infrastructure setup complete!" -ForegroundColor Green
    Write-Host "Redpanda is running in the kafka namespace" -ForegroundColor Green
    Write-Host "Dapr is initialized and components are applied" -ForegroundColor Green
}
catch {
    Write-Host "Error during setup: $_" -ForegroundColor Red
    exit 1
}