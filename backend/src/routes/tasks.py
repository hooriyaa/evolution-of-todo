from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime
from ..models import Task, User
from ..schemas import TaskCreate, TaskUpdate, TaskResponse
from ..auth import get_current_user
from ..db import get_db
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["tasks"])


@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(
    status: Optional[str] = Query(None, description="Filter by status (pending/completed)"),
    sort: Optional[str] = Query(None, description="Sort by (created/title)"),
    due_date_from: Optional[datetime] = Query(None, description="Filter tasks from this date"),
    due_date_to: Optional[datetime] = Query(None, description="Filter tasks until this date"),
    category: Optional[str] = Query(None, description="Filter by category"),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """
    Fetch tasks for the current user with optional filtering by status, due date, and category
    """
    # Build query
    query = select(Task).where(Task.user_id == current_user.id)

    # Apply status filter
    if status:
        if status.lower() == "completed":
            query = query.where(Task.completed == True)
        elif status.lower() == "pending":
            query = query.where(Task.completed == False)
        else:
            raise HTTPException(status_code=400, detail="Invalid status parameter. Use 'completed' or 'pending'")

    # Apply due date filters
    if due_date_from:
        query = query.where(Task.due_date >= due_date_from)
    if due_date_to:
        query = query.where(Task.due_date <= due_date_to)

    # Apply category filter
    if category:
        query = query.where(Task.category == category)

    # Apply sorting
    if sort:
        if sort.lower() == "title":
            query = query.order_by(Task.title)
        elif sort.lower() == "created":
            query = query.order_by(Task.created_at)
        elif sort.lower() == "due_date":
            query = query.order_by(Task.due_date)
        else:
            # For any other value, default to created_at
            query = query.order_by(Task.created_at)

    tasks = session.exec(query).all()
    return tasks


@router.post("/tasks", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """
    Create a new task for the current user
    """
    # Create new task
    task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=current_user.id,  # Use the authenticated user's ID
        completed=task_data.completed,
        due_date=task_data.due_date,
        category=task_data.category
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """
    Get details of a specific task
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Verify that the task belongs to the user - fix type mismatch
    if str(task.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: access denied")

    return task


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """
    Update task fields including due_date and category
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Verify that the task belongs to the user - fix type mismatch
    if str(task.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: access denied")

    # Update the task with provided values
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    # Update the updated_at timestamp
    task.updated_at = datetime.now()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """
    Delete a task permanently
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Verify that the task belongs to the user - fix type mismatch
    if str(task.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: access denied")

    session.delete(task)
    session.commit()

    return {"message": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_task_completion(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """
    Toggle completion status of a task
    """
    logger.info(f"Attempting to toggle task completion for task_id: {task_id}, user_id: {current_user.id}")

    task = session.get(Task, task_id)

    if not task:
        logger.error(f"Task not found: {task_id}")
        raise HTTPException(status_code=404, detail="Task not found")

    # Verify that the task belongs to the user - fix type mismatch
    if str(task.user_id) != str(current_user.id):
        logger.error(f"User {current_user.id} trying to access task {task_id} belonging to user {task.user_id}")
        raise HTTPException(status_code=403, detail="Forbidden: access denied")

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.now()

    session.add(task)
    session.commit()
    session.refresh(task)

    logger.info(f"Successfully toggled task {task_id} completion status to {task.completed}")

    return task