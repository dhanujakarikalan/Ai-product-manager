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

        # Run Complete Pipeline
        result = pipeline.run(temp_path)

        # Store processed dataframe
        processed_df = result["processed_dataframe"]

        # Delete temporary file
        os.remove(temp_path)

        return {
            "status": "Success",
            "message": "Dataset uploaded and processed successfully.",
            "rows_processed": len(processed_df)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))