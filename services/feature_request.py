from sentence_transformers import SentenceTransformer, util


class FeatureRequestExtraction:

    def __init__(self):

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        self.features = {

            "Dark Mode":
                "dark mode dark theme black theme",

            "Export to Excel":
                "export excel spreadsheet xlsx",

            "Export to PDF":
                "export pdf download report",

            "Biometric Login":
                "fingerprint face id biometric login",

            "Push Notifications":
                "push notification alerts reminder",

            "Voice Search":
                "voice search speech recognition",

            "Advanced Filters":
                "advanced filter sorting search filter",

            "Multi-language Support":
                "language translation multilingual",

            "Offline Mode":
                "offline mode internet connection",

            "Two-Factor Authentication":
                "2fa otp two factor authentication",

            "Dashboard Customization":
                "custom dashboard widgets personalization",

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

    # -----------------------------------------
    # Keyword Matching
    # -----------------------------------------

    def keyword_feature(self, feedback):

        feedback = feedback.lower()

        if "dark mode" in feedback:
            return "Dark Mode"

        elif "excel" in feedback:
            return "Export to Excel"

        elif "pdf" in feedback:
            return "Export to PDF"

        elif "fingerprint" in feedback or "face id" in feedback:
            return "Biometric Login"

        elif "notification" in feedback:
            return "Push Notifications"

        elif "voice search" in feedback:
            return "Voice Search"

        elif "filter" in feedback:
            return "Advanced Filters"

        elif "language" in feedback:
            return "Multi-language Support"

        elif "offline" in feedback:
            return "Offline Mode"

        elif "2fa" in feedback or "two factor" in feedback:
            return "Two-Factor Authentication"

        elif "custom dashboard" in feedback or "widget" in feedback:
            return "Dashboard Customization"

        return None

    # -----------------------------------------
    # Semantic Similarity
    # -----------------------------------------

    def semantic_feature(self, feedback):

        embedding = self.model.encode(
            feedback,
            convert_to_tensor=True
        )

        best_feature = "General"
        best_score = 0

        for feature, feature_embedding in self.feature_embeddings.items():

            score = util.cos_sim(
                embedding,
                feature_embedding
            ).item()

            if score > best_score:

                best_score = score
                best_feature = feature

        return best_feature

    # -----------------------------------------
    # Hybrid Approach
    # -----------------------------------------

    def extract_feature(self, feedback):

        feature = self.keyword_feature(feedback)

        if feature is not None:
            return feature

        return self.semantic_feature(feedback)

    # -----------------------------------------
    # DataFrame Processing
    # -----------------------------------------

    def extract_dataframe_features(self, df):

        if "processed_feedback" not in df.columns:

            raise ValueError(
                "processed_feedback column not found."
            )

        df["feature_request"] = df["processed_feedback"].apply(
            self.extract_feature
        )

        return df