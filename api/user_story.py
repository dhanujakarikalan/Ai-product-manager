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
# GENERATE USER STORIES
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

    try:

        # =================================================
        # CHECK DATASET
        # =================================================

        if app_state.processed_df is None:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No processed dataset found. "
                    "Please upload and process a dataset first."
                )
            )


        # =================================================
        # CHECK GENERATED PRD
        # =================================================

        if not app_state.generated_prd:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Dataset is available, but no PRD has "
                    "been generated yet. Please generate the "
                    "PRD before creating user stories."
                )
            )


        # =================================================
        # GET PRD
        # =================================================

        prd = app_state.generated_prd


        # =================================================
        # NORMALIZE PRD
        #
        # The PRD generator may return a string or a dict.
        # User Story generation needs readable text.
        # =================================================

        if isinstance(
            prd,
            dict
        ):

            prd_text = (

                prd.get("prd")

                or prd.get("content")

                or prd.get("text")

                or prd.get("markdown")

                or str(prd)

            )

        else:

            prd_text = str(
                prd
            )


        # =================================================
        # VALIDATE PRD TEXT
        # =================================================

        if not prd_text.strip():

            raise HTTPException(
                status_code=400,
                detail=(
                    "The generated PRD is empty. "
                    "Please generate the PRD again."
                )
            )


        print(
            "\n" + "=" * 60
        )

        print(
            "USER STORY API"
        )

        print(
            "=" * 60
        )

        print(
            "Dataset rows:",
            len(
                app_state.processed_df
            )
        )

        print(
            "PRD available:",
            True
        )

        print(
            "PRD length:",
            len(prd_text)
        )

        print(
            "Requested stories:",
            count
        )


        # =================================================
        # GENERATE USER STORIES
        # =================================================

        result = (
            user_story_service
            .generate_user_stories(

                prd=prd_text,

                count=count

            )
        )


        # =================================================
        # CHECK RESULT
        # =================================================

        if not result:

            raise HTTPException(
                status_code=500,
                detail=(
                    "User Story service returned "
                    "an empty response."
                )
            )


        if result.get(
            "status"
        ) != "success":

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

        generated_stories = (

            result.get(
                "user_stories",
                ""
            )

        )


        app_state.generated_user_stories = (
            generated_stories
        )


        # =================================================
        # RETURN
        # =================================================

        return {

            "status":
                "success",

            "message":
                (
                    "User stories and work items "
                    "generated successfully."
                ),

            "requested_count":
                count,

            "count":
                result.get(
                    "count",
                    count
                ),

            "user_stories":
                generated_stories

        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "\nUSER STORY GENERATION ERROR:"
        )

        print(
            str(e)
        )

        raise HTTPException(

            status_code=500,

            detail=(
                "User story generation failed: "
                f"{str(e)}"
            )

        )