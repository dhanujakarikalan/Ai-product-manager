from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.gemini_service import generate_structured_ai_response

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str
    database_context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    status: str
    prompt: str
    response: str

@router.post("/chat", response_model=ChatResponse)
def handle_chat_query(req: ChatRequest):
    """
    FastAPI endpoint for generating structured Gemini AI responses.
    """
    if not req.prompt or not req.prompt.trim():
        raise HTTPException(status_code=400, detail="Prompt string cannot be empty.")

    try:
        ai_reply = generate_structured_ai_response(req.prompt, req.database_context)
        return {
            "status": "success",
            "prompt": req.prompt,
            "response": ai_reply
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini AI processing error: {str(e)}")
