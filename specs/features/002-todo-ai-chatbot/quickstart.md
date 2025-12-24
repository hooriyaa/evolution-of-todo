# Todo AI Chatbot - Quickstart Guide

## Overview

This guide provides a step-by-step process to get the Todo AI Chatbot feature up and running in your development environment.

## Prerequisites

Before starting, ensure you have the following installed:

### Backend Requirements
- Python 3.11 or higher
- pip (Python package manager)
- Git

### Frontend Requirements
- Node.js 18 or higher
- npm or yarn package manager

### Other Requirements
- Access to a Neon Postgres database
- Google Gemini API key

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
git clone <your-repo-url>
cd hackathon2
```

### 2. Backend Setup

#### 2.1. Navigate to Backend Directory
```bash
cd backend
```

#### 2.2. Create and Activate Virtual Environment
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### 2.3. Install Dependencies
```bash
pip install fastapi uvicorn sqlmodel python-dotenv openai
```

#### 2.4. Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
```

### 3. Frontend Setup

#### 3.1. Navigate to Frontend Directory
```bash
cd frontend  # from project root
```

#### 3.2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3.3. Set Up Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 4. Database Setup

#### 4.1. Run Database Migrations

First, create the database models in `backend/src/models.py` with the following content:

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

Then run your database migration tool to create these tables in your database.

### 5. Create Backend Files

#### 5.1. Create Tools Module (`backend/src/tools.py`)

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

#### 5.2. Create Agent Module (`backend/src/agent.py`)

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

#### 5.3. Create Chat Route (`backend/src/routes/chat.py`)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from models import Message, Conversation
from database import get_session
from agent import TodoAgent
from typing import Optional
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1")

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

@router.post("/chat")
async def chat(request: ChatRequest, session: Session = Depends(get_session)):
    # Get or create conversation
    if request.conversation_id:
        conversation = session.get(Conversation, request.conversation_id)
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
        content=request.message
    )
    session.add(user_message)
    session.commit()
    
    # Get conversation history
    from sqlmodel import select
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

#### 5.4. Update Main Application (`backend/main.py`)

```python
from fastapi import FastAPI
from routes.chat import router as chat_router

app = FastAPI(title="Todo AI Chatbot API")

# Include chat routes
app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "Todo AI Chatbot API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 6. Create Frontend Component

#### 6.1. Create Chat Widget (`frontend/src/components/ChatWidget.tsx`)

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
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In a real app, you would include the auth token here
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

### 7. Start the Applications

#### 7.1. Start Backend Server

From the `backend` directory:

```bash
uvicorn main:app --reload
```

Your backend API will be available at `http://localhost:8000`.

#### 7.2. Start Frontend Server

From the `frontend` directory:

```bash
npm run dev
```

Your frontend will be available at `http://localhost:3000`.

### 8. Testing the Integration

1. Open your browser to `http://localhost:3000`
2. Look for the chat widget button in the bottom-right corner
3. Click the button to open the chat interface
4. Type a message like "Add task: Buy groceries"
5. The AI should respond and create the task

## Troubleshooting

### Common Issues

#### Issue: "GEMINI_API_KEY not found"
**Solution:** Verify that your `.env` file in the backend directory contains the correct API key.

#### Issue: "Database connection failed"
**Solution:** Check that your `DATABASE_URL` in the `.env` file is correct and the database server is running.

#### Issue: "Module not found errors"
**Solution:** Ensure you've installed all required dependencies in both the backend and frontend directories.

#### Issue: "CORS errors"
**Solution:** Make sure your backend allows requests from your frontend origin. You may need to add CORS middleware to your FastAPI app.

## Next Steps

1. Integrate with your existing authentication system
2. Add proper error handling and logging
3. Implement rate limiting
4. Add tests for your new functionality
5. Deploy to your preferred hosting platform