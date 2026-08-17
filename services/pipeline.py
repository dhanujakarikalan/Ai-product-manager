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

    def run(self, file_path):

        print("\n========== PIPELINE STARTED ==========\n")

        # Step 1 - Data Ingestion
        print("Step 1 - Data Ingestion")
        df = self.ingestion.load_data(file_path)
        print("Completed\n")

        # Step 2 - Data Validation
        print("Step 2 - Data Validation")
        validation_report = self.validation.validate_dataframe(df)
        print("Completed\n")

        # Step 3 - Data Cleaning
        print("Step 3 - Data Cleaning")
        df, cleaning_report = self.cleaning.clean_dataframe(df)
        print("Completed\n")

        # Step 4 - EDA
        print("Step 4 - EDA")
        eda_report = self.eda.generate_eda_report(df)
        print("Completed\n")

        # Step 5 - Text Preprocessing
        print("Step 5 - Text Preprocessing")
        df = self.preprocessing.preprocess_dataframe(df)
        print("Completed\n")

        # Step 6 - Embedding Generation
        print("Step 6 - Embedding Generation")
        df = self.embeddings.generate_dataframe_embeddings(df)
        print("Completed\n")

        # Step 7 - Categorization
        print("Step 7 - Feedback Categorization")
        df, categorization_summary = self.categorization.categorize_dataframe(df)
        print("Completed\n")

        # Step 8 - Theme Extraction
        print("Step 8 - Theme Extraction")
        df, theme_summary = self.theme.extract_dataframe_themes(df)
        print("Completed\n")

        # Step 9 - Pain Point Extraction
        print("Step 9 - Pain Point Extraction")
        df, pain_summary = self.pain.extract_dataframe_pain_points(df)
        print("Completed\n")

        # Step 10 - Feature Request Extraction
        print("Step 10 - Feature Request Extraction")
        df, feature_summary = self.feature.extract_dataframe_features(df)
        print("Completed\n")

        # Step 11 - Sentiment Analysis
        print("Step 11 - Sentiment Analysis")
        df, sentiment_summary = self.sentiment.analyze_dataframe(df)
        print("Completed\n")

        # Step 12 - Trend Analysis
        print("Step 12 - Trend Analysis")
        trend_report = self.trend.generate_report(df)
        print("Completed\n")

        print("========== PIPELINE COMPLETED ==========\n")

        return {

            "processed_dataframe": df,

            "validation_report": validation_report,

            "cleaning_report": cleaning_report,

            "eda_report": eda_report,

            "categorization_summary": categorization_summary,

            "theme_summary": theme_summary,

            "pain_point_summary": pain_summary,

            "feature_request_summary": feature_summary,

            "sentiment_summary": sentiment_summary,

            "trend_report": trend_report

        }