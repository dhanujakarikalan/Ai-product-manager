# =========================================================
# services/llm_service.py
# Groq LLM Service
# =========================================================

import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()


class LLMService:

    def __init__(self):

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError(
                "GROQ_API_KEY is not configured in .env"
            )

        self.client = Groq(
            api_key=api_key
        )

        # Use the model that we already tested successfully
        self.model = "openai/gpt-oss-20b"


    # =====================================================
    # GENERATE
    # =====================================================

    def generate(
        self,
        prompt
    ):

        print("\n" + "=" * 60)
        print("GROQ LLM REQUEST")
        print("=" * 60)

        print("Model:", self.model)
        print("Prompt length:", len(prompt))

        try:

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

                    temperature=0.2,

                    max_tokens=4000
                )
            )

            print(
                "Finish reason:",
                response.choices[0].finish_reason
            )

            message = response.choices[0].message

            content = message.content

            # GPT-OSS can sometimes put reasoning separately.
            if not content:

                reasoning = getattr(
                    message,
                    "reasoning_content",
                    None
                )

                if reasoning:
                    content = reasoning

            if not content:

                raise RuntimeError(
                    "Groq returned an empty response."
                )

            print(
                "Response length:",
                len(content)
            )

            return content.strip()


        except Exception as e:

            error_text = str(e)

            print(
                "\nGROQ ERROR:"
            )

            print(
                error_text
            )

            raise RuntimeError(
                f"Groq generation failed: {error_text}"
            ) from e