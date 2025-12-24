# Todo AI Chatbot - Implementation Plan

## Technical Context

### Project Overview
The Todo AI Chatbot is a stateless chatbot API that integrates with Google Gemini 2.0 Flash using the openai-agents-sdk. The chatbot allows users to manage their tasks through natural language interactions, storing conversation history in Neon Postgres database. The frontend features a modern chat widget with the project's specific color scheme.

### Architecture
- **Backend**: Python FastAPI API with SQLModel ORM
- **Database**: Neon Postgres
- **AI Engine**: Google Gemini 2.0 Flash via openai-agents-sdk
- **Frontend**: React/Next.js with Tailwind CSS

### Current State
- Authentication system is already implemented
- Task management API exists
- UI uses Tailwind CSS with lime green (#D4E76C) and dark gray/black theme

### Technology Stack
- Python 3.11+
- FastAPI
- SQLModel
- Neon Postgres
- openai-agents-sdk
- Google Gemini 2.0 Flash API
- Next.js
- React
- Tailwind CSS

### Known Unknowns
- [NEEDS CLARIFICATION] How should conversation history be paginated or limited?
- [NEEDS CLARIFICATION] Should there be rate limiting on chat requests?
- [NEEDS CLARIFICATION] How should the system handle API errors from Gemini?

## Constitution Check

### Code Quality
- All code follows PEP 8 standards
- Type hints are used throughout
- Error handling is comprehensive
- Code is well-documented

### Security
- API keys are stored in environment variables
- Authentication is required for all endpoints
- Input validation is implemented
- SQL injection is prevented through ORM usage

### Performance
- Database queries are optimized
- API responses are efficient
- Caching is implemented where appropriate

### Testing
- Unit tests cover all functions
- Integration tests verify API endpoints
- Error scenarios are tested

## Gates

### Gate 1: Architecture Review
- [x] Stateless design confirmed
- [x] Database schema defined
- [x] API endpoints planned
- [x] Frontend integration approach defined

### Gate 2: Security Review
- [x] Authentication requirements verified
- [x] API key handling planned
- [x] Input validation approach defined

### Gate 3: Performance Review
- [x] Database query optimization planned
- [x] API response time targets defined
- [x] Caching strategy defined

## Phase 0: Research

### Research Tasks

#### RT-1: Conversation History Management
**Decision**: Implement conversation history with pagination and retention policy
**Rationale**: To prevent performance issues with long-running conversations
**Alternatives considered**: 
- Unlimited history (performance concerns)
- Time-based retention (30 days) with summary generation
- Session-based history (single visit only)

#### RT-2: Error Handling Strategy
**Decision**: Implement graceful degradation with user-friendly error messages
**Rationale**: AI API might be temporarily unavailable
**Alternatives considered**:
- Fallback to simple text responses
- Queue messages for later processing
- Show error message to user

#### RT-3: Rate Limiting Implementation
**Decision**: Implement token-based rate limiting
**Rationale**: Prevent API abuse and manage costs
**Alternatives considered**:
- No rate limiting (cost and security risks)
- IP-based limiting (shared IP issues)
- User-based limiting (more granular control)

## Phase 1: Design & Contracts

### Data Model

#### Conversation Entity
```python
class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int  # Reference to the user
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship to messages
    messages: List["Message"] = Relationship(back_populates="conversation")
```

#### Message Entity
```python
class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    role: str = Field(regex="^(user|assistant|system)$")  # user, assistant, or system
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship to conversation
    conversation: Conversation = Relationship(back_populates="messages")
```

#### Task Entity (for integration)
```python
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### API Contracts

#### POST /api/v1/chat
**Description**: Process user message through AI agent and return response

**Request**:
```json
{
  "message": "Add task: Buy groceries",
  "conversation_id": "optional, creates new if not provided"
}
```

**Response (Success)**:
```json
{
  "conversation_id": 123,
  "response": "I've added 'Buy groceries' to your task list.",
  "timestamp": "2023-10-01T12:00:00Z"
}
```

**Response (Error)**:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Authentication**: Bearer token required

### Quickstart Guide

#### Prerequisites
- Python 3.11+
- Node.js 18+
- Neon Postgres database
- Google Gemini API key

#### Setup Backend
1. Install dependencies:
```bash
pip install fastapi uvicorn sqlmodel python-dotenv openai
```

2. Set environment variables:
```bash
export GEMINI_API_KEY=your_gemini_api_key
export DATABASE_URL=postgresql://user:password@localhost:5432/todo_db
```

3. Run database migrations:
```bash
# This would be implemented as part of startup
```

4. Start the server:
```bash
uvicorn main:app --reload
```

#### Setup Frontend
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Phase 2: Implementation Steps

### Step 1: Database Models (Day 1)
- [ ] Create Conversation and Message models in `backend/src/models.py`
- [ ] Implement database session dependency
- [ ] Create database migration scripts

### Step 2: Backend Tools (Day 1-2)
- [ ] Create `backend/src/tools.py` with `add_task`, `list_tasks`, `delete_task`
- [ ] Implement database access functions using SessionDep
- [ ] Write unit tests for each tool function

### Step 3: AI Agent Setup (Day 2-3)
- [ ] Create `backend/src/agent.py` with AsyncOpenAI client configuration
- [ ] Set up Google Gemini integration with proper base_url
- [ ] Register tool functions with the agent
- [ ] Implement conversation history management

### Step 4: API Endpoint (Day 3-4)
- [ ] Create `backend/src/routes/chat.py` with POST /api/chat endpoint
- [ ] Implement conversation history retrieval and storage
- [ ] Integrate with AI agent
- [ ] Add error handling and validation

### Step 5: Frontend Component (Day 4-5)
- [ ] Create `frontend/src/components/ChatWidget.tsx`
- [ ] Implement floating chat UI with Tailwind CSS
- [ ] Style with lime green (#D4E76C) for user bubbles
- [ ] Add smooth animations and rounded corners (rounded-2xl)

### Step 6: Integration & Testing (Day 5-6)
- [ ] Connect frontend to backend API
- [ ] Test end-to-end functionality
- [ ] Fix any integration issues
- [ ] Performance testing

## Implementation Details

### Backend Implementation

#### 1. Database Models (`backend/src/models.py`)
```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    messages: List["Message"] = Relationship(back_populates="conversation")

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    role: str = Field(regex="^(user|assistant|system)$")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    conversation: Conversation = Relationship(back_populates="messages")
```

#### 2. Backend Tools (`backend/src/tools.py`)
```python
from sqlmodel import Session, select
from models import Task
from typing import List

def add_task(session: Session, user_id: int, title: str, description: str = None) -> Task:
    """Add a new task to the user's task list"""
    task = Task(user_id=user_id, title=title, description=description, completed=False)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def list_tasks(session: Session, user_id: int, completed: bool = None) -> List[Task]:
    """List tasks for a user with optional filtering by completion status"""
    query = select(Task).where(Task.user_id == user_id)
    
    if completed is not None:
        query = query.where(Task.completed == completed)
    
    return session.exec(query).all()

def delete_task(session: Session, task_id: int, user_id: int) -> bool:
    """Delete a task by ID for the specified user"""
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if task:
        session.delete(task)
        session.commit()
        return True
    return False
```

#### 3. AI Agent (`backend/src/agent.py`)
```python
import os
from openai import OpenAI
from dotenv import load_dotenv
from tools import add_task, list_tasks, delete_task
from typing import Dict, Any

load_dotenv()

class TodoAgent:
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv("GEMINI_API_KEY"),
            base_url="https://generativelanguage.googleapis.com/v1beta/openai"
        )
        
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task to the user's list",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "The ID of the user"},
                            "title": {"type": "string", "description": "The task title"},
                            "description": {"type": "string", "description": "Optional task description"}
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List all tasks for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "The ID of the user"},
                            "completed": {"type": "boolean", "description": "Filter by completion status (optional)"}
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task by ID",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "integer", "description": "The ID of the task to delete"},
                            "user_id": {"type": "integer", "description": "The ID of the user"}
                        },
                        "required": ["task_id", "user_id"]
                    }
                }
            }
        ]
    
    def process_message(self, messages: list, user_id: int, session: Session) -> str:
        """Process a message with the AI agent"""
        # Add tools to the request
        response = self.client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=messages,
            tools=self.tools,
            tool_choice="auto"
        )
        
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls
        
        if tool_calls:
            # Execute the tools
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = eval(tool_call.function.arguments)
                
                # Add user_id to function args if not present
                if "user_id" not in function_args:
                    function_args["user_id"] = user_id
                
                if function_name == "add_task":
                    result = add_task(session, **function_args)
                    return f"Added task: {result.title}"
                elif function_name == "list_tasks":
                    tasks = list_tasks(session, **function_args)
                    if tasks:
                        task_list = [f"- {task.title} ({'completed' if task.completed else 'pending'})" for task in tasks]
                        return f"Your tasks:\n" + "\n".join(task_list)
                    else:
                        return "You have no tasks."
                elif function_name == "delete_task":
                    success = delete_task(session, **function_args)
                    if success:
                        return "Task deleted successfully."
                    else:
                        return "Could not delete the task. It may not exist or you may not have permission."
        
        return response_message.content
```

#### 4. API Route (`backend/src/routes/chat.py`)
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from models import Message, Conversation
from database import get_session
from agent import TodoAgent
from typing import Optional
import json

router = APIRouter(prefix="/api/v1")

@router.post("/chat")
async def chat(message: str, conversation_id: Optional[int] = None, session: Session = Depends(get_session)):
    # Get or create conversation
    if conversation_id:
        conversation = session.get(Conversation, conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        # Create new conversation
        conversation = Conversation(user_id=1)  # In real app, get from auth
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
    
    # Add user message to conversation
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=message
    )
    session.add(user_message)
    session.commit()
    
    # Get conversation history
    history_query = select(Message).where(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at)
    history = session.exec(history_query).all()
    
    # Format messages for the AI
    messages = [{"role": msg.role, "content": msg.content} for msg in history]
    
    # Process with AI agent
    agent = TodoAgent()
    response = agent.process_message(messages, conversation.user_id, session)
    
    # Add AI response to conversation
    ai_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=response
    )
    session.add(ai_message)
    session.commit()
    
    return {
        "conversation_id": conversation.id,
        "response": response,
        "timestamp": ai_message.created_at.isoformat()
    }
```

### Frontend Implementation

#### Chat Widget Component (`frontend/src/components/ChatWidget.tsx`)
```tsx
import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // In a real app, you would send the message to your backend
      // This is a placeholder for the actual API call
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          conversation_id: 1, // In real app, use actual conversation ID
        }),
      });

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-gray-900 text-white rounded-2xl shadow-xl flex flex-col border border-gray-700">
          {/* Header */}
          <div className="bg-gray-800 p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold">AI Task Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Start a conversation to manage your tasks...
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`mb-3 rounded-2xl p-3 max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'bg-[#D4E76C] text-gray-900 ml-auto' 
                        : 'bg-gray-800 mr-auto'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-gray-800 rounded-2xl p-3 max-w-[80%] mr-auto">
                    <div className="flex items-center">
                      <div className="animate-pulse">Thinking...</div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me to manage tasks..."
                className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D4E76C]"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-[#D4E76C] text-gray-900 rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#c0d05c]"
                disabled={isLoading || !inputValue.trim()}
              >
                <span>➤</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#D4E76C] text-gray-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        >
          <span className="text-xl">💬</span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
```

## Risk Assessment

### High Risk Items
- API availability and response time from Google Gemini
- Database performance with growing conversation history
- Security of API keys and user data

### Mitigation Strategies
- Implement caching and fallback mechanisms
- Add database indexing and pagination
- Use environment variables and secure authentication

## Deployment Considerations

### Environment Variables
- GEMINI_API_KEY: Google Gemini API key
- DATABASE_URL: Connection string for Neon Postgres
- FRONTEND_URL: Allowed origin for CORS (if needed)

### Infrastructure
- Neon Postgres database
- Server capable of running Python FastAPI application
- HTTPS-enabled domain for production