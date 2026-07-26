import pandas as pd


class DataCleaning:

    # ----------------------------------------
    # Remove Duplicate Rows
    # ----------------------------------------

    def remove_duplicates(self, df):

        df = df.drop_duplicates()

        return df

    # ----------------------------------------
    # Handle Missing Values
    # ----------------------------------------

    def handle_missing_values(self, df):

        # Drop rows where feedback is missing
        if "feedback_text" in df.columns:
            df = df.dropna(subset=["feedback_text"])

        # Fill missing product names
        if "product_name" in df.columns:
            df["product_name"] = df["product_name"].fillna("Unknown")

        # Fill missing source
        if "source" in df.columns:
            df["source"] = df["source"].fillna("Unknown")

        # Fill missing ratings
        if "rating" in df.columns:
            df["rating"] = df["rating"].fillna(0)

        return df

    # ----------------------------------------
    # Standardize Column Names
    # ----------------------------------------

    def standardize_columns(self, df):

        df.columns = (
            df.columns
            .str.strip()
            .str.lower()
            .str.replace(" ", "_")
        )

        return df

    # ----------------------------------------
    # Clean Text Columns
    # ----------------------------------------

    def clean_text(self, df):

        if "feedback_text" in df.columns:

            df["feedback_text"] = (
                df["feedback_text"]
                .astype(str)
                .str.strip()
                .str.replace("\n", " ", regex=False)
                .str.replace("\r", " ", regex=False)
            )

        return df

    # ----------------------------------------
    # Remove Empty Feedback
    # ----------------------------------------

    def remove_empty_feedback(self, df):

        if "feedback_text" in df.columns:

            df = df[df["feedback_text"] != ""]

        return df

    # ----------------------------------------
    # Cleaning Report
    # ----------------------------------------

    def cleaning_report(self, before_rows, after_rows):

        report = {

            "Rows Before Cleaning": before_rows,

            "Rows After Cleaning": after_rows,

            "Rows Removed": before_rows - after_rows

        }

        return report

    # ----------------------------------------
    # Main Cleaning Function
    # ----------------------------------------

    def clean_dataframe(self, df):

        before_rows = len(df)

        df = self.standardize_columns(df)

        df = self.remove_duplicates(df)

        df = self.handle_missing_values(df)

        df = self.clean_text(df)

        df = self.remove_empty_feedback(df)

        after_rows = len(df)

        report = self.cleaning_report(before_rows, after_rows)

        return df, report