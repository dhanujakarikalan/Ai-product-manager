# =========================================================
# api/upload.py
# DATASET UPLOAD + COMPLETE ANALYSIS PIPELINE
# =========================================================

import os
import shutil
import tempfile

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

from services.pipeline import FeedbackPipeline
from services import app_state


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    tags=["Upload"]
)


# =========================================================
# PIPELINE
# =========================================================

pipeline = FeedbackPipeline()


# =========================================================
# UPLOAD ENDPOINT
# =========================================================

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    # =====================================================
    # VALIDATE FILE
    # =====================================================

    if not file:

        raise HTTPException(
            status_code=400,
            detail="No file uploaded."
        )


    filename = (
        file.filename
        or "uploaded_file"
    )


    extension = os.path.splitext(
        filename
    )[1].lower()


    allowed_extensions = [
        ".csv",
        ".xlsx",
        ".xls"
    ]


    if extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Please upload CSV or Excel file."
            )
        )


    # =====================================================
    # SAVE TEMPORARY FILE
    # =====================================================

    temp_path = None


    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:

            temp_path = temp_file.name

            shutil.copyfileobj(
                file.file,
                temp_file
            )


        print(
            "\n========================================"
        )

        print(
            "DATASET UPLOAD STARTED"
        )

        print(
            "Filename:",
            filename
        )

        print(
            "========================================\n"
        )


        # =================================================
        # RUN COMPLETE PIPELINE
        # =================================================

        result = pipeline.run(
            temp_path
        )


        if not result:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Analysis pipeline returned "
                    "an empty result."
                )
            )


        # =================================================
        # GET PROCESSED DATAFRAME
        # =================================================

        processed_df = (
            result.get(
                "processed_dataframe"
            )
        )


        if processed_df is None:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Pipeline did not return "
                    "a processed dataframe."
                )
            )


        # =================================================
        # SAVE GLOBAL APP STATE
        # =================================================

        app_state.processed_df = (
            processed_df
        )


        app_state.pipeline_result = (
            result
        )


        app_state.dataset_uploaded = (
            True
        )


        # =================================================
        # SAVE ORIGINAL FEEDBACK LIST
        # =================================================

        try:

            app_state.feedback_list = (
                processed_df
                .to_dict(
                    orient="records"
                )
            )

        except Exception:

            app_state.feedback_list = []


        # =================================================
        # CLEAR OLD GENERATED RESULTS
        # =================================================
        #
        # New dataset = new analysis.
        #
        # Old PRD / stories should not remain
        # attached to a completely different dataset.
        #
        # =================================================

        app_state.generated_prd = ""

        app_state.generated_prd_metadata = {}

        app_state.generated_user_stories = []

        app_state.generated_user_story_count = 0

        app_state.generated_tasks = []


        app_state.feature_scores = []

        app_state.generated_prioritization = []

        app_state.generated_roadmap = []

        app_state.generated_milestone_recommendation = ""

        app_state.generated_executive_summary = ""

        app_state.generated_product_strategy = ""

        app_state.generated_roadmap_evaluation = ""

        app_state.testing_report = {}

        app_state.optimization_context = {}


        # =================================================
        # EXTRACT SUMMARIES
        # =================================================

        theme_summary = (
            result.get(
                "theme_summary",
                {}
            )
        )


        category_summary = (
            result.get(
                "categorization_summary",
                {}
            )
        )


        sentiment_summary = (
            result.get(
                "sentiment_summary",
                {}
            )
        )


        pain_point_summary = (
            result.get(
                "pain_point_summary",
                {}
            )
        )


        feature_request_summary = (
            result.get(
                "feature_request_summary",
                {}
            )
        )


        trend_report = (
            result.get(
                "trend_report",
                {}
            )
        )


        # =================================================
        # SENTIMENT COUNTS
        # =================================================

        positive = int(
            sentiment_summary.get(
                "Positive",
                sentiment_summary.get(
                    "positive",
                    0
                )
            )
            or 0
        )


        negative = int(
            sentiment_summary.get(
                "Negative",
                sentiment_summary.get(
                    "negative",
                    0
                )
            )
            or 0
        )


        neutral = int(
            sentiment_summary.get(
                "Neutral",
                sentiment_summary.get(
                    "neutral",
                    0
                )
            )
            or 0
        )


        # =================================================
        # THEME INFORMATION
        # =================================================

        theme_distribution = (
            theme_summary.get(
                "theme_distribution",
                {}
            )
            if isinstance(
                theme_summary,
                dict
            )
            else {}
        )


        # =================================================
        # TREND INFORMATION
        # =================================================

        feedback_trend = (
            trend_report.get(
                "feedback_trend",
                []
            )
            if isinstance(
                trend_report,
                dict
            )
            else []
        )


        monthly_feedback_trend = (
            trend_report.get(
                "monthly_feedback_trend",
                []
            )
            if isinstance(
                trend_report,
                dict
            )
            else []
        )


        # =================================================
        # RESPONSE
        # =================================================

        response = {

            "status":
                "success",

            "message":
                "File uploaded and analyzed successfully.",

            "file_name":
                filename,

            "rows_processed":
                int(
                    len(processed_df)
                ),

            # ---------------------------------------------
            # Main analysis summaries
            # ---------------------------------------------

            "categorization_summary":
                category_summary,

            "theme_summary":
                theme_summary,

            "pain_point_summary":
                pain_point_summary,

            "feature_request_summary":
                feature_request_summary,

            "sentiment_summary":
                sentiment_summary,

            # ---------------------------------------------
            # Theme convenience data
            # ---------------------------------------------

            "theme_distribution":
                theme_distribution,

            "total_themes":
                int(
                    theme_summary.get(
                        "total_themes",
                        len(
                            theme_distribution
                        )
                    )
                    if isinstance(
                        theme_summary,
                        dict
                    )
                    else 0
                ),

            "top_theme":
                (
                    theme_summary.get(
                        "top_theme"
                    )
                    if isinstance(
                        theme_summary,
                        dict
                    )
                    else None
                ),

            # ---------------------------------------------
            # Trend data
            # ---------------------------------------------

            "trend_report":
                trend_report,

            "feedback_trend":
                feedback_trend,

            "monthly_feedback_trend":
                monthly_feedback_trend,

            # ---------------------------------------------
            # Sentiment counts
            # ---------------------------------------------

            "positive_count":
                positive,

            "negative_count":
                negative,

            "neutral_count":
                neutral

        }


        print(
            "\n========================================"
        )

        print(
            "DATASET ANALYSIS COMPLETED"
        )

        print(
            "Rows:",
            len(processed_df)
        )

        print(
            "Themes:",
            len(
                theme_distribution
            )
        )

        print(
            "Trend records:",
            len(
                feedback_trend
            )
        )

        print(
            "========================================\n"
        )


        return response


    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except HTTPException:

        raise


    except Exception as error:

        print(
            "\n========================================"
        )

        print(
            "UPLOAD / PIPELINE ERROR"
        )

        print(
            str(error)
        )

        print(
            "========================================\n"
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Dataset processing failed: "
                f"{str(error)}"
            )
        )


    finally:

        # =================================================
        # DELETE TEMP FILE
        # =================================================

        if temp_path:

            try:

                if os.path.exists(
                    temp_path
                ):

                    os.remove(
                        temp_path
                    )

            except Exception as cleanup_error:

                print(
                    "Temporary file cleanup failed:",
                    cleanup_error
                )