from fastapi import APIRouter, HTTPException, Query

from services.user_story_generation import (
    UserStoryGenerationService
)

from services import app_state


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(

    prefix="/user-story",

    tags=["User Story Generation"]
)


# =========================================================
# SERVICE
# =========================================================

user_story_service = (
    UserStoryGenerationService()
)


# =========================================================
# GENERATE USER STORIES + WORK ITEMS
# =========================================================

@router.post("/generate")
def generate_user_stories(

    count: int = Query(

        default=10,

        ge=1,

        le=50,

        description=(
            "Number of prioritized user stories "
            "to generate."
        )
    )

):

    # =====================================================
    # STEP 1: CHECK PRD
    # =====================================================

    if not app_state.generated_prd:

        raise HTTPException(

            status_code=400,

            detail=(
                "Please generate PRD first."
            )
        )


    # =====================================================
    # STEP 2: GET PRD
    # =====================================================

    prd = app_state.generated_prd


    # =====================================================
    # STEP 3: GENERATE USER STORIES
    # =====================================================

    try:

        result = (
            user_story_service
            .generate_user_stories(

                prd=prd,

                count=count
            )
        )


        # =================================================
        # CHECK RESULT
        # =================================================

        if result.get("status") != "success":

            raise HTTPException(

                status_code=400,

                detail=result.get(

                    "message",

                    "User story generation failed."
                )
            )


        # =================================================
        # STORE USER STORIES
        # =================================================

        app_state.generated_user_stories = (

            result.get(
                "user_stories",
                ""
            )
        )


        # =================================================
        # RETURN
        # =================================================

        return {

            "status":
                "success",

            "message":
                "User stories and work items generated successfully.",

            "requested_count":
                count,

            "user_stories":
                app_state.generated_user_stories
        }


    except HTTPException:

        raise


    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=(
                f"User story generation failed: {str(e)}"
            )
        )