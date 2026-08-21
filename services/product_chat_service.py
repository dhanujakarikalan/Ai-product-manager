from services.llm_service import LLMService
from services.rag_service import RAGService


class ProductChatService:

    def __init__(self):

        self.llm = LLMService()
        self.rag = RAGService()


    # =====================================================
    # PRODUCT CHAT
    # =====================================================

    def chat(
        self,
        question,
        df=None,
        prd=None,
        user_stories=None
    ):

        # =================================================
        # STEP 1: CHECK QUESTION
        # =================================================

        if not question or not str(question).strip():

            return {
                "status": "failed",
                "message": "Question is required.",
                "answer": ""
            }


        # =================================================
        # STEP 2: DATASET SUMMARY
        # =================================================

        dataset_context = ""


        if df is not None:

            total_feedback = len(df)

            dataset_context += (
                f"Total Feedback: {total_feedback}\n"
            )


            # ---------------------------------------------
            # CATEGORY
            # ---------------------------------------------

            if "category" in df.columns:

                category_summary = (
                    df["category"]
                    .value_counts()
                    .to_dict()
                )

                dataset_context += (
                    f"Category Summary: "
                    f"{category_summary}\n"
                )


            # ---------------------------------------------
            # SENTIMENT
            # ---------------------------------------------

            if "sentiment" in df.columns:

                sentiment_summary = (
                    df["sentiment"]
                    .value_counts()
                    .to_dict()
                )

                dataset_context += (
                    f"Sentiment Summary: "
                    f"{sentiment_summary}\n"
                )


            # ---------------------------------------------
            # THEME
            # ---------------------------------------------

            if "theme" in df.columns:

                theme_summary = (
                    df["theme"]
                    .value_counts()
                    .to_dict()
                )

                dataset_context += (
                    f"Theme Summary: "
                    f"{theme_summary}\n"
                )


            # ---------------------------------------------
            # PAIN POINT
            # ---------------------------------------------

            if "pain_point" in df.columns:

                pain_point_summary = (
                    df["pain_point"]
                    .value_counts()
                    .to_dict()
                )

                dataset_context += (
                    f"Pain Point Summary: "
                    f"{pain_point_summary}\n"
                )


            # ---------------------------------------------
            # FEATURE REQUEST
            # ---------------------------------------------

            if "feature_request" in df.columns:

                feature_request_summary = (
                    df["feature_request"]
                    .value_counts()
                    .to_dict()
                )

                dataset_context += (
                    f"Feature Request Summary: "
                    f"{feature_request_summary}\n"
                )


        # =================================================
        # STEP 3: RAG RETRIEVAL
        # =================================================

        relevant_feedback = (
            self.rag.retrieve_relevant_feedback(

                query=question,

                top_k=10
            )
        )


        # =================================================
        # STEP 4: RAG CONTEXT
        # =================================================

        rag_context = ""


        for item in relevant_feedback:

            feedback = item.get(
                "feedback",
                ""
            )

            if feedback:

                rag_context += (
                    f"- {feedback}\n"
                )


        if not rag_context:

            rag_context = (
                "No relevant customer feedback was retrieved."
            )


        # =================================================
        # STEP 5: PRD CONTEXT
        # =================================================

        prd_context = (

            prd
            if prd
            else
            "PRD has not been generated yet."
        )


        # =================================================
        # STEP 6: USER STORY CONTEXT
        # =================================================

        user_story_context = (

            user_stories
            if user_stories
            else
            "User stories have not been generated yet."
        )


        # =================================================
        # STEP 7: COMPLETE PRODUCT CONTEXT
        # =================================================

        product_context = f"""

=========================================================
DATASET ANALYSIS
=========================================================

{dataset_context}


=========================================================
RAG RETRIEVED CUSTOMER FEEDBACK
=========================================================

{rag_context}


=========================================================
GENERATED PRD
=========================================================

{prd_context}


=========================================================
USER STORIES AND WORK ITEMS
=========================================================

{user_story_context}

"""


        # =================================================
        # STEP 8: PRODUCT MANAGER PROMPT
        # =================================================

        prompt = f"""
You are an AI Product Manager Copilot.

Answer the Product Manager's question using the
provided product information.

PRODUCT INFORMATION:

{product_context}


PRODUCT MANAGER QUESTION:

{question}


=========================================================
ANSWERING RULES
=========================================================

1. Use the provided product information as the
   primary source.

2. For questions about overall customer feedback,
   use the Dataset Analysis.

3. For questions about specific customer problems,
   use RAG-retrieved customer feedback when available.

4. For questions about the product requirements,
   use the PRD.

5. For questions about functional requirements,
   use the PRD.

6. For questions about user stories,
   use the User Stories section.

7. For questions about acceptance criteria,
   use the User Stories section.

8. For questions about development work,
   use the Work Items contained inside the User Stories.

9. Do not invent customer feedback.

10. Do not claim that customers said something unless
    it is supported by the provided information.

11. Do not invent product requirements.

12. If the requested information is unavailable,
    clearly say that the information is not available.

13. When useful, include supporting numbers from
    the dataset.

14. Keep the response concise but useful for a
    Product Manager.

15. Explain the reasoning when it helps the Product
    Manager understand the decision.

16. Do not expose internal implementation details
    unless specifically asked.


Now answer the Product Manager's question.
"""


        # =================================================
        # STEP 9: GEMINI
        # =================================================

        answer = self.llm.generate(
            prompt
        )


        # =================================================
        # STEP 10: RETURN
        # =================================================

        return {

            "status":
                "success",

            "question":
                question,

            "answer":
                answer,

            "retrieved_feedback":
                relevant_feedback
        }