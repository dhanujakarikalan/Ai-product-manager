from fastapi import APIRouter, HTTPException
from services import app_state


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


def find_column(df, possible_names):

    normalized_columns = {
        str(column).strip().lower(): column
        for column in df.columns
    }

    for name in possible_names:

        column = normalized_columns.get(str(name).strip().lower())

        if column:
            return column

    return None


def get_counts(df, column_name):

    if not column_name:
        return {}

    values = (
        df[column_name]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )

    values = values[values != ""]

    return {
        str(key): int(value)
        for key, value in values.value_counts().to_dict().items()
    }


@router.get("/")
def get_analytics():

    print("\n========== ANALYTICS API ==========")
    print("Dataset uploaded:", app_state.dataset_uploaded)
    print("Processed dataframe exists:", app_state.processed_df is not None)

    if app_state.processed_df is None:

        print("ERROR: No dataframe found")
        print("===================================\n")

        raise HTTPException(
            status_code=400,
            detail="Please upload a dataset first."
        )

    df = app_state.processed_df

    print("Total rows:", len(df))
    print("Columns:", df.columns.tolist())
    print("===================================\n")


    total_feedback = int(len(df))


    # CATEGORY SUMMARY

    category_summary = get_counts(
        df,
        find_column(df, ["category", "categorization", "feedback_category"])
    )


    # SENTIMENT SUMMARY

    sentiment_summary = get_counts(
        df,
        find_column(df, ["sentiment", "sentiment_label", "sentiment analysis"])
    )


    # THEME SUMMARY

    theme_summary = get_counts(
        df,
        find_column(df, ["theme", "themes", "extracted_theme"])
    )


    # PAIN POINT SUMMARY

    pain_point_summary = get_counts(
        df,
        find_column(df, ["pain_point", "pain point", "painpoint", "pain_points"])
    )


    # FEATURE REQUEST SUMMARY

    feature_request_summary = get_counts(
        df,
        find_column(df, ["feature_request", "feature request", "feature", "feature_requests"])
    )


    # CATEGORY TRENDS

    category_trends = []

    if category_summary:

        category_trends = [
            {
                "Category": str(name),
                "Count": int(count)
            }
            for name, count in category_summary.items()
        ]


    # THEME TRENDS

    theme_trends = []

    if theme_summary:

        theme_trends = [
            {
                "Theme": str(name),
                "Count": int(count)
            }
            for name, count in theme_summary.items()
        ]


    # PAIN POINT TRENDS

    pain_point_trends = []

    if pain_point_summary:

        pain_point_trends = [
            {
                "Pain Point": str(name),
                "Count": int(count)
            }
            for name, count in pain_point_summary.items()
        ]


    # FEATURE REQUEST TRENDS

    feature_request_trends = []

    if feature_request_summary:

        feature_request_trends = [
            {
                "Feature": str(name),
                "Count": int(count)
            }
            for name, count in feature_request_summary.items()
        ]


    # SENTIMENT TRENDS

    sentiment_trends = []

    if sentiment_summary:

        sentiment_trends = [
            {
                "Sentiment": str(name),
                "Count": int(count)
            }
            for name, count in sentiment_summary.items()
        ]


    return {

        "status": "success",

        "total_feedback": total_feedback,

        "category_summary": category_summary,

        "sentiment_summary": sentiment_summary,

        "theme_summary": theme_summary,

        "pain_point_summary": pain_point_summary,

        "feature_request_summary": feature_request_summary,

        "trend_report": {

            "category_trends": category_trends,

            "theme_trends": theme_trends,

            "pain_point_trends": pain_point_trends,

            "feature_request_trends": feature_request_trends,

            "sentiment_trends": sentiment_trends

        },

        "category_trends": category_trends,

        "theme_trends": theme_trends,

        "pain_point_trends": pain_point_trends,

        "feature_request_trends": feature_request_trends,

        "sentiment_trends": sentiment_trends

    }