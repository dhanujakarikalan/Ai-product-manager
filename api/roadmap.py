from fastapi import APIRouter, HTTPException

from services import app_state

from services.roadmap_planner import (
    RoadmapPlanner
)

from services.milestone_recommender import (
    MilestoneRecommender
)

from services.evaluation import (
    RoadmapEvaluation
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/roadmap",
    tags=["Roadmap & Milestones"]
)


# =========================================================
# SERVICES
# =========================================================

roadmap_planner = RoadmapPlanner()

milestone_recommender = (
    MilestoneRecommender()
)

roadmap_evaluation = (
    RoadmapEvaluation()
)


# =========================================================
# GENERATE ROADMAP
# =========================================================

@router.post("/generate")
def generate_roadmap():

    try:

        # =================================================
        # GET PRIORITIZED FEATURES
        # =================================================

        prioritized_features = (
            app_state.generated_prioritization
        )

        if not prioritized_features:

            raise HTTPException(

                status_code=400,

                detail=(
                    "No prioritized features found. "
                    "Please run Feature Prioritization "
                    "before generating the roadmap."
                )
            )

        # =================================================
        # 1. ROADMAP
        # =================================================

        roadmap = (
            roadmap_planner.create_roadmap(
                prioritized_features
            )
        )

        app_state.generated_roadmap = roadmap

        # =================================================
        # 2. AI RECOMMENDATION
        # =================================================

        recommendation = (
            milestone_recommender.recommend(
                roadmap
            )
        )

        app_state.generated_milestone_recommendation = (
            recommendation
        )

        # =================================================
        # 3. EVALUATION
        # =================================================

        evaluation_report = (
            roadmap_evaluation.evaluate(
                roadmap,
                recommendation
            )
        )

        app_state.generated_roadmap_evaluation = (
            evaluation_report
        )

        # =================================================
        # RESPONSE
        # =================================================

        return {

            "message":
                "Roadmap generated successfully",

            "roadmap":
                roadmap,

            "recommendation":
                recommendation,

            "evaluation":
                evaluation_report
        }

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=(
                "Roadmap generation failed: "
                f"{str(e)}"
            )
        )