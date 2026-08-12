from pydantic import BaseModel
from typing import List


class ChatMessage(BaseModel):

    role: str
    content: str


class ChatRequest(BaseModel):

    question: str
    conversation_history: List[ChatMessage] = []


class ChatResponse(BaseModel):

    question: str
    answer: str
    sources: List[str] = []