from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, select
import os
from .db import engine
from .routes import tasks
from .routes.auth import router as auth_router
from .routes.chat import router as chat_router
from .models import Task
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Todo App API",
    description="Secure REST API for the Todo Web App using FastAPI and SQLModel",
    version="0.1.0"
)


# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",                    # Localhost (Testing ke liye)
        "https://evolution-of-todo.vercel.app",     # ✅ Vercel Frontend 
        "https://evolution-of-todo.onrender.com",   # Render Backend (Self)
        "http://104.40.93.29",                      # ✅ Azure Frontend
        "http://104.40.93.29:80"                  
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, DELETE sab allow
    allow_headers=["*"],
)
# === ROUTERS REGISTRATION ===
# Auth Router
app.include_router(auth_router)

# Task Router
app.include_router(tasks.router)

# Chat Router (FIXED: Added Prefix Here)
app.include_router(chat_router, prefix="/api/v1", tags=["chat"])

# Database Startup Event
@app.on_event("startup")
def on_startup():
    logger.info("Starting up the application...")
    try:
        # Temporarily fix the enum case issue before loading models
        from sqlmodel import text
        with engine.connect() as connection:
            # Fix the priority case issue
            connection.execute(text("UPDATE task SET priority = LOWER(priority) WHERE priority IN ('Medium', 'High', 'Low');"))
            # Fix the default value
            connection.execute(text("ALTER TABLE task ALTER COLUMN priority SET DEFAULT 'medium';"))
            # Fix NULL categories
            connection.execute(text("UPDATE task SET category = 'General' WHERE category IS NULL OR category = '';"))
            connection.commit()

        SQLModel.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        # Don't raise here in dev to avoid crash loops, just log
        pass

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo App API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Server is running"}


@app.get("/fix-db-schema")
def fix_db_schema():
    """
    Temporary endpoint to fix database schema by adding missing columns to the task table.
    This endpoint should be removed after the schema is fixed.
    """
    from sqlmodel import text

    # Define the SQL commands to add missing columns if they don't exist
    alter_statements = [
        "ALTER TABLE task ADD COLUMN IF NOT EXISTS priority VARCHAR DEFAULT 'Medium';",
        "ALTER TABLE task ADD COLUMN IF NOT EXISTS tags VARCHAR;",
        "ALTER TABLE task ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;",
        "ALTER TABLE task ADD COLUMN IF NOT EXISTS recurring_rule VARCHAR;",
        "ALTER TABLE task ADD COLUMN IF NOT EXISTS category VARCHAR DEFAULT 'General';"
    ]

    try:
        with engine.connect() as connection:
            for statement in alter_statements:
                connection.execute(text(statement))
            connection.commit()

        return {
            "status": "success",
            "message": "Database schema updated successfully",
            "details": {
                "columns_added": [
                    "priority (VARCHAR, Default 'Medium')",
                    "tags (VARCHAR, Nullable)",
                    "is_recurring (BOOLEAN, Default False)",
                    "recurring_rule (VARCHAR, Nullable)",
                    "category (VARCHAR, Default 'General')"
                ]
            }
        }
    except Exception as e:
        logger.error(f"Error updating database schema: {e}")
        return {"status": "error", "message": str(e)}


@app.get("/add-indexes")
def add_indexes():
    """
    Temporary endpoint to add database indexes for improved performance.
    This endpoint should be removed after the indexes are added.
    """
    from sqlmodel import text

    # Define the SQL commands to add indexes if they don't exist
    index_statements = [
        "CREATE INDEX IF NOT EXISTS idx_task_user_id ON task(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_task_completed ON task(completed);",
        "CREATE INDEX IF NOT EXISTS idx_task_due_date ON task(due_date);",
        "CREATE INDEX IF NOT EXISTS idx_task_category ON task(category);",
        "CREATE INDEX IF NOT EXISTS idx_task_priority ON task(priority);",
        "CREATE INDEX IF NOT EXISTS idx_task_created_at ON task(created_at);",
        "CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);"
    ]

    try:
        with engine.connect() as connection:
            for statement in index_statements:
                connection.execute(text(statement))
            connection.commit()

        return {
            "status": "success",
            "message": "Database indexes added successfully",
            "details": {
                "indexes_added": [
                    "idx_task_user_id (on user_id)",
                    "idx_task_completed (on completed)",
                    "idx_task_due_date (on due_date)",
                    "idx_task_category (on category)",
                    "idx_task_priority (on priority)",
                    "idx_task_created_at (on created_at)",
                    "idx_user_email (on email)"
                ]
            }
        }
    except Exception as e:
        logger.error(f"Error adding database indexes: {e}")
        return {"status": "error", "message": str(e)}


@app.get("/fix-priority-case")
def fix_priority_case():
    """
    Temporary endpoint to fix priority case issues in the database.
    This endpoint should be removed after the priority cases are fixed.
    """
    from sqlmodel import text

    try:
        with engine.connect() as connection:
            # Fix the priority case issue
            connection.execute(text("UPDATE task SET priority = LOWER(priority) WHERE priority IN ('Medium', 'High', 'Low');"))
            # Fix the default value
            connection.execute(text("ALTER TABLE task ALTER COLUMN priority SET DEFAULT 'medium';"))
            # Fix NULL categories
            connection.execute(text("UPDATE task SET category = 'General' WHERE category IS NULL OR category = '';"))
            connection.commit()

        return {
            "status": "success",
            "message": "Priority cases fixed successfully",
            "details": {
                "updates_applied": [
                    "Converted all priority values to lowercase",
                    "Set default priority to 'medium'",
                    "Set NULL categories to 'General'"
                ]
            }
        }
    except Exception as e:
        logger.error(f"Error fixing priority cases: {e}")
        return {"status": "error", "message": str(e)}


@app.get("/fix-timezone-data")
def fix_timezone_data():
    """
    Temporary endpoint to fix timezone issues in existing task due dates.
    This endpoint should be removed after the timezone data is fixed.
    """
    from sqlmodel import Session
    import pytz

    try:
        with Session(engine) as session:
            # Get all tasks with due dates
            tasks = session.exec(select(Task).where(Task.due_date.is_not(None))).all()

            updated_count = 0
            for task in tasks:
                # If the due date is naive (no timezone), assume it's in the user's local timezone
                # and convert it to UTC for storage
                if task.due_date and task.due_date.tzinfo is None:
                    # Assuming the local timezone is Pakistan Standard Time (PKT)
                    local_tz = pytz.timezone('Asia/Karachi')
                    local_dt = local_tz.localize(task.due_date)

                    # Convert to UTC
                    utc_dt = local_dt.astimezone(pytz.UTC)

                    # Update the task with the timezone-aware datetime
                    task.due_date = utc_dt
                    updated_count += 1

            session.commit()

        return {
            "status": "success",
            "message": f"Timezone data fixed for {updated_count} tasks",
            "details": {
                "tasks_updated": updated_count
            }
        }
    except ImportError:
        # If pytz is not available, return an error message
        return {
            "status": "error",
            "message": "pytz module not available. Please ensure it's installed.",
            "details": {
                "tasks_processed": 0
            }
        }
    except Exception as e:
        logger.error(f"Error fixing timezone data: {e}")
        return {"status": "error", "message": str(e)}