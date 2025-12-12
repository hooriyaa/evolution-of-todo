# API Contract: Todo App API

## Base URL
`http://localhost:8000/api`

## Authentication
All endpoints require a valid JWT token in the Authorization header:
`Authorization: Bearer <token>`

## Common Error Responses
- `401 Unauthorized`: No valid JWT token provided
- `403 Forbidden`: `user_id` in URL doesn't match `user_id` in JWT token
- `404 Not Found`: Requested resource doesn't exist

## Endpoints

### GET /{user_id}/tasks
Fetch all tasks for the specified user

#### Parameters
- `user_id` (path): User's unique identifier (must match JWT token)
- `status` (query, optional): Filter by completion status (pending/completed)
- `sort` (query, optional): Sort order (created/title)

#### Response
- `200 OK`: List of tasks for the user
- `401`, `403`, `404`: Error responses as defined above

### POST /{user_id}/tasks
Create a new task

#### Parameters
- `user_id` (path): User's unique identifier (must match JWT token)

#### Request Body
```json
{
  "title": "string (1-200 chars)",
  "description": "string (optional)"
}
```

#### Response
- `201 Created`: Created task object
- `400 Bad Request`: Invalid input data
- `401`, `403`, `404`: Error responses as defined above

### GET /{user_id}/tasks/{task_id}
Get details of a specific task

#### Parameters
- `user_id` (path): User's unique identifier (must match JWT token)
- `task_id` (path): Task's unique identifier

#### Response
- `200 OK`: Task object
- `401`, `403`, `404`: Error responses as defined above

### PUT /{user_id}/tasks/{task_id}
Update task title or description

#### Parameters
- `user_id` (path): User's unique identifier (must match JWT token)
- `task_id` (path): Task's unique identifier

#### Request Body
```json
{
  "title": "string (1-200 chars)",
  "description": "string (optional)"
}
```

#### Response
- `200 OK`: Updated task object
- `400 Bad Request`: Invalid input data
- `401`, `403`, `404`: Error responses as defined above

### DELETE /{user_id}/tasks/{task_id}
Delete a task permanently

#### Parameters
- `user_id` (path): User's unique identifier (must match JWT token)
- `task_id` (path): Task's unique identifier

#### Response
- `200 OK`: Deletion confirmation
- `401`, `403`, `404`: Error responses as defined above

### PATCH /{user_id}/tasks/{task_id}/complete
Toggle completion status

#### Parameters
- `user_id` (path): User's unique identifier (must match JWT token)
- `task_id` (path): Task's unique identifier

#### Response
- `200 OK`: Updated task with new completion status
- `401`, `403`, `404`: Error responses as defined above