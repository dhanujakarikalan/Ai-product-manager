from fastapi import APIRouter, HTTPException
import services.app_state as app_state


router = APIRouter(
    tags=["Dashboard"]
)


@router.get("/dashboard")
def dashboard():

    # ==================================================
    # CHECK DATASET
    # ==================================================

    if app_state.processed_df is None:

        raise HTTPException(
            status_code=400,
            detail="Please upload a dataset first."
        )


    df = app_state.processed_df


    # ==================================================
    # DASHBOARD DATA
    # ==================================================

    dashboard_data = {}


    # ==================================================
    # TOTAL FEEDBACK
    # ==================================================

    dashboard_data["Total Feedback"] = len(df)


    # ==================================================
    # SENTIMENT SUMMARY
    # ==================================================

    if "sentiment" in df.columns:

        dashboard_data["Positive Feedback"] = int(
            (df["sentiment"] == "Positive").sum()
        )

        dashboard_data["Negative Feedback"] = int(
            (df["sentiment"] == "Negative").sum()
        )

        dashboard_data["Neutral Feedback"] = int(
            (df["sentiment"] == "Neutral").sum()
        )


    # ==================================================
    # CATEGORIES
    # ==================================================

    if "category" in df.columns:

        dashboard_data["Categories"] = (
            df["category"]
            .value_counts()
            .to_dict()
        )


    # ==================================================
    # THEMES
    # ==================================================

    if "theme" in df.columns:

        dashboard_data["Themes"] = (
            df["theme"]
            .value_counts()
            .to_dict()
        )


    # ==================================================
    # PAIN POINTS
    # ==================================================

    if "pain_point" in df.columns:

        dashboard_data["Pain Points"] = (
            df["pain_point"]
            .value_counts()
            .to_dict()
        )


    # ==================================================
    # FEATURE REQUESTS
    # ==================================================

    if "feature_request" in df.columns:

        dashboard_data["Feature Requests"] = (
            df["feature_request"]
            .value_counts()
            .to_dict()
        )


    # ==================================================
    # RETURN
    # ==================================================

    return {
        "status": "success",
        "dashboard": dashboard_data
    }