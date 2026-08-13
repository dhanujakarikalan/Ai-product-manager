from fastapi import FastAPI

# Import Routers
from api.feedback import router as feedback_router
from api.upload import router as upload_router
from api.auth import router as auth_router

# Import Database
from database.database import Base, engine

# Import SQLAlchemy Models
from models.user_model import User
from models.feedback_db import Feedback

# Create Database Tables
Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Product Manager Copilot",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(feedback_router, tags=["Feedback"])
app.include_router(upload_router, tags=["Upload"])
app.include_router(auth_router, tags=["Authentication"])


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Product Manager Copilot Backend"
    }