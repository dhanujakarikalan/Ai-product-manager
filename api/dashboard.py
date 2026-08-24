# =========================================================
# api/dashboard.py
# DASHBOARD API
# =========================================================

from fastapi import APIRouter, HTTPException

from services import app_state


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    tags=["Dashboard"]
)


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


    df = app_state.processed_df


    # =====================================================
    # BASIC INFORMATION
    # =====================================================

    total_feedback = int(
        len(df)
    )


    # =====================================================
    # DASHBOARD DATA
    # =====================================================

    dashboard_data = {

        "Total Feedback":
            total_feedback,

        "Positive Feedback":
            0,

        "Negative Feedback":
            0,

        "Neutral Feedback":
            0,

        "Categories":
            {},

        "Themes":
            {},

        "Pain Points":
            {},

        "Feature Requests":
            {},

        "Feedback Trend":
            [],

        "Theme Distribution":
            [],

        "Product Insights":
            {}

    }


    # =====================================================
    # SENTIMENT
    # =====================================================

    if "sentiment" in df.columns:

        sentiment_series = (
            df["sentiment"]
            .fillna("Unknown")
            .astype(str)
            .str.strip()
        )


        dashboard_data[
            "Positive Feedback"
        ] = int(
            (
                sentiment_series.str.lower()
                == "positive"
            ).sum()
        )


        dashboard_data[
            "Negative Feedback"
        ] = int(
            (
                sentiment_series.str.lower()
                == "negative"
            ).sum()
        )


        dashboard_data[
            "Neutral Feedback"
        ] = int(
            (
                sentiment_series.str.lower()
                == "neutral"
            ).sum()
        )


    # =====================================================
    # CATEGORY DISTRIBUTION
    # =====================================================

    if "category" in df.columns:

        categories = (
            df["category"]
            .fillna("Unknown")
            .astype(str)
            .str.strip()
        )


        categories = categories[
            categories != ""
        ]


        dashboard_data[
            "Categories"
        ] = (
            categories
            .value_counts()
            .to_dict()
        )


    # =====================================================
    # THEME DISTRIBUTION
    # =====================================================

    if "theme" in df.columns:

        themes = (
            df["theme"]
            .fillna("General")
            .astype(str)
            .str.strip()
        )


        themes = themes[
            themes != ""
        ]


        theme_counts = (
            themes
            .value_counts()
            .to_dict()
        )


        dashboard_data[
            "Themes"
        ] = theme_counts


        # -----------------------------------------------
        # Frontend-friendly theme distribution
        # -----------------------------------------------

        dashboard_data[
            "Theme Distribution"
        ] = [

            {
                "name":
                    name,

                "value":
                    int(value),

                "count":
                    int(value)

            }

            for name, value
            in theme_counts.items()

        ]


    # =====================================================
    # PAIN POINTS
    # =====================================================

    if "pain_point" in df.columns:

        pain_points = (
            df["pain_point"]
            .fillna("Unknown")
            .astype(str)
            .str.strip()
        )


        pain_points = pain_points[
            pain_points != ""
        ]


        dashboard_data[
            "Pain Points"
        ] = (
            pain_points
            .value_counts()
            .to_dict()
        )


    # =====================================================
    # FEATURE REQUESTS
    # =====================================================

    if "feature_request" in df.columns:

        feature_requests = (
            df["feature_request"]
            .fillna("Unknown")
            .astype(str)
            .str.strip()
        )


        feature_requests = feature_requests[
            feature_requests != ""
        ]


        dashboard_data[
            "Feature Requests"
        ] = (
            feature_requests
            .value_counts()
            .to_dict()
        )


    # =====================================================
    # FEEDBACK TREND
    # =====================================================
    #
    # Try to identify a date column from the processed
    # dataframe.
    #
    # This prevents the frontend chart from always
    # receiving an empty array.
    #
    # =====================================================

    date_column = None


    possible_date_columns = [

        "date",

        "Date",

        "created_at",

        "createdAt",

        "timestamp",

        "Timestamp",

        "created",

        "time"

    ]


    for column in possible_date_columns:

        if column in df.columns:

            date_column = column

            break


    # =====================================================
    # BUILD DATE TREND
    # =====================================================

    if date_column:

        try:

            trend_df = df.copy()


            trend_df[
                "_dashboard_date"
            ] = pd.to_datetime(
                trend_df[date_column],
                errors="coerce"
            )


            trend_df = trend_df.dropna(
                subset=[
                    "_dashboard_date"
                ]
            )


            if not trend_df.empty:

                trend_df[
                    "_date_label"
                ] = (
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


                dashboard_data[
                    "Feedback Trend"
                ] = [

                    {
                        "date":
                            str(row[
                                "_date_label"
                            ]),

                        "count":
                            int(row[
                                "count"
                            ])

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
    #
    # If the dataset does not contain a usable date
    # column, use the trend service result if available.
    #
    # =====================================================

    if not dashboard_data[
        "Feedback Trend"
    ]:

        try:

            pipeline_result = (
                app_state.pipeline_result
                or {}
            )


            trend_report = (
                pipeline_result.get(
                    "trend_report",
                    {}
                )
            )


            if isinstance(
                trend_report,
                dict
            ):

                possible_trend = (

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


                if isinstance(
                    possible_trend,
                    list
                ):

                    dashboard_data[
                        "Feedback Trend"
                    ] = (
                        possible_trend
                    )

        except Exception as error:

            print(
                "Trend fallback failed:",
                error
            )


    # =====================================================
    # PRODUCT INSIGHTS
    # =====================================================

    themes_dict = dashboard_data[
        "Themes"
    ]


    categories_dict = dashboard_data[
        "Categories"
    ]


    pain_points_dict = dashboard_data[
        "Pain Points"
    ]


    feature_requests_dict = dashboard_data[
        "Feature Requests"
    ]


    # -----------------------------------------------
    # Top theme
    # -----------------------------------------------

    top_theme = None

    if themes_dict:

        top_theme = max(
            themes_dict.items(),
            key=lambda item: item[1]
        )


    # -----------------------------------------------
    # Top category
    # -----------------------------------------------

    top_category = None

    if categories_dict:

        top_category = max(
            categories_dict.items(),
            key=lambda item: item[1]
        )


    # -----------------------------------------------
    # Top pain point
    # -----------------------------------------------

    top_pain_point = None

    if pain_points_dict:

        top_pain_point = max(
            pain_points_dict.items(),
            key=lambda item: item[1]
        )


    # -----------------------------------------------
    # Top feature request
    # -----------------------------------------------

    top_feature_request = None

    if feature_requests_dict:

        top_feature_request = max(
            feature_requests_dict.items(),
            key=lambda item: item[1]
        )


    dashboard_data[
        "Product Insights"
    ] = {

        "total_themes":
            len(themes_dict),

        "top_theme":
            (
                top_theme[0]
                if top_theme
                else None
            ),

        "top_theme_count":
            (
                int(top_theme[1])
                if top_theme
                else 0
            ),

        "top_category":
            (
                top_category[0]
                if top_category
                else None
            ),

        "top_category_count":
            (
                int(top_category[1])
                if top_category
                else 0
            ),

        "top_pain_point":
            (
                top_pain_point[0]
                if top_pain_point
                else None
            ),

        "top_pain_point_count":
            (
                int(top_pain_point[1])
                if top_pain_point
                else 0
            ),

        "top_feature_request":
            (
                top_feature_request[0]
                if top_feature_request
                else None
            ),

        "top_feature_request_count":
            (
                int(
                    top_feature_request[1]
                )
                if top_feature_request
                else 0
            )

    }


    # =====================================================
    # RETURN RESPONSE
    # =====================================================

    return {

        "status":
            "success",

        "dashboard":
            dashboard_data

    }