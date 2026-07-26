from fastapi import FastAPI
from api.feedback import router as feedback_router
from api.upload import router as upload_router

app = FastAPI(title="AI Product Manager Copilot")

app.include_router(feedback_router, tags=["Feedback"])
app.include_router(upload_router, tags=["Upload"])

@app.get("/")
def home():
    return {
        "message": "Welcome to AI Product Manager Copilot Backend"
    }