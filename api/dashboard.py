# =========================================================
# api/dashboard.py
# DASHBOARD API
# =========================================================

import pandas as pd

from fastapi import APIRouter, HTTPException

from services import app_state


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    tags=["Dashboard"]
)


# =========================================================
# FIND COLUMN
# =========================================================

def find_column(df, possible_names):

    normalized_columns = {
        str(column).strip().lower(): column
        for column in df.columns
    }

    for name in possible_names:

        normalized_name = (
            str(name)
            .strip()
            .lower()
        )

        if normalized_name in normalized_columns:

            return normalized_columns[
                normalized_name
            ]

    return None


# =========================================================
# CLEAN COUNT DICTIONARY
# =========================================================

def get_counts(df, column_name, default_value="Unknown"):

    if not column_name:

        return {}

    values = (
        df[column_name]
        .fillna(default_value)
        .astype(str)
        .str.strip()
    )

    values = values[
        values != ""
    ]

    return {
        str(key): int(value)
        for key, value in (
            values
            .value_counts()
            .to_dict()
            .items()
        )
    }


# =========================================================
# GET SUMMARY FROM PIPELINE
# =========================================================

def get_pipeline_summary(keys):

    pipeline_result = (
        getattr(
            app_state,
            "pipeline_result",
            None
        )
        or {}
    )

    if not isinstance(
        pipeline_result,
        dict
    ):

        return {}

    for key in keys:

        value = pipeline_result.get(key)

        if isinstance(value, dict):

            for nested_key in (
                "category_distribution",
                "categorization_distribution",
                "theme_distribution",
                "sentiment_distribution",
                "distribution",
                "data"
            ):

                nested_value = value.get(nested_key)

                if isinstance(nested_value, dict):
                    return nested_value

            return value

    return {}


# =========================================================
# DASHBOARD
# =========================================================

@router.get("/dashboard")
def dashboard():

    # =====================================================
    # CHECK DATASET
    # =====================================================

    if app_state.processed_df is None:

        raise HTTPException(
            status_code=400,
            detail="Please upload a dataset first."
        )


    df = app_state.processed_df.copy()


    # =====================================================
    # TOTAL FEEDBACK
    # =====================================================

    total_feedback = int(
        len(df)
    )


    # =====================================================
    # FIND ACTUAL COLUMNS
    # =====================================================

    sentiment_column = find_column(
        df,
        [
            "sentiment",
            "sentiment_label",
            "sentiment analysis"
        ]
    )


    category_column = find_column(
        df,
        [
            "category",
            "categorization",
            "feedback_category"
        ]
    )


    theme_column = find_column(
        df,
        [
            "theme",
            "themes",
            "extracted_theme"
        ]
    )


    pain_point_column = find_column(
        df,
        [
            "pain_point",
            "pain point",
            "painpoint",
            "pain_points"
        ]
    )


    feature_request_column = find_column(
        df,
        [
            "feature_request",
            "feature request",
            "feature",
            "feature_requests"
        ]
    )


    date_column = find_column(
        df,
        [
            "date",
            "created_at",
            "createdat",
            "timestamp",
            "created",
            "time"
        ]
    )


    # =====================================================
    # DEFAULT VALUES
    # =====================================================

    positive_count = 0
    negative_count = 0
    neutral_count = 0


    categories = {}
    themes = {}
    pain_points = {}
    feature_requests = {}
    feedback_trend = []


    # =====================================================
    # SENTIMENT
    # =====================================================

    if sentiment_column:

        sentiment_series = (
            df[sentiment_column]
            .fillna("")
            .astype(str)
            .str.strip()
            .str.lower()
        )


        positive_count = int(
            sentiment_series.isin(
                ["positive", "positive feedback", "pos"]
            ).sum()
        )


        negative_count = int(
            sentiment_series.isin(
                ["negative", "negative feedback", "neg"]
            ).sum()
        )


        neutral_count = int(
            sentiment_series.isin(
                ["neutral", "neutral feedback", "neu"]
            ).sum()
        )

        if positive_count + negative_count + neutral_count == 0:
            pipeline_sentiment = get_pipeline_summary(
                ["sentiment_summary", "sentiment", "sentiment_analysis"]
            )
            positive_count = int(pipeline_sentiment.get("positive_feedback", 0) or 0)
            negative_count = int(pipeline_sentiment.get("negative_feedback", 0) or 0)
            neutral_count = int(pipeline_sentiment.get("neutral_feedback", 0) or 0)


    # =====================================================
    # FALLBACK SENTIMENT FROM PIPELINE RESULT
    # =====================================================

    if (
        positive_count == 0
        and negative_count == 0
        and neutral_count == 0
    ):

        sentiment_summary = (
            get_pipeline_summary(
                [
                    "sentiment_summary",
                    "sentiment",
                    "sentiment_analysis"
                ]
            )
        )


        positive_count = int(
            sentiment_summary.get(
                "Positive",
                sentiment_summary.get(
                    "positive",
                    sentiment_summary.get("positive_feedback", 0)
                )
            )
            or 0
        )


        negative_count = int(
            sentiment_summary.get(
                "Negative",
                sentiment_summary.get(
                    "negative",
                    sentiment_summary.get("negative_feedback", 0)
                )
            )
            or 0
        )


        neutral_count = int(
            sentiment_summary.get(
                "Neutral",
                sentiment_summary.get(
                    "neutral",
                    sentiment_summary.get("neutral_feedback", 0)
                )
            )
            or 0
        )


    # =====================================================
    # CATEGORIES
    # =====================================================

    categories = get_counts(
        df,
        category_column
    )


    if not categories:

        categories = (
            get_pipeline_summary(
                [
                    "categorization_summary",
                    "category_summary",
                    "categories"
                ]
            )
        )


    # =====================================================
    # THEMES
    # =====================================================

    themes = get_counts(
        df,
        theme_column,
        "General"
    )


    if not themes:

        themes = (
            get_pipeline_summary(
                [
                    "theme_summary",
                    "themes"
                ]
            )
        )


    # =====================================================
    # PAIN POINTS
    # =====================================================

    pain_points = get_counts(
        df,
        pain_point_column
    )


    if not pain_points:

        pain_points = (
            get_pipeline_summary(
                [
                    "pain_point_summary",
                    "pain_points"
                ]
            )
        )


    # =====================================================
    # FEATURE REQUESTS
    # =====================================================

    feature_requests = get_counts(
        df,
        feature_request_column
    )


    if not feature_requests:

        feature_requests = (
            get_pipeline_summary(
                [
                    "feature_request_summary",
                    "feature_requests"
                ]
            )
        )


        if (
            isinstance(
                feature_requests,
                dict
            )
            and "feature_request_distribution"
            in feature_requests
        ):

            feature_requests = (
                feature_requests[
                    "feature_request_distribution"
                ]
            )


    # =====================================================
    # FEEDBACK TREND
    # =====================================================

    if date_column:

        try:

            trend_df = df.copy()


            trend_df["_dashboard_date"] = (
                pd.to_datetime(
                    trend_df[date_column],
                    errors="coerce"
                )
            )


            trend_df = (
                trend_df
                .dropna(
                    subset=[
                        "_dashboard_date"
                    ]
                )
            )


            if not trend_df.empty:

                trend_df["_date_label"] = (
                    trend_df[
                        "_dashboard_date"
                    ]
                    .dt.strftime(
                        "%Y-%m-%d"
                    )
                )


                grouped = (
                    trend_df
                    .groupby(
                        "_date_label"
                    )
                    .size()
                    .reset_index(
                        name="count"
                    )
                )


                feedback_trend = [

                    {
                        "date":
                            str(
                                row[
                                    "_date_label"
                                ]
                            ),

                        "count":
                            int(
                                row[
                                    "count"
                                ]
                            )

                    }

                    for _, row
                    in grouped.iterrows()

                ]

        except Exception as error:

            print(
                "Feedback trend generation failed:",
                error
            )


    # =====================================================
    # FALLBACK TREND
    # =====================================================

    if not feedback_trend:

        pipeline_result = (
            getattr(
                app_state,
                "pipeline_result",
                None
            )
            or {}
        )


        trend_report = (
            pipeline_result.get(
                "trend_report",
                {}
            )
            if isinstance(
                pipeline_result,
                dict
            )
            else {}
        )


        if isinstance(
            trend_report,
            dict
        ):

            feedback_trend = (

                trend_report.get(
                    "feedback_trend"
                )

                or

                trend_report.get(
                    "monthly_feedback_trend"
                )

                or

                trend_report.get(
                    "trends"
                )

                or []

            )


    # =====================================================
    # THEME DISTRIBUTION
    # =====================================================

    theme_distribution = [

        {
            "name":
                str(name),

            "value":
                int(value),

            "count":
                int(value)

        }

        for name, value
        in themes.items()

    ]


    # =====================================================
    # TOP VALUES
    # =====================================================

    def get_top_value(data):

        if not data:

            return None, 0

        name, count = max(
            data.items(),
            key=lambda item: item[1]
        )

        return (
            str(name),
            int(count)
        )


    top_theme, top_theme_count = (
        get_top_value(
            themes
        )
    )


    (
        top_category,
        top_category_count
    ) = get_top_value(
        categories
    )


    (
        top_pain_point,
        top_pain_point_count
    ) = get_top_value(
        pain_points
    )


    (
        top_feature_request,
        top_feature_request_count
    ) = get_top_value(
        feature_requests
    )


    # =====================================================
    # DASHBOARD DATA
    # =====================================================

    dashboard_data = {

        "Total Feedback":
            total_feedback,

        "Positive Feedback":
            positive_count,

        "Negative Feedback":
            negative_count,

        "Neutral Feedback":
            neutral_count,

        "Categories":
            categories,

        "Themes":
            themes,

        "Pain Points":
            pain_points,

        "Feature Requests":
            feature_requests,

        "Feedback Trend":
            feedback_trend,

        "Theme Distribution":
            theme_distribution,

        "Product Insights": {

            "total_themes":
                len(themes),

            "top_theme":
                top_theme,

            "top_theme_count":
                top_theme_count,

            "top_category":
                top_category,

            "top_category_count":
                top_category_count,

            "top_pain_point":
                top_pain_point,

            "top_pain_point_count":
                top_pain_point_count,

            "top_feature_request":
                top_feature_request,

            "top_feature_request_count":
                top_feature_request_count

        }

    }


    # =====================================================
    # DEBUG
    # =====================================================

    print(
        "DASHBOARD SENTIMENT:",
        positive_count,
        negative_count,
        neutral_count
    )


    print(
        "DASHBOARD COLUMNS:",
        list(df.columns)
    )


    # =====================================================
    # RETURN
    # =====================================================

    return {

        "status":
            "success",

        "dashboard":
            dashboard_data

    }