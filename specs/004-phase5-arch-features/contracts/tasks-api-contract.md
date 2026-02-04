# API Contract: Advanced Task Operations

## Overview
This document specifies the API contracts for advanced task management features including filtering, sorting, searching, priorities, tags, and due dates.

## Base URL
`https://api.todo-chatbot.com/v1`

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Endpoints

### GET /tasks
Retrieve a list of tasks with advanced filtering, sorting, and searching capabilities.

#### Query Parameters
- `filter[priority]` (optional): Filter by priority (low, medium, high)
- `filter[status]` (optional): Filter by status (pending, completed)
- `filter[tag]` (optional): Filter by tag ID
- `filter[due_date_from]` (optional): Filter tasks with due date after this date (ISO 8601)
- `filter[due_date_to]` (optional): Filter tasks with due date before this date (ISO 8601)
- `sort` (optional): Sort field with optional direction (e.g., "due_date:asc", "priority:desc")
- `search` (optional): Search term to match against task title and description
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20, max: 100)

#### Response (200 OK)
```json
{
  "data": [
    {
      "id": "uuid-string",
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "priority": "high",
      "due_date": "2024-12-31T23:59:59Z",
      "recurring_rule": {
        "frequency": "weekly",
        "interval": 1,
        "end_condition": {
          "type": "after_occurrences",
          "value": 10
        }
      },
      "tags": [
        {
          "id": "tag-uuid",
          "name": "Work",
          "color": "#FF5733"
        }
      ],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "user_id": "user-uuid"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "pages": 5,
    "limit": 20
  }
}
```

### POST /tasks
Create a new task with advanced properties.

#### Request Body
```json
{
  "title": "New task title",
  "description": "Task description",
  "priority": "medium",
  "due_date": "2024-12-31T23:59:59Z",
  "recurring_rule": {
    "frequency": "weekly",
    "interval": 1,
    "end_condition": {
      "type": "after_occurrences",
      "value": 10
    }
  },
  "tags": [
    {
      "id": "tag-uuid",
      "name": "Work",
      "color": "#FF5733"
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "data": {
    "id": "new-task-uuid",
    "title": "New task title",
    "description": "Task description",
    "completed": false,
    "priority": "medium",
    "due_date": "2024-12-31T23:59:59Z",
    "recurring_rule": {
      "frequency": "weekly",
      "interval": 1,
      "end_condition": {
        "type": "after_occurrences",
        "value": 10
      }
    },
    "tags": [
      {
        "id": "tag-uuid",
        "name": "Work",
        "color": "#FF5733"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "user_id": "user-uuid"
  }
}
```

### PUT /tasks/{id}
Update an existing task with advanced properties.

#### Path Parameters
- `id` (required): Task UUID

#### Request Body
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59Z",
  "completed": false,
  "recurring_rule": {
    "frequency": "monthly",
    "interval": 1,
    "end_condition": {
      "type": "on_date",
      "value": "2025-12-31"
    }
  },
  "tags": [
    {
      "id": "tag-uuid",
      "name": "Personal",
      "color": "#33FF57"
    }
  ]
}
```

#### Response (200 OK)
```json
{
  "data": {
    "id": "existing-task-uuid",
    "title": "Updated task title",
    "description": "Updated task description",
    "completed": false,
    "priority": "high",
    "due_date": "2024-12-31T23:59:59Z",
    "recurring_rule": {
      "frequency": "monthly",
      "interval": 1,
      "end_condition": {
        "type": "on_date",
        "value": "2025-12-31"
      }
    },
    "tags": [
      {
        "id": "tag-uuid",
        "name": "Personal",
        "color": "#33FF57"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T10:30:00Z",
    "user_id": "user-uuid"
  }
}
```

### POST /tasks/{id}/toggle-completion
Toggle the completion status of a task.

#### Path Parameters
- `id` (required): Task UUID

#### Response (200 OK)
```json
{
  "data": {
    "id": "task-uuid",
    "completed": true,
    "updated_at": "2024-01-02T10:30:00Z"
  }
}
```

### GET /tags
Retrieve a list of tags for the authenticated user.

#### Response (200 OK)
```json
{
  "data": [
    {
      "id": "tag-uuid",
      "name": "Work",
      "color": "#FF5733",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "user_id": "user-uuid"
    }
  ]
}
```

### POST /tags
Create a new tag.

#### Request Body
```json
{
  "name": "New Tag",
  "color": "#3357FF"
}
```

#### Response (201 Created)
```json
{
  "data": {
    "id": "new-tag-uuid",
    "name": "New Tag",
    "color": "#3357FF",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "user_id": "user-uuid"
  }
}
```