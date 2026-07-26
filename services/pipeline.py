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

        # Step 1
        df = self.ingestion.load_data(file_path)

        # Step 2
        validation_report = self.validation.validate_dataframe(df)

        # Step 3
        df, cleaning_report = self.cleaning.clean_dataframe(df)

        # Step 4
        eda_report = self.eda.generate_eda_report(df)

        # Step 5
        df = self.preprocessing.preprocess_dataframe(df)

        # Step 6
        df = self.embeddings.generate_dataframe_embeddings(df)

        # Step 7
        df = self.categorization.categorize_dataframe(df)

        # Step 8
        df = self.theme.extract_dataframe_themes(df)

        # Step 9
        df = self.pain.extract_dataframe_pain_points(df)

        # Step 10
        df = self.feature.extract_dataframe_features(df)

        # Step 11
        df = self.sentiment.analyze_dataframe(df)

        # Step 12
        trend_report = self.trend.generate_report(df)

        return {
            "processed_dataframe": df,
            "validation_report": validation_report,
            "cleaning_report": cleaning_report,
            "eda_report": eda_report,
            "trend_report": trend_report
        }