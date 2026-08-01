from sentence_transformers import SentenceTransformer, util


class FeatureRequestExtraction:

    def __init__(self):

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        self.features = {

            "Dark Mode":
                "dark mode night mode theme",

            "Export":
                "export excel csv pdf download report",

            "Notifications":
                "notification alert reminder email",

            "Search":
                "search filter find lookup",

            "Dashboard":
                "dashboard analytics graph chart",

            "Authentication":
                "login authentication password otp security",

            "Performance":
                "speed performance optimization faster",

            "General":
                "general feature request"

        }

        self.feature_embeddings = {

            feature: self.model.encode(
                description,
                convert_to_tensor=True
            )

            for feature, description in self.features.items()

        }

    def extract_feature(self, feedback):

        feedback_embedding = self.model.encode(
            feedback,
            convert_to_tensor=True
        )

        best_feature = "General"
        best_score = 0

        for feature, embedding in self.feature_embeddings.items():

            score = util.cos_sim(
                feedback_embedding,
                embedding
            ).item()

            if score > best_score:

                best_score = score
                best_feature = feature

        return best_feature

    def extract_dataframe_features(self, df):

        if "processed_feedback" not in df.columns:

            raise ValueError(
                "processed_feedback column not found."
            )

        df["feature_request"] = df["processed_feedback"].apply(
            self.extract_feature
        )

        feature_counts = (
            df["feature_request"]
            .value_counts()
            .to_dict()
        )

        feature_summary = {

            "total_feature_requests": len(feature_counts),

            "most_requested_feature": (
                df["feature_request"].mode()[0]
                if not df.empty else None
            ),

            "feature_request_distribution": feature_counts

        }

        return df, feature_summary