from fastapi import APIRouter, HTTPException, Query

from services.prd_generation import (
    PRDGenerationService
)

from services import app_state


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/prd",
    tags=["PRD"]
)


# =========================================================
# SERVICE
# =========================================================

prd_service = (
    PRDGenerationService()
)


# =========================================================
# GENERATE PRD
# =========================================================

@router.post("/generate")
def generate_prd(
    feature_title: str | None = Query(
        default=None,
        description="Optional feature request to scope the PRD."
    )
):

    try:

        # =================================================
        # CHECK PROCESSED DATA
        # =================================================

        if app_state.processed_df is None:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No processed dataset found. "
                    "Please upload a dataset first."
                )
            )

        # =================================================
        # GET PROCESSED DATAFRAME
        # =================================================

        processed_df = (
            app_state.processed_df
        )

        # =================================================
        # GENERATE PRD
        # =================================================

        result = prd_service.generate_prd(
            processed_df,
            feature_title=feature_title
        )

        # =================================================
        # STORE PRD
        # =================================================

        app_state.generated_prd = (
            result.get(
                "prd",
                ""
            )
        )

        # =================================================
        # STORE PIPELINE INFORMATION
        # =================================================

        if app_state.pipeline_result is None:

            app_state.pipeline_result = {}

        app_state.pipeline_result[
            "prd_result"
        ] = result

        # =================================================
        # RESPONSE
        # =================================================

        return {

            "message":
                "PRD generated successfully",

            "prd":
                result.get(
                    "prd",
                    ""
                ),

            "total_feedback":
                result.get(
                    "total_feedback",
                    0
                ),

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

            "recommendations":
                result.get(
                    "recommendations",
                    []
                ),

            "retrieved_feedback":
                result.get(
                    "retrieved_feedback",
                    []
                ),

            "retrieved_feedback_count":
                result.get(
                    "retrieved_feedback_count",
                    0
                )
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            "\nPRD GENERATION ERROR:"
        )

        print(
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"PRD generation failed: {str(e)}"
            )
        )


# =========================================================
# GET GENERATED PRD
# =========================================================

@router.get("/result")
def get_generated_prd():

    try:

        if not app_state.generated_prd:

            raise HTTPException(
                status_code=404,
                detail=(
                    "No PRD has been generated yet."
                )
            )

        return {

            "message":
                "PRD retrieved successfully",

            "prd":
                app_state.generated_prd
        }

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )