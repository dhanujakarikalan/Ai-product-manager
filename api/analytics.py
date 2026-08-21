from fastapi import APIRouter, HTTPException
from services import app_state

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/")
def get_analytics():

    # ==========================================
    # 1. CHECK DATASET
    # ==========================================

    if app_state.processed_df is None:

        raise HTTPException(
            status_code=400,
            detail="Please upload dataset first."
        )

    df = app_state.processed_df

    # ==========================================
    # 2. TOTAL FEEDBACK
    # ==========================================

    total_feedback = len(df)

    # ==========================================
    # 3. CATEGORY
    # ==========================================

    if "category" in df.columns:

        category_summary = (
            df["category"]
            .fillna("Unknown")
            .value_counts()
            .to_dict()
        )

    else:

        category_summary = {}

    # ==========================================
    # 4. SENTIMENT
    # ==========================================

    if "sentiment" in df.columns:

        sentiment_summary = (
            df["sentiment"]
            .fillna("Unknown")
            .value_counts()
            .to_dict()
        )

    else:

        sentiment_summary = {}

    # ==========================================
    # 5. THEME
    # ==========================================

    if "theme" in df.columns:

        theme_summary = (
            df["theme"]
            .fillna("Unknown")
            .value_counts()
            .to_dict()
        )

    else:

        theme_summary = {}

    # ==========================================
    # 6. PAIN POINT
    # ==========================================

    if "pain_point" in df.columns:

        pain_point_summary = (
            df["pain_point"]
            .fillna("Unknown")
            .value_counts()
            .to_dict()
        )

    else:

        pain_point_summary = {}

    # ==========================================
    # 7. FEATURE REQUEST
    # ==========================================

    if "feature_request" in df.columns:

        feature_request_summary = (
            df["feature_request"]
            .fillna("Unknown")
            .value_counts()
            .to_dict()
        )

    else:

        feature_request_summary = {}

    # ==========================================
    # 8. RETURN
    # ==========================================

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
            feature_request_summary
    }