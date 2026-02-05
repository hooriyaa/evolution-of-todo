from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
import os
from .db import engine
from .routes import tasks
from .routes.auth import router as auth_router
from .routes.chat import router as chat_router
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
        "http://localhost:3000",                    # Local testing
        "https://evolution-of-todo.vercel.app",     # Vercel Frontend
        "https://evolution-of-todo.onrender.com",   # Render Backend (Self)
        "http://104.40.93.29",                      # 👈 AZURE FRONTEND IP (Yeh zaroori hai!)
        "http://104.40.93.29:80"                    # (Safety ke liye port 80 bhi daal dein)
    ],
    allow_credentials=True,
    allow_methods=["*"],
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