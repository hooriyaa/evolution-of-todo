from dataclasses import dataclass
from typing import Optional


@dataclass
class Task:
    """
    Represents a single todo item in the application.
    
    Attributes:
        id: Unique identifier for the task
        title: Task title (1-200 characters)
        description: Optional task description
        status: Task status, either 'Pending' or 'Completed'
    """
    id: int
    title: str
    description: Optional[str] = ""
    status: str = "Pending"