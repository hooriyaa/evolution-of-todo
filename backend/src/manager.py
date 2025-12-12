from typing import List, Optional
from models import Task


class TaskManager:
    """
    Manages the collection of tasks in memory.

    This class provides methods to add, update, delete, and view tasks.
    All tasks are stored in memory using a Python list.
    """

    def __init__(self):
        """
        Initialize the TaskManager with an empty list of tasks and
        an ID counter for generating unique task IDs.
        """
        self.tasks: List[Task] = []
        self._next_id: int = 1

    def get_next_id(self) -> int:
        """
        Get the next available ID and increment the counter.

        Returns:
            The next available unique ID
        """
        new_id = self._next_id
        self._next_id += 1
        return new_id

    def add_task(self, title: str, description: str = "") -> int:
        """
        Add a new task to the task list.

        Args:
            title: Task title (1-200 characters)
            description: Optional task description

        Returns:
            The ID of the newly created task

        Raises:
            ValueError: If title is not between 1-200 characters
        """
        # Validate title length
        if not (1 <= len(title) <= 200):
            raise ValueError("Task title must be between 1 and 200 characters")

        # Create a new task with auto-incremented ID
        task_id = self.get_next_id()
        task = Task(
            id=task_id,
            title=title,
            description=description,
            status="Pending"
        )

        # Add the task to the list and return its ID
        self.tasks.append(task)
        return task_id

    def get_all_tasks(self) -> List[Task]:
        """
        Get all tasks in the task list.

        Returns:
            A list of all Task objects
        """
        return self.tasks.copy()  # Return a copy to prevent external modification

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Get a task by its ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The Task object if found, None otherwise
        """
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None

    def mark_complete(self, task_id: int) -> bool:
        """
        Mark a task as complete.

        Args:
            task_id: The ID of the task to mark as complete

        Returns:
            True if the task was found and updated, False otherwise
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False  # Task not found

        task.status = "Completed"
        return True

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task.

        Args:
            task_id: The ID of the task to delete

        Returns:
            True if the task was found and deleted, False otherwise
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False  # Task not found

        self.tasks.remove(task)
        return True

    def update_task(self, task_id: int, title: str = None, description: str = None) -> bool:
        """
        Update a task's title or description.

        Args:
            task_id: The ID of the task to update
            title: New title for the task (optional, if provided must be 1-200 chars)
            description: New description for the task (optional)

        Returns:
            True if the task was found and updated, False otherwise
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False  # Task not found

        # If title is provided, validate it
        if title is not None:
            if not (1 <= len(title) <= 200):
                raise ValueError("Task title must be between 1 and 200 characters")
            task.title = title

        # If description is provided, update it
        if description is not None:
            task.description = description

        return True