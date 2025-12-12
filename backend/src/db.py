from sqlmodel import create_engine
import os
from typing import Generator

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todoapp.db")

# Create the engine
engine = create_engine(DATABASE_URL, echo=True)

def get_db():
    from sqlmodel import Session
    with Session(engine) as session:
        yield session

# Alias for compatibility
get_session = get_db