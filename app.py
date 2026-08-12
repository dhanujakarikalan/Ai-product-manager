from fastapi import FastAPI


# =========================================================
# API ROUTERS
# =========================================================

from api.feedback import router as feedback_router
from api.upload import router as upload_router
from api.auth import router as auth_router

from api.analytics import router as analytics_router
from api.dashboard import router as dashboard_router

from api.prd import router as prd_router
from api.user_story import router as user_story_router

from api.task_assignment import router as task_assignment_router

from api.prioritization import router as prioritization_router
from api.product_chat import router as product_chat_router


# =========================================================
# DATABASE
# =========================================================

from database.database import Base, engine


# =========================================================
# DATABASE MODELS
# =========================================================

from models.user_model import User
from models.feedback_db import Feedback


# =========================================================
# CREATE DATABASE TABLES
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="AI Product Manager Copilot",

    description=(
        "AI-powered Product Management Copilot for "
        "customer feedback analysis, PRD generation, "
        "user story generation, task assignment, "
        "feature prioritization, analytics, "
        "dashboard insights, and product chat."
    ),

    version="1.0.0"
)


# =========================================================
# FEEDBACK
# =========================================================

app.include_router(
    feedback_router,
    tags=["Feedback"]
)


# =========================================================
# FILE UPLOAD
# =========================================================

app.include_router(
    upload_router,
    tags=["Upload"]
)


# =========================================================
# AUTHENTICATION
# =========================================================

app.include_router(
    auth_router,
    tags=["Authentication"]
)


# =========================================================
# ANALYTICS
# =========================================================

app.include_router(
    analytics_router,
    tags=["Analytics"]
)


# =========================================================
# DASHBOARD
# =========================================================

app.include_router(
    dashboard_router,
    tags=["Dashboard"]
)


# =========================================================
# PRD GENERATION
# =========================================================

app.include_router(
    prd_router,
    tags=["PRD Generation"]
)


# =========================================================
# USER STORY GENERATION
# =========================================================

app.include_router(
    user_story_router,
    tags=["User Story Generation"]
)


# =========================================================
# TASK ASSIGNMENT
# =========================================================

app.include_router(
    task_assignment_router,
    tags=["Task Assignment"]
)


# =========================================================
# FEATURE PRIORITIZATION
# =========================================================

app.include_router(
    prioritization_router,
    tags=["Feature Prioritization"]
)


# =========================================================
# PRODUCT CHAT
# =========================================================

app.include_router(
    product_chat_router,
    tags=["Product Chat"]
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "Welcome to AI Product Manager Copilot Backend",
        "status": "running",
        "version": "1.0.0"
    }