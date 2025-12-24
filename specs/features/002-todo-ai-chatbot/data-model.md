# Todo AI Chatbot - Data Model

## Overview

This document defines the data models required for the Todo AI Chatbot feature, including database schemas, relationships, and validation rules.

## Entity Models

### Conversation

Represents a single conversation session between a user and the AI assistant.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique identifier for the conversation |
| user_id | Integer | Foreign Key, Not Null | Reference to the user who owns the conversation |
| created_at | DateTime | Not Null | Timestamp when the conversation was created |
| updated_at | DateTime | Not Null | Timestamp when the conversation was last updated |

#### Relationships
- One-to-Many: Conversation → Messages (conversation.messages)

#### Validation Rules
- user_id must reference a valid user in the system
- created_at and updated_at are automatically set by the system

### Message

Represents a single message within a conversation, either from the user or the AI assistant.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique identifier for the message |
| conversation_id | Integer | Foreign Key, Not Null | Reference to the parent conversation |
| role | String | Not Null, Enum(user,assistant,system) | The role of the message sender |
| content | Text | Not Null | The content of the message |
| created_at | DateTime | Not Null | Timestamp when the message was created |

#### Relationships
- Many-to-One: Message → Conversation (message.conversation)

#### Validation Rules
- conversation_id must reference a valid conversation
- role must be one of: 'user', 'assistant', or 'system'
- content must not exceed 10,000 characters (implementation detail)

### Task (Existing Model Integration)

Represents a user's task that can be managed through the AI chatbot.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique identifier for the task |
| user_id | Integer | Foreign Key, Not Null | Reference to the user who owns the task |
| title | String | Not Null, Max 255 chars | The task title |
| description | Text | Optional | Optional task description |
| completed | Boolean | Not Null, Default False | Indicates if the task is completed |
| created_at | DateTime | Not Null | Timestamp when the task was created |
| updated_at | DateTime | Not Null | Timestamp when the task was last updated |

#### Relationships
- Many-to-One: Task → User (task.user)

#### Validation Rules
- user_id must reference a valid user in the system
- title must not be empty
- completed defaults to False when creating new tasks

## Database Schema

### SQL Definition

```sql
-- Conversation table
CREATE TABLE conversation (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Message table
CREATE TABLE message (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_message_conversation_id ON message(conversation_id);
CREATE INDEX idx_message_created_at ON message(created_at);
CREATE INDEX idx_conversation_user_id ON conversation(user_id);
```

## State Transitions

### Task State Transitions

1. **Created**: A new task is added with `completed = false`
2. **Completed**: A task's `completed` field is set to `true`
3. **Deleted**: A task is removed from the system

### Message State Transitions

- Messages are immutable once created
- Messages are automatically deleted when their parent conversation is deleted (due to CASCADE constraint)

## API Data Contracts

### Request/Response Objects

#### Chat Request
```json
{
  "message": "Add task: Buy groceries",
  "conversation_id": 123
}
```

#### Chat Response
```json
{
  "conversation_id": 123,
  "response": "I've added 'Buy groceries' to your task list.",
  "timestamp": "2023-10-01T12:00:00Z"
}
```

#### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Performance Considerations

### Indexing Strategy
- Index on `conversation.user_id` for quick user conversation retrieval
- Index on `message.conversation_id` for efficient conversation history queries
- Index on `message.created_at` for chronological ordering

### Data Retention
- Implement automatic cleanup of conversations older than 90 days (configurable)
- Limit conversation history to last 50 messages to maintain performance

### Query Optimization
- Use JOINs to efficiently retrieve conversation history with a single query
- Implement pagination for conversations with many messages
- Cache frequently accessed user data to reduce database load

## Security Considerations

### Data Access
- Ensure users can only access their own conversations and tasks
- Implement proper authentication checks in all API endpoints
- Sanitize all user inputs to prevent injection attacks

### Data Privacy
- Encrypt sensitive data at rest if required by privacy regulations
- Implement proper data retention and deletion policies
- Log access to sensitive data for audit purposes