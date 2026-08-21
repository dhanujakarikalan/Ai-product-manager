from fastapi import APIRouter, UploadFile, File, HTTPException

import tempfile
import os

from services.pipeline import FeedbackPipeline
from services.rag_service import RAGService
from services.milestone4_service import Milestone4Service

import services.app_state as app_state

# =========================================================
# DATABASE
# =========================================================

from database.database import SessionLocal
from models.feedback_db import Feedback


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
# SAVE FEEDBACK TO POSTGRESQL
# =========================================================

def save_feedback_to_database(processed_df):

    db = SessionLocal()

    saved_count = 0

    try:

        # =================================================
        # CHECK ACTUAL FEEDBACK COLUMN
        # =================================================

        if "feedback_text" not in processed_df.columns:

            print(
                "\nWARNING: 'feedback_text' column not found."
            )

            print(
                "Available columns:",
                processed_df.columns.tolist()
            )

            return 0

        # =================================================
        # SAVE EACH ROW
        # =================================================

        for _, row in processed_df.iterrows():

            # -------------------------------------------------
            # Actual feedback column from your dataset
            # -------------------------------------------------

            feedback_value = row.get(
                "feedback_text"
            )

            if feedback_value is None:
                continue

            feedback_value = str(
                feedback_value
            ).strip()

            if not feedback_value:
                continue

            # -------------------------------------------------
            # Your dataset has "source", not "customer"
            # So source is stored in the existing customer field
            # -------------------------------------------------

            customer_value = row.get(
                "source"
            )

            if (
                customer_value is None
                or str(customer_value).strip() == ""
            ):

                customer_value = "Unknown"

            # -------------------------------------------------
            # Create Feedback record
            # -------------------------------------------------

            feedback_record = Feedback(
                customer=str(
                    customer_value
                ),
                feedback=feedback_value
            )

            db.add(
                feedback_record
            )

            saved_count += 1

        # =================================================
        # COMMIT
        # =================================================

        db.commit()

        print(
            "\nPostgreSQL save successful."
        )

        print(
            "Records saved:",
            saved_count
        )

        return saved_count

    except Exception as e:

        db.rollback()

        print(
            "\nPOSTGRESQL ERROR:"
        )

        print(
            str(e)
        )

        raise

    finally:

        db.close()


# =========================================================
# CREATE RAG FEEDBACK LIST
# =========================================================

def create_rag_feedback_list(processed_df):

    feedback_list = []

    # =====================================================
    # CHECK ACTUAL DATASET COLUMN
    # =====================================================

    if "feedback_text" not in processed_df.columns:

        print(
            "\nWARNING: 'feedback_text' column not found "
            "for RAG."
        )

        return feedback_list

    # =====================================================
    # CREATE RAG RECORDS
    #
    # RAGService expects:
    #
    # {
    #     "feedback": "...",
    #     "category": "...",
    #     "theme": "...",
    #     "sentiment": "...",
    #     "pain_point": "...",
    #     "feature_request": "..."
    # }
    # =====================================================

    for _, row in processed_df.iterrows():

        feedback_value = row.get(
            "feedback_text"
        )

        if feedback_value is None:
            continue

        feedback_value = str(
            feedback_value
        ).strip()

        if not feedback_value:
            continue

        feedback_item = {

            "feedback":
                feedback_value,

            "category":
                row.get(
                    "category"
                ),

            "theme":
                row.get(
                    "theme"
                ),

            "sentiment":
                row.get(
                    "sentiment"
                ),

            "pain_point":
                row.get(
                    "pain_point"
                ),

            "feature_request":
                row.get(
                    "feature_request"
                )
        }

        feedback_list.append(
            feedback_item
        )

    return feedback_list


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

        print(
            "DATASET UPLOAD"
        )

        print(
            "=" * 60
        )

        print(
            "File:",
            file.filename
        )

        # =================================================
        # 2. RUN EXISTING FEEDBACK PIPELINE
        # =================================================

        print(
            "\nRunning Feedback Pipeline..."
        )

        result = pipeline.run(
            temp_path
        )

        # =================================================
        # 3. GET PROCESSED DATAFRAME
        # =================================================

        processed_df = result[
            "processed_dataframe"
        ]

        print(
            "\nPROCESSED DATAFRAME COLUMNS:"
        )

        print(
            processed_df.columns.tolist()
        )

        print(
            "\nTOTAL PROCESSED ROWS:"
        )

        print(
            len(processed_df)
        )

        # =================================================
        # 4. STORE IN APPLICATION STATE
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

        print(
            "\nRows:",
            len(processed_df)
        )

        print(
            "Columns:",
            list(processed_df.columns)
        )

        # =================================================
        # 5. SAVE FEEDBACK TO POSTGRESQL
        # =================================================

        print(
            "\n" + "=" * 60
        )

        print(
            "SAVING FEEDBACK TO POSTGRESQL"
        )

        print(
            "=" * 60
        )

        database_records_saved = (
            save_feedback_to_database(
                processed_df
            )
        )

        print(
            "\nPostgreSQL storage completed."
        )

        # =================================================
        # 6. CREATE RAG FEEDBACK LIST
        # =================================================

        feedback_list = (
            create_rag_feedback_list(
                processed_df
            )
        )

        app_state.feedback_list = (
            feedback_list
        )

        print(
            "\nFeedback records for RAG:",
            len(feedback_list)
        )

        # =================================================
        # 7. CREATE FAISS VECTOR STORE
        # =================================================

        if feedback_list:

            print(
                "\nCreating FAISS Vector Store..."
            )

            rag_result = (
                rag_service.create_vectorstore(
                    feedback_list
                )
            )

            print(
                "FAISS Vector Store Created."
            )

            print(
                "RAG result:",
                rag_result
            )

        else:

            print(
                "\nNo feedback available for RAG."
            )

        # =================================================
        # 8. RUN MILESTONE 4
        # =================================================

        print(
            "\n" + "=" * 60
        )

        print(
            "STARTING MILESTONE 4"
        )

        print(
            "=" * 60
        )

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
        # 9. RETURN COMPLETE RESULT
        # =================================================

        return {

            "status":
                "Success",

            "message":
                (
                    "Dataset uploaded, "
                    "stored in PostgreSQL, "
                    "RAG vector store created, "
                    "and Milestone 4 completed successfully."
                ),

            "file_name":
                file.filename,

            "rows_processed":
                len(processed_df),

            "database_records_saved":
                database_records_saved,

            "rag_records":
                len(feedback_list),

            "dataset_available":
                True,

            # ---------------------------------------------
            # PIPELINE RESULTS
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