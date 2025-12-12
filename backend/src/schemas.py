from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Request/Response models for API
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    due_date: Optional[datetime] = None
    category: Optional[str] = None


class TaskCreate(TaskBase):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    category: Optional[str] = "Personal"


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    category: Optional[str] = None


class TaskResponse(TaskBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime


# Authentication models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None