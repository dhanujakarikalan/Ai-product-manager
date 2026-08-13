try:
    from transformers import pipeline
except Exception:
    pipeline = None


class SentimentAnalysis:

    def __init__(self):
        if pipeline:
            try:
                self.sentiment_pipeline = pipeline(
                    "sentiment-analysis"
                )
            except Exception:
                self.sentiment_pipeline = None
        else:
            self.sentiment_pipeline = None

    # -----------------------------------------
    # Analyze Single Feedback
    # -----------------------------------------

    def analyze_sentiment(self, feedback):

        result = self.sentiment_pipeline(feedback)[0]

        label = result["label"].upper()

        if label == "POSITIVE":
            return "Positive"

        elif label == "NEGATIVE":
            return "Negative"

        return "Neutral"

    # -----------------------------------------
    # Analyze Entire DataFrame
    # -----------------------------------------

    def analyze_dataframe(self, df):

        if "processed_feedback" not in df.columns:

            raise ValueError(
                "processed_feedback column not found."
            )

        df["sentiment"] = df["processed_feedback"].apply(
            self.analyze_sentiment
        )

        sentiment_counts = (
            df["sentiment"]
            .value_counts()
            .to_dict()
        )

        total_feedback = len(df)

        sentiment_percentage = {

            sentiment: round(
                (count / total_feedback) * 100,
                2
            )

            for sentiment, count in sentiment_counts.items()

        } if total_feedback > 0 else {}

        sentiment_summary = {

            "overall_sentiment": (
                df["sentiment"].mode()[0]
                if not df.empty else None
            ),

            "total_feedback": total_feedback,

            "positive_feedback": sentiment_counts.get(
                "Positive", 0
            ),

            "negative_feedback": sentiment_counts.get(
                "Negative", 0
            ),

            "neutral_feedback": sentiment_counts.get(
                "Neutral", 0
            ),

            "sentiment_distribution": sentiment_counts,

            "sentiment_percentage": sentiment_percentage

        }

        return df, sentiment_summary