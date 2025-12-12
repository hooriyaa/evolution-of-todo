---
id: 1
title: JWT Auth Migration
stage: general
date: '2025-12-08'
model: gpt-4
feature: none
branch: main
user: PMLS
command: /sp.implement
labels: ["auth", "migration", "jwt", "fastapi", "react"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: []
tests: []
---

# JWT Auth Migration

## User Input

Execute Emergency Migration: Replace Better Auth with Custom JWT Authentication.

Context: We are removing the broken Better Auth library and implementing standard JWT Auth using FastAPI (Backend) and React Context (Frontend).

--- PHASE 1: BACKEND (FastAPI) ---

1. **Install Dependencies:**
   - Ensure `passlib[bcrypt]`, `python-jose[cryptography]`, `python-multipart` are installed.

2. **Create `backend/src/schemas.py` (or update):**
   - Add Pydantic models: `UserCreate` (name, email, password), `UserLogin` (email, password), `Token` (access_token, token_type), `TokenData` (email).

3. **Update `backend/src/auth.py`:**
   - Implement `verify_password(plain, hashed)` and `get_password_hash(password)`.
   - Implement `create_access_token(data: dict)` using `SECRET_KEY` and `ALGORITHM` from env.
   - Implement `get_current_user` dependency that decodes the JWT token and fetches the user from DB.

4. **Create `backend/src/routes/auth.py`:**
   - `POST /api/auth/signup`: Accepts `UserCreate`. Hashes password. Saves User to DB. Returns User.
   - `POST /api/auth/login`: Accepts `UserLogin`. Verifies password. Returns `Token` ({ access_token: "...", token_type: "bearer" }).

5. **Update `backend/src/main.py`:**
   - Import and include the `auth.router`.
   - Ensure CORS allows requests from `http://localhost:3000`.

--- PHASE 2: FRONTEND (Next.js) ---

1. **Clean Slate:**
   - UNINSTALL `better-auth`.
   - DELETE `frontend/src/lib/auth.ts`, `frontend/src/lib/auth-client.ts`.
   - DELETE folder `frontend/src/app/api/auth`.

2. **Create `frontend/src/context/AuthContext.tsx`:**
   - Create a React Context that provides: `{ user, login, logout, isLoading }`.
   - On mount (`useEffect`), check `localStorage.getItem("token")`. If exists, decode it (simple base64 decode of payload) to set the user.
   - `login(token)` function: Saves token to localStorage, sets user state, redirects to `/dashboard`.
   - `logout()` function: Removes token, clears state, redirects to `/login`.

3. **Update `frontend/src/app/layout.tsx`:**
   - Wrap the children in `<AuthProvider>`.

4. **Update `frontend/src/lib/api.ts`:**
   - Update Axios interceptor to read `token` from `localStorage`.
   - If token exists, add header: `Authorization: Bearer ${token}`.

5. **Re-implement Pages:**
   - **`frontend/src/app/signup/page.tsx`**: Create form -> Call `POST /api/auth/signup` -> On success, redirect to Login.
   - **`frontend/src/app/login/page.tsx`**: Create form -> Call `POST /api/auth/login` -> Get Token -> Call `authContext.login(token)`.
   - **`frontend/src/components/Sidebar.tsx`**: Update Logout button to use `authContext.logout()`.

--- CHECKS ---
- Ensure Backend reads `SECRET_KEY` from `os.getenv`.
- Ensure Frontend reads API URL from `process.env.NEXT_PUBLIC_API_URL`.

## Response

Successfully implemented the emergency migration from Better Auth to custom JWT authentication. The implementation includes:

### Backend Changes
1. Added JWT dependencies (`passlib[bcrypt]`, `python-jose[cryptography]`)
2. Updated `schemas.py` to include authentication models (`UserCreate`, `UserLogin`, `Token`, `TokenData`)
3. Updated `auth.py` with all required functions (`verify_password`, `get_password_hash`, `create_access_token`, `get_current_user`)
4. Created `routes/auth.py` with signup and login endpoints
5. Updated `main.py` to include auth router and configure CORS
6. Added `User` model to `models.py`
7. Updated `tasks.py` to use JWT authentication instead of the old system

### Frontend Changes
1. Removed Better Auth related files (`auth.ts`, `auth-client.ts`, `api/auth` directory)
2. Created `AuthContext.tsx` with React Context for authentication
3. Updated `layout.tsx` to wrap children in `<AuthProvider>`
4. Updated `api.ts` to include JWT tokens in requests
5. Created `signup/page.tsx` with signup form
6. Updated `login/page.tsx` to use new authentication system
7. Updated `Sidebar.tsx` to use auth context for logout
8. Updated `dashboard/page.tsx` to integrate with the new authentication and API routes

### Environment Configuration
1. Verified backend reads `SECRET_KEY` from environment variables
2. Verified frontend reads `NEXT_PUBLIC_API_URL` from environment variables

The migration is now complete and the application uses the new JWT-based authentication system instead of Better Auth.