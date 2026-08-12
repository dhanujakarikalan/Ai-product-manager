from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.product_chat import (
    ProductChatService
)

from services import app_state


# =====================================================
# REQUEST MODEL
# =====================================================

class ChatRequest(BaseModel):

    question: str


# =====================================================
# ROUTER
# =====================================================

router = APIRouter(
    prefix="/product-chat",
    tags=["Product Chat"]
)


# =====================================================
# SERVICE
# =====================================================

chat_service = ProductChatService()


# =====================================================
# CHAT
# =====================================================

@router.post("/ask")
def ask_product_question(
    request: ChatRequest
):

    # =================================================
    # STEP 1: CHECK DATASET
    # =================================================

    if app_state.processed_df is None:

        raise HTTPException(
            status_code=400,
            detail="Please upload dataset first."
        )


    # =================================================
    # STEP 2: GET PRODUCT INFORMATION
    # =================================================

    df = app_state.processed_df

    prd = app_state.generated_prd

    user_stories = (
        app_state.generated_user_stories
    )

    tasks = app_state.generated_tasks


    # =================================================
    # STEP 3: GENERATE ANSWER
    # =================================================

    try:

        result = chat_service.chat(

            question=request.question,

            df=df,

            prd=prd,

            user_stories=user_stories,

            tasks=tasks
        )


        # =================================================
        # STEP 4: STORE RESPONSE
        # =================================================

        app_state.product_chat_response = (
            result.get(
                "answer",
                ""
            )
        )


        # =================================================
        # STEP 5: RETURN
        # =================================================

        return {

            "status": "success",

            "question":
                request.question,

            "answer":
                result.get(
                    "answer",
                    ""
                ),

            "retrieved_feedback":
                result.get(
                    "retrieved_feedback",
                    []
                )
        }


    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=(
                f"Product chat failed: {str(e)}"
            )
        )