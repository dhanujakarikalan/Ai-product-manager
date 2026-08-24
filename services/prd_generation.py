# =========================================================
# services/prd_generation.py
# =========================================================

from services.llm_service import LLMService
from services.rag_service import RAGService


class PRDGenerationService:

    def __init__(self):
        self.llm = LLMService()
        self.rag = RAGService()

    # =====================================================
    # AUTOMATIC PRODUCT AREA RECOMMENDATIONS
    # =====================================================

    def get_recommendations(self, df):

        recommendations = []

        # CATEGORY
        if "category" in df.columns:
            counts = (
                df["category"]
                .dropna()
                .astype(str)
                .str.strip()
                .value_counts()
            )

            for category, count in counts.items():
                if category:
                    recommendations.append({
                        "area": category,
                        "type": "Category",
                        "signals": int(count)
                    })

        # THEME
        if "theme" in df.columns:
            counts = (
                df["theme"]
                .dropna()
                .astype(str)
                .str.strip()
                .value_counts()
            )

            for theme, count in counts.items():
                if theme:
                    recommendations.append({
                        "area": theme,
                        "type": "Theme",
                        "signals": int(count)
                    })

        # PAIN POINT
        if "pain_point" in df.columns:
            counts = (
                df["pain_point"]
                .dropna()
                .astype(str)
                .str.strip()
                .value_counts()
            )

            for pain, count in counts.items():
                if pain:
                    recommendations.append({
                        "area": pain,
                        "type": "Pain Point",
                        "signals": int(count)
                    })

        # FEATURE REQUEST
        if "feature_request" in df.columns:
            counts = (
                df["feature_request"]
                .dropna()
                .astype(str)
                .str.strip()
                .value_counts()
            )

            for feature, count in counts.items():
                if feature:
                    recommendations.append({
                        "area": feature,
                        "type": "Feature Request",
                        "signals": int(count)
                    })

        # SORT
        recommendations.sort(
            key=lambda x: x["signals"],
            reverse=True
        )

        # REMOVE DUPLICATES
        unique = []
        seen = set()

        for item in recommendations:

            key = item["area"].strip().lower()

            if not key:
                continue

            if key in seen:
                continue

            seen.add(key)
            unique.append(item)

        return unique[:5]

    # =====================================================
    # GENERATE PRD
    # =====================================================

    def generate_prd(self, df):

        total_feedback = len(df)

        # CATEGORY
        if "category" in df.columns:
            category_summary = (
                df["category"]
                .dropna()
                .astype(str)
                .value_counts()
                .to_dict()
            )
        else:
            category_summary = {}

        # SENTIMENT
        if "sentiment" in df.columns:
            sentiment_summary = (
                df["sentiment"]
                .dropna()
                .astype(str)
                .value_counts()
                .to_dict()
            )
        else:
            sentiment_summary = {}

        # THEME
        if "theme" in df.columns:
            theme_summary = (
                df["theme"]
                .dropna()
                .astype(str)
                .value_counts()
                .to_dict()
            )
        else:
            theme_summary = {}

        # PAIN POINT
        if "pain_point" in df.columns:
            pain_point_summary = (
                df["pain_point"]
                .dropna()
                .astype(str)
                .value_counts()
                .to_dict()
            )
        else:
            pain_point_summary = {}

        # FEATURE REQUEST
        if "feature_request" in df.columns:
            feature_request_summary = (
                df["feature_request"]
                .dropna()
                .astype(str)
                .value_counts()
                .to_dict()
            )
        else:
            feature_request_summary = {}

        # RECOMMENDATIONS
        recommendations = self.get_recommendations(df)

        # =================================================
        # RAG CONTEXT
        # =================================================

        query = """
        Identify customer feedback that provides strong
        evidence about important product problems,
        recurring pain points, customer needs,
        product improvement opportunities and
        feature requirements.

        Focus on recurring and high-impact customer
        problems.
        """

        try:
            relevant_feedback = (
                self.rag.retrieve_relevant_feedback(
                    query=query,
                    top_k=10
                )
            )
        except Exception:
            relevant_feedback = []

        retrieved_context_parts = []

        for item in relevant_feedback:

            feedback_text = item.get(
                "feedback",
                ""
            )

            if feedback_text:
                retrieved_context_parts.append(
                    f"- {feedback_text}"
                )

        retrieved_context = "\n".join(
            retrieved_context_parts
        )

        # =================================================
        # PROMPT
        # =================================================

        prompt = f"""
You are an experienced Senior Product Manager.

Create a professional, evidence-based Product
Requirements Document from the processed customer
feedback dataset.

Do not perform data cleaning.

==================================================
DATASET OVERVIEW
==================================================

Total Feedback:
{total_feedback}

==================================================
CATEGORY SUMMARY
==================================================

{category_summary}

==================================================
SENTIMENT SUMMARY
==================================================

{sentiment_summary}

==================================================
THEME SUMMARY
==================================================

{theme_summary}

==================================================
PAIN POINT SUMMARY
==================================================

{pain_point_summary}

==================================================
FEATURE REQUEST SUMMARY
==================================================

{feature_request_summary}

==================================================
RECOMMENDED PRODUCT AREAS
==================================================

{recommendations}

==================================================
CUSTOMER EVIDENCE
==================================================

{retrieved_context}

==================================================
PRD STRUCTURE
==================================================

Generate the following sections:

1. Overall Customer Feedback Insights

2. Customer Sentiment Overview

3. Major Customer Problems

4. Top Product Themes

5. Feature Request Analysis

6. Recommended Product Areas

7. Product Opportunities

8. Problem Statement

9. Product Objective

10. Proposed Solution

11. Target Users

12. Functional Requirements

13. Non-Functional Requirements

14. User Experience Considerations

15. Success Metrics

16. Risks and Assumptions

17. Future Enhancements

==================================================
IMPORTANT
==================================================

Use the complete dataset summaries as the primary
source for frequency and importance.

Use retrieved customer feedback only as supporting
evidence.

Do not invent customer statements.

Do not invent unsupported features.

Clearly distinguish evidence from assumptions.

Functional requirements must be specific,
actionable and suitable for downstream User Story
generation.

Do not generate:

- Executive Summary
- Product Roadmap
- Milestone Recommendations
- Product Strategy Report

Those are generated by separate modules.

Return professional human-readable Markdown.

Do not return JSON.

Do not return Python dictionaries.
"""

        # =================================================
        # LLM
        # =================================================

        prd = self.llm.generate(prompt)

        # =================================================
        # RESULT
        # =================================================

        return {
            "prd": prd,
            "total_feedback": total_feedback,
            "category_summary": category_summary,
            "sentiment_summary": sentiment_summary,
            "theme_summary": theme_summary,
            "pain_point_summary": pain_point_summary,
            "feature_request_summary": feature_request_summary,
            "recommendations": recommendations,
            "retrieved_feedback": relevant_feedback,
            "retrieved_feedback_count": len(
                relevant_feedback
            ),
            "retrieved_context": retrieved_context
        }