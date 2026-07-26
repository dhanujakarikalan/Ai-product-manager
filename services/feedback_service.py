from database.database import connection, cursor
from models.feedback_model import Feedback

from services.preprocessing import TextPreprocessing
from services.categorization import FeedbackCategorization

# Create objects
preprocessor = TextPreprocessing()
categorizer = FeedbackCategorization()


def add_feedback(data: Feedback):

    # Preprocess feedback
    processed_feedback = preprocessor.preprocess_text(data.feedback)

    # Categorize feedback
    category = categorizer.categorize_feedback(processed_feedback)

    # Save to database
    cursor.execute(
        """
        INSERT INTO feedback (customer, feedback)
        VALUES (?, ?)
        """,
        (
            data.customer,
            processed_feedback
        )
    )

    connection.commit()

    return {
        "message": "Feedback saved successfully",
        "category": category
    }


def get_all_feedback():

    cursor.execute("SELECT * FROM feedback")

    rows = cursor.fetchall()

    result = []

    for row in rows:
        result.append({
            "id": row[0],
            "customer": row[1],
            "feedback": row[2]
        })

    return result