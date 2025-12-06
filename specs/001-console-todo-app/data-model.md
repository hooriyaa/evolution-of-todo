# Data Model: Todo List Console Application

## Task Entity

### Fields
- **id**: int (auto-incrementing, unique identifier, required)
- **title**: str (1-200 characters, required)
- **description**: str (optional, can be empty)
- **status**: str (either "Pending" or "Completed", default "Pending")

### Relationships
- No relationships with other entities (standalone model)

### Validation Rules
- title must be between 1 and 200 characters
- status must be either "Pending" or "Completed"
- id must be unique within the system

### State Transitions
- Status can transition from "Pending" to "Completed" using the mark complete functionality
- Status should not transition from "Completed" back to "Pending" based on requirements

## TaskManager Entity

### Fields
- **tasks**: List[Task] (collection of all tasks in the system)

### Methods
- **add_task(title: str, description: str = "") -> int**: Creates a new task with auto-incremented ID and returns the ID
- **view_tasks() -> List[Task]**: Returns all tasks in the system
- **update_task(task_id: int, title: str = None, description: str = None) -> bool**: Updates an existing task, returns True if successful
- **delete_task(task_id: int) -> bool**: Deletes a task, returns True if successful
- **mark_complete(task_id: int) -> bool**: Marks a task as complete, returns True if successful
- **get_task_by_id(task_id: int) -> Task or None**: Helper method to retrieve a specific task