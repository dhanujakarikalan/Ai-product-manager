from sentence_transformers import SentenceTransformer, util


class PainPointExtraction:

    def __init__(self):

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        self.pain_points = {

            "Slow Login":
                "login slow authentication delay",

            "Login Failure":
                "login failed unable signin authentication error",

            "OTP Failure":
                "otp verification code not received",

            "Dashboard Crash":
                "dashboard crash freeze error",

            "Slow Dashboard":
                "dashboard loading slow lag",

            "Payment Failure":
                "payment failed transaction unsuccessful",

            "Refund Delay":
                "refund delayed payment issue",

            "Notification Delay":
                "notification delayed alerts late",

            "Search Failure":
                "search not working unable find",

            "Incorrect Search Results":
                "search incorrect wrong results",

            "Profile Update Failure":
                "profile update save failed",

            "Report Export Failure":
                "export report pdf excel failed",

            "General":
                "general feedback"
        }

        self.pain_embeddings = {

            pain: self.model.encode(
                description,
                convert_to_tensor=True
            )

            for pain, description in self.pain_points.items()

        }

    # ---------------------------------------------
    # Keyword Matching
    # ---------------------------------------------

    def keyword_pain(self, feedback):

        feedback = feedback.lower()

        if "login" in feedback and "slow" in feedback:
            return "Slow Login"

        elif "login" in feedback and (
            "failed" in feedback or "unable" in feedback
        ):
            return "Login Failure"

        elif "otp" in feedback:
            return "OTP Failure"

        elif "dashboard" in feedback and (
            "crash" in feedback or "freeze" in feedback
        ):
            return "Dashboard Crash"

        elif "dashboard" in feedback and (
            "slow" in feedback or "loading" in feedback
        ):
            return "Slow Dashboard"

        elif "payment" in feedback and "failed" in feedback:
            return "Payment Failure"

        elif "refund" in feedback:
            return "Refund Delay"

        elif "notification" in feedback:
            return "Notification Delay"

        elif "search" in feedback and (
            "not working" in feedback or "unable" in feedback
        ):
            return "Search Failure"

        elif "search" in feedback and (
            "wrong" in feedback or "incorrect" in feedback
        ):
            return "Incorrect Search Results"

        elif "profile" in feedback and "update" in feedback:
            return "Profile Update Failure"

        elif "export" in feedback:
            return "Report Export Failure"

        return None

    # ---------------------------------------------
    # Semantic Similarity
    # ---------------------------------------------

    def semantic_pain(self, feedback):

        embedding = self.model.encode(
            feedback,
            convert_to_tensor=True
        )

        best_pain = "General"
        best_score = 0

        for pain, pain_embedding in self.pain_embeddings.items():

            score = util.cos_sim(
                embedding,
                pain_embedding
            ).item()

            if score > best_score:

                best_score = score
                best_pain = pain

        return best_pain

    # ---------------------------------------------
    # Hybrid Extraction
    # ---------------------------------------------

    def extract_pain_point(self, feedback):

        pain = self.keyword_pain(feedback)

        if pain is not None:
            return pain

        return self.semantic_pain(feedback)

    # ---------------------------------------------
    # DataFrame Processing
    # ---------------------------------------------

    def extract_dataframe_pain_points(self, df):

        if "processed_feedback" not in df.columns:

            raise ValueError(
                "processed_feedback column not found."
            )

        df["pain_point"] = df["processed_feedback"].apply(
            self.extract_pain_point
        )

        return df