from services.llm_service import LLMService
from services.rag_service import RAGService


class PRDGenerationService:

    def __init__(self):

        self.llm = LLMService()

        self.rag = RAGService()


    # =====================================================
    # GENERATE PRD
    # =====================================================

    def generate_prd(
        self,
        df,
        theme_summary=None
    ):

        # =================================================
        # 1. TOTAL FEEDBACK
        # =================================================

        total_feedback = len(df)


        # =================================================
        # 2. INTERNAL CATEGORY ANALYSIS
        # =================================================

        if "category" in df.columns:

            category_summary = (
                df["category"]
                .value_counts()
                .to_dict()
            )

        else:

            category_summary = {}


        # =================================================
        # 3. INTERNAL SENTIMENT ANALYSIS
        # =================================================

        if "sentiment" in df.columns:

            sentiment_summary = (
                df["sentiment"]
                .value_counts()
                .to_dict()
            )

        else:

            sentiment_summary = {}


        # =================================================
        # 4. INTERNAL THEME ANALYSIS
        # =================================================

        if "theme" in df.columns:

            theme_summary_from_df = (
                df["theme"]
                .value_counts()
                .to_dict()
            )

        else:

            theme_summary_from_df = {}


        # =================================================
        # 5. INTERNAL PAIN POINT ANALYSIS
        # =================================================

        if "pain_point" in df.columns:

            pain_point_summary = (
                df["pain_point"]
                .value_counts()
                .to_dict()
            )

        else:

            pain_point_summary = {}


        # =================================================
        # 6. INTERNAL FEATURE REQUEST ANALYSIS
        # =================================================

        if "feature_request" in df.columns:

            feature_request_summary = (
                df["feature_request"]
                .value_counts()
                .to_dict()
            )

        else:

            feature_request_summary = {}


        # =================================================
        # 7. PREPARE COMPLETE FEEDBACK
        # =================================================

        feedback_list = []

        if "feedback" in df.columns:

            columns = ["feedback"]


            for column in [

                "category",
                "theme",
                "sentiment",
                "pain_point",
                "feature_request"

            ]:

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
        # 8. REBUILD RAG
        # =================================================

        if feedback_list:

            self.rag.rebuild_vectorstore(
                feedback_list
            )


        # =================================================
        # 9. RAG QUERY
        # =================================================

        query = """

        Identify strong customer evidence
        representing important recurring problems,
        customer needs, product opportunities,
        feature needs and customer experience issues.

        Focus on feedback that can support
        product requirements and product decisions.

        """


        # =================================================
        # 10. RETRIEVE SUPPORTING EVIDENCE
        # =================================================

        relevant_feedback = (

            self.rag.retrieve_relevant_feedback(

                query=query,

                top_k=10

            )

        )


        # =================================================
        # 11. CREATE CONTEXT
        # =================================================

        retrieved_context = "\n".join(

            [

                (
                    f"- {item['feedback']} "
                    f"(similarity: "
                    f"{item['similarity_score']:.3f})"
                )

                for item in relevant_feedback

            ]

        )


        if not retrieved_context:

            retrieved_context = (
                "No supporting customer "
                "evidence was retrieved."
            )


        # =================================================
        # 12. FINAL THEMES
        # =================================================

        final_themes = (

            theme_summary

            if theme_summary

            else theme_summary_from_df

        )


        # =================================================
        # 13. INTERNAL ANALYSIS
        # =================================================

        analysis_context = f"""

        TOTAL FEEDBACK:
        {total_feedback}

        CATEGORY SIGNALS:
        {category_summary}

        SENTIMENT SIGNALS:
        {sentiment_summary}

        THEME SIGNALS:
        {final_themes}

        PAIN POINT SIGNALS:
        {pain_point_summary}

        FEATURE REQUEST SIGNALS:
        {feature_request_summary}

        """


        # =================================================
        # 14. GEMINI PROMPT
        # =================================================

        prompt = f"""

You are an AI Product Manager Copilot.

Generate a professional Product Requirements
Document based on the analyzed customer
feedback dataset.

The dataset has already been cleaned
and processed.

Use the following analytical information
internally to make product decisions.

Do NOT reproduce the analysis dashboards
as separate sections in the final PRD.

INTERNAL ANALYSIS:

{analysis_context}


SUPPORTING CUSTOMER EVIDENCE:

{retrieved_context}


Use the complete dataset analysis to identify:

- Important customer problems
- Recurring customer needs
- High-impact product opportunities
- Product requirements
- Business impact
- Customer impact
- Product priorities
- Recommended solutions


Generate the PRD using these sections:

1. Executive Summary

2. Problem Statement

3. Customer Needs and Evidence

4. Major Product Requirements

5. Proposed Solution

6. Target Users

7. Functional Requirements

8. Non-Functional Requirements

9. User Experience Requirements

10. Product Priorities

11. Success Metrics

12. Risks and Assumptions

13. Future Enhancements


For Product Priorities, consider:

- Frequency
- Customer impact
- Business impact
- Severity
- Customer need
- Supporting evidence


Use:

P0 - Critical
P1 - High
P2 - Medium
P3 - Low


IMPORTANT:

- Analyze the complete dataset.
- RAG results are supporting evidence only.
- Do not treat the retrieved feedback as the
  entire dataset.
- Do not invent customer feedback.
- Do not create fake customer quotations.
- Do not repeat category dashboards.
- Do not repeat sentiment dashboards.
- Do not repeat theme dashboards.
- Do not repeat pain-point dashboards.
- Do not repeat feature-request dashboards.
- Focus on product decisions and requirements.
- Clearly distinguish evidence from assumptions.
- Write like a professional Product Manager.

"""


        # =================================================
        # 15. GEMINI
        # =================================================

        prd = self.llm.generate(
            prompt
        )


        # =================================================
        # 16. RETURN
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
                final_themes,

            "pain_point_summary":
                pain_point_summary,

            "feature_request_summary":
                feature_request_summary,

            "retrieved_feedback":
                relevant_feedback,

            "retrieved_feedback_count":
                len(relevant_feedback),

            "retrieved_context":
                retrieved_context
        }