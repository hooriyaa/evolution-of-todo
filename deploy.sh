#!/bin/bash

# Todo App Deployment Script for Minikube
# This script automates the deployment of the Todo App to a local Minikube cluster

set -e  # Exit immediately if a command exits with a non-zero status

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Todo App Deployment Script${NC}"
echo "=========================="

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

# Check if docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed or not in PATH${NC}" >&2
    exit 1
fi

# Check if minikube is available
if ! command -v minikube &> /dev/null; then
    echo -e "${RED}Error: Minikube is not installed or not in PATH${NC}" >&2
    exit 1
fi

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed or not in PATH${NC}" >&2
    exit 1
fi

# Check if helm is available
if ! command -v helm &> /dev/null; then
    echo -e "${RED}Error: Helm is not installed or not in PATH${NC}" >&2
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites are met${NC}"

# Check if minikube is running
if ! minikube status &> /dev/null; then
    echo -e "${YELLOW}Starting Minikube...${NC}"
    minikube start
else
    echo -e "${GREEN}✓ Minikube is already running${NC}"
fi

# Enable ingress addon
echo -e "${YELLOW}Enabling ingress addon...${NC}"
minikube addons enable ingress

# Get minikube IP
MINIKUBE_IP=$(minikube ip)
echo -e "${GREEN}Minikube IP: $MINIKUBE_IP${NC}"

# Update /etc/hosts to map todo.local to minikube IP
echo -e "${YELLOW}Configuring local DNS for todo.local...${NC}"

# Check if the entry already exists
if grep -q "todo.local" /etc/hosts; then
    echo -e "${GREEN}✓ todo.local entry already exists in /etc/hosts${NC}"
else
    echo -e "${YELLOW}Adding todo.local entry to /etc/hosts (requires sudo)${NC}"
    echo "$MINIKUBE_IP    todo.local" | sudo tee -a /etc/hosts > /dev/null
    echo -e "${GREEN}✓ Added todo.local entry to /etc/hosts${NC}"
fi

# Navigate to the project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
cd "$PROJECT_ROOT"

# Build Docker images
echo -e "${YELLOW}Building Docker images...${NC}"

echo "Building backend image..."
docker build -t todo-backend:latest ./backend -f ./backend/Dockerfile

echo "Building frontend image..."
docker build -t todo-frontend:latest ./frontend -f ./frontend/Dockerfile

# Load images into minikube
echo -e "${YELLOW}Loading images into Minikube...${NC}"
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

# Check if secrets already exist
SECRET_NAME="todo-app-secrets"
if kubectl get secret "$SECRET_NAME" &> /dev/null; then
    echo -e "${YELLOW}Secret $SECRET_NAME already exists, updating...${NC}"
    kubectl delete secret "$SECRET_NAME"
fi

# Create secrets
echo -e "${YELLOW}Creating secrets...${NC}"
echo "Please provide the following secret values:"
read -s -p "Enter DATABASE_URL: " DB_URL
echo  # New line
read -s -p "Enter GEMINI_API_KEY: " GEMINI_KEY
echo  # New line
read -s -p "Enter BETTER_AUTH_SECRET: " AUTH_SECRET
echo  # New line

kubectl create secret generic "$SECRET_NAME" \
  --from-literal=database-url="$DB_URL" \
  --from-literal=gemini-api-key="$GEMINI_KEY" \
  --from-literal=better-auth-secret="$AUTH_SECRET"

echo -e "${GREEN}✓ Secrets created successfully${NC}"

# Navigate to the helm chart directory
HELM_CHART_DIR="./helm/todo-app"
cd "$HELM_CHART_DIR"

# Install or upgrade the Helm release
echo -e "${YELLOW}Installing/upgrading Helm release...${NC}"
helm upgrade --install todo-app . \
  --set backend.image.repository=todo-backend \
  --set backend.image.tag=latest \
  --set frontend.image.repository=todo-frontend \
  --set frontend.image.tag=latest

echo -e "${GREEN}✓ Helm release installed/updated successfully${NC}"

# Wait for deployments to be ready
echo -e "${YELLOW}Waiting for deployments to be ready...${NC}"

# Wait for backend deployment
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=backend --timeout=180s

# Wait for frontend deployment
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=frontend --timeout=180s

echo -e "${GREEN}✓ All deployments are ready${NC}"

# Display deployment status
echo -e "\n${GREEN}Deployment Status:${NC}"
kubectl get pods
echo ""
kubectl get services
echo ""
kubectl get ingress

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}Access the application at: http://todo.local${NC}"
echo -e "${YELLOW}Note: It may take a few moments for the ingress to become active.${NC}"