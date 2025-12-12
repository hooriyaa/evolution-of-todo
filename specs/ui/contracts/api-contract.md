# Frontend API Contract: Todo App UI

## Overview
This document specifies the API integration points for the frontend UI components. The frontend communicates with the backend API at `http://localhost:8000/api/` using the axios client from `lib/api.ts` which automatically attaches JWT tokens.

## Authentication Header
All API requests must include:
```
Authorization: Bearer <jwt-token>
```
The token is retrieved from the Better Auth session and attached automatically by the API client.

## API Integration Points

### 1. Task List Component
**Functionality**: Fetch and display user tasks

#### GET /{user_id}/tasks
- Purpose: Fetch all tasks for the authenticated user
- Query Parameters:
  - `status`: Optional ("pending" or "completed") to filter by completion status
  - `sort`: Optional ("created" or "title") to sort tasks
- Response: Array of Task objects
- UI Integration:
  - Called on dashboard page load
  - Called after task creation/update/deletion to refresh the list
  - Shows loading state while fetching
  - Displays error message if request fails

### 2. Task Form Component
**Functionality**: Create new tasks

#### POST /{user_id}/tasks
- Purpose: Create a new task
- Request Body:
```json
{
  "title": "string (1-200 chars)",
  "description": "string (optional)"
}
```
- Response: Created Task object
- UI Integration:
  - Called when user submits the task form
  - Shows submitting state during request
  - Handles validation errors
  - Clears form after successful creation

### 3. Task Card Component
**Functionality**: Display individual tasks with update/delete options

#### GET /{user_id}/tasks/{task_id}
- Purpose: Get details of a specific task
- Response: Single Task object
- UI Integration:
  - Used to display task details in forms/modals for editing

#### PUT /{user_id}/tasks/{task_id}
- Purpose: Update task title or description
- Request Body:
```json
{
  "title": "string (optional)",
  "description": "string (optional)"
}
```
- Response: Updated Task object
- UI Integration:
  - Called when user updates task details
  - Updates task in the UI immediately after success

#### DELETE /{user_id}/tasks/{task_id}
- Purpose: Delete a task permanently
- Response: Success confirmation
- UI Integration:
  - Called when user confirms deletion
  - Removes task from UI immediately after success
  - Shows confirmation dialog before sending request

#### PATCH /{user_id}/tasks/{task_id}/complete
- Purpose: Toggle task completion status
- Response: Updated Task object
- UI Integration:
  - Called when user clicks the completion checkbox
  - Updates the UI immediately after success
  - Changes visual appearance based on completion status

## Error Handling
- 401 Unauthorized: User token is invalid/expired - redirect to login
- 403 Forbidden: User ID mismatch - show error message
- 404 Not Found: Resource not found - show error message
- Network errors: Show appropriate error message and allow retry

## Loading States
- Show skeleton loaders while fetching tasks
- Show spinner while submitting forms
- Show toast notifications for success/error messages