from services.llm_service import LLMService
from services.rag_service import RAGService


class ProductChatService:

    def __init__(self):

        self.llm = LLMService()
        self.rag = RAGService()


    def chat(
        self,
        question,
        df=None,
        prd=None,
        user_stories=None,
        tasks=None
    ):

        # =================================================
        # STEP 1: CHECK QUESTION
        # =================================================

        if not question:

            return {
                "status": "failed",
                "message": "Question is required."
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
            # Category
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
            # Sentiment
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
            # Themes
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
            # Pain Points
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
            # Feature Requests
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
        # STEP 4: CREATE RAG CONTEXT
        # =================================================

        rag_context = ""

        for item in relevant_feedback:

            rag_context += (
                f"- {item.get('feedback', '')}\n"
            )


        # =================================================
        # STEP 5: CREATE PRODUCT CONTEXT
        # =================================================

        product_context = f"""

DATASET ANALYSIS:

{dataset_context}


RAG RETRIEVED CUSTOMER FEEDBACK:

{rag_context}


GENERATED PRD:

{prd if prd else "PRD has not been generated yet."}


GENERATED USER STORIES:

{user_stories if user_stories else "User stories have not been generated yet."}


GENERATED DEVELOPMENT TASKS:

{tasks if tasks else "Development tasks have not been generated yet."}
"""


        # =================================================
        # STEP 6: CREATE CHAT PROMPT
        # =================================================

        prompt = f"""
You are an AI Product Manager Copilot.

Answer the Product Manager's question using
the available product information.

PRODUCT INFORMATION:

{product_context}


PRODUCT MANAGER QUESTION:

{question}


IMPORTANT RULES:

1. Use the provided product information as the
   primary source.

2. Use RAG-retrieved feedback when the question
   relates to customer feedback.

3. Do not invent customer feedback.

4. Do not claim something came from customers
   unless it is supported by the provided data.

5. If the information is unavailable, clearly say
   that the information is not available.

6. Give a concise but useful Product Manager
   oriented answer.

7. When appropriate, explain the reasoning using
   the available data.

8. If the question concerns the PRD, use the PRD.

9. If the question concerns user stories, use the
   generated user stories.

10. If the question concerns development work,
    use the generated tasks.
"""


        # =================================================
        # STEP 7: GEMINI
        # =================================================

        answer = self.llm.generate(
            prompt
        )


        # =================================================
        # STEP 8: RETURN
        # =================================================

        return {

            "status": "success",

            "question": question,

            "answer": answer,

            "retrieved_feedback":
                relevant_feedback
        }