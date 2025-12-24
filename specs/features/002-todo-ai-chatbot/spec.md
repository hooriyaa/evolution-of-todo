# Todo AI Chatbot - Feature Specification

## Feature Name
Todo AI Chatbot

## Feature Description
A stateless chatbot API that integrates with Google Gemini 2.0 Flash using the openai-agents-sdk. The chatbot will allow users to manage their tasks through natural language interactions, storing conversation history in Neon Postgres database. The frontend will feature a modern chat widget with the project's specific color scheme.

## User Scenarios & Testing

### Scenario 1: Adding a Task via Chat
- **Actor**: Authenticated user
- **Action**: User types "Add task: Buy groceries"
- **Expected Result**: AI understands the request, creates a new task, and confirms to the user

### Scenario 2: Listing Tasks via Chat
- **Actor**: Authenticated user
- **Action**: User types "Show my tasks"
- **Expected Result**: AI retrieves and displays the user's tasks

### Scenario 3: Deleting a Task via Chat
- **Actor**: Authenticated user
- **Action**: User types "Delete task: Buy groceries"
- **Expected Result**: AI identifies and removes the specified task

### Scenario 4: Chatting with the AI Assistant
- **Actor**: Authenticated user
- **Action**: User engages in conversation with the AI
- **Expected Result**: AI responds contextually and can perform task management functions when requested

## Functional Requirements

### FR-1: Database Schema
- The system SHALL include a Conversation entity with id, user_id, and created_at fields
- The system SHALL include a Message entity with id, conversation_id, role, content, and created_at fields
- The system SHALL persist all conversation history in the Neon Postgres database

### FR-2: Backend Tools
- The system SHALL provide an `add_task` function that creates new tasks in the database
- The system SHALL provide a `list_tasks` function that retrieves user's tasks from the database
- The system SHALL provide a `delete_task` function that removes tasks from the database
- All functions SHALL use SessionDep for database access

### FR-3: AI Agent Integration
- The system SHALL initialize an AsyncOpenAI client with base_url="https://generativelanguage.googleapis.com/v1beta/openai"
- The system SHALL use GEMINI_API_KEY for authentication
- The system SHALL register the task management functions as tools with the AI agent
- The system SHALL process user input through the AI agent to determine appropriate actions

### FR-4: API Endpoint
- The system SHALL provide a POST /api/chat endpoint
- The endpoint SHALL retrieve conversation history from the database
- The endpoint SHALL pass the history to the AI agent for processing
- The endpoint SHALL save new messages to the database
- The endpoint SHALL return the AI's response to the client

### FR-5: Frontend UI
- The system SHALL provide a floating chat widget component
- The widget SHALL use Tailwind CSS for styling
- The widget SHALL use lime green (#D4E76C) for user message bubbles
- The widget SHALL use black/gray for the container to match the sidebar
- The widget SHALL have rounded corners (rounded-2xl) and smooth animations

## Success Criteria

- Users can successfully add, list, and delete tasks through natural language
- 95% of user requests result in appropriate task management actions
- Chat responses are delivered within 3 seconds
- Conversation history is reliably persisted and retrieved
- The UI provides a seamless, intuitive chat experience
- The chat widget integrates smoothly with the existing application theme

## Key Entities

### Conversation
- id: Unique identifier for the conversation
- user_id: Reference to the user who owns the conversation
- created_at: Timestamp when the conversation was created

### Message
- id: Unique identifier for the message
- conversation_id: Reference to the parent conversation
- role: The role of the message (user, assistant, system)
- content: The content of the message
- created_at: Timestamp when the message was created

### Task
- id: Unique identifier for the task
- user_id: Reference to the user who owns the task
- title: The task title
- description: Optional task description
- completed: Boolean indicating if the task is completed
- created_at: Timestamp when the task was created
- updated_at: Timestamp when the task was last updated

## Assumptions

- The user is authenticated when interacting with the chatbot
- The GEMINI_API_KEY is properly configured in environment variables
- The Neon Postgres database is available and properly configured
- The existing authentication system is compatible with the new chat functionality
- The frontend already has Tailwind CSS configured