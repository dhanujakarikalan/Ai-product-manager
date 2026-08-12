from services.llm_service import LLMService


class UserStoryGenerationService:

    def __init__(self):

        self.llm = LLMService()


    def generate_user_stories(self, prd):

        if not prd:

            return {
                "status": "failed",
                "message": "PRD is required."
            }


        prompt = f"""
You are an experienced Agile Product Manager.

Convert the following Product Requirements Document
into actionable Agile User Stories.

PRODUCT REQUIREMENTS DOCUMENT:

{prd}


For every important requirement, generate a user story.

Use this structure:

User Story ID:
US-001

Title:
Short meaningful title.

User Story:
As a <type of user>,
I want <capability>,
So that <business value>.

Acceptance Criteria:

1. Given ...
   When ...
   Then ...

2. Given ...
   When ...
   Then ...

Priority:
High / Medium / Low


IMPORTANT RULES:

- Generate stories only from the provided PRD.
- Do not invent requirements.
- Each story should represent one meaningful capability.
- Keep stories understandable for developers and testers.
- Acceptance criteria must be testable.
- Focus on user/business value.
- Generate all important user stories from the PRD.
"""

        user_stories = self.llm.generate(prompt)

        return {
            "status": "success",
            "user_stories": user_stories
        }