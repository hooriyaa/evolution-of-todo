from sqlmodel import SQLModel, Session, select
from .models import User
from .db import engine
from passlib.context import CryptContext

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_database():
    """
    Seeds the database with initial data, specifically ensuring User ID 1 exists.
    """
    print("Starting database seeding...")
    
    # Create tables if they don't exist
    SQLModel.metadata.create_all(bind=engine)
    
    # Create a session
    with Session(engine) as session:
        # Check if user with ID 1 already exists
        existing_user = session.get(User, 1)
        
        if existing_user:
            print("User ID 1 already exists. No seeding needed.")
            return
        
        # Create a dummy user with ID 1
        hashed_password = get_password_hash("password123")  # Default password for test user
        user = User(
            id=1,
            email="test@example.com",
            name="Test User",
            hashed_password=hashed_password
        )
        
        session.add(user)
        session.commit()
        session.refresh(user)
        
        print(f"Successfully created user: ID {user.id}, Email: {user.email}, Name: {user.name}")

if __name__ == "__main__":
    seed_database()