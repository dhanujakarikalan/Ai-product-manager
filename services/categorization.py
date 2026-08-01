from sentence_transformers import SentenceTransformer, util


class FeedbackCategorization:

    def __init__(self):

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        # Category descriptions
        self.categories = {

            "Bug":
                "application crash bug error exception failure",

            "Feature Request":
                "new feature enhancement functionality improvement",

            "Performance":
                "slow loading lag performance response speed",

            "UI/UX":
                "design interface layout navigation user experience",

            "Security":
                "authentication login password privacy security",

            "Pricing":
                "subscription payment pricing refund premium",

            "Praise":
                "good excellent amazing nice satisfied happy",

            "Customer Support":
                "support ticket response customer service help",

            "General Feedback":
                "general feedback"
        }

        # Generate embeddings for category descriptions
        self.category_embeddings = {

            category: self.model.encode(
                description,
                convert_to_tensor=True
            )

            for category, description in self.categories.items()

        }

    # --------------------------------------------------
    # Rule-Based Categorization
    # --------------------------------------------------

    def keyword_category(self, feedback):

        feedback = feedback.lower()

        if any(word in feedback for word in
               ["crash", "bug", "error", "issue", "failure"]):
            return "Bug"

        elif any(word in feedback for word in
                 ["feature", "add", "enhancement", "request"]):
            return "Feature Request"

        elif any(word in feedback for word in
                 ["slow", "lag", "performance", "delay"]):
            return "Performance"

        elif any(word in feedback for word in
                 ["login", "password", "security", "authentication"]):
            return "Security"

        elif any(word in feedback for word in
                 ["price", "payment", "refund", "subscription"]):
            return "Pricing"

        elif any(word in feedback for word in
                 ["good", "excellent", "great", "love", "amazing"]):
            return "Praise"

        elif any(word in feedback for word in
                 ["support", "ticket", "help", "service"]):
            return "Customer Support"

        return None

    # --------------------------------------------------
    # Semantic Categorization
    # --------------------------------------------------

    def semantic_category(self, feedback):

        feedback_embedding = self.model.encode(
            feedback,
            convert_to_tensor=True
        )

        best_category = "General Feedback"
        best_score = 0

        for category, embedding in self.category_embeddings.items():

            score = util.cos_sim(
                feedback_embedding,
                embedding
            ).item()

            if score > best_score:

                best_score = score
                best_category = category

        return best_category

    # --------------------------------------------------
    # Hybrid Categorization
    # --------------------------------------------------

    def categorize_feedback(self, feedback):

        category = self.keyword_category(feedback)

        if category is not None:
            return category

        return self.semantic_category(feedback)

    # --------------------------------------------------
    # DataFrame Categorization
    # --------------------------------------------------

    def categorize_dataframe(self, df):

        if "processed_feedback" not in df.columns:

            raise ValueError(
                "processed_feedback column not found."
            )

        # Categorize feedback
        df["category"] = df["processed_feedback"].apply(
            self.categorize_feedback
        )

        # Generate summary
        category_counts = (
            df["category"]
            .value_counts()
            .to_dict()
        )

        categorization_summary = {

            "total_categories": len(category_counts),

            "top_category": (
                df["category"].mode()[0]
                if not df.empty else None
            ),

            "category_distribution": category_counts
        }

        return df, categorization_summary