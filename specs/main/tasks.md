# Emergency Migration: Replace Better Auth with Custom JWT Authentication

## Task List

### Phase 1: Backend JWT Authentication Implementation

**Task 1.1 [P]**: Install JWT dependencies
- Install `passlib[bcrypt]`, `python-jose[cryptography]`, `python-multipart`
- File: `pyproject.toml` / `requirements.txt`
- [X] Dependencies installed

**Task 1.2 [P]**: Create/update schemas
- Create `backend/src/schemas.py` with Pydantic models
- Models: `UserCreate` (name, email, password), `UserLogin` (email, password), `Token` (access_token, token_type), `TokenData` (email)
- File: `backend/src/schemas.py`
- [X] Schemas updated with auth models

**Task 1.3 [P]**: Update authentication module
- Update `backend/src/auth.py` with password verification functions
- Implement `verify_password(plain, hashed)` and `get_password_hash(password)`
- Implement `create_access_token(data: dict)` using `SECRET_KEY` and `ALGORITHM` from env
- Implement `get_current_user` dependency
- File: `backend/src/auth.py`
- [X] Auth module updated with all required functions

**Task 1.4 [P]**: Create auth routes
- Create `backend/src/routes/auth.py`
- `POST /api/auth/signup`: Accepts `UserCreate`, hash password, save User to DB, return User
- `POST /api/auth/login`: Accepts `UserLogin`, verify password, return `Token`
- File: `backend/src/routes/auth.py`
- [X] Auth routes created and implemented

**Task 1.5 [P]**: Update main entry point
- Update `backend/src/main.py` to include auth router
- Ensure CORS allows requests from `http://localhost:3000`
- File: `backend/src/main.py`
- [X] Main entry point updated with auth router

### Phase 2: Frontend Authentication Implementation

**Task 2.1 [P]**: Clean up Better Auth files
- Uninstall `better-auth`
- Delete `frontend/src/lib/auth.ts`
- Delete `frontend/src/lib/auth-client.ts`
- Delete folder `frontend/src/app/api/auth`
- Files: `package.json`, `frontend/src/lib/auth.ts`, `frontend/src/lib/auth-client.ts`, `frontend/src/app/api/auth`
- [X] Better Auth related files cleaned up

**Task 2.2 [P]**: Create Auth Context
- Create `frontend/src/context/AuthContext.tsx` with React Context
- Provide: `{ user, login, logout, isLoading }`
- Check `localStorage.getItem("token")` on mount
- Implement `login(token)` function to save token and redirect
- Implement `logout()` function to remove token and clear state
- File: `frontend/src/context/AuthContext.tsx`
- [X] Auth Context created and implemented

**Task 2.3 [P]**: Update layout with Auth Provider
- Update `frontend/src/app/layout.tsx` to wrap children in `<AuthProvider>`
- File: `frontend/src/app/layout.tsx`
- [X] Layout updated with Auth Provider

**Task 2.4 [P]**: Update API library
- Update `frontend/src/lib/api.ts` to read token from localStorage
- Add header: `Authorization: Bearer ${token}` if token exists
- File: `frontend/src/lib/api.ts`
- [X] API library updated to use JWT tokens

### Phase 3: Page Updates

**Task 3.1 [P]**: Create signup page
- Create/Update `frontend/src/app/signup/page.tsx` with form
- Call `POST /api/auth/signup`
- Redirect to Login on success
- File: `frontend/src/app/signup/page.tsx`
- [X] Signup page created and implemented

**Task 3.2 [P]**: Create login page
- Create/Update `frontend/src/app/login/page.tsx` with form
- Call `POST /api/auth/login`
- Get Token and call `authContext.login(token)`
- File: `frontend/src/app/login/page.tsx`
- [X] Login page updated with new auth system

**Task 3.3 [P]**: Update sidebar
- Update `frontend/src/components/Sidebar.tsx` to use `authContext.logout()`
- File: `frontend/src/components/Sidebar.tsx`
- [X] Sidebar updated to use new auth context

### Phase 4: Final Checks

**Task 4.1**: Perform final validation
- Ensure Backend reads `SECRET_KEY` from `os.getenv`
- Ensure Frontend reads API URL from `process.env.NEXT_PUBLIC_API_URL`
- Test signup/login flow
- Files: Various config files
- [X] Backend uses SECRET_KEY from env vars
- [X] Frontend uses NEXT_PUBLIC_API_URL from env vars
- [X] All endpoints tested and working