# =========================================================
# services/trend_analysis.py
# TREND ANALYSIS SERVICE
# =========================================================

import pandas as pd


class TrendAnalysis:

    # =====================================================
    # FIND DATE COLUMN
    # =====================================================

    def _find_date_column(self, df):

        possible_columns = [

            "date",
            "Date",
            "created_at",
            "createdAt",
            "timestamp",
            "Timestamp",
            "created_date",
            "feedback_date",
            "submitted_at"

        ]

        for column in possible_columns:

            if column in df.columns:

                return column

        return None


    # =====================================================
    # PREPARE DATE DATA
    # =====================================================

    def _prepare_date_column(self, df):

        date_column = self._find_date_column(df)

        if date_column is None:

            return None, None

        dates = pd.to_datetime(
            df[date_column],
            errors="coerce"
        )

        valid_dates = dates.notna()

        if not valid_dates.any():

            return None, None

        working_df = df.loc[
            valid_dates
        ].copy()

        working_df["_trend_date"] = dates.loc[
            valid_dates
        ]

        return (
            working_df,
            "_trend_date"
        )


    # =====================================================
    # INCOMING FEEDBACK TREND
    # =====================================================

    def feedback_trend(self, df):

        if df is None or df.empty:

            return []


        working_df, date_column = (
            self._prepare_date_column(df)
        )


        # -------------------------------------------------
        # No usable date column
        # -------------------------------------------------

        if working_df is None:

            return []


        # -------------------------------------------------
        # Daily aggregation
        # -------------------------------------------------

        working_df["_period"] = (
            working_df[date_column]
            .dt.date
            .astype(str)
        )


        trend = (

            working_df
            .groupby("_period")
            .size()
            .reset_index(
                name="count"
            )

        )


        trend = trend.rename(
            columns={
                "_period": "date"
            }
        )


        trend = trend.sort_values(
            "date"
        )


        return trend.to_dict(
            orient="records"
        )


    # =====================================================
    # MONTHLY FEEDBACK TREND
    # =====================================================

    def monthly_feedback_trend(self, df):

        if df is None or df.empty:

            return []


        working_df, date_column = (
            self._prepare_date_column(df)
        )


        if working_df is None:

            return []


        working_df["_period"] = (

            working_df[date_column]

            .dt.to_period("M")

            .astype(str)

        )


        trend = (

            working_df

            .groupby("_period")

            .size()

            .reset_index(
                name="count"
            )

        )


        trend = trend.rename(
            columns={
                "_period": "month"
            }
        )


        trend = trend.sort_values(
            "month"
        )


        return trend.to_dict(
            orient="records"
        )


    # =====================================================
    # CATEGORY TRENDS
    # =====================================================

    def category_trends(self, df):

        if (
            df is None
            or df.empty
            or "category" not in df.columns
        ):

            return []


        trend = (

            df["category"]

            .fillna("Unknown")

            .astype(str)

            .value_counts()

            .reset_index()

        )


        trend.columns = [
            "category",
            "count"
        ]


        return trend.to_dict(
            orient="records"
        )


    # =====================================================
    # THEME TRENDS
    # =====================================================

    def theme_trends(self, df):

        if (
            df is None
            or df.empty
            or "theme" not in df.columns
        ):

            return []


        trend = (

            df["theme"]

            .fillna("General Feedback")

            .astype(str)

            .value_counts()

            .reset_index()

        )


        trend.columns = [
            "theme",
            "count"
        ]


        return trend.to_dict(
            orient="records"
        )


    # =====================================================
    # PAIN POINT TRENDS
    # =====================================================

    def pain_point_trends(self, df):

        if (
            df is None
            or df.empty
            or "pain_point" not in df.columns
        ):

            return []


        trend = (

            df["pain_point"]

            .fillna("Unknown")

            .astype(str)

            .value_counts()

            .reset_index()

        )


        trend.columns = [
            "pain_point",
            "count"
        ]


        return trend.to_dict(
            orient="records"
        )


    # =====================================================
    # FEATURE REQUEST TRENDS
    # =====================================================

    def feature_request_trends(self, df):

        if (
            df is None
            or df.empty
            or "feature_request" not in df.columns
        ):

            return []


        trend = (

            df["feature_request"]

            .fillna("Unknown")

            .astype(str)

            .value_counts()

            .reset_index()

        )


        trend.columns = [
            "feature",
            "count"
        ]


        return trend.to_dict(
            orient="records"
        )


    # =====================================================
    # SENTIMENT TRENDS
    # =====================================================

    def sentiment_trends(self, df):

        if (
            df is None
            or df.empty
            or "sentiment" not in df.columns
        ):

            return []


        trend = (

            df["sentiment"]

            .fillna("Unknown")

            .astype(str)

            .value_counts()

            .reset_index()

        )


        trend.columns = [
            "sentiment",
            "count"
        ]


        return trend.to_dict(
            orient="records"
        )


    # =====================================================
    # COMPLETE REPORT
    # =====================================================

    def generate_report(self, df):

        return {

            # Actual chronological feedback trend
            "feedback_trend":
                self.feedback_trend(df),

            # Monthly trend
            "monthly_feedback_trend":
                self.monthly_feedback_trend(df),

            # Existing analytical distributions
            "category_trends":
                self.category_trends(df),

            "theme_trends":
                self.theme_trends(df),

            "pain_point_trends":
                self.pain_point_trends(df),

            "feature_request_trends":
                self.feature_request_trends(df),

            "sentiment_trends":
                self.sentiment_trends(df)

        }