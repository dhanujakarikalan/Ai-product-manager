from fastapi import APIRouter, HTTPException

from services.task_assignment_service import (
    TaskAssignmentService
)

from services import app_state


# =====================================================
# ROUTER
# =====================================================

router = APIRouter(
    prefix="/tasks",
    tags=["Task Assignment"]
)


# =====================================================
# SERVICE
# =====================================================

task_service = TaskAssignmentService()


# =====================================================
# GENERATE TASKS
# =====================================================

@router.post("/generate")
def generate_tasks():

    # ==========================================
    # STEP 1: CHECK USER STORIES
    # ==========================================

    if not app_state.generated_user_stories:

        raise HTTPException(
            status_code=400,
            detail="Please generate user stories first."
        )


    # ==========================================
    # STEP 2: GET USER STORIES
    # ==========================================

    user_stories = (
        app_state.generated_user_stories
    )


    # ==========================================
    # STEP 3: GENERATE TASKS
    # ==========================================

    try:

        result = task_service.generate_tasks(
            user_stories=user_stories
        )


        # ==========================================
        # STEP 4: SAVE GENERATED TASKS
        # ==========================================

        app_state.generated_tasks = (
            result.get(
                "tasks",
                ""
            )
        )


        # ==========================================
        # STEP 5: RETURN RESPONSE
        # ==========================================

        return {

            "status": "success",

            "message":
                "Development tasks generated successfully.",

            "tasks":
                app_state.generated_tasks
        }


    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=(
                f"Task generation failed: {str(e)}"
            )
        )