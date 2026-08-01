from sentence_transformers import SentenceTransformer, util


class PainPointExtraction:

    def __init__(self):

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        self.pain_points = {

            "Performance Issue":
                "slow lag loading delay performance speed",

            "Application Crash":
                "crash error bug failure exception",

            "Login Issue":
                "login authentication password sign in",

            "Payment Issue":
                "payment refund subscription billing",

            "UI Problem":
                "design interface navigation layout user experience",

            "Customer Support":
                "support help ticket service response",

            "Feature Missing":
                "missing feature enhancement functionality request",

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

    def extract_pain_point(self, feedback):

        feedback_embedding = self.model.encode(
            feedback,
            convert_to_tensor=True
        )

        best_pain = "General"
        best_score = 0

        for pain, embedding in self.pain_embeddings.items():

            score = util.cos_sim(
                feedback_embedding,
                embedding
            ).item()

            if score > best_score:

                best_score = score
                best_pain = pain

        return best_pain

    def extract_dataframe_pain_points(self, df):

        if "processed_feedback" not in df.columns:

            raise ValueError(
                "processed_feedback column not found."
            )

        df["pain_point"] = df["processed_feedback"].apply(
            self.extract_pain_point
        )

        pain_counts = (
            df["pain_point"]
            .value_counts()
            .to_dict()
        )

        pain_summary = {

            "total_pain_points": len(pain_counts),

            "top_pain_point": (
                df["pain_point"].mode()[0]
                if not df.empty else None
            ),

            "pain_point_distribution": pain_counts

        }

        return df, pain_summary