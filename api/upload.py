from fastapi import APIRouter, UploadFile, File, HTTPException

import tempfile
import os

from services.pipeline import FeedbackPipeline
from services.rag_service import RAGService
from services.milestone4_service import Milestone4Service

import services.app_state as app_state


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    tags=["Upload"]
)


# =========================================================
# SERVICES
# =========================================================

pipeline = FeedbackPipeline()

rag_service = RAGService()

milestone4_service = Milestone4Service()


# =========================================================
# UPLOAD DATASET
# =========================================================

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    temp_path = None

    try:

        # =================================================
        # 1. SAVE FILE TEMPORARILY
        # =================================================

        suffix = os.path.splitext(
            file.filename
        )[1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            temp_file.write(
                await file.read()
            )

            temp_path = temp_file.name

        print("\n" + "=" * 60)
        print("DATASET UPLOAD")
        print("=" * 60)

        print(
            "File:",
            file.filename
        )

        # =================================================
        # 2. RUN EXISTING FEEDBACK PIPELINE
        # =================================================

        print("\nRunning Feedback Pipeline...")

        result = pipeline.run(
            temp_path
        )

        # =================================================
        # 3. STORE PROCESSED DATA
        # =================================================

        processed_df = result[
            "processed_dataframe"
        ]

        app_state.processed_df = (
            processed_df
        )

        app_state.pipeline_result = (
            result
        )

        app_state.dataset_uploaded = (
            True
        )

        print(
            "Rows:",
            len(processed_df)
        )

        print(
            "Columns:",
            list(processed_df.columns)
        )

        # =================================================
        # 4. CREATE FEEDBACK LIST
        # =================================================

        feedback_list = []

        if "feedback" in processed_df.columns:

            feedback_list = (
                processed_df[
                    ["feedback"]
                ]
                .dropna()
                .to_dict(
                    orient="records"
                )
            )

        app_state.feedback_list = (
            feedback_list
        )

        # =================================================
        # 5. CREATE FAISS VECTOR STORE
        # =================================================

        if feedback_list:

            print(
                "\nCreating FAISS Vector Store..."
            )

            rag_service.create_vectorstore(
                feedback_list
            )

            print(
                "FAISS Vector Store Created."
            )

        # =================================================
        # 6. RUN MILESTONE 4 AUTOMATICALLY
        # =================================================

        print("\n" + "=" * 60)

        print(
            "STARTING MILESTONE 4"
        )

        print("=" * 60)

        milestone4_result = (
            milestone4_service.run(

                processed_df=processed_df,

                pipeline_result=result
            )
        )

        print(
            "\nMilestone 4 Completed."
        )

        # =================================================
        # 7. RETURN COMPLETE RESULT
        # =================================================

        return {

            "status":
                "Success",

            "message":
                (
                    "Dataset uploaded and "
                    "Milestone 4 completed successfully."
                ),

            "file_name":
                file.filename,

            "rows_processed":
                len(processed_df),

            "dataset_available":
                True,

            # ---------------------------------------------
            # EXISTING PIPELINE
            # ---------------------------------------------

            "validation_report":
                result.get(
                    "validation_report"
                ),

            "cleaning_report":
                result.get(
                    "cleaning_report"
                ),

            "eda_report":
                result.get(
                    "eda_report"
                ),

            "categorization_summary":
                result.get(
                    "categorization_summary"
                ),

            "theme_summary":
                result.get(
                    "theme_summary"
                ),

            "pain_point_summary":
                result.get(
                    "pain_point_summary"
                ),

            "feature_request_summary":
                result.get(
                    "feature_request_summary"
                ),

            "sentiment_summary":
                result.get(
                    "sentiment_summary"
                ),

            "trend_report":
                result.get(
                    "trend_report"
                ),

            # ---------------------------------------------
            # MILESTONE 4
            # ---------------------------------------------

            "feature_scores":
                milestone4_result[
                    "feature_scores"
                ],

            "feature_prioritization":
                milestone4_result[
                    "prioritization"
                ],

            "roadmap":
                milestone4_result[
                    "roadmap"
                ],

            "milestone_recommendation":
                milestone4_result[
                    "milestone_recommendation"
                ],

            "executive_summary":
                milestone4_result[
                    "executive_summary"
                ],

            "product_strategy":
                milestone4_result[
                    "product_strategy"
                ],

            "evaluation":
                milestone4_result[
                    "evaluation"
                ]
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            "\nUPLOAD / MILESTONE 4 ERROR:"
        )

        print(
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        # =================================================
        # DELETE TEMPORARY FILE
        # =================================================

        if (
            temp_path
            and os.path.exists(
                temp_path
            )
        ):

            try:

                os.remove(
                    temp_path
                )

            except Exception:

                pass