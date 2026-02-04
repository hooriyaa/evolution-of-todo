#!/bin/bash

# Setup script for local event-driven infrastructure
# This script sets up Redpanda and Dapr on a local Minikube cluster

set -e  # Exit immediately if a command exits with a non-zero status

# Function to print messages in green
print_success() {
    echo -e "\033[0;32m$1\033[0m"
}

# Function to print messages in red
print_error() {
    echo -e "\033[0;31m$1\033[0m"
}

# Add Redpanda Helm repository
print_success "Adding Redpanda Helm repository..."
helm repo add redpanda https://charts.redpanda.com
helm repo update

# Create kafka namespace
print_success "Creating kafka namespace..."
kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f -

# Install Redpanda in the kafka namespace (without version constraint)
print_success "Installing Redpanda in kafka namespace..."
helm install redpanda redpanda/redpanda \
  --namespace kafka \
  --values ./infra/local/redpanda-values.yaml

# Wait for Redpanda to be ready using rollouts status
print_success "Waiting for Redpanda to be ready..."
kubectl rollout status statefulset/redpanda --namespace kafka --timeout=300s

# Check if dapr command exists
if ! command -v dapr &> /dev/null; then
    print_error "Error: Please install Dapr CLI first."
    exit 1
fi

# Initialize Dapr on Kubernetes
print_success "Initializing Dapr on Kubernetes..."
dapr init -k

# Wait for Dapr to be ready
print_success "Waiting for Dapr to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=dapr-operator --timeout=300s -n dapr-system

# Apply Dapr components
print_success "Applying Dapr components..."
kubectl apply -f ./infra/local/dapr-components/

print_success "Local event-driven infrastructure setup complete!"
print_success "Redpanda is running in the kafka namespace"
print_success "Dapr is initialized and components are applied"