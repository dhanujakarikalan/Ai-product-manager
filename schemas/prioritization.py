from pydantic import BaseModel, Field
from typing import List


class FeatureScore(BaseModel):
    feature: str

    customer_demand: float = Field(
        ..., ge=0, le=10
    )

    business_value: float = Field(
        ..., ge=0, le=10
    )

    user_impact: float = Field(
        ..., ge=0, le=10
    )

    strategic_alignment: float = Field(
        ..., ge=0, le=10
    )

    urgency: float = Field(
        ..., ge=0, le=10
    )


class PrioritizationRequest(BaseModel):

    features: List[FeatureScore]

    customer_demand_weight: float = 0.30
    business_value_weight: float = 0.25
    user_impact_weight: float = 0.20
    strategic_alignment_weight: float = 0.15
    urgency_weight: float = 0.10