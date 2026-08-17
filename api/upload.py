from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os

from services.pipeline import FeedbackPipeline

router = APIRouter(tags=["Upload"])

pipeline = FeedbackPipeline()

# Global variable to store processed dataframe
processed_df = None


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global processed_df

    try:
        # Save uploaded file temporarily
        suffix = os.path.splitext(file.filename)[1]

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(await file.read())
            temp_path = temp_file.name

        # ===============================
        # Print Temporary File Information
        # ===============================
        print("\n" + "=" * 60)
        print("Temporary File Created Successfully")
        print("=" * 60)
        print("Uploaded File Name :", file.filename)
        print("Temporary File Path:", temp_path)
        print("File Exists        :", os.path.exists(temp_path))
        print("=" * 60 + "\n")

        # Run Complete Pipeline
        result = pipeline.run(temp_path)

        # Store processed dataframe
        processed_df = result["processed_dataframe"]

        # Print DataFrame Information
        print("\n" + "=" * 60)
        print("Processed DataFrame")
        print("=" * 60)
        print("Rows    :", processed_df.shape[0])
        print("Columns :", processed_df.shape[1])
        print(processed_df.head())
        print("=" * 60 + "\n")

        # Uncomment this line when you want to delete the temp file
        # os.remove(temp_path)

        return {
            "status": "Success",
            "message": "Dataset uploaded and processed successfully.",
            "file_name": file.filename,
            "temporary_file_path": temp_path,
            "rows_processed": len(processed_df),
            "validation_report": result["validation_report"],
            "cleaning_report": result["cleaning_report"],
            "eda_report": result["eda_report"],
            "categorization_summary": result["categorization_summary"],
            "theme_summary": result["theme_summary"],
            "pain_point_summary": result["pain_point_summary"],
            "feature_request_summary": result["feature_request_summary"],
            "sentiment_summary": result["sentiment_summary"],
            "trend_report": result["trend_report"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))