from fastapi import APIRouter, HTTPException
from services import app_state


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/")
def get_analytics():

    # =====================================================
    # CHECK DATASET
    # =====================================================

    if app_state.processed_df is None:

        raise HTTPException(
            status_code=400,
            detail="Please upload dataset first."
        )

    df = app_state.processed_df

    # =====================================================
    # TOTAL FEEDBACK
    # =====================================================

    total_feedback = len(df)

    # =====================================================
    # CATEGORY SUMMARY
    # =====================================================

    if "category" in df.columns:

        category_summary = (
            df["category"]
            .fillna("Unknown")
            .replace("", "Unknown")
            .value_counts()
            .to_dict()
        )

    else:

        category_summary = {}

    # =====================================================
    # SENTIMENT SUMMARY
    # =====================================================

    if "sentiment" in df.columns:

        sentiment_summary = (
            df["sentiment"]
            .fillna("Unknown")
            .replace("", "Unknown")
            .value_counts()
            .to_dict()
        )

    else:

        sentiment_summary = {}

    # =====================================================
    # THEME SUMMARY
    # =====================================================

    if "theme" in df.columns:

        theme_summary = (
            df["theme"]
            .fillna("Unknown")
            .replace("", "Unknown")
            .value_counts()
            .to_dict()
        )

    else:

        theme_summary = {}

    # =====================================================
    # PAIN POINT SUMMARY
    # =====================================================

    if "pain_point" in df.columns:

        pain_point_summary = (
            df["pain_point"]
            .fillna("Unknown")
            .replace("", "Unknown")
            .value_counts()
            .to_dict()
        )

    else:

        pain_point_summary = {}

    # =====================================================
    # FEATURE REQUEST SUMMARY
    # =====================================================

    if "feature_request" in df.columns:

        feature_request_summary = (
            df["feature_request"]
            .fillna("Unknown")
            .replace("", "Unknown")
            .value_counts()
            .to_dict()
        )

    else:

        feature_request_summary = {}

    # =====================================================
    # TREND DATA
    # =====================================================

    trend_report = {}

    # ---------------- CATEGORY TREND ----------------

    if "category" in df.columns:

        trend_report["category_trends"] = (
            df["category"]
            .fillna("Unknown")
            .replace("", "Unknown")
            .value_counts()
            .reset_index()
            .rename(
                columns={
                    "category": "Category",
                    "count": "Count"
                }
            )
            .to_dict(orient="records")
        )

    else:

        trend_report["category_trends"] = []

    # ---------------- THEME TREND ----------------

    if "theme" in df.columns:

        trend_report["theme_trends"] = (
            df["theme"]
            .fillna("Unknown")
            .replace("", "Unknown")
            .value_counts()
            .reset_index()
            .rename(
                columns={
                    "theme": "Theme",
                    "count": "Count"
                }
            )
            .to_dict(orient="records")
        )

    else:

        trend_report["theme_trends"] = []

    # ---------------- PAIN POINT TREND ----------------

    if "pain_point" in df.columns:

        trend_report["pain_point_trends"] = (
            df["pain_point"]
            .fillna("Unknown")
            .replace("", "Unknown")
            .value_counts()
            .reset_index()
            .rename(
                columns={
                    "pain_point": "Pain Point",
                    "count": "Count"
                }
            )
            .to_dict(orient="records")
        )

    else:

        trend_report["pain_point_trends"] = []

    # ---------------- FEATURE REQUEST TREND ----------------

    if "feature_request" in df.columns:

        trend_report["feature_request_trends"] = (
            df["feature_request"]
            .fillna("Unknown")
            .replace("", "Unknown")
            .value_counts()
            .reset_index()
            .rename(
                columns={
                    "feature_request": "Feature",
                    "count": "Count"
                }
            )
            .to_dict(orient="records")
        )

    else:

        trend_report["feature_request_trends"] = []

    # ---------------- SENTIMENT TREND ----------------

    if "sentiment" in df.columns:

        trend_report["sentiment_trends"] = (
            df["sentiment"]
            .fillna("Unknown")
            .replace("", "Unknown")
            .value_counts()
            .reset_index()
            .rename(
                columns={
                    "sentiment": "Sentiment",
                    "count": "Count"
                }
            )
            .to_dict(orient="records")
        )

    else:

        trend_report["sentiment_trends"] = []

    # =====================================================
    # RETURN RESPONSE
    # =====================================================

    return {

        "status": "success",

        "total_feedback":
            total_feedback,

        "category_summary":
            category_summary,

        "sentiment_summary":
            sentiment_summary,

        "theme_summary":
            theme_summary,

        "pain_point_summary":
            pain_point_summary,

        "feature_request_summary":
            feature_request_summary,

        "trend_report":
            trend_report,

        # Frontend-friendly aliases
        "category_trends":
            trend_report["category_trends"],

        "theme_trends":
            trend_report["theme_trends"],

        "pain_point_trends":
            trend_report["pain_point_trends"],

        "feature_request_trends":
            trend_report["feature_request_trends"],

        "sentiment_trends":
            trend_report["sentiment_trends"]
    }