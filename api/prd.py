from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from services.prd_generation import (
    PRDGenerationService
)

from services import app_state


# =====================================================
# ROUTER
# =====================================================

router = APIRouter(
    prefix="/prd",
    tags=["PRD Generation"]
)


# =====================================================
# SERVICE
# =====================================================

prd_service = PRDGenerationService()


# =====================================================
# GENERATE PRD
# =====================================================

@router.post("/generate")
def generate_prd(

    category: Optional[str] = Query(

        default=None,

        description=(
            "Optional category filter. "
            "If provided, PRD is generated only "
            "for that category. "
            "If omitted, complete dataset is used."
        )

    )

):

    # =================================================
    # STEP 1: CHECK DATASET
    # =================================================

    if app_state.processed_df is None:

        raise HTTPException(

            status_code=400,

            detail=(
                "Please upload dataset first."
            )

        )


    # =================================================
    # STEP 2: GET DATASET
    # =================================================

    df = app_state.processed_df


    # =================================================
    # STEP 3: OPTIONAL CATEGORY FILTER
    # =================================================

    if category is not None:

        if "category" not in df.columns:

            raise HTTPException(

                status_code=500,

                detail=(
                    "Category column not found "
                    "in processed dataset."
                )

            )


        df = df[
            df["category"] == category
        ]


        if df.empty:

            raise HTTPException(

                status_code=400,

                detail=(
                    f"No feedback found for "
                    f"category: '{category}'"
                )

            )


    # =================================================
    # STEP 4: GENERATE PRD
    # =================================================

    try:

        result = prd_service.generate_prd(
            df=df
        )


        # =================================================
        # STEP 5: STORE GENERATED PRD
        # =================================================

        app_state.generated_prd = result.get(
            "prd",
            ""
        )


        # =================================================
        # STEP 6: RETURN RESPONSE
        # =================================================

        return {

            "status":
                "success",


            "message":
                "PRD generated successfully using "
                "complete dataset analysis, RAG "
                "and Gemini.",


            # ---------------------------------------------
            # GENERATION SCOPE
            # ---------------------------------------------

            "category_filter":
                category,


            # ---------------------------------------------
            # DATASET
            # ---------------------------------------------

            "total_feedback":
                result.get(
                    "total_feedback",
                    0
                ),


            # ---------------------------------------------
            # ANALYSIS
            # ---------------------------------------------

            "category_summary":
                result.get(
                    "category_summary",
                    {}
                ),


            "sentiment_summary":
                result.get(
                    "sentiment_summary",
                    {}
                ),


            "theme_summary":
                result.get(
                    "theme_summary",
                    {}
                ),


            "pain_point_summary":
                result.get(
                    "pain_point_summary",
                    {}
                ),


            "feature_request_summary":
                result.get(
                    "feature_request_summary",
                    {}
                ),


            # ---------------------------------------------
            # RAG
            # ---------------------------------------------

            "retrieved_feedback":
                result.get(
                    "retrieved_feedback",
                    []
                ),


            "retrieved_feedback_count":
                result.get(
                    "retrieved_feedback_count",
                    0
                ),


            "retrieved_context":
                result.get(
                    "retrieved_context",
                    ""
                ),


            # ---------------------------------------------
            # FINAL PRD
            # ---------------------------------------------

            "prd":
                result.get(
                    "prd",
                    ""
                )

        }


    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=(
                f"PRD generation failed: {str(e)}"
            )

        )