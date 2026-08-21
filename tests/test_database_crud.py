from database.database import SessionLocal
from models.feedback_db import Feedback


def test_feedback_insert_and_read():

    db = SessionLocal()

    try:
        test_feedback = Feedback(
            customer="Test Customer",
            feedback="This is a PostgreSQL database test."
        )

        db.add(test_feedback)
        db.commit()
        db.refresh(test_feedback)

        assert test_feedback.id is not None

        saved_id = test_feedback.id

        result = (
            db.query(Feedback)
            .filter(Feedback.id == saved_id)
            .first()
        )

        assert result is not None
        assert result.customer == "Test Customer"
        assert result.feedback == "This is a PostgreSQL database test."

    finally:
        db.delete(test_feedback)
        db.commit()
        db.close()