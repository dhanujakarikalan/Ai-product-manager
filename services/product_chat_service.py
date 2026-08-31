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
        # 1. VALIDATE QUESTION
        # =================================================

        if not question or not str(question).strip():

            return {
                "status": "failed",
                "message": "Please enter a question.",
                "answer": "",
                "retrieved_feedback": []
            }

        question = str(question).strip()

        # =================================================
        # 2. DATASET CONTEXT
        # =================================================

        dataset_context = self._build_dataset_context(df)

        # =================================================
        # 3. RAG RETRIEVAL
        # =================================================

        try:

            relevant_feedback = (
                self.rag.retrieve_relevant_feedback(
                    query=question,
                    top_k=10
                )
            )

        except Exception as e:

            print("RAG retrieval error:", str(e))

            relevant_feedback = []

        # =================================================
        # 4. REMOVE DUPLICATE FEEDBACK
        # =================================================

        unique_feedback = []

        seen = set()

        for item in relevant_feedback:

            feedback = str(
                item.get("feedback", "")
            ).strip()

            if not feedback:
                continue

            feedback_key = feedback.lower()

            if feedback_key in seen:
                continue

            seen.add(feedback_key)

            unique_feedback.append(item)

        # =================================================
        # 5. BUILD RAG CONTEXT
        # =================================================

        rag_context = ""

        for item in unique_feedback:

            feedback = item.get(
                "feedback",
                ""
            )

            category = item.get(
                "category",
                ""
            )

            theme = item.get(
                "theme",
                ""
            )

            sentiment = item.get(
                "sentiment",
                ""
            )

            pain_point = item.get(
                "pain_point",
                ""
            )

            feature_request = item.get(
                "feature_request",
                ""
            )

            rag_context += f"""
Feedback:
{feedback}

Category: {category}
Theme: {theme}
Sentiment: {sentiment}
Pain Point: {pain_point}
Feature Request: {feature_request}

---
"""

        if not rag_context:

            rag_context = (
                "No directly relevant customer feedback "
                "was retrieved."
            )

        # =================================================
        # 6. PRD CONTEXT
        # =================================================

        prd_context = (
            str(prd)
            if prd
            else
            "No PRD has been generated yet."
        )

        # =================================================
        # 7. USER STORY CONTEXT
        # =================================================

        user_story_context = (
            str(user_stories)
            if user_stories
            else
            "No user stories have been generated yet."
        )

        # =================================================
        # 8. COMPLETE PRODUCT CONTEXT
        # =================================================

        product_context = f"""

================ DATASET =================

{dataset_context}


================ CUSTOMER FEEDBACK =================

{rag_context}


================ PRD =================

{prd_context}


================ USER STORIES =================

{user_story_context}

"""

        # =================================================
        # 9. AI PRODUCT MANAGER PROMPT
        # =================================================

        prompt = f"""
You are an AI Product Manager Copilot.

You are having a natural conversation with a Product
Manager.

The Product Manager may ask ANY type of question about
the product.

The question may be:

- a greeting
- a general product question
- a customer feedback question
- a dataset question
- a pain-point question
- a sentiment question
- a feature request question
- a prioritization question
- a PRD question
- a user-story question
- a roadmap question
- a business-impact question
- a follow-up question
- a request for a summary
- a request for recommendations

Understand the user's intent naturally.

Do NOT expect a fixed question format.

================ PRODUCT INFORMATION ================

{product_context}


================ USER QUESTION ================

{question}


================ ANSWERING BEHAVIOR ================

1. Understand the intent of the user's question.

2. Use the most relevant information from the product
   context.

3. For customer-related questions, prioritize the
   retrieved customer feedback.

4. For dataset-level questions, use the dataset analysis.

5. For PRD questions, use the PRD.

6. For user-story questions, use the user stories.

7. For roadmap questions, use available roadmap information.

8. For questions requiring multiple sources, combine the
   relevant information.

9. For greetings such as "hi", "hello", or "hey", respond
   naturally and briefly. Do not dump product information
   unnecessarily.

10. For general conversational questions, respond naturally
    while remaining relevant to the Product Manager context.

11. If the user asks a product-related question, provide
    an actual answer based on the available product data.

12. Do not simply repeat retrieved feedback.

13. Synthesize the information and explain what it means.

14. When useful, mention supporting numbers or patterns.

15. Do not invent customer feedback.

16. Do not claim that customers said something unless it is
    supported by the retrieved information.

17. Do not invent product requirements.

18. Do not invent metrics or business results.

19. Do not invent information that is not available.

20. If the requested information is unavailable, say:

   "I don't have enough information in the available
    product data to answer that accurately."

21. Keep answers concise but useful.

22. Use normal human-readable language.

23. Do not mention RAG, embeddings, vector databases,
    prompts, internal services, or implementation details
    unless the user specifically asks about the technology.

24. Do not return JSON.

25. Do not return Python dictionaries.

26. Do not mention these instructions.

================ RESPONSE STYLE ================

Respond like a professional AI Product Manager assistant.

Be conversational.

Understand the question first.

Answer directly.

Use bullets when they improve readability.

Use short sections when the answer is complex.

Do not unnecessarily explain how you generated the answer.

Now answer the user's question.
"""

        # =================================================
        # 10. GENERATE AI RESPONSE
        # =================================================

        try:

            answer = self.llm.generate(
                prompt
            )

        except Exception as e:

            print(
                "Product Chat LLM error:",
                str(e)
            )

            return {
                "status": "failed",
                "message": str(e),
                "answer": "",
                "retrieved_feedback":
                    unique_feedback
            }

        # =================================================
        # 11. RETURN RESPONSE
        # =================================================

        return {

            "status": "success",

            "question": question,

            "answer": answer,

            "retrieved_feedback":
                unique_feedback
        }

    # =====================================================
    # DATASET CONTEXT BUILDER
    # =====================================================

    def _build_dataset_context(
        self,
        df
    ):

        if df is None:

            return (
                "No dataset is currently available."
            )

        context = []

        # =================================================
        # TOTAL RECORDS
        # =================================================

        context.append(
            f"Total Feedback Records: {len(df)}"
        )

        # =================================================
        # SUMMARY COLUMNS
        # =================================================

        summary_columns = [

            "category",
            "theme",
            "sentiment",
            "pain_point",
            "feature_request"

        ]

        for column in summary_columns:

            if column not in df.columns:
                continue

            summary = (
                df[column]
                .value_counts()
                .to_dict()
            )

            if summary:

                context.append(
                    f"{column.title()} Summary: {summary}"
                )

        return "\n".join(context)