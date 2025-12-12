# Quickstart Guide: Todo List Console Application

## Prerequisites
- Python 3.13+
- UV package manager

## Setup
1. Clone the repository
2. Navigate to the project directory
3. Initialize the project: `uv init`
4. Install dependencies: `uv pip install rich`

## Running the Application
1. Execute: `python src/main.py`
2. Follow the menu prompts to manage your tasks

## Basic Usage
1. Add Task: Select option 1, enter a title (1-200 characters) and optional description
2. View Tasks: Select option 2 to see all tasks in a formatted table
3. Update Task: Select option 3, enter the task ID, then update title or description
4. Delete Task: Select option 4, enter the task ID to permanently remove
5. Mark Complete: Select option 5, enter the task ID to mark as completed
6. Exit: Select option 6 to close the application

## Testing
Run the tests using: `pytest tests/`

## Development
- Models are defined in `src/models.py`
- Business logic is in `src/manager.py`
- Main application flow is in `src/main.py`
- Tests are in `tests/test_manager.py`