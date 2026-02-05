from sqlmodel import create_engine
from sqlalchemy.pool import QueuePool
import os
from typing import Generator

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todoapp.db")

# Create the engine with optimized settings for better performance
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to False in production to avoid logging all SQL queries
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,  # Recycle connections after 5 minutes
    pool_size=20,  # Number of connection objects to maintain
    max_overflow=30,  # Additional connections beyond pool_size
    poolclass=QueuePool
)

def get_db():
    from sqlmodel import Session
    with Session(engine) as session:
        yield session

# Alias for compatibility
get_session = get_db