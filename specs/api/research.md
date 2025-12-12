# Research: REST API Implementation for Todo App

## Decision: Technology Stack & Architecture
**Rationale**: Based on the project constitution and feature specifications, FastAPI with SQLModel provides an excellent combination for building secure, well-documented APIs with automatic validation and type safety. The async nature of FastAPI allows for handling many concurrent requests efficiently.

## Alternatives Considered:
- Flask: Less modern, requires more manual work for documentation and validation
- Django: Heavier framework, more complex setup for simple API use cases

## Decision: JWT Authentication with Better Auth
**Rationale**: The project constitution specifically mandates Better Auth with JWT tokens. Since Better Auth handles the token generation on the frontend, our backend needs to properly validate these tokens using the shared BETTER_AUTH_SECRET.

## Decision: SQLModel for Database Models
**Rationale**: SQLModel combines the power of SQLAlchemy with the usability of Pydantic, allowing for the same models to be used for both database operations and API validation. This reduces code duplication and maintains consistency.

## Alternatives Considered:
- Pure SQLAlchemy: Requires separate models for API validation
- Pydantic with a different ORM: Would require mapping between different model types

## Decision: CORS Configuration
**Rationale**: Since the frontend (Next.js) runs on a different port (3000) than the backend (FastAPI on 8000), CORS configuration is required to allow cross-origin requests. This is essential for the frontend to communicate with the backend API.

## Decision: Pydantic Schemas for API
**Rationale**: Using Pydantic schemas ensures type safety and automatic validation of request/response payloads. These schemas will align with SQLModel entities but can be tailored specifically for API input/output to ensure proper data validation and security.

## Best Practices Identified:

1. **JWT Token Handling**:
   - Always validate JWT tokens in middleware
   - Store user_id from JWT in request state for easy access in route handlers
   - Use proper error handling for expired/invalid tokens
   - Verify user_id in URL matches user_id in JWT for all user-specific endpoints

2. **Database Connection**:
   - Use async database sessions
   - Implement proper connection pooling
   - Handle database errors gracefully

3. **CORS Configuration**:
   - Be specific about allowed origins in production
   - Use environment variables to configure allowed origins
   - Don't allow all origins in production

4. **API Endpoint Design**:
   - Follow RESTful conventions
   - Use consistent error response format
   - Implement proper HTTP status codes
   - Support query parameters for filtering and sorting

5. **Security Considerations**:
   - Validate user_id in URLs matches authenticated user in all endpoints
   - Use parameter validation to prevent injection attacks
   - Implement rate limiting if needed