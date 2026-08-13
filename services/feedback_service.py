from sqlalchemy.orm import Session

from database.database import SessionLocal
from models.feedback_db import Feedback as FeedbackDB
from models.feedback_model import Feedback

from services.preprocessing import TextPreprocessing
from services.categorization import FeedbackCategorization

preprocessor = TextPreprocessing()
categorizer = FeedbackCategorization()


def add_feedback(data: Feedback):

    db: Session = SessionLocal()

    try:
        processed_feedback = preprocessor.preprocess_text(data.feedback)

        category = categorizer.categorize_feedback(processed_feedback)

        feedback = FeedbackDB(
            customer=data.customer,
            feedback=processed_feedback
        )

        db.add(feedback)
        db.commit()
        db.refresh(feedback)

        return {
            "message": "Feedback saved successfully",
            "category": category
        }

    finally:
        db.close()


def get_all_feedback():

    db: Session = SessionLocal()

    try:
        feedbacks = db.query(FeedbackDB).all()

        result = []

        for item in feedbacks:
            result.append({
                "id": item.id,
                "customer": item.customer,
                "feedback": item.feedback
            })

        return result

    finally:
        db.close()