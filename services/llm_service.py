# =========================================================
# services/llm_service.py
# Gemini LLM Service
# =========================================================

import os
import time

from dotenv import load_dotenv
from google import genai


load_dotenv()


class LLMService:

    def __init__(self):

        # =================================================
        # API KEY
        # =================================================

        api_key = os.getenv(
            "GEMINI_API_KEY"
        )

        if not api_key:

            raise ValueError(
                "GEMINI_API_KEY is not configured."
            )

        # =================================================
        # GEMINI CLIENT
        # =================================================

        self.client = genai.Client(
            api_key=api_key
        )

        # =================================================
        # MODELS
        # =================================================

        # Main model
        self.primary_model = (
            "gemini-3.6-flash"
        )

        # Fast / low-cost fallback
        self.fallback_model = (
            "gemini-3.6-flash"
        )

        # =================================================
        # RETRY
        # =================================================

        self.max_retries = 2

    # =====================================================
    # GENERATE
    # =====================================================

    def generate(
        self,
        prompt
    ):

        models = [

            self.primary_model,

            self.fallback_model

        ]

        last_error = None

        # =================================================
        # TRY MODELS
        # =================================================

        for model in models:

            print(
                "\n"
                + "=" * 60
            )

            print(
                "Using Gemini model:",
                model
            )

            print(
                "=" * 60
            )

            # =================================================
            # RETRIES
            # =================================================

            for attempt in range(
                1,
                self.max_retries + 1
            ):

                try:

                    print(
                        f"Gemini attempt "
                        f"{attempt}/"
                        f"{self.max_retries}"
                    )

                    # -----------------------------------------
                    # API CALL
                    # -----------------------------------------

                    response = (
                        self.client
                        .models
                        .generate_content(

                            model=model,

                            contents=prompt

                        )
                    )

                    # -----------------------------------------
                    # VALIDATE RESPONSE
                    # -----------------------------------------

                    if response is None:

                        raise ValueError(
                            "Gemini returned no response."
                        )

                    text = getattr(
                        response,
                        "text",
                        None
                    )

                    if not text:

                        raise ValueError(
                            "Gemini returned an empty response."
                        )

                    print(
                        "Gemini response received."
                    )

                    return text.strip()

                # =================================================
                # ERROR HANDLING
                # =================================================

                except Exception as e:

                    last_error = e

                    error_text = str(
                        e
                    )

                    print(
                        "\nGemini error:"
                    )

                    print(
                        error_text
                    )

                    # -----------------------------------------
                    # MODEL NOT FOUND
                    # -----------------------------------------

                    if (

                        "404" in error_text

                        or
                        "NOT_FOUND"
                        in error_text.upper()

                    ):

                        print(
                            f"Model {model} "
                            "is unavailable."
                        )

                        # Don't retry the same
                        # unavailable model.

                        break

                    # -----------------------------------------
                    # TEMPORARY AVAILABILITY
                    # -----------------------------------------

                    temporary_error = (

                        "503"
                        in error_text

                        or
                        "UNAVAILABLE"
                        in error_text.upper()

                        or
                        "HIGH DEMAND"
                        in error_text.upper()

                        or
                        "429"
                        in error_text

                        or
                        "RESOURCE_EXHAUSTED"
                        in error_text.upper()

                    )

                    if not temporary_error:

                        raise

                    # -----------------------------------------
                    # RETRY
                    # -----------------------------------------

                    if attempt < self.max_retries:

                        wait_time = (
                            2 ** attempt
                        )

                        print(
                            "Temporary Gemini "
                            "service error."
                        )

                        print(
                            f"Retrying in "
                            f"{wait_time} seconds..."
                        )

                        time.sleep(
                            wait_time
                        )

        # =====================================================
        # ALL MODELS FAILED
        # =====================================================

        raise RuntimeError(

            "Gemini service is currently "
            "unavailable. "

            "Tried models: "
            f"{self.primary_model}, "
            f"{self.fallback_model}. "

            f"Last error: {last_error}"

        )