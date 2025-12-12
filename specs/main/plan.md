# Emergency Migration Plan: Replace Better Auth with Custom JWT Authentication

## Overview
We are implementing standard JWT authentication to replace the broken Better Auth library. This will involve creating a JWT-based authentication system on the backend using FastAPI and React Context on the frontend.

## Tech Stack
- Backend: FastAPI with Python
- Frontend: Next.js with React Context
- Authentication: JWT tokens
- Password hashing: bcrypt via passlib
- Token encryption: python-jose[cryptography]

## Architecture
### Backend Architecture
- Authentication endpoints: `/api/auth/signup`, `/api/auth/login`
- JWT token creation and verification
- Password hashing with bcrypt
- Dependency injection for auth validation

### Frontend Architecture
- React Context for authentication state management
- Axios interceptors for adding auth headers
- LocalStorage for token persistence
- Protected route handling

## File Structure
```
backend/
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── auth.py
│   ├── schemas.py
│   └── routes/
│       ├── __init__.py
│       └── auth.py
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── types.ts
│   └── app/
│       ├── login/
│       │   └── page.tsx
│       ├── signup/
│       │   └── page.tsx
│       └── layout.tsx
```

## Security Considerations
- Use HTTPS in production
- Properly validate JWT tokens
- Implement proper password hashing
- Store sensitive data securely
- Secure token storage in localStorage (consider HttpOnly cookies for production)

## Environment Variables
- SECRET_KEY: For JWT token encryption
- ALGORITHM: JWT algorithm (e.g., HS256)
- ACCESS_TOKEN_EXPIRE_MINUTES: Token expiration time
- NEXT_PUBLIC_API_URL: Frontend API URL