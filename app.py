from fastapi import FastAPI
from api.feedback import router

app = FastAPI(title="AI Product Manager Copilot")

app.include_router(router)

@app.get("/")
def home():
    return {
        "message": "Welcome to AI Product Manager Copilot Backend"
    }