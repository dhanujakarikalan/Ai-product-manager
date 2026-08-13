from fastapi import APIRouter
from models.feedback_model import Feedback
from services.feedback_service import add_feedback, get_all_feedback

router = APIRouter()

@router.post("/feedback")
def create_feedback(data: Feedback):
    return add_feedback(data)

@router.get("/feedback")
def read_feedback():
    return get_all_feedback()