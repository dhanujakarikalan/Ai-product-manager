from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# =========================================================
# API ROUTERS
# =========================================================

from api.feedback import (
    router as feedback_router
)

from api.upload import (
    router as upload_router
)

from api.auth import (
    router as auth_router
)

from api.analytics import (
    router as analytics_router
)

from api.dashboard import (
    router as dashboard_router
)

from api.prd import (
    router as prd_router
)

from api.user_story import (
    router as user_story_router
)

from api.prioritization import (
    router as prioritization_router
)

from api.product_chat import (
    router as product_chat_router
)

from api.milestone4 import (
    router as milestone4_router
)


# =========================================================
# DATABASE
# =========================================================

from database.database import (
    Base,
    engine
)


# =========================================================
# DATABASE MODELS
# =========================================================

from models.user_model import User
from models.feedback_db import Feedback


# =========================================================
# CREATE DATABASE TABLES
# =========================================================

Base.metadata.create_all(
    bind=engine
)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(

    title="AI Product Manager Copilot",

    description=(
        "AI-powered Product Management Copilot for "
        "customer feedback analysis, analytics, "
        "RAG-based insights, PRD generation, "
        "user story generation, feature prioritization, "
        "roadmap planning, milestone recommendation, "
        "executive summary, product strategy, "
        "roadmap evaluation, and product chat."
    ),

    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================
#
# Frontend:
#   http://localhost:5173
#   http://127.0.0.1:5173
#
# Backend:
#   http://127.0.0.1:8001
#
# Without CORS, the browser blocks API requests even
# though the backend itself is running correctly.
# =========================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5173",

        "http://127.0.0.1:5173",

        "http://localhost:5174",

        "http://127.0.0.1:5174"

    ],

    allow_credentials=True,

    allow_methods=[

        "*"

    ],

    allow_headers=[

        "*"

    ]

)


# =========================================================
# FEEDBACK
# =========================================================

app.include_router(
    feedback_router
)


# =========================================================
# UPLOAD
# =========================================================

app.include_router(
    upload_router
)


# =========================================================
# AUTHENTICATION
# =========================================================

app.include_router(
    auth_router
)


# =========================================================
# ANALYTICS
# =========================================================

app.include_router(
    analytics_router
)


# =========================================================
# DASHBOARD
# =========================================================

app.include_router(
    dashboard_router
)


# =========================================================
# PRD
# =========================================================

app.include_router(
    prd_router
)


# =========================================================
# USER STORIES + WORK ITEMS
# =========================================================

app.include_router(
    user_story_router
)


# =========================================================
# FEATURE PRIORITIZATION
# =========================================================

app.include_router(
    prioritization_router
)


# =========================================================
# MILESTONE 4
#
# Feature Prioritization
#       ↓
# Roadmap
#       ↓
# Milestone Recommendation
#       ↓
# Executive Summary
#       ↓
# Product Strategy
#       ↓
# Evaluation
# =========================================================

app.include_router(
    milestone4_router
)


# =========================================================
# PRODUCT CHAT
# =========================================================

app.include_router(
    product_chat_router
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {

        "message":
            "Welcome to AI Product Manager Copilot Backend",

        "status":
            "running",

        "version":
            "1.0.0"

    }