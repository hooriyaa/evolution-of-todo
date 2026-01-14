# Simple Deploy Script
$ErrorActionPreference = "Stop"

Write-Host "--- STARTING DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Check Minikube
Write-Host "1. Checking Minikube..." -ForegroundColor Yellow
$status = minikube status --format='{{.Host}}'
if ($status -match "Running") {
    Write-Host "Minikube is running." -ForegroundColor Green
} else {
    Write-Host "Minikube is NOT running. Starting now..." -ForegroundColor Yellow
    minikube start
}

# 2. Build Backend
Write-Host "2. Building Backend Image..." -ForegroundColor Yellow
docker build -t todo-backend:latest ./backend
if ($LASTEXITCODE -ne 0) { Write-Error "Backend Build Failed"; exit 1 }

# 3. Build Frontend
Write-Host "3. Building Frontend Image..." -ForegroundColor Yellow
docker build -t todo-frontend:latest ./frontend
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend Build Failed"; exit 1 }

# 4. Load Images
Write-Host "4. Loading Images to Minikube..." -ForegroundColor Yellow
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

# 5. Helm Deploy
Write-Host "5. Deploying with Helm..." -ForegroundColor Yellow
if (-not (Test-Path "./helm/todo-app")) {
    Write-Error "Helm chart folder missing!"
    exit 1
}
helm upgrade --install todo-app ./helm/todo-app

# 6. Success
Write-Host "--- SUCCESS! ---" -ForegroundColor Green
$ip = minikube ip
Write-Host "Minikube IP: $ip"
Write-Host "Add this to hosts file: $ip todo.local"
Write-Host "Open: http://todo.local"