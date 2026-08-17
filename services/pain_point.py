try:
    from sentence_transformers import SentenceTransformer, util
except Exception:
    SentenceTransformer = None
    util = None


class PainPointExtraction:

    def __init__(self):
        if SentenceTransformer:
            try:
                self.model = SentenceTransformer(
                    "sentence-transformers/all-MiniLM-L6-v2"
                )
            except Exception:
                self.model = None
        else:
            self.model = None

        self.pain_points = {

            "Performance Issue":
                "slow lag loading delay performance speed",

            "UI/UX Confusion":
                "confusing difficult UI UX navigation interface",

            "Bug/Error":
                "crash bug error failure broken exception",

            "Integration Problem":
                "api webhook sync connect integration fail",

            "Pricing Complaint":
                "expensive high cost price fee subscription billing",

            "Feature Missing":
                "missing feature enhancement functionality request",

            "General":
                "general feedback"

        }

        if self.model:
            self.pain_embeddings = {
                pain: self.model.encode(
                    description,
                    convert_to_tensor=True
                )
                for pain, description in self.pain_points.items()
            }
        else:
            self.pain_embeddings = {}

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