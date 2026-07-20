from database.database import connection, cursor
from models.feedback_model import Feedback
from services.preprocessing import clean_text
from services.categorization import categorize_feedback

def add_feedback(data: Feedback):

    cleaned_feedback = clean_text(data.feedback)
    category = categorize_feedback(cleaned_feedback)

    cursor.execute(
        "INSERT INTO feedback (customer, feedback) VALUES (?, ?)",
        (data.customer, cleaned_feedback)
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