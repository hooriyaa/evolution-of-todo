from sqlmodel import SQLModel, Field, Column, Text, Relationship
from sqlalchemy import Index, DateTime
from typing import Optional, List
from datetime import datetime
from enum import Enum

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class User(SQLModel, table=True):
    """
    User model for authentication
    """
    __table_args__ = (
        Index("idx_user_email", "email", unique=True),
        {"extend_existing": True}
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(sa_column=Column("email", Text, unique=True, nullable=False, index=True))
    hashed_password: str = Field(min_length=1, max_length=200)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(sa_column=Column(Text))
    completed: bool = Field(default=False)
    user_id: int  # This will now reference our User.id
    due_date: Optional[datetime] = Field(sa_column=Column(DateTime(timezone=True)))
    category: Optional[str] = Field(default=None, max_length=50)
    priority: PriorityEnum = Field(default=PriorityEnum.medium)
    tags: Optional[str] = Field(default=None)  # Comma-separated tags or JSON string
    is_recurring: bool = Field(default=False)
    recurring_rule: Optional[str] = Field(default=None)  # e.g., "daily", "weekly"


class Task(TaskBase, table=True):
    """
    Task model matching the schema specification
    """
    __table_args__ = (
        Index("idx_task_user_id", "user_id"),
        Index("idx_task_completed", "completed"),
        Index("idx_task_due_date", "due_date"),
        Index("idx_task_category", "category"),
        Index("idx_task_priority", "priority"),
        Index("idx_task_created_at", "created_at"),
        {"extend_existing": True}
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Conversation(SQLModel, table=True):
    """
    Conversation model for chat history
    """
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int  # Reference to the user who owns the conversation
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to messages
    messages: List["Message"] = Relationship(back_populates="conversation")


class Message(SQLModel, table=True):
    """
    Message model for chat history
    """
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    role: str = Field(regex="^(user|assistant|system)$")  # user, assistant, or system
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to conversation
    conversation: Conversation = Relationship(back_populates="messages")