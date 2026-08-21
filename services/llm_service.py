# =========================================================
# services/llm_service.py
# Groq LLM Service
# =========================================================

import os

from dotenv import load_dotenv
from groq import Groq


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


class LLMService:

    def __init__(self):

        # =================================================
        # GROQ API KEY
        # =================================================

        api_key = os.getenv(
            "GROQ_API_KEY"
        )

        if not api_key:

            raise ValueError(
                "GROQ_API_KEY is not configured in .env"
            )

        # =================================================
        # GROQ CLIENT
        # =================================================

        self.client = Groq(
            api_key=api_key
        )

        # =================================================
        # GROQ MODEL
        # =================================================

        self.model = (
            "openai/gpt-oss-120b"
        )

    # =====================================================
    # GENERATE RESPONSE
    # =====================================================

    def generate(
        self,
        prompt
    ):

        print(
            "\n"
            + "=" * 60
        )

        print(
            "Using Groq model:",
            self.model
        )

        print(
            "=" * 60
        )

        try:

            print(
                "Sending request to Groq..."
            )

            # =================================================
            # GROQ API CALL
            # =================================================

            response = (
                self.client
                .chat
                .completions
                .create(

                    model=self.model,

                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],

                    temperature=0.2
                )
            )

            # =================================================
            # VALIDATE RESPONSE
            # =================================================

            if response is None:

                raise RuntimeError(
                    "Groq returned no response."
                )

            if not response.choices:

                raise RuntimeError(
                    "Groq returned no choices."
                )

            text = (
                response
                .choices[0]
                .message
                .content
            )

            if not text:

                raise RuntimeError(
                    "Groq returned an empty response."
                )

            print(
                "Groq response received."
            )

            return text.strip()

        # =====================================================
        # ERROR HANDLING
        # =====================================================

        except Exception as e:

            error_text = str(
                e
            )

            print(
                "\nGroq error:"
            )

            print(
                error_text
            )

            # -----------------------------------------------
            # MODEL NOT FOUND
            # -----------------------------------------------

            if (
                "model_not_found"
                in error_text.lower()
                or
                "404"
                in error_text
            ):

                raise RuntimeError(

                    f"Groq model "
                    f"'{self.model}' "
                    "is unavailable or "
                    "not accessible."

                ) from e

            # -----------------------------------------------
            # RATE LIMIT / QUOTA
            # -----------------------------------------------

            if (
                "429"
                in error_text
                or
                "rate_limit"
                in error_text.lower()
                or
                "rate limit"
                in error_text.lower()
            ):

                raise RuntimeError(

                    "Groq API rate limit or "
                    "quota exceeded. "
                    "Please wait and try again."

                ) from e

            # -----------------------------------------------
            # OTHER ERRORS
            # -----------------------------------------------

            raise RuntimeError(

                f"Groq generation failed: "
                f"{error_text}"

            ) from e