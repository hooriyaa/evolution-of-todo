# Security Requirements: Kubernetes Secrets for Todo App

## Overview
This document outlines the security requirements for managing sensitive data using Kubernetes Secrets in the Todo App deployment.

## Secret Management Principles
- Never store sensitive data in plain text in configuration files
- Use Kubernetes Secrets to store sensitive information like API keys, database credentials, and JWT secrets
- Ensure secrets are not stored in version control
- Implement proper access controls for secrets

## Required Secrets

### Database Connection Secret
- Key: `database-url`
- Value: PostgreSQL connection string
- Format: `postgresql://username:password@host:port/database`
- Must be mounted as an environment variable in the backend container
- Should not be accessible to the frontend service

### JWT Secret Key
- Key: `jwt-secret`
- Value: Secret key for JWT token encryption
- Must be mounted as an environment variable in the backend container
- Used by the backend for creating and verifying JWT tokens
- Should be at least 32 characters long and randomly generated

### Additional API Keys (if applicable)
- Any third-party API keys (e.g., Google Gemini API key)
- Key: `api-key` (or specific service name)
- Should be accessible only to services that require them

## Secret Creation and Management

### Using Helm Templates
- Create secrets via Helm templates in the `templates/secret.yaml` file
- Allow secrets to be provided via values, or generate them if not provided
- Use Helm functions to encode secrets in base64 format
- Implement validation to ensure required secrets are provided

### Example Secret Template
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "todo-app.fullname" . }}-secrets
type: Opaque
data:
  {{- if .Values.secret.databaseUrl }}
  database-url: {{ .Values.secret.databaseUrl | b64enc | quote }}
  {{- else }}
  database-url: {{ randAlphaNum 20 | b64enc | quote }}
  {{- end }}
  {{- if .Values.secret.jwtSecret }}
  jwt-secret: {{ .Values.secret.jwtSecret | b64enc | quote }}
  {{- else }}
  jwt-secret: {{ randAlphaNum 32 | b64enc | quote }}
  {{- end }}
```

## Security Best Practices

### Access Control
- Limit which pods can access specific secrets
- Use Kubernetes RBAC to control access to secrets
- Only mount secrets that are actually needed by each service
- Frontend should not have access to database credentials or JWT secrets

### Environment Variables
- Pass secrets to containers as environment variables
- Do not hardcode secret values in Docker images
- Use downward API or volume mounts as alternatives to environment variables for larger secrets

### Mounting Secrets
- Mount secrets as files in containers when needed
- Use projected volumes to combine multiple secrets into a single mount point
- Ensure proper file permissions on mounted secret files

### Rotation
- Implement a strategy for rotating secrets periodically
- Update applications to handle secret rotation gracefully
- Document the process for updating secrets in the deployed application

## Security Validation Requirements
- Verify that no sensitive data is stored in ConfigMaps (only Secrets)
- Ensure secrets are not exposed in pod specifications or logs
- Validate that secrets are properly encoded in base64
- Confirm that secrets are not stored in plain text in Helm values

## Development vs Production
- In development: Allow secrets to be provided via Helm values for convenience
- In production: Require secrets to be provided through more secure means (e.g., external secret managers)
- Implement different security policies for development and production environments
- Use different secret naming conventions if needed for different environments

## Monitoring and Auditing
- Enable Kubernetes audit logging for secret access
- Monitor for unauthorized access to secrets
- Implement alerts for unusual secret access patterns
- Regularly review which services have access to which secrets