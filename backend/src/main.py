from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from sqlmodel import SQLModel
import os
from .db import engine
from .routes import tasks
from .routes.auth import router as auth_router

# Create the FastAPI app instance
app = FastAPI(
    title="Todo App API",
    description="Secure REST API for the Todo Web App using FastAPI and SQLModel",
    version="0.1.0"
)

# Add CORS middleware to allow requests from the frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
     allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include the auth router
app.include_router(auth_router)

# Include the tasks router
app.include_router(tasks.router)

# Create database tables
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo App API"}