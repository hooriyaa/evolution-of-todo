# Todo AI Chatbot - API Contracts

## Overview

This document defines the API contracts for the Todo AI Chatbot feature, including endpoint specifications, request/response formats, and error handling.

## Base URL

All API endpoints are relative to:
```
https://api.yourapp.com/api/v1
```

## Authentication

All endpoints require authentication via a Bearer token in the Authorization header:
```
Authorization: Bearer {access_token}
```

## Common Headers

All requests and responses use the following common headers:

### Request Headers
- `Content-Type`: `application/json`
- `Authorization`: `Bearer {access_token}`

### Response Headers
- `Content-Type`: `application/json`
- `X-RateLimit-Remaining`: Number of requests remaining in the current window

## Endpoints

### POST /chat

Process a user message through the AI agent and return a response.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "message": "The message content from the user",
  "conversation_id": 123
}
```

**Fields:**
- `message` (string, required): The message content from the user
- `conversation_id` (integer, optional): ID of an existing conversation; if omitted, a new conversation is created

#### Response

**Success Response (200 OK):**
```json
{
  "conversation_id": 123,
  "response": "The AI's response to the user message",
  "timestamp": "2023-10-01T12:00:00Z"
}
```

**Response Fields:**
- `conversation_id` (integer): The ID of the conversation (newly created or existing)
- `response` (string): The AI's response to the user message
- `timestamp` (string): ISO 8601 formatted timestamp of the response

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid input provided",
  "code": "INVALID_INPUT",
  "details": {
    "message": "Message field is required"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Conversation not found",
  "code": "CONVERSATION_NOT_FOUND"
}
```

**Error Response (429 Too Many Requests):**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "An unexpected error occurred",
  "code": "INTERNAL_ERROR"
}
```

#### Example Request

```http
POST /api/v1/chat
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "message": "Add task: Buy groceries",
  "conversation_id": null
}
```

#### Example Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Remaining: 19

{
  "conversation_id": 156,
  "response": "I've added 'Buy groceries' to your task list.",
  "timestamp": "2023-10-01T12:00:00Z"
}
```

### GET /conversations

Retrieve a list of user's conversations with basic metadata.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `limit` (integer, optional, default: 10): Maximum number of conversations to return
- `offset` (integer, optional, default: 0): Number of conversations to skip

#### Response

**Success Response (200 OK):**
```json
{
  "conversations": [
    {
      "id": 123,
      "created_at": "2023-10-01T10:00:00Z",
      "updated_at": "2023-10-01T12:00:00Z",
      "last_message": "Can you help me organize my tasks?"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

**Response Fields:**
- `conversations` (array): List of conversation objects
  - `id` (integer): Conversation ID
  - `created_at` (string): ISO 8601 formatted creation timestamp
  - `updated_at` (string): ISO 8601 formatted last update timestamp
  - `last_message` (string): Preview of the last message in the conversation
- `total` (integer): Total number of conversations available
- `limit` (integer): Number of conversations returned
- `offset` (integer): Number of conversations skipped

### GET /conversations/{id}/messages

Retrieve messages from a specific conversation.

#### Request

**Path Parameters:**
- `id` (integer): The conversation ID

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `limit` (integer, optional, default: 50): Maximum number of messages to return
- `offset` (integer, optional, default: 0): Number of messages to skip

#### Response

**Success Response (200 OK):**
```json
{
  "messages": [
    {
      "id": 456,
      "role": "user",
      "content": "Add task: Buy groceries",
      "timestamp": "2023-10-01T11:30:00Z"
    },
    {
      "id": 457,
      "role": "assistant",
      "content": "I've added 'Buy groceries' to your task list.",
      "timestamp": "2023-10-01T11:31:00Z"
    }
  ],
  "total": 5,
  "limit": 50,
  "offset": 0
}
```

**Response Fields:**
- `messages` (array): List of message objects
  - `id` (integer): Message ID
  - `role` (string): Role of the message sender (user, assistant, system)
  - `content` (string): The message content
  - `timestamp` (string): ISO 8601 formatted timestamp
- `total` (integer): Total number of messages in the conversation
- `limit` (integer): Number of messages returned
- `offset` (integer): Number of messages skipped

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_REQUIRED | 401 | Authentication token is missing or invalid |
| INVALID_INPUT | 400 | Request contains invalid or missing parameters |
| CONVERSATION_NOT_FOUND | 404 | Specified conversation does not exist |
| RATE_LIMIT_EXCEEDED | 429 | User has exceeded the allowed number of requests |
| INTERNAL_ERROR | 500 | An unexpected server error occurred |
| GEMINI_API_ERROR | 502 | External AI service is temporarily unavailable |

## Rate Limiting

All authenticated endpoints are subject to rate limiting:

- **Standard users**: 20 requests per minute per user
- **Premium users**: 60 requests per minute per user
- **Burst allowance**: Up to 5 additional requests allowed occasionally

Rate limit information is included in response headers:
- `X-RateLimit-Limit`: The maximum number of requests allowed per window
- `X-RateLimit-Remaining`: The number of requests remaining in the current window
- `X-RateLimit-Reset`: Unix timestamp for when the rate limit window resets

## Data Validation

### Message Content
- Minimum length: 1 character
- Maximum length: 1000 characters
- Must not contain executable scripts or markup

### Conversation ID
- Must be a positive integer
- Must reference an existing conversation owned by the authenticated user

## Versioning

This API follows semantic versioning. Breaking changes will increment the major version number (e.g., v1 to v2). Minor and patch versions maintain backward compatibility.

## CORS Policy

This API supports CORS for secure cross-origin requests. The following origins are allowed:
- `https://yourapp.com`
- `http://localhost:3000` (for development)
- Other origins as configured in the application settings