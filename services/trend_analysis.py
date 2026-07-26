import pandas as pd


class TrendAnalysis:

    def __init__(self):
        pass

    # -----------------------------------------
    # Category Trends
    # -----------------------------------------

    def category_trends(self, df):

        return (
            df["category"]
            .value_counts()
            .reset_index()
            .rename(columns={
                "index": "Category",
                "category": "Count"
            })
        )

    # -----------------------------------------
    # Theme Trends
    # -----------------------------------------

    def theme_trends(self, df):

        return (
            df["theme"]
            .value_counts()
            .reset_index()
            .rename(columns={
                "index": "Theme",
                "theme": "Count"
            })
        )

    # -----------------------------------------
    # Pain Point Trends
    # -----------------------------------------

    def pain_point_trends(self, df):

        return (
            df["pain_point"]
            .value_counts()
            .reset_index()
            .rename(columns={
                "index": "Pain Point",
                "pain_point": "Count"
            })
        )

    # -----------------------------------------
    # Feature Request Trends
    # -----------------------------------------

    def feature_request_trends(self, df):

        return (
            df["feature_request"]
            .value_counts()
            .reset_index()
            .rename(columns={
                "index": "Feature",
                "feature_request": "Count"
            })
        )

    # -----------------------------------------
    # Sentiment Trends
    # -----------------------------------------

    def sentiment_trends(self, df):

        return (
            df["sentiment"]
            .value_counts()
            .reset_index()
            .rename(columns={
                "index": "Sentiment",
                "sentiment": "Count"
            })
        )

    # -----------------------------------------
    # Generate Complete Report
    # -----------------------------------------

    def generate_report(self, df):

        report = {

            "Category Trends":
                self.category_trends(df),

            "Theme Trends":
                self.theme_trends(df),

            "Pain Point Trends":
                self.pain_point_trends(df),

            "Feature Request Trends":
                self.feature_request_trends(df),

            "Sentiment Trends":
                self.sentiment_trends(df)

        }

        return report