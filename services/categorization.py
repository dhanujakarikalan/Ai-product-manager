def categorize_feedback(feedback):

    feedback = feedback.lower()

    if "crash" in feedback or "bug" in feedback:
        return "Bug"

    elif "feature" in feedback:
        return "Feature Request"

    elif "slow" in feedback or "performance" in feedback:
        return "Performance"

    elif "good" in feedback or "excellent" in feedback:
        return "Praise"

    else:
        return "General Feedback"