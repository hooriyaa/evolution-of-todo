# Dockerization Requirements for Todo App

## Overview
This document outlines the requirements for containerizing the Todo App frontend and backend services for Kubernetes deployment.

## Frontend Dockerization Requirements

### Dockerfile Structure
- Use multi-stage build for optimized image
- Base image: `node:20-alpine` for production
- For development, use a separate Dockerfile.dev with hot-reload capabilities
- Copy package.json and package-lock.json first for efficient layer caching
- Install dependencies with `npm ci`
- Build Next.js application with `npm run build`
- Use `node:alpine` as the final base image to run the application
- Expose port 3000
- Set non-root user for security

### Environment Variables
- `NEXT_PUBLIC_API_URL`: URL for backend API calls (should be `http://backend-service:8000` in Kubernetes)
- `NODE_ENV`: Set to 'production' in the final image

### Build Arguments
- `NEXT_PUBLIC_API_URL`: Allow override during build time

## Backend Dockerization Requirements

### Dockerfile Structure
- Use multi-stage build for optimized image
- Base image: `python:3.13-slim` for production
- For development, use a separate Dockerfile.dev
- Install system dependencies first (if any)
- Copy requirements.txt and install Python dependencies with `pip install`
- Copy application code
- Expose port 8000
- Set non-root user for security
- Use uvicorn to run the application

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (should be read from Kubernetes Secret)
- `SECRET_KEY`: JWT secret key (should be read from Kubernetes Secret)
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

## Security Requirements
- Run containers as non-root user
- Do not store secrets in image layers
- Use minimal base images (alpine variants preferred)
- Implement proper resource limits
- Scan images for vulnerabilities

## Optimization Requirements
- Use multi-stage builds to minimize final image size
- Leverage Docker layer caching by copying dependencies before application code
- Use .dockerignore files to exclude unnecessary files
- Implement build cache optimization

## Networking Requirements
- Frontend container should be able to reach backend on `http://backend-service:8000`
- Both services should be accessible via Kubernetes Ingress for external access
- Internal communication should use Kubernetes service names