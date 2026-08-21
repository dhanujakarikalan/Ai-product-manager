from fastapi import APIRouter, HTTPException

from schemas.prioritization import PrioritizationRequest
from services.feature_prioritization import FeaturePrioritization
from services import app_state


router = APIRouter(
    prefix="/prioritization",
    tags=["Feature Prioritization"]
)


prioritization_service = FeaturePrioritization()


@router.post("/rank")
def prioritize_features(
    request: PrioritizationRequest
):

    try:

        results = (
            prioritization_service.prioritize_features(

                features=request.features,

                customer_demand_weight=(
                    request.customer_demand_weight
                ),

                business_value_weight=(
                    request.business_value_weight
                ),

                user_impact_weight=(
                    request.user_impact_weight
                ),

                strategic_alignment_weight=(
                    request.strategic_alignment_weight
                ),

                urgency_weight=(
                    request.urgency_weight
                )
            )
        )

        # =================================================
        # SAVE RESULT FOR MILESTONE 4
        # =================================================

        app_state.generated_prioritization = results

        return {

            "message":
                "Features prioritized successfully",

            "total_features":
                len(results),

            "results":
                results
        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=(
                "Feature prioritization failed: "
                f"{str(e)}"
            )
        )