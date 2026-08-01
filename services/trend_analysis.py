import pandas as pd


class TrendAnalysis:

    def __init__(self):
        pass

    # -----------------------------------------
    # Category Trends
    # -----------------------------------------

    def category_trends(self, df):

        trend = (
            df["category"]
            .value_counts()
            .reset_index()
        )

        trend.columns = ["Category", "Count"]

        return trend.to_dict(orient="records")

    # -----------------------------------------
    # Theme Trends
    # -----------------------------------------

    def theme_trends(self, df):

        trend = (
            df["theme"]
            .value_counts()
            .reset_index()
        )

        trend.columns = ["Theme", "Count"]

        return trend.to_dict(orient="records")

    # -----------------------------------------
    # Pain Point Trends
    # -----------------------------------------

    def pain_point_trends(self, df):

        trend = (
            df["pain_point"]
            .value_counts()
            .reset_index()
        )

        trend.columns = ["Pain Point", "Count"]

        return trend.to_dict(orient="records")

    # -----------------------------------------
    # Feature Request Trends
    # -----------------------------------------

    def feature_request_trends(self, df):

        trend = (
            df["feature_request"]
            .value_counts()
            .reset_index()
        )

        trend.columns = ["Feature", "Count"]

        return trend.to_dict(orient="records")

    # -----------------------------------------
    # Sentiment Trends
    # -----------------------------------------

    def sentiment_trends(self, df):

        trend = (
            df["sentiment"]
            .value_counts()
            .reset_index()
        )

        trend.columns = ["Sentiment", "Count"]

        return trend.to_dict(orient="records")

    # -----------------------------------------
    # Generate Complete Report
    # -----------------------------------------

    def generate_report(self, df):

        report = {

            "category_trends": self.category_trends(df),

            "theme_trends": self.theme_trends(df),

            "pain_point_trends": self.pain_point_trends(df),

            "feature_request_trends": self.feature_request_trends(df),

            "sentiment_trends": self.sentiment_trends(df)

        }

        return report