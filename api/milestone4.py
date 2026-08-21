from fastapi import APIRouter, HTTPException

from services.milestone4_service import (
    Milestone4Service
)

from services import app_state


router = APIRouter(
    prefix="/milestone4",
    tags=["Milestone 4"]
)


milestone4_service = (
    Milestone4Service()
)


# =========================================================
# RUN COMPLETE MILESTONE 4
# =========================================================

@router.post("/run")
def run_milestone4():

    try:

        # =================================================
        # CHECK DATASET
        # =================================================

        processed_df = (
            app_state.processed_df
        )

        pipeline_result = (
            app_state.pipeline_result
        )

        if processed_df is None:

            raise HTTPException(

                status_code=400,

                detail=(
                    "No processed dataset found. "
                    "Please upload a dataset first."
                )

            )

        if not pipeline_result:

            raise HTTPException(

                status_code=400,

                detail=(
                    "No pipeline result found. "
                    "Please upload a dataset first."
                )

            )

        # =================================================
        # RUN COMPLETE MILESTONE 4
        # =================================================

        result = (
            milestone4_service.run(

                processed_df=processed_df,

                pipeline_result=pipeline_result

            )
        )

        # =================================================
        # RESPONSE
        # =================================================

        return {

            "status":
                "success",

            "message":
                "Milestone 4 completed successfully.",

            "feature_scores":
                result.get(
                    "feature_scores",
                    []
                ),

            "prioritization":
                result.get(
                    "prioritization",
                    []
                ),

            "roadmap":
                result.get(
                    "roadmap",
                    []
                ),

            "milestone_recommendation":
                result.get(
                    "milestone_recommendation",
                    ""
                ),

            "executive_summary":
                result.get(
                    "executive_summary",
                    ""
                ),

            "product_strategy":
                result.get(
                    "product_strategy",
                    ""
                ),

            "evaluation":
                result.get(
                    "evaluation",
                    ""
                )

        }

    except HTTPException:

        raise

    except Exception as e:

        print("\n" + "=" * 70)
        print("MILESTONE 4 ERROR")
        print("=" * 70)
        print(str(e))
        print("=" * 70 + "\n")

        raise HTTPException(

            status_code=500,

            detail=(
                f"Milestone 4 failed: {str(e)}"
            )

        )