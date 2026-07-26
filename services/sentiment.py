from sentence_transformers import SentenceTransformer, util


class SentimentAnalysis:

    def __init__(self):

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        self.sentiments = {

            "Positive":
                "good excellent amazing love satisfied happy wonderful awesome",

            "Negative":
                "bad poor slow crash failed bug issue error terrible disappointed",

            "Neutral":
                "average okay normal acceptable moderate general"

        }

        self.sentiment_embeddings = {

            sentiment: self.model.encode(
                description,
                convert_to_tensor=True
            )

            for sentiment, description in self.sentiments.items()

        }

    # -----------------------------------------
    # Keyword-Based Sentiment
    # -----------------------------------------

    def keyword_sentiment(self, feedback):

        feedback = feedback.lower()

        positive_words = [
            "good", "great", "excellent",
            "awesome", "love", "happy",
            "amazing", "fantastic", "perfect",
            "satisfied"
        ]

        negative_words = [
            "bad", "poor", "slow",
            "crash", "bug", "issue",
            "failed", "terrible",
            "worst", "hate", "error"
        ]

        if any(word in feedback for word in positive_words):
            return "Positive"

        elif any(word in feedback for word in negative_words):
            return "Negative"

        return None

    # -----------------------------------------
    # Semantic Sentiment
    # -----------------------------------------

    def semantic_sentiment(self, feedback):

        embedding = self.model.encode(
            feedback,
            convert_to_tensor=True
        )

        best_sentiment = "Neutral"
        best_score = 0

        for sentiment, sentiment_embedding in self.sentiment_embeddings.items():

            score = util.cos_sim(
                embedding,
                sentiment_embedding
            ).item()

            if score > best_score:

                best_score = score
                best_sentiment = sentiment

        return best_sentiment

    # -----------------------------------------
    # Hybrid Sentiment
    # -----------------------------------------

    def analyze_sentiment(self, feedback):

        sentiment = self.keyword_sentiment(feedback)

        if sentiment is not None:
            return sentiment

        return self.semantic_sentiment(feedback)

    # -----------------------------------------
    # DataFrame Processing
    # -----------------------------------------

    def analyze_dataframe(self, df):

        if "processed_feedback" not in df.columns:

            raise ValueError(
                "processed_feedback column not found."
            )

        df["sentiment"] = df["processed_feedback"].apply(
            self.analyze_sentiment
        )

        return df