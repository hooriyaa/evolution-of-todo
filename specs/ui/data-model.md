# Data Model: UI Components for Todo App

## Task Entity (Frontend Representation)

### Fields
- `id`: number or string (unique identifier)
- `title`: string (1-200 characters, required)
- `description`: string (optional, can be empty)
- `completed`: boolean (default: false)
- `createdAt`: Date or string (timestamp)
- `updatedAt`: Date or string (timestamp)

### State Transitions
- `completed` field can transition from `false` to `true` (via UI toggle)
- `completed` field can transition from `true` to `false` (via UI toggle)
- `title` and `description` can be updated via editing UI
- `updatedAt` automatically updates when task is modified

### Validation Rules
- `title` must be between 1 and 200 characters
- `title` must not be empty or just whitespace
- `description` can be empty but not more than 1000 characters

## User Entity (Frontend Representation)

### Fields
- `id`: string (unique identifier from authentication)
- `email`: string (email address)
- `name`: string (display name)
- `authenticated`: boolean (whether user is currently authenticated)

### State Transitions
- `authenticated` state changes when user logs in or out

## Session Entity

### Fields
- `user`: User (the authenticated user)
- `token`: string (JWT token from Better Auth)
- `expiresAt`: Date (expiration time of token)

### State Transitions
- Session is created when user logs in
- Session is destroyed when user logs out
- Session may refresh token before expiration

## UI State Models

### TaskListState
- `tasks`: Array<Task> (list of tasks to display)
- `loading`: boolean (whether tasks are being loaded)
- `error`: string or null (any error message)
- `filterStatus`: 'all' | 'completed' | 'pending' (filter criteria)
- `sortBy`: 'created' | 'title' (sorting criteria)

### TaskFormState
- `title`: string (current title in form)
- `description`: string (current description in form)
- `error`: string or null (validation or submission error)
- `submitting`: boolean (whether form is submitting)
- `visible`: boolean (whether form is visible - for modal forms)

### AuthState
- `user`: User | null (currently authenticated user)
- `loading`: boolean (whether auth status is being checked)
- `error`: string or null (any authentication error)