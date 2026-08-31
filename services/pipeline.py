# =========================================================
# services/pipeline.py
# COMPLETE FEEDBACK ANALYSIS PIPELINE
# =========================================================

from services.ingestion import DataIngestion
from services.validation import DataValidation
from services.cleaning import DataCleaning
from services.eda import DataEDA
from services.preprocessing import TextPreprocessing
from services.embeddings import TextEmbeddings

from services.categorization import FeedbackCategorization
from services.theme_extraction import ThemeExtraction
from services.pain_point import PainPointExtraction
from services.feature_request import FeatureRequestExtraction
from services.sentiment import SentimentAnalysis
from services.trend_analysis import TrendAnalysis


class FeedbackPipeline:

    def __init__(self):

        self.ingestion = DataIngestion()

        self.validation = DataValidation()

        self.cleaning = DataCleaning()

        self.eda = DataEDA()

        self.preprocessing = TextPreprocessing()

        self.embeddings = TextEmbeddings()

        self.categorization = FeedbackCategorization()

        self.theme = ThemeExtraction()

        self.pain = PainPointExtraction()

        self.feature = FeatureRequestExtraction()

        self.sentiment = SentimentAnalysis()

        self.trend = TrendAnalysis()


    # =====================================================
    # RUN PIPELINE
    # =====================================================

    def run(
        self,
        file_path
    ):

        print(
            "\n========== PIPELINE STARTED ==========\n"
        )


        # =================================================
        # STEP 1 — DATA INGESTION
        # =================================================

        print(
            "Step 1 - Data Ingestion"
        )

        df = self.ingestion.load_data(
            file_path
        )

        print(
            f"Loaded rows: {len(df)}"
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 2 — VALIDATION
        # =================================================

        print(
            "Step 2 - Data Validation"
        )

        validation_report = (
            self.validation.validate_dataframe(
                df
            )
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 3 — CLEANING
        # =================================================

        print(
            "Step 3 - Data Cleaning"
        )

        df, cleaning_report = (
            self.cleaning.clean_dataframe(
                df
            )
        )

        print(
            f"Rows after cleaning: {len(df)}"
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 4 — EDA
        # =================================================

        print(
            "Step 4 - EDA"
        )

        eda_report = (
            self.eda.generate_eda_report(
                df
            )
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 5 — TEXT PREPROCESSING
        # =================================================

        print(
            "Step 5 - Text Preprocessing"
        )

        df = (
            self.preprocessing
            .preprocess_dataframe(
                df
            )
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 6 — EMBEDDINGS
        # =================================================

        print(
            "Step 6 - Embedding Generation"
        )

        df = (
            self.embeddings
            .generate_dataframe_embeddings(
                df
            )
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 7 — CATEGORIZATION
        # =================================================

        print(
            "Step 7 - Feedback Categorization"
        )

        df, categorization_summary = (
            self.categorization
            .categorize_dataframe(
                df
            )
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 8 — THEME EXTRACTION
        # =================================================

        print(
            "Step 8 - Theme Extraction"
        )

        df, theme_summary = (
            self.theme
            .extract_dataframe_themes(
                df
            )
        )

        print(
            "Theme summary:",
            theme_summary
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 9 — PAIN POINT EXTRACTION
        # =================================================

        print(
            "Step 9 - Pain Point Extraction"
        )

        df, pain_summary = (
            self.pain
            .extract_dataframe_pain_points(
                df
            )
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 10 — FEATURE REQUEST EXTRACTION
        # =================================================

        print(
            "Step 10 - Feature Request Extraction"
        )

        df, feature_summary = (
            self.feature
            .extract_dataframe_features(
                df
            )
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 11 — SENTIMENT ANALYSIS
        # =================================================

        print(
            "Step 11 - Sentiment Analysis"
        )

        df, sentiment_summary = (
            self.sentiment
            .analyze_dataframe(
                df
            )
        )

        print(
            "Sentiment summary:",
            sentiment_summary
        )

        print(
            "Completed\n"
        )


        # =================================================
        # STEP 12 — TREND ANALYSIS
        # =================================================

        print(
            "Step 12 - Trend Analysis"
        )

        trend_report = (
            self.trend
            .generate_report(
                df
            )
        )

        print(
            "Trend report generated."
        )

        print(
            "Completed\n"
        )


        # =================================================
        # FINAL RESULT
        # =================================================

        result = {

            "processed_dataframe":
                df,

            "validation_report":
                validation_report,

            "cleaning_report":
                cleaning_report,

            "eda_report":
                eda_report,

            "categorization_summary":
                categorization_summary,

            "theme_summary":
                theme_summary,

            "pain_point_summary":
                pain_summary,

            "feature_request_summary":
                feature_summary,

            "sentiment_summary":
                sentiment_summary,

            "trend_report":
                trend_report

        }


        # =================================================
        # PIPELINE SUMMARY
        # =================================================

        print(
            "\n========== PIPELINE COMPLETED ==========\n"
        )

        print(
            "Total rows:",
            len(df)
        )

        print(
            "Themes:",
            len(
                theme_summary.get(
                    "theme_distribution",
                    {}
                )
            )
        )

        print(
            "Categories:",
            len(
                categorization_summary
                if isinstance(
                    categorization_summary,
                    dict
                )
                else {}
            )
        )

        print(
            "Trend records:",
            len(
                trend_report.get(
                    "feedback_trend",
                    []
                )
            )
        )

        print(
            "\n========================================\n"
        )


        return result