from pydantic import BaseModel

class Feedback(BaseModel):
    customer: str
    feedback: str