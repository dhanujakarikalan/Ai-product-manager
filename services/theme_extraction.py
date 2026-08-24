# =========================================================
# services/theme_extraction.py
# THEME EXTRACTION SERVICE
# =========================================================

import re

from sentence_transformers import (
    SentenceTransformer,
    util
)


class ThemeExtraction:

    def __init__(self):

        # -------------------------------------------------
        # Embedding model
        # -------------------------------------------------

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )


        # -------------------------------------------------
        # Product themes
        # -------------------------------------------------

        self.themes = {

            "Usability & UX":
                "user interface navigation usability user experience confusing difficult easy to use design",

            "Performance":
                "slow lag loading speed latency timeout response performance",

            "Reliability & Bugs":
                "bug error crash failure broken defect issue unreliable downtime",

            "Security & Authentication":
                "login password authentication security privacy access permission account",

            "Pricing & Billing":
                "price pricing payment billing subscription refund charge cost expensive",

            "Customer Support":
                "support help service ticket agent response resolution customer service",

            "Features & Functionality":
                "feature functionality capability enhancement improvement missing feature",

            "Notifications":
                "notification alert reminder email message push notification",

            "Search & Discovery":
                "search filter finding results discovery lookup navigation",

            "Reports & Analytics":
                "reports analytics dashboard metrics statistics data visualization insights",

            "Integrations":
                "integration api connector third party external system synchronization sync",

            "Mobile Experience":
                "mobile android ios smartphone tablet mobile application responsive",

            "Data & Content":
                "data content records upload import export missing incorrect information",

            "Workflow & Automation":
                "workflow automation task process approval repetitive productivity",

            "General Feedback":
                "general feedback suggestion opinion comment experience"

        }


        # -------------------------------------------------
        # Create embeddings once
        # -------------------------------------------------

        self.theme_embeddings = {

            theme: self.model.encode(
                description,
                convert_to_tensor=True,
                normalize_embeddings=True
            )

            for theme, description
            in self.themes.items()

        }


        # -------------------------------------------------
        # Keyword signals
        # -------------------------------------------------

        self.keyword_map = {

            "Usability & UX": [
                "confusing",
                "difficult",
                "easy to use",
                "navigation",
                "interface",
                "ui",
                "ux"
            ],

            "Performance": [
                "slow",
                "lag",
                "loading",
                "latency",
                "timeout",
                "speed"
            ],

            "Reliability & Bugs": [
                "bug",
                "error",
                "crash",
                "broken",
                "failure",
                "defect",
                "issue"
            ],

            "Security & Authentication": [
                "login",
                "password",
                "authentication",
                "security",
                "privacy",
                "permission",
                "access"
            ],

            "Pricing & Billing": [
                "price",
                "pricing",
                "payment",
                "billing",
                "subscription",
                "refund",
                "charge",
                "cost"
            ],

            "Customer Support": [
                "support",
                "help",
                "ticket",
                "agent",
                "response",
                "service"
            ],

            "Features & Functionality": [
                "feature",
                "functionality",
                "capability",
                "enhancement",
                "improvement"
            ],

            "Notifications": [
                "notification",
                "alert",
                "reminder",
                "email",
                "push"
            ],

            "Search & Discovery": [
                "search",
                "filter",
                "find",
                "results",
                "discovery"
            ],

            "Reports & Analytics": [
                "report",
                "analytics",
                "dashboard",
                "metrics",
                "statistics"
            ],

            "Integrations": [
                "integration",
                "api",
                "connector",
                "sync",
                "third party"
            ],

            "Mobile Experience": [
                "mobile",
                "android",
                "ios",
                "smartphone",
                "tablet"
            ],

            "Data & Content": [
                "data",
                "content",
                "record",
                "upload",
                "import",
                "export"
            ],

            "Workflow & Automation": [
                "workflow",
                "automation",
                "automate",
                "task",
                "approval",
                "process"
            ]

        }


    # =====================================================
    # CLEAN TEXT
    # =====================================================

    def _clean_text(
        self,
        text
    ):

        if text is None:

            return ""

        text = str(text).lower()

        text = re.sub(
            r"\s+",
            " ",
            text
        )

        return text.strip()


    # =====================================================
    # FIND SOURCE TEXT COLUMN
    # =====================================================

    def _find_text_column(
        self,
        df
    ):

        possible_columns = [

            "processed_feedback",
            "feedback",
            "feedback_text",
            "text",
            "comment",
            "content",
            "message",
            "review",
            "description"

        ]


        for column in possible_columns:

            if column in df.columns:

                return column


        return None


    # =====================================================
    # KEYWORD SCORE
    # =====================================================

    def _keyword_score(
        self,
        text,
        theme
    ):

        keywords = self.keyword_map.get(
            theme,
            []
        )


        if not keywords:

            return 0.0


        matched = 0


        for keyword in keywords:

            if keyword in text:

                matched += 1


        return min(
            matched,
            3
        )


    # =====================================================
    # EXTRACT ONE THEME
    # =====================================================

    def extract_theme(
        self,
        feedback
    ):

        text = self._clean_text(
            feedback
        )


        if not text:

            return "General Feedback"


        # -------------------------------------------------
        # Semantic embedding
        # -------------------------------------------------

        feedback_embedding = self.model.encode(

            text,

            convert_to_tensor=True,

            normalize_embeddings=True

        )


        scores = []


        for (
            theme,
            theme_embedding
        ) in self.theme_embeddings.items():

            semantic_score = util.cos_sim(
                feedback_embedding,
                theme_embedding
            ).item()


            keyword_score = (
                self._keyword_score(
                    text,
                    theme
                )
            )


            # -------------------------------------------------
            # Combined score
            # -------------------------------------------------

            final_score = (

                semantic_score * 0.75

                +

                keyword_score * 0.08

            )


            scores.append(
                (
                    theme,
                    final_score
                )
            )


        scores.sort(
            key=lambda item: item[1],
            reverse=True
        )


        best_theme = scores[0][0]

        best_score = scores[0][1]


        # -------------------------------------------------
        # Very weak match
        # -------------------------------------------------

        if best_score < 0.20:

            return "General Feedback"


        return best_theme


    # =====================================================
    # EXTRACT THEMES FROM DATAFRAME
    # =====================================================

    def extract_dataframe_themes(
        self,
        df
    ):

        if df is None:

            raise ValueError(
                "DataFrame cannot be None."
            )


        if df.empty:

            df["theme"] = []

            return (
                df,
                {
                    "total_themes": 0,
                    "top_theme": None,
                    "theme_distribution": {}
                }
            )


        # -------------------------------------------------
        # Find feedback text
        # -------------------------------------------------

        text_column = (
            self._find_text_column(df)
        )


        if text_column is None:

            raise ValueError(
                "No feedback text column found. "
                "Expected feedback, text, comment, "
                "content, message, or processed_feedback."
            )


        # -------------------------------------------------
        # Extract theme for every feedback row
        # -------------------------------------------------

        df["theme"] = (

            df[text_column]

            .fillna("")

            .astype(str)

            .apply(
                self.extract_theme
            )

        )


        # -------------------------------------------------
        # Count themes
        # -------------------------------------------------

        theme_distribution = (

            df["theme"]

            .value_counts()

            .to_dict()

        )


        # -------------------------------------------------
        # Top theme
        # -------------------------------------------------

        top_theme = None


        if theme_distribution:

            top_theme = max(

                theme_distribution,

                key=theme_distribution.get

            )


        # -------------------------------------------------
        # Theme percentages
        # -------------------------------------------------

        total_rows = len(df)

        theme_details = []


        for (
            theme,
            count
        ) in theme_distribution.items():

            percentage = (

                (count / total_rows) * 100

                if total_rows > 0

                else 0

            )


            theme_details.append({

                "theme": theme,

                "count": int(count),

                "percentage":
                    round(
                        percentage,
                        1
                    )

            })


        # -------------------------------------------------
        # Sort largest first
        # -------------------------------------------------

        theme_details.sort(

            key=lambda item:
                item["count"],

            reverse=True

        )


        # -------------------------------------------------
        # Final summary
        # -------------------------------------------------

        theme_summary = {

            "total_themes":
                len(theme_distribution),

            "top_theme":
                top_theme,

            "theme_distribution":
                theme_distribution,

            "theme_details":
                theme_details

        }


        return (
            df,
            theme_summary
        )