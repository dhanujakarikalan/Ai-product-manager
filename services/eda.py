import pandas as pd


class DataEDA:

    # ----------------------------------------
    # Dataset Summary
    # ----------------------------------------

    def dataset_summary(self, df):

        summary = {
            "Rows": df.shape[0],
            "Columns": df.shape[1],
            "Column Names": list(df.columns)
        }

        return summary

    # ----------------------------------------
    # Missing Values
    # ----------------------------------------

    def missing_values(self, df):

        return df.isnull().sum().to_dict()

    # ----------------------------------------
    # Duplicate Rows
    # ----------------------------------------

    def duplicate_rows(self, df):

        return int(df.duplicated().sum())

    # ----------------------------------------
    # Source Distribution
    # ----------------------------------------

    def source_distribution(self, df):

        if "source" in df.columns:
            return df["source"].value_counts().to_dict()

        return {}

    # ----------------------------------------
    # Product Distribution
    # ----------------------------------------

    def product_distribution(self, df):

        if "product_name" in df.columns:
            return df["product_name"].value_counts().to_dict()

        return {}

    # ----------------------------------------
    # Rating Distribution
    # ----------------------------------------

    def rating_distribution(self, df):

        if "rating" in df.columns:
            return df["rating"].value_counts().sort_index().to_dict()

        return {}

    # ----------------------------------------
    # Feedback Length Statistics
    # ----------------------------------------

    def feedback_length(self, df):

        if "feedback_text" not in df.columns:
            return {}

        lengths = df["feedback_text"].astype(str).str.len()

        stats = {
            "Minimum Length": int(lengths.min()),
            "Maximum Length": int(lengths.max()),
            "Average Length": float(lengths.mean())
        }

        return stats

    # ----------------------------------------
    # Complete EDA Report
    # ----------------------------------------
    def generate_eda_report(self, df):

        report = {

            "total_rows": df.shape[0],

            "total_columns": df.shape[1],

            "source_distribution": self.source_distribution(df),

            "product_distribution": self.product_distribution(df),

            "rating_distribution": self.rating_distribution(df),

            "feedback_length": self.feedback_length(df)

        }

        return report