from fastapi import APIRouter, HTTPException

from schemas.prioritization import PrioritizationRequest
from services.feature_prioritization import FeaturePrioritization


router = APIRouter(
    prefix="/prioritization",
    tags=["Feature Prioritization"]
)


prioritization_service = FeaturePrioritization()


@router.post("/rank")
def prioritize_features(request: PrioritizationRequest):

    try:

        results = prioritization_service.prioritize_features(
            features=request.features,
            customer_demand_weight=request.customer_demand_weight,
            business_value_weight=request.business_value_weight,
            user_impact_weight=request.user_impact_weight,
            strategic_alignment_weight=request.strategic_alignment_weight,
            urgency_weight=request.urgency_weight
        )

        return {
            "message": "Features prioritized successfully",
            "total_features": len(results),
            "results": results
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Feature prioritization failed: {str(e)}"
        )