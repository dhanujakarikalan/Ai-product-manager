# =========================================================
# services/user_story_generation.py
# =========================================================

import re

from services.llm_service import LLMService


class UserStoryGenerationService:

    def __init__(self):

        self.llm = LLMService()


    # =====================================================
    # EXTRACT FUNCTIONAL REQUIREMENTS
    # =====================================================

    def extract_functional_requirements(
        self,
        prd
    ):

        text = str(prd)

        start = text.find(
            "12. Functional Requirements"
        )

        end = text.find(
            "13. Non-Functional Requirements"
        )

        if start == -1:

            return text[:12000]

        if end == -1:

            end = len(text)

        functional_requirements = (
            text[start:end]
        )

        return functional_requirements[:12000]


    # =====================================================
    # GENERATE USER STORIES
    # =====================================================

    def generate_user_stories(
        self,
        prd,
        count=10
    ):

        # =================================================
        # CHECK PRD
        # =================================================

        if not prd or not str(prd).strip():

            return {

                "status": "failed",

                "message":
                    "No PRD available. Please generate PRD first.",

                "user_stories": ""
            }


        # =================================================
        # EXTRACT ONLY FUNCTIONAL REQUIREMENTS
        # =================================================

        functional_requirements = (
            self.extract_functional_requirements(
                prd
            )
        )


        print("\n" + "=" * 60)
        print("USER STORY GENERATION")
        print("=" * 60)

        print(
            "Requested stories:",
            count
        )

        print(
            "Functional requirement length:",
            len(functional_requirements)
        )


        # =================================================
        # PROMPT
        # =================================================

        prompt = f"""
You are an experienced Agile Product Manager.

Convert the following Functional Requirements from an
existing Product Requirements Document into exactly
{count} prioritized Agile user stories.

FUNCTIONAL REQUIREMENTS
=======================

{functional_requirements}


PRIORITIZATION RULES
====================

Prioritize requirements using:

1. Customer impact
2. Problem severity
3. Frequency of the issue
4. Product priority
5. Evidence contained in the requirements


USER STORY RULES
================

Every user story must:

- Be directly based on a Functional Requirement.
- Use the format:

As a [user],
I want [capability],
So that [benefit].

- Do not invent unrelated functionality.
- Do not create requirements that are not present.
- Keep the story practical and concise.


ACCEPTANCE CRITERIA
===================

Give 2 or 3 acceptance criteria for each story.

Use:

Given
When
Then


WORK ITEMS
==========

Give only 2 or 3 lightweight work items.

Examples:

- Backend implementation
- Frontend implementation
- API integration
- Database update
- Testing


OUTPUT FORMAT
=============

USER STORY #1

User Story ID:
US-001

Priority:
High

Functional Requirement:
FR-01 - ...

Title:
...

User Story:
As a ...
I want ...
So that ...

Acceptance Criteria:

1. Given ...
   When ...
   Then ...

2. Given ...
   When ...
   Then ...

Work Items:

1. ...

2. ...

3. ...


--------------------------------------------------

Continue until exactly {count} user stories are created.


IMPORTANT:

Return normal human-readable text only.

Do not return JSON.

Do not return Python dictionaries.

Do not explain your internal reasoning.

Do not generate a new PRD.

Use only the provided Functional Requirements.
"""


        # =================================================
        # CALL GROQ
        # =================================================

        result = self.llm.generate(
            prompt
        )


        # =================================================
        # RETURN
        # =================================================

        return {

            "status":
                "success",

            "message":
                "User stories and work items generated successfully.",

            "count":
                count,

            "user_stories":
                result
        }