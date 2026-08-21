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


        # =================================================
        # CATEGORY ANALYSIS
        # =================================================

        if "category" in df.columns:

            category_counts = (
                df["category"]
                .dropna()
                .value_counts()
                .to_dict()
            )

            for category, count in category_counts.items():

                recommendations.append({

                    "area": str(category),

                    "type": "Category",

                    "signals": int(count)

                })


        # =================================================
        # THEME ANALYSIS
        # =================================================

        if "theme" in df.columns:

            theme_counts = (
                df["theme"]
                .dropna()
                .value_counts()
                .to_dict()
            )

            for theme, count in theme_counts.items():

                recommendations.append({

                    "area": str(theme),

                    "type": "Theme",

                    "signals": int(count)

                })


        # =================================================
        # PAIN POINT ANALYSIS
        # =================================================

        if "pain_point" in df.columns:

            pain_counts = (
                df["pain_point"]
                .dropna()
                .value_counts()
                .to_dict()
            )

            for pain, count in pain_counts.items():

                recommendations.append({

                    "area": str(pain),

                    "type": "Pain Point",

                    "signals": int(count)

                })


        # =================================================
        # FEATURE REQUEST ANALYSIS
        # =================================================

        if "feature_request" in df.columns:

            feature_counts = (
                df["feature_request"]
                .dropna()
                .value_counts()
                .to_dict()
            )

            for feature, count in feature_counts.items():

                recommendations.append({

                    "area": str(feature),

                    "type": "Feature Request",

                    "signals": int(count)

                })


        # =================================================
        # SORT BY FREQUENCY
        # =================================================

        recommendations = sorted(

            recommendations,

            key=lambda x: x["signals"],

            reverse=True

        )


        # =================================================
        # REMOVE DUPLICATE AREAS
        # =================================================

        unique_recommendations = []

        seen = set()


        for item in recommendations:

            area = item["area"].strip().lower()


            if not area:

                continue


            if area not in seen:

                seen.add(area)

                unique_recommendations.append(item)


        # =================================================
        # TOP 5 RECOMMENDATIONS
        # =================================================

        return unique_recommendations[:5]


    # =====================================================
    # GENERATE PRD
    # =====================================================

    def generate_prd(self, df):


        # =================================================
        # STEP 1: TOTAL FEEDBACK
        # =================================================

        total_feedback = len(df)


        # =================================================
        # STEP 2: CATEGORY SUMMARY
        # =================================================

        if "category" in df.columns:

            category_summary = (

                df["category"]

                .dropna()

                .value_counts()

                .to_dict()

            )

        else:

            category_summary = {}


        # =================================================
        # STEP 3: SENTIMENT SUMMARY
        # =================================================

        if "sentiment" in df.columns:

            sentiment_summary = (

                df["sentiment"]

                .dropna()

                .value_counts()

                .to_dict()

            )

        else:

            sentiment_summary = {}


        # =================================================
        # STEP 4: THEME SUMMARY
        # =================================================

        if "theme" in df.columns:

            theme_summary = (

                df["theme"]

                .dropna()

                .value_counts()

                .to_dict()

            )

        else:

            theme_summary = {}


        # =================================================
        # STEP 5: PAIN POINT SUMMARY
        # =================================================

        if "pain_point" in df.columns:

            pain_point_summary = (

                df["pain_point"]

                .dropna()

                .value_counts()

                .to_dict()

            )

        else:

            pain_point_summary = {}


        # =================================================
        # STEP 6: FEATURE REQUEST SUMMARY
        # =================================================

        if "feature_request" in df.columns:

            feature_request_summary = (

                df["feature_request"]

                .dropna()

                .value_counts()

                .to_dict()

            )

        else:

            feature_request_summary = {}


        # =================================================
        # STEP 7: AUTOMATIC RECOMMENDATIONS
        # =================================================

        recommendations = (

            self.get_recommendations(df)

        )


        # =================================================
        # STEP 8: PREPARE ALL FEEDBACK FOR RAG
        # =================================================

        feedback_list = []


        if "feedback" in df.columns:

            columns = ["feedback"]


            optional_columns = [

                "category",

                "theme",

                "sentiment",

                "pain_point",

                "feature_request"

            ]


            for column in optional_columns:

                if column in df.columns:

                    columns.append(column)


            feedback_list = (

                df[columns]

                .dropna(
                    subset=["feedback"]
                )

                .to_dict(
                    orient="records"
                )

            )


        # =================================================
        # STEP 9: RAG QUERY
        # =================================================

        query = """

        Identify customer feedback that provides
        strong evidence about the most important
        product problems, recurring pain points,
        customer needs, product improvement
        opportunities and feature requirements.

        Focus on evidence supporting the major
        product areas identified from the dataset.

        """


        # =================================================
        # STEP 10: RAG RETRIEVAL
        # =================================================

        relevant_feedback = (

            self.rag.retrieve_relevant_feedback(

                query=query,

                top_k=10

            )

        )


        # =================================================
        # STEP 11: CONVERT RETRIEVED DATA TO TEXT
        # =================================================

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
        # STEP 12: CREATE PRD PROMPT
        # =================================================

        prompt = f"""

You are an AI Product Manager Copilot.

Your task is to analyze the complete processed
customer feedback dataset and create a professional
Product Requirements Document (PRD) focused on
customer insights, product problems, opportunities,
requirements and success criteria.

The dataset has already been cleaned and processed.

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
AUTOMATIC PRODUCT AREA RECOMMENDATIONS
==================================================

{recommendations}


==================================================
RAG RETRIEVED CUSTOMER EVIDENCE
==================================================

{retrieved_context}


==================================================
PRD GENERATION INSTRUCTIONS
==================================================

Generate a professional Product Requirements
Document using the complete dataset analysis.

The recommendations represent areas with strong
signals in the processed dataset.

Use the RAG retrieved feedback as supporting
customer evidence.

Do not treat the RAG results as the complete dataset.

The complete dataset summaries are the primary
source for frequency and trend analysis.


==================================================
GENERATE THE FOLLOWING PRD SECTIONS
==================================================

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
PRD SCOPE
==================================================

IMPORTANT:

Do NOT generate an Executive Summary.

The Executive Summary is generated separately
as part of Milestone 4.

Do NOT generate a Product Roadmap.

Roadmap planning is handled by the existing
Roadmap Planner module.

Do NOT generate Milestone Recommendations.

Milestone recommendations are handled by the
Milestone 4 module.

Do NOT generate a Product Strategy Report.

Product Strategy is generated separately by
the Milestone 4 module.

Keep this PRD focused on:

- Customer insights
- Customer problems
- Product themes
- Feature requests
- Product opportunities
- Problem statements
- Product objectives
- Proposed solutions
- Target users
- Functional requirements
- Non-functional requirements
- UX considerations
- Success metrics
- Risks and assumptions
- Future enhancements


==================================================
IMPORTANT RULES
==================================================

- Analyze the complete dataset.

- Do not assume that only the retrieved RAG
  feedback represents the dataset.

- Use category, sentiment, themes, pain points
  and feature requests to identify important
  product problems.

- Focus on recurring and high-impact problems.

- Use retrieved feedback only as supporting
  evidence.

- Do not invent customer statements.

- Do not create unsupported features.

- Clearly separate evidence from assumptions.

- Functional requirements must be specific
  and actionable.

- Functional requirements should later be
  usable for User Story generation.

- Write the document as a professional
  Product Manager.

- Use normal human-readable language.

- Do NOT return JSON.

- Do NOT return Python dictionaries.

"""


        # =================================================
        # STEP 13: GEMINI
        # =================================================

        prd = self.llm.generate(

            prompt

        )


        # =================================================
        # STEP 14: RETURN RESULT
        # =================================================

        return {

            "prd": prd,

            "total_feedback":
                total_feedback,

            "category_summary":
                category_summary,

            "sentiment_summary":
                sentiment_summary,

            "theme_summary":
                theme_summary,

            "pain_point_summary":
                pain_point_summary,

            "feature_request_summary":
                feature_request_summary,

            "recommendations":
                recommendations,

            "retrieved_feedback":
                relevant_feedback,

            "retrieved_feedback_count":
                len(relevant_feedback),

            "retrieved_context":
                retrieved_context

        }