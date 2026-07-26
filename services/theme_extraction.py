from sentence_transformers import SentenceTransformer, util


class ThemeExtraction:

    def __init__(self):

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        # Theme descriptions
        self.themes = {

            "Authentication":
                "login signup authentication password otp account",

            "Dashboard":
                "dashboard homepage analytics charts widgets reports",

            "Payments":
                "payment billing invoice subscription refund transaction",

            "Notifications":
                "notification alerts email sms reminder push notification",

            "Reports":
                "report export excel pdf csv analytics summary",

            "Search":
                "search filter sorting find query",

            "Profile":
                "profile account settings user information",

            "Performance":
                "speed loading lag response performance delay",

            "UI":
                "user interface design layout navigation user experience",

            "General":
                "general feedback"
        }

        # Create embeddings for themes
        self.theme_embeddings = {

            theme: self.model.encode(
                description,
                convert_to_tensor=True
            )

            for theme, description in self.themes.items()

        }

    # -------------------------------------------------
    # Keyword-Based Theme Detection
    # -------------------------------------------------

    def keyword_theme(self, feedback):

        feedback = feedback.lower()

        if any(word in feedback for word in
               ["login", "signin", "signup", "password", "otp", "authentication"]):

            return "Authentication"

        elif any(word in feedback for word in
                 ["dashboard", "analytics", "chart", "widget"]):

            return "Dashboard"

        elif any(word in feedback for word in
                 ["payment", "billing", "refund", "subscription", "invoice"]):

            return "Payments"

        elif any(word in feedback for word in
                 ["notification", "alert", "email", "sms"]):

            return "Notifications"

        elif any(word in feedback for word in
                 ["report", "export", "excel", "pdf", "csv"]):

            return "Reports"

        elif any(word in feedback for word in
                 ["search", "filter", "find"]):

            return "Search"

        elif any(word in feedback for word in
                 ["profile", "account", "settings"]):

            return "Profile"

        elif any(word in feedback for word in
                 ["ui", "interface", "layout", "navigation"]):

            return "UI"

        elif any(word in feedback for word in
                 ["slow", "lag", "performance", "loading", "delay"]):

            return "Performance"

        return None

    # -------------------------------------------------
    # Semantic Theme Detection
    # -------------------------------------------------

    def semantic_theme(self, feedback):

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

    # -------------------------------------------------
    # Hybrid Theme Detection
    # -------------------------------------------------

    def extract_theme(self, feedback):

        theme = self.keyword_theme(feedback)

        if theme is not None:
            return theme

        return self.semantic_theme(feedback)

    # -------------------------------------------------
    # Theme Extraction for DataFrame
    # -------------------------------------------------

    def extract_dataframe_themes(self, df):

        if "processed_feedback" not in df.columns:

            raise ValueError(
                "processed_feedback column not found."
            )

        df["theme"] = df["processed_feedback"].apply(
            self.extract_theme
        )

        return df