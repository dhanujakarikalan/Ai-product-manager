from fastapi import APIRouter, UploadFile, File, HTTPException

import tempfile
import os

from services.pipeline import FeedbackPipeline
from services.rag_service import RAGService
import services.app_state as app_state


router = APIRouter(tags=["Upload"])

pipeline = FeedbackPipeline()
rag_service = RAGService()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    try:

        # ==================================================
        # Save uploaded file temporarily
        # ==================================================

        suffix = os.path.splitext(file.filename)[1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            temp_file.write(
                await file.read()
            )

            temp_path = temp_file.name


        # ==================================================
        # Temporary File Information
        # ==================================================

        print("\n" + "=" * 60)
        print("Temporary File Created Successfully")
        print("=" * 60)

        print(
            "Uploaded File Name :",
            file.filename
        )

        print(
            "Temporary File Path:",
            temp_path
        )

        print(
            "File Exists        :",
            os.path.exists(temp_path)
        )

        print("=" * 60 + "\n")


        # ==================================================
        # Run Complete Feedback Pipeline
        # ==================================================

        result = pipeline.run(temp_path)


        # ==================================================
        # Store Processed DataFrame in Shared App State
        # ==================================================

        app_state.processed_df = result[
            "processed_dataframe"
        ]

        app_state.pipeline_result = result

        app_state.dataset_uploaded = True


        processed_df = app_state.processed_df


        # ==================================================
        # Print DataFrame Information
        # ==================================================

        print("\n" + "=" * 60)
        print("Processed DataFrame")
        print("=" * 60)

        print(
            "Rows    :",
            processed_df.shape[0]
        )

        print(
            "Columns :",
            processed_df.shape[1]
        )

        print(
            processed_df.head()
        )

        print("=" * 60 + "\n")


        # ==================================================
        # CREATE FEEDBACK LIST FOR RAG
        # ==================================================

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

        else:

            print(
                "WARNING: 'feedback' column "
                "not found in processed dataframe."
            )


        # ==================================================
        # Store Feedback List in Shared State
        # ==================================================

        app_state.feedback_list = feedback_list


        # ==================================================
        # CREATE FAISS VECTOR STORE
        # ==================================================

        if feedback_list:

            print("\n" + "=" * 60)
            print("Creating FAISS Vector Store...")
            print("=" * 60)

            rag_service.create_vectorstore(
                feedback_list
            )

            print(
                "FAISS Vector Store Created Successfully"
            )

            print(
                "Vector Store Location: vectorstore/"
            )

            print("=" * 60 + "\n")

        else:

            print(
                "No feedback data available "
                "for vector store."
            )


        # ==================================================
        # RETURN API RESPONSE
        # ==================================================

        return {

            "status": "Success",

            "message":
                "Dataset uploaded, processed, "
                "analytics generated, and "
                "FAISS vector store created.",

            "file_name":
                file.filename,

            "temporary_file_path":
                temp_path,

            "rows_processed":
                len(processed_df),

            "dataset_available":
                True,

            "vector_store":
                "FAISS",

            "vector_store_path":
                "vectorstore/feedback.index",

            "validation_report":
                result[
                    "validation_report"
                ],

            "cleaning_report":
                result[
                    "cleaning_report"
                ],

            "eda_report":
                result[
                    "eda_report"
                ],

            "categorization_summary":
                result[
                    "categorization_summary"
                ],

            "theme_summary":
                result[
                    "theme_summary"
                ],

            "pain_point_summary":
                result[
                    "pain_point_summary"
                ],

            "feature_request_summary":
                result[
                    "feature_request_summary"
                ],

            "sentiment_summary":
                result[
                    "sentiment_summary"
                ],

            "trend_report":
                result[
                    "trend_report"
                ]
        }


    except Exception as e:

        print("\nUPLOAD ERROR:")
        print(str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )