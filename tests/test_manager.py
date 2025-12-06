import pytest
from src.models import Task
from src.manager import TaskManager


class TestTaskManager:
    """Test cases for the TaskManager class."""
    
    def setup_method(self):
        """Set up a fresh TaskManager instance for each test."""
        self.manager = TaskManager()
    
    # Tests for User Story 1 - Add New Task
    
    def test_add_task_with_valid_title(self):
        """Test adding a task with a valid title."""
        title = "Test Task"
        task_id = self.manager.add_task(title)
        
        # Verify the task was added
        assert len(self.manager.tasks) == 1
        
        # Verify the task has the correct properties
        task = self.manager.tasks[0]
        assert task.id == task_id
        assert task.title == title
        assert task.description == ""
        assert task.status == "Pending"
    
    def test_add_task_with_title_and_description(self):
        """Test adding a task with both title and description."""
        title = "Test Task"
        description = "This is a test description"
        task_id = self.manager.add_task(title, description)
        
        # Verify the task was added
        assert len(self.manager.tasks) == 1
        
        # Verify the task has the correct properties
        task = self.manager.tasks[0]
        assert task.id == task_id
        assert task.title == title
        assert task.description == description
        assert task.status == "Pending"
    
    def test_add_task_title_validation(self):
        """Test title validation (1-200 characters)."""
        # Test title that's too short (empty)
        with pytest.raises(ValueError):
            self.manager.add_task("")

        # Test title that's too long (>200 chars)
        long_title = "A" * 201
        with pytest.raises(ValueError):
            self.manager.add_task(long_title)

        # Test title with exactly 200 chars (should work)
        valid_title = "A" * 200
        task_id = self.manager.add_task(valid_title)

        task = self.manager.tasks[0]
        assert task.id == task_id
        assert task.title == valid_title

    # Tests for User Story 2 - View Task List

    def test_view_all_tasks(self):
        """Test viewing all tasks when tasks exist."""
        # Add some tasks
        task1_id = self.manager.add_task("Task 1", "Description for task 1")
        task2_id = self.manager.add_task("Task 2")

        # Get all tasks
        all_tasks = self.manager.get_all_tasks()

        # Verify we have 2 tasks
        assert len(all_tasks) == 2

        # Verify the tasks are correct
        task1 = all_tasks[0]
        task2 = all_tasks[1]

        assert task1.id == task1_id
        assert task1.title == "Task 1"
        assert task1.description == "Description for task 1"
        assert task1.status == "Pending"

        assert task2.id == task2_id
        assert task2.title == "Task 2"
        assert task2.description == ""
        assert task2.status == "Pending"

    def test_view_empty_task_list(self):
        """Test viewing tasks when no tasks exist."""
        # Initially, there should be no tasks
        all_tasks = self.manager.get_all_tasks()
        assert len(all_tasks) == 0

    # Tests for User Story 3 - Mark Task as Complete

    def test_mark_task_complete(self):
        """Test marking a task as complete."""
        # Add a task
        task_id = self.manager.add_task("Test Task", "Description")

        # Verify the task is initially pending
        task = self.manager.tasks[0]
        assert task.status == "Pending"

        # Mark the task as complete
        result = self.manager.mark_complete(task_id)

        # Verify the result is True (successful)
        assert result is True

        # Verify the task status changed to completed
        updated_task = self.manager.tasks[0]
        assert updated_task.status == "Completed"

    def test_mark_task_complete_invalid_id(self):
        """Test handling invalid task ID when marking as complete."""
        # Add a task
        self.manager.add_task("Test Task", "Description")

        # Try to mark a task with an invalid ID
        result = self.manager.mark_complete(999)  # Non-existent ID

        # Verify the result is False (unsuccessful)
        assert result is False

        # Verify the existing task is still pending
        existing_task = self.manager.tasks[0]
        assert existing_task.status == "Pending"

    # Tests for User Story 5 - Delete Task

    def test_delete_task(self):
        """Test deleting a task."""
        # Add two tasks
        task1_id = self.manager.add_task("Task 1", "Description 1")
        task2_id = self.manager.add_task("Task 2", "Description 2")

        # Verify we have 2 tasks
        assert len(self.manager.tasks) == 2

        # Delete the first task
        result = self.manager.delete_task(task1_id)

        # Verify the result is True (successful)
        assert result is True

        # Verify we now have 1 task
        assert len(self.manager.tasks) == 1

        # Verify the correct task was deleted
        remaining_task = self.manager.tasks[0]
        assert remaining_task.id == task2_id
        assert remaining_task.title == "Task 2"

    def test_delete_task_invalid_id(self):
        """Test handling invalid task ID during deletion."""
        # Add a task
        self.manager.add_task("Test Task", "Description")

        # Verify we have 1 task
        assert len(self.manager.tasks) == 1

        # Try to delete a task with an invalid ID
        result = self.manager.delete_task(999)  # Non-existent ID

        # Verify the result is False (unsuccessful)
        assert result is False

        # Verify we still have 1 task
        assert len(self.manager.tasks) == 1

        # Verify the existing task is still there
        existing_task = self.manager.tasks[0]
        assert existing_task.title == "Test Task"

    # Tests for User Story 4 - Update Task

    def test_update_task_title(self):
        """Test updating a task's title."""
        # Add a task
        task_id = self.manager.add_task("Original Title", "Original Description")

        # Verify the task exists with original values
        original_task = self.manager.tasks[0]
        assert original_task.title == "Original Title"
        assert original_task.description == "Original Description"

        # Update the task's title
        result = self.manager.update_task(task_id, title="Updated Title")

        # Verify the result is True (successful)
        assert result is True

        # Verify the task was updated
        updated_task = self.manager.tasks[0]
        assert updated_task.title == "Updated Title"
        assert updated_task.description == "Original Description"  # Should remain unchanged

    def test_update_task_description(self):
        """Test updating a task's description."""
        # Add a task
        task_id = self.manager.add_task("Original Title", "Original Description")

        # Verify the task exists with original values
        original_task = self.manager.tasks[0]
        assert original_task.title == "Original Title"
        assert original_task.description == "Original Description"

        # Update the task's description
        result = self.manager.update_task(task_id, description="Updated Description")

        # Verify the result is True (successful)
        assert result is True

        # Verify the task was updated
        updated_task = self.manager.tasks[0]
        assert updated_task.title == "Original Title"  # Should remain unchanged
        assert updated_task.description == "Updated Description"

    def test_update_task_invalid_id(self):
        """Test handling invalid task ID during update."""
        # Add a task
        self.manager.add_task("Test Task", "Test Description")

        # Try to update a task with an invalid ID
        result = self.manager.update_task(999, title="New Title")  # Non-existent ID

        # Verify the result is False (unsuccessful)
        assert result is False

        # Verify the existing task is unchanged
        existing_task = self.manager.tasks[0]
        assert existing_task.title == "Test Task"
        assert existing_task.description == "Test Description"