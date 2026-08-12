from fastapi import APIRouter, HTTPException

from services.user_story_generation import (
    UserStoryGenerationService
)

from services import app_state


router = APIRouter(
    prefix="/user-story",
    tags=["User Story Generation"]
)


user_story_service = UserStoryGenerationService()


@router.post("/generate")
def generate_user_stories():

    # ==========================================
    # STEP 1: CHECK PRD
    # ==========================================

    if not app_state.generated_prd:

        raise HTTPException(
            status_code=400,
            detail="Please generate PRD first."
        )


    # ==========================================
    # STEP 2: GET PRD
    # ==========================================

    prd = app_state.generated_prd


    # ==========================================
    # STEP 3: GENERATE USER STORIES
    # ==========================================

    try:

        result = (
            user_story_service
            .generate_user_stories(
                prd=prd
            )
        )


        # ==========================================
        # STEP 4: SAVE USER STORIES
        # ==========================================

        app_state.generated_user_stories = (
            result.get(
                "user_stories",
                ""
            )
        )


        # ==========================================
        # STEP 5: RETURN
        # ==========================================

        return {

            "status": "success",

            "message":
                "User stories generated successfully.",

            "user_stories":
                app_state.generated_user_stories
        }


    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=(
                f"User story generation failed: {str(e)}"
            )
        )