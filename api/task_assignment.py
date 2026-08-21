from fastapi import APIRouter, HTTPException

from services.task_assignment_service import (
    TaskAssignmentService
)

from services import app_state


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(

    prefix="/tasks",

    tags=["Task Assignment"]
)


# =========================================================
# SERVICE
# =========================================================

task_service = TaskAssignmentService()


# =========================================================
# GENERATE TASKS
# =========================================================

@router.post("/generate")
def generate_tasks():

    # =====================================================
    # CHECK USER STORIES
    # =====================================================

    if not app_state.generated_user_stories:

        raise HTTPException(

            status_code=400,

            detail=(
                "Please generate user stories first."
            )
        )


    # =====================================================
    # GET USER STORIES
    # =====================================================

    user_stories = (
        app_state.generated_user_stories
    )


    # =====================================================
    # GENERATE WORK ITEMS
    # =====================================================

    try:

        result = (
            task_service
            .generate_tasks(
                user_stories=user_stories
            )
        )


        # =================================================
        # STORE TASKS
        # =================================================

        app_state.generated_tasks = (
            result.get(
                "tasks",
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
                "Development work items generated successfully.",

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