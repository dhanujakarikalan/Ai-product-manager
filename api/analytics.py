from fastapi import APIRouter, HTTPException
import services.app_state as app_state

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


def get_dataframe():

    if app_state.processed_df is None:
        raise HTTPException(
            status_code=400,
            detail="Please upload a dataset first."
        )

    return app_state.processed_df


# ==================================================
# CATEGORIES
# ==================================================

@router.get("/categories")
def categories():

    df = get_dataframe()

    if "category" not in df.columns:
        return {
            "message": "Category column not found"
        }

    return {
        "categories": df["category"]
        .value_counts()
        .to_dict()
    }


# ==================================================
# THEMES
# ==================================================

@router.get("/themes")
def themes():

    df = get_dataframe()

    if "theme" not in df.columns:
        return {
            "message": "Theme column not found"
        }

    return {
        "themes": df["theme"]
        .value_counts()
        .to_dict()
    }


# ==================================================
# SENTIMENTS
# ==================================================

@router.get("/sentiments")
def sentiments():

    df = get_dataframe()

    if "sentiment" not in df.columns:
        return {
            "message": "Sentiment column not found"
        }

    return {
        "sentiments": df["sentiment"]
        .value_counts()
        .to_dict()
    }


# ==================================================
# PAIN POINTS
# ==================================================

@router.get("/pain-points")
def pain_points():

    df = get_dataframe()

    if "pain_point" not in df.columns:
        return {
            "message": "Pain Point column not found"
        }

    return {
        "pain_points": df["pain_point"]
        .value_counts()
        .to_dict()
    }


# ==================================================
# FEATURE REQUESTS
# ==================================================

@router.get("/feature-requests")
def feature_requests():

    df = get_dataframe()

    if "feature_request" not in df.columns:
        return {
            "message": "Feature Request column not found"
        }

    return {
        "feature_requests": df["feature_request"]
        .value_counts()
        .to_dict()
    }


# ==================================================
# TRENDS
# ==================================================

@router.get("/trends")
def trends():

    df = get_dataframe()

    if "date" not in df.columns:
        return {
            "message": "Date column not found"
        }

    trend = (
        df.groupby("date")
        .size()
        .reset_index(name="count")
    )

    return {
        "trends": trend.to_dict(
            orient="records"
        )
    }