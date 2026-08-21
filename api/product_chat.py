from typing import Optional

from fastapi import APIRouter, HTTPException

from pydantic import BaseModel

from services.product_chat_service import (
    ProductChatService
)

from services import app_state


# =========================================================
# REQUEST MODEL
# =========================================================

class ProductChatRequest(BaseModel):

    question: str


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(

    prefix="/product-chat",

    tags=["Product Chat"]
)


# =========================================================
# SERVICE
# =========================================================

product_chat_service = ProductChatService()


# =========================================================
# PRODUCT CHAT
# =========================================================

@router.post("/")
def product_chat(
    request: ProductChatRequest
):

    # =====================================================
    # STEP 1: CHECK QUESTION
    # =====================================================

    if not request.question.strip():

        raise HTTPException(

            status_code=400,

            detail="Question is required."
        )


    # =====================================================
    # STEP 2: GET PROCESSED DATASET
    # =====================================================

    df = app_state.processed_df


    # =====================================================
    # STEP 3: GET GENERATED PRD
    # =====================================================

    prd = app_state.generated_prd


    # =====================================================
    # STEP 4: GET USER STORIES
    # =====================================================

    user_stories = (
        app_state.generated_user_stories
    )


    # =====================================================
    # STEP 5: PRODUCT CHAT
    # =====================================================

    try:

        result = product_chat_service.chat(

            question=request.question,

            df=df,

            prd=prd,

            user_stories=user_stories
        )


        # =================================================
        # STEP 6: CHECK RESULT
        # =================================================

        if result.get("status") != "success":

            raise HTTPException(

                status_code=400,

                detail=result.get(

                    "message",

                    "Product Chat failed."
                )
            )


        # =================================================
        # STEP 7: RETURN
        # =================================================

        return {

            "status":
                "success",

            "question":
                result.get(
                    "question",
                    request.question
                ),

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


    except HTTPException:

        raise


    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=(
                f"Product Chat failed: {str(e)}"
            )
        )