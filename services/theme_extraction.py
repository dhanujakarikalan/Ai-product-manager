try:
    from sentence_transformers import SentenceTransformer, util
except Exception:
    SentenceTransformer = None
    util = None


class ThemeExtraction:

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

        self.themes = {

            "Usability": "easy use user friendly navigation interface",

            "Performance": "speed slow lag loading performance",

            "Reliability": "crash bug error issue failure",

            "Security": "login password authentication privacy security",

            "Pricing": "price payment subscription refund premium",

            "Customer Support": "support help service ticket response",

            "Features": "feature functionality enhancement improvement",

            "General": "general feedback"

        }

        if self.model:
            self.theme_embeddings = {
                theme: self.model.encode(
                    description,
                    convert_to_tensor=True
                )
                for theme, description in self.themes.items()
            }
        else:
            self.theme_embeddings = {}

    def extract_theme(self, feedback):

        feedback_embedding = self.model.encode(
            feedback,
            convert_to_tensor=True
        )

        best_theme = "General"
        best_score = 0

        for theme, embedding in self.theme_embeddings.items():

            score = util.cos_sim(
                feedback_embedding,
                embedding
            ).item()

            if score > best_score:

                best_score = score
                best_theme = theme

        return best_theme

    def extract_dataframe_themes(self, df):

        if "processed_feedback" not in df.columns:

            raise ValueError(
                "processed_feedback column not found."
            )

        df["theme"] = df["processed_feedback"].apply(
            self.extract_theme
        )

        theme_counts = (
            df["theme"]
            .value_counts()
            .to_dict()
        )

        theme_summary = {

            "total_themes": len(theme_counts),

            "top_theme": (
                df["theme"].mode()[0]
                if not df.empty else None
            ),

            "theme_distribution": theme_counts

        }

        return df, theme_summary