from pydantic import BaseModel
from typing import List


class PRDFeedback(BaseModel):
    feedback: str


class PRDRequest(BaseModel):
    feature: str
    feedback: List[PRDFeedback] = []


class PRDResponse(BaseModel):
    feature: str
    retrieved_feedback: list
    prd: str