# =========================================================
# services/feature_request.py
# Feature Request Extraction
# =========================================================

from sentence_transformers import SentenceTransformer, util


class FeatureRequestExtraction:

    def __init__(self):

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        # -------------------------------------------------
        # Known feature concepts.
        # These are used as semantic anchors, not as a
        # hard limit on the number of features.
        # -------------------------------------------------

        self.features = {

            "Dark Mode":
                "dark mode night mode dark theme appearance",

            "Export":
                "export excel csv pdf download report data",

            "Notifications":
                "notification alert reminder email push notification",

            "Search":
                "search filter find lookup query discovery",

            "Dashboard":
                "dashboard analytics graph chart metrics visualization",

            "Authentication":
                "login authentication password otp security sign in",

            "Performance":
                "speed performance optimization faster latency loading",

            "Mobile Experience":
                "mobile responsive phone tablet mobile application",

            "Integration":
                "integration API webhook third party connection",

            "Billing":
                "billing payment invoice subscription pricing",

            "Reporting":
                "reports reporting insights summary",

            "General":
                "general product feature request improvement"
        }

        self.feature_embeddings = {

            feature: self.model.encode(
                description,
                convert_to_tensor=True
            )

            for feature, description
            in self.features.items()

        }


    # =====================================================
    # NORMALIZE TEXT
    # =====================================================

    @staticmethod
    def normalize_text(value):

        if value is None:

            return ""

        text = str(value).strip()

        if text.lower() in {
            "",
            "nan",
            "none",
            "null"
        }:

            return ""

        return text


    # =====================================================
    # DETECT WHETHER TEXT IS A FEATURE REQUEST
    # =====================================================

    def is_feature_request(self, feedback):

        text = self.normalize_text(
            feedback
        )

        if not text:

            return False


        request_keywords = [

            "add",

            "need",

            "want",

            "would like",

            "please",

            "request",

            "feature",

            "support",

            "allow",

            "enable",

            "should have",

            "can you",

            "it would be useful",

            "wish"

        ]


        lowered = text.lower()


        return any(
            keyword in lowered
            for keyword in request_keywords
        )


    # =====================================================
    # EXTRACT FEATURE
    # =====================================================

    def extract_feature(self, feedback):

        text = self.normalize_text(
            feedback
        )

        if not text:

            return "General"


        feedback_embedding = self.model.encode(
            text,
            convert_to_tensor=True
        )


        best_feature = "General"

        best_score = -1


        for feature, embedding in (
            self.feature_embeddings.items()
        ):

            score = util.cos_sim(
                feedback_embedding,
                embedding
            ).item()


            if score > best_score:

                best_score = score

                best_feature = feature


        return best_feature


    # =====================================================
    # EXTRACT FEATURES FROM DATAFRAME
    # =====================================================

    def extract_dataframe_features(self, df):

        if df is None:

            raise ValueError(
                "DataFrame cannot be None."
            )


        # -------------------------------------------------
        # Prefer processed_feedback.
        # Fall back to feedback_text.
        # -------------------------------------------------

        source_column = None


        if "processed_feedback" in df.columns:

            source_column = (
                "processed_feedback"
            )

        elif "feedback_text" in df.columns:

            source_column = (
                "feedback_text"
            )


        if source_column is None:

            raise ValueError(
                "Neither 'processed_feedback' "
                "nor 'feedback_text' column found."
            )


        # -------------------------------------------------
        # Extract feature for EVERY row.
        # -------------------------------------------------

        df["feature_request"] = (

            df[source_column]

            .fillna("")

            .astype(str)

            .apply(
                self.extract_feature
            )

        )


        # -------------------------------------------------
        # Count all feature assignments.
        # -------------------------------------------------

        feature_counts = (

            df["feature_request"]

            .value_counts()

            .to_dict()

        )


        # -------------------------------------------------
        # Remove General when real features exist and
        # General represents only noise.
        #
        # We keep it if it is the only detected category.
        # -------------------------------------------------

        real_feature_counts = {

            key: value

            for key, value
            in feature_counts.items()

            if key != "General"

        }


        distribution = (

            real_feature_counts

            if real_feature_counts

            else feature_counts

        )


        # -------------------------------------------------
        # Most requested feature
        # -------------------------------------------------

        most_requested_feature = None


        if distribution:

            most_requested_feature = max(
                distribution,
                key=distribution.get
            )


        # -------------------------------------------------
        # IMPORTANT:
        #
        # Return the distribution directly as part of the
        # result so Milestone4Service can consume it.
        # -------------------------------------------------

        feature_summary = {

            "total_feature_requests":
                int(
                    sum(
                        distribution.values()
                    )
                ),

            "unique_features":
                int(
                    len(distribution)
                ),

            "most_requested_feature":
                most_requested_feature,

            "feature_request_distribution":
                distribution,

            # ---------------------------------------------
            # Compatibility with existing frontend/backend
            # ---------------------------------------------

            "features":
                distribution

        }


        return (
            df,
            feature_summary
        )