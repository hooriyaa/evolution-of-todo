from sqlmodel import Session, select
from ..models import Task
from typing import List
from datetime import datetime
import re

def parse_natural_date(date_str: str) -> datetime:
    """
    Parse natural language date strings like 'tomorrow at 5pm', 'next Monday', etc.
    This is a simplified parser - in a production app you might want to use a library like dateparser
    """
    if not date_str:
        return None

    # Convert to lowercase for easier processing
    date_str = date_str.lower().strip()

    # Handle relative dates
    now = datetime.now()

    # Parse "tomorrow at 5pm" format
    tomorrow_match = re.search(r'tomorrow at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?', date_str)
    if tomorrow_match:
        hour = int(tomorrow_match.group(1))
        minute = int(tomorrow_match.group(2)) if tomorrow_match.group(2) else 0
        am_pm = tomorrow_match.group(3)

        if am_pm == 'pm' and hour != 12:
            hour += 12
        elif am_pm == 'am' and hour == 12:
            hour = 0

        # Tomorrow at the specified time
        return now.replace(day=now.day + 1, hour=hour, minute=minute, second=0, microsecond=0)

    # Parse "today at 5pm" format
    today_match = re.search(r'today at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?', date_str)
    if today_match:
        hour = int(today_match.group(1))
        minute = int(today_match.group(2)) if today_match.group(2) else 0
        am_pm = today_match.group(3)

        if am_pm == 'pm' and hour != 12:
            hour += 12
        elif am_pm == 'am' and hour == 12:
            hour = 0

        return now.replace(hour=hour, minute=minute, second=0, microsecond=0)

    # Parse "MM/DD/YYYY HH:MM AM/PM" format (e.g., "1/9/2026 09:48 AM")
    date_match = re.search(r'(\d{1,2})/(\d{1,2})/(\d{4})\s+(\d{1,2}):(\d{2})\s*(am|pm)', date_str)
    if date_match:
        month = int(date_match.group(1))
        day = int(date_match.group(2))
        year = int(date_match.group(3))
        hour = int(date_match.group(4))
        minute = int(date_match.group(5))
        am_pm = date_match.group(6)

        if am_pm == 'pm' and hour != 12:
            hour += 12
        elif am_pm == 'am' and hour == 12:
            hour = 0

        try:
            return datetime(year, month, day, hour, minute)
        except ValueError:
            # If the date is invalid (e.g., Feb 30), return None
            pass

    # For other cases, try to parse as ISO format or return None
    try:
        # Try parsing as ISO format if it looks like a date
        if 't' in date_str:  # Likely ISO format
            # Parse as naive datetime (without timezone) to preserve the user's intended time
            # Remove timezone info if present to avoid conversion
            dt = datetime.fromisoformat(date_str.replace('z', '').replace('Z', ''))
            return dt
    except ValueError:
        pass

    # Handle the format from frontend (YYYY-MM-DD HH:MM:SS)
    try:
        # Format is like "2025-12-30 14:30:00"
        if '-' in date_str and len(date_str) == 19 and date_str.count(':') == 2:
            dt = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
            return dt
    except ValueError:
        pass

    # If we can't parse it, return None
    return None

def add_task(session: Session, user_id: int, title: str, description: str = None, due_date: str = None, category: str = None) -> Task:
    """Add a new task to the user's task list"""
    # Parse the due date if provided
    parsed_due_date = None
    if due_date:
        parsed_due_date = parse_natural_date(due_date)
        if parsed_due_date is None:
            # If parsing failed, try to parse as ISO format directly
            try:
                parsed_due_date = datetime.fromisoformat(due_date.replace('z', '+00:00'))
            except ValueError:
                # If still can't parse, ignore the due date
                pass

    task = Task(
        user_id=user_id,
        title=title,
        description=description,
        due_date=parsed_due_date,
        category=category,
        completed=False
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def list_tasks(session: Session, user_id: int, completed: bool = None) -> List[Task]:
    """List tasks for a user with optional filtering by completion status"""
    query = select(Task).where(Task.user_id == user_id)

    if completed is not None:
        query = query.where(Task.completed == completed)

    return session.exec(query).all()

def delete_task(session: Session, task_id: int, user_id: int) -> bool:
    """Delete a task by ID for the specified user"""
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()

    if task:
        session.delete(task)
        session.commit()
        return True
    return False

def complete_task(session: Session, title: str, user_id: int) -> str:
    """Mark a task as completed by title for the specified user"""
    # Query for a task with the given title and user_id (case-insensitive)
    task = session.exec(
        select(Task).where(
            Task.user_id == user_id,
            Task.title.ilike(f'%{title}%')  # Case-insensitive partial match
        )
    ).first()

    if task:
        task.completed = True
        session.add(task)
        session.commit()
        return f"Task '{task.title}' marked as completed! ✅"
    else:
        return "Task not found."