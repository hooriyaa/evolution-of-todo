from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlmodel import Session, select, delete
from datetime import datetime
from ..models import Task, User
from ..schemas import TaskCreate, TaskUpdate, TaskResponse
from ..auth import get_current_user
from ..db import get_db
from ..dapr_client import publish_event
from ..utils import convert_to_utc, convert_from_utc
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["tasks"])


@router.get("/tasks")
def get_tasks(
    status: Optional[str] = Query(None, description="Filter by status (pending/completed)"),
    priority: Optional[str] = Query(None, description="Filter by priority (low/medium/high)"),
    search: Optional[str] = Query(None, description="Search in title/description"),
    sort_by: Optional[str] = Query(None, description="Sort by (due_date/priority)"),
    due_date_from: Optional[datetime] = Query(None, description="Filter tasks from this date"),
    due_date_to: Optional[datetime] = Query(None, description="Filter tasks until this date"),
    category: Optional[str] = Query(None, description="Filter by category"),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """
    Fetch tasks for the current user with optional filtering by status, due date, category, priority, and search
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

    # Apply priority filter
    if priority:
        if priority.lower() in ["low", "medium", "high"]:
            query = query.where(Task.priority == priority.lower())
        else:
            raise HTTPException(status_code=400, detail="Invalid priority parameter. Use 'low', 'medium', or 'high'")

    # Apply search filter
    if search:
        search_pattern = f"%{search}%"
        query = query.where((Task.title.ilike(search_pattern)) | (Task.description.ilike(search_pattern)))

    # Apply due date filters
    if due_date_from:
        # Convert to UTC for comparison
        due_date_from_utc = convert_to_utc(due_date_from) if due_date_from else None
        if due_date_from_utc:
            query = query.where(Task.due_date >= due_date_from_utc)
    if due_date_to:
        # Convert to UTC for comparison
        due_date_to_utc = convert_to_utc(due_date_to) if due_date_to else None
        if due_date_to_utc:
            query = query.where(Task.due_date <= due_date_to_utc)

    # Apply category filter
    if category:
        query = query.where(Task.category == category)

    # Apply sorting
    if sort_by:
        if sort_by.lower() == "due_date":
            query = query.order_by(Task.due_date)
        elif sort_by.lower() == "priority":
            query = query.order_by(Task.priority)
        elif sort_by.lower() == "title":
            query = query.order_by(Task.title)
        elif sort_by.lower() == "created":
            query = query.order_by(Task.created_at)
        else:
            # For any other value, default to created_at
            query = query.order_by(Task.created_at)
    else:
        # Default sorting if no sort parameter provided
        query = query.order_by(Task.created_at)

    tasks = session.exec(query).all()

    # Apply timezone conversion to each task's due_date before returning
    result = []
    for task in tasks:
        if task.due_date:
            task.due_date = convert_from_utc(task.due_date)
        result.append(task)

    return result


@router.post("/tasks")
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """
    Create a new task for the current user
    """
    # Convert due_date to UTC if it exists
    due_date_utc = convert_to_utc(task_data.due_date) if task_data.due_date else None

    # Create new task
    task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=current_user.id,  # Use the authenticated user's ID
        completed=task_data.completed,
        due_date=due_date_utc,
        category=task_data.category,
        priority=task_data.priority,
        tags=task_data.tags,
        is_recurring=task_data.is_recurring,
        recurring_rule=task_data.recurring_rule
    )

    session.add(task)
    session.commit()

    # Refresh only the necessary fields to improve performance
    session.refresh(task, attribute_names=['id', 'title', 'description', 'completed',
                                          'due_date', 'category', 'priority', 'tags',
                                          'is_recurring', 'recurring_rule', 'user_id',
                                          'created_at', 'updated_at'])

    # Apply timezone conversion to the task's due_date before returning
    if task.due_date:
        task.due_date = convert_from_utc(task.due_date)

    # Publish event to Dapr asynchronously to not block the response
    try:
        event_data = {
            "event_type": "created",
            "task_id": task.id,
            "task_title": task.title,
            "user_id": task.user_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        # Run the event publishing in a background task to not block the response
        from threading import Thread

        def publish_event_async():
            try:
                publish_event(event_data)
            except Exception as e:
                logger.error(f"Failed to publish task created event: {str(e)}")

        thread = Thread(target=publish_event_async, daemon=True)
        thread.start()
    except Exception as e:
        # Log the error but don't raise it to ensure API request still succeeds
        logger.error(f"Failed to publish task created event: {str(e)}")

    return task


@router.get("/tasks/{task_id}")
def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """
    Get details of a specific task
    """
    # Using session.get() is already efficient for fetching by primary key
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Verify that the task belongs to the user - fix type mismatch
    if str(task.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: access denied")

    # Apply timezone conversion to the task's due_date before returning
    if task.due_date:
        task.due_date = convert_from_utc(task.due_date)

    return task


@router.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """
    Update task fields including due_date, category, priority, tags, and recurring fields
    """
    # Use a single query to fetch the task with user verification
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Verify that the task belongs to the user - fix type mismatch
    if str(task.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: access denied")

    # Store original values for the event
    original_title = task.title

    # Update the task with provided values
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        # Handle timezone conversion for due_date
        if field == "due_date" and value is not None:
            value = convert_to_utc(value)
        setattr(task, field, value)

    # Update the updated_at timestamp
    task.updated_at = datetime.now()

    session.add(task)
    session.commit()

    # Refresh only the necessary fields to improve performance
    session.refresh(task, attribute_names=['id', 'title', 'description', 'completed',
                                          'due_date', 'category', 'priority', 'tags',
                                          'is_recurring', 'recurring_rule', 'user_id',
                                          'created_at', 'updated_at'])

    # Apply timezone conversion to the task's due_date before returning
    if task.due_date:
        task.due_date = convert_from_utc(task.due_date)

    # Publish event to Dapr asynchronously to not block the response
    try:
        event_data = {
            "event_type": "updated",
            "task_id": task.id,
            "task_title": task.title,
            "original_title": original_title,
            "user_id": task.user_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        # Run the event publishing in a background task to not block the response
        from threading import Thread

        def publish_event_async():
            try:
                publish_event(event_data)
            except Exception as e:
                logger.error(f"Failed to publish task updated event: {str(e)}")

        thread = Thread(target=publish_event_async, daemon=True)
        thread.start()
    except Exception as e:
        # Log the error but don't raise it to ensure API request still succeeds
        logger.error(f"Failed to publish task updated event: {str(e)}")

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
    # Get the task first to retrieve its details before deletion
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Verify that the task belongs to the user - fix type mismatch
    if str(task.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: access denied")

    # Store values for the event before deletion
    task_title = task.title
    user_id = task.user_id

    # Use a direct delete query for better performance
    session.delete(task)
    session.commit()

    # Publish event to Dapr asynchronously to not block the response
    try:
        event_data = {
            "event_type": "deleted",
            "task_id": task_id,
            "task_title": task_title,
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        # Run the event publishing in a background task to not block the response
        from threading import Thread

        def publish_event_async():
            try:
                publish_event(event_data)
            except Exception as e:
                logger.error(f"Failed to publish task deleted event: {str(e)}")

        thread = Thread(target=publish_event_async, daemon=True)
        thread.start()
    except Exception as e:
        # Log the error but don't raise it to ensure API request still succeeds
        logger.error(f"Failed to publish task deleted event: {str(e)}")

    return {"message": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/complete")
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

    # Store original completion status for the event
    original_completed_status = task.completed

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.now()

    session.add(task)
    session.commit()

    # Refresh only the necessary fields to improve performance
    session.refresh(task, attribute_names=['id', 'title', 'description', 'completed',
                                         'due_date', 'category', 'priority', 'tags',
                                         'is_recurring', 'recurring_rule', 'user_id',
                                         'created_at', 'updated_at'])

    logger.info(f"Successfully toggled task {task_id} completion status to {task.completed}")

    # Apply timezone conversion to the task's due_date before returning
    if task.due_date:
        task.due_date = convert_from_utc(task.due_date)

    # Publish event to Dapr asynchronously to not block the response
    try:
        event_data = {
            "event_type": "updated",
            "task_id": task.id,
            "task_title": task.title,
            "original_completed_status": original_completed_status,
            "new_completed_status": task.completed,
            "user_id": task.user_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        # Run the event publishing in a background task to not block the response
        from threading import Thread

        def publish_event_async():
            try:
                publish_event(event_data)
            except Exception as e:
                logger.error(f"Failed to publish task completion toggle event: {str(e)}")

        thread = Thread(target=publish_event_async, daemon=True)
        thread.start()
    except Exception as e:
        # Log the error but don't raise it to ensure API request still succeeds
        logger.error(f"Failed to publish task completion toggle event: {str(e)}")

    return task