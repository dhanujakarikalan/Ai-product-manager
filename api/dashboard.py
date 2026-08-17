from fastapi import APIRouter, HTTPException
from api.upload import processed_df

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard")
def dashboard():

    if processed_df is None:
        raise HTTPException(
            status_code=400,
            detail="Please upload a dataset first."
        )

    df = processed_df

    dashboard_data = {}

    # Total Feedback
    dashboard_data["Total Feedback"] = len(df)

    # Sentiment Summary
    if "sentiment" in df.columns:
        dashboard_data["Positive Feedback"] = (
            df["sentiment"] == "Positive"
        ).sum()

        dashboard_data["Negative Feedback"] = (
            df["sentiment"] == "Negative"
        ).sum()

        dashboard_data["Neutral Feedback"] = (
            df["sentiment"] == "Neutral"
        ).sum()

    # Categories
    if "category" in df.columns:
        dashboard_data["Categories"] = (
            df["category"]
            .value_counts()
            .to_dict()
        )

    # Themes
    if "theme" in df.columns:
        dashboard_data["Themes"] = (
            df["theme"]
            .value_counts()
            .to_dict()
        )

    # Pain Points
    if "pain_point" in df.columns:
        dashboard_data["Pain Points"] = (
            df["pain_point"]
            .value_counts()
            .to_dict()
        )

    # Feature Requests
    if "feature_request" in df.columns:
        dashboard_data["Feature Requests"] = (
            df["feature_request"]
            .value_counts()
            .to_dict()
        )

    return dashboard_data