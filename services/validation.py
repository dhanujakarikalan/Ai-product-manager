import pandas as pd


class DataValidation:

    def __init__(self):
        self.required_columns = [
            "source",
            "product_name",
            "feedback_text"
        ]

    # -------------------------------------------------
    # Check Empty Dataset
    # -------------------------------------------------

    def check_empty_dataframe(self, df):

        if df.empty:
            raise ValueError("Uploaded dataset is empty.")

        return True

    # -------------------------------------------------
    # Check Required Columns
    # -------------------------------------------------

    def check_required_columns(self, df):

        missing_columns = []

        for column in self.required_columns:

            if column not in df.columns:
                missing_columns.append(column)

        return missing_columns

    # -------------------------------------------------
    # Check Missing Values
    # -------------------------------------------------

    def check_missing_values(self, df):

        return df.isnull().sum()

    # -------------------------------------------------
    # Check Duplicate Rows
    # -------------------------------------------------

    def check_duplicates(self, df):

        duplicate_count = df.duplicated().sum()

        return duplicate_count

    # -------------------------------------------------
    # Check Data Types
    # -------------------------------------------------

    def check_data_types(self, df):

        return df.dtypes

    # -------------------------------------------------
    # Generate Validation Report
    # -------------------------------------------------

    def generate_validation_report(self, df):

        report = {

            "Total Rows": len(df),

            "Total Columns": len(df.columns),

            "Missing Columns": self.check_required_columns(df),

            "Missing Values": self.check_missing_values(df).to_dict(),

            "Duplicate Rows": int(self.check_duplicates(df)),

            "Data Types": {
                column: str(dtype)
                for column, dtype in self.check_data_types(df).items()
            }

        }

        return report

    # -------------------------------------------------
    # Main Validation Function
    # -------------------------------------------------

    def validate_dataframe(self, df):

        self.check_empty_dataframe(df)

        report = self.generate_validation_report(df)

        return report