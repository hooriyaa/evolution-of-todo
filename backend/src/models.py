from sqlmodel import SQLModel, Field, Column, DateTime, Text
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    """
    User model for authentication
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(unique=True, min_length=5, max_length=100)
    hashed_password: str = Field(min_length=1, max_length=200)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(sa_column=Column(Text))
    completed: bool = Field(default=False)
    user_id: int  # This will now reference our User.id
    due_date: Optional[datetime] = Field(sa_column=Column(DateTime))
    category: Optional[str] = Field(default=None, max_length=50)


class Task(TaskBase, table=True):
    """
    Task model matching the schema specification
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)