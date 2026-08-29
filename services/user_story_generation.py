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

    def extract_functional_requirements(self, prd):

        if not prd:
            return ""

        text = str(prd).strip()

        # -------------------------------------------------
        # Try exact existing PRD heading
        # -------------------------------------------------

        start_patterns = [
            r"12\.\s*Functional Requirements",
            r"Functional Requirements",
            r"Functional requirements"
        ]

        end_patterns = [
            r"13\.\s*Non-Functional Requirements",
            r"Non-Functional Requirements",
            r"Non-Functional requirements",
            r"14\.\s*User Experience",
            r"User Experience Considerations"
        ]

        start = -1

        for pattern in start_patterns:

            match = re.search(
                pattern,
                text,
                re.IGNORECASE
            )

            if match:

                start = match.start()

                break


        # -------------------------------------------------
        # If functional requirements are not found
        # -------------------------------------------------

        if start == -1:

            # Use complete PRD as fallback.
            # This prevents empty user-story generation.

            return text[:15000]


        # -------------------------------------------------
        # Find next section
        # -------------------------------------------------

        end = len(text)

        content_after_start = text[start + 1:]


        for pattern in end_patterns:

            match = re.search(
                pattern,
                content_after_start,
                re.IGNORECASE
            )

            if match:

                possible_end = (
                    start +
                    1 +
                    match.start()
                )

                if possible_end > start:

                    end = possible_end

                    break


        functional_requirements = (
            text[start:end]
            .strip()
        )


        return functional_requirements[:15000]


    # =====================================================
    # VALIDATE LLM OUTPUT
    # =====================================================

    def validate_user_story_output(
        self,
        result,
        expected_count
    ):

        if not result:

            return False


        text = str(result).strip()


        if len(text) < 100:

            return False


        # -------------------------------------------------
        # Count USER STORY sections
        # -------------------------------------------------

        story_matches = re.findall(
            r"USER STORY\s*#?\s*\d+",
            text,
            re.IGNORECASE
        )


        # -------------------------------------------------
        # If exact count is not returned, still allow
        # reasonably structured output.
        # -------------------------------------------------

        if len(story_matches) >= expected_count:

            return True


        # -------------------------------------------------
        # Check whether at least one valid story exists
        # -------------------------------------------------

        has_user_story_format = (
            re.search(
                r"As a\s+.+?\s*,?\s*I want\s+.+?\s*,?\s*So that",
                text,
                re.IGNORECASE |
                re.DOTALL
            )
            is not None
        )


        return bool(has_user_story_format)


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

                "user_stories": "",

                "count": 0
            }


        # =================================================
        # NORMALIZE COUNT
        # =================================================

        try:

            count = int(count)

        except Exception:

            count = 10


        count = max(
            1,
            min(count, 20)
        )


        # =================================================
        # EXTRACT FUNCTIONAL REQUIREMENTS
        # =================================================

        functional_requirements = (
            self.extract_functional_requirements(
                prd
            )
        )


        if not functional_requirements:

            return {

                "status": "failed",

                "message":
                    "Functional requirements could not be extracted from the PRD.",

                "user_stories": "",

                "count": 0
            }


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

You are given the Functional Requirements section
from an existing Product Requirements Document.

Your job is to convert those requirements into
exactly {count} high-quality, implementation-ready
Agile user stories.

Do not create a new PRD.

Do not invent unrelated functionality.

Do not use information that is not supported by
the provided requirements.


==================================================
FUNCTIONAL REQUIREMENTS
==================================================

{functional_requirements}


==================================================
PRIORITIZATION
==================================================

Prioritize the stories using:

1. Customer impact
2. Problem severity
3. Frequency of the problem
4. Business/product importance
5. Evidence from the requirements

Use these priorities:

- Critical
- High
- Medium
- Low


==================================================
USER STORY FORMAT
==================================================

Every story MUST follow this format:

USER STORY #1

User Story ID:
US-001

Priority:
High

Title:
Short meaningful title

Functional Requirement:
FR-01 - Related requirement

User Story:
As a [specific user],
I want [specific capability],
So that [clear customer/business benefit].

Acceptance Criteria:

1. Given [initial condition]
   When [action]
   Then [expected result]

2. Given [initial condition]
   When [action]
   Then [expected result]

3. Given [initial condition]
   When [action]
   Then [expected result]

Work Items:

1. Backend implementation

2. Frontend implementation

3. Testing


==================================================
QUALITY RULES
==================================================

Each story must:

- Represent ONE clear product capability.
- Be directly traceable to a functional requirement.
- Have a meaningful title.
- Identify a realistic user.
- Explain the customer benefit.
- Have 2 or 3 acceptance criteria.
- Use Given / When / Then.
- Have 2 or 3 practical work items.
- Be independently understandable.
- Avoid duplicate stories.
- Avoid vague statements.
- Avoid technical implementation details inside
  the actual user story.
- Avoid invented features.

Do NOT write:

"As a user, I want everything to work."

Instead make the user and capability specific.

For example:

"As a product manager,
I want to view feedback themes by frequency,
so that I can identify the most important
customer problems."


==================================================
TRACEABILITY
==================================================

Every user story MUST contain:

Functional Requirement:
FR-XX - ...

The FR reference must correspond to a requirement
contained in the provided Functional Requirements.

Do not invent FR numbers that have no relation to
the provided requirements.

If the original requirements do not contain IDs,
create sequential references such as:

FR-01
FR-02
FR-03


==================================================
EXACT NUMBER OF STORIES
==================================================

Generate exactly {count} user stories.

Do not generate fewer.

Do not generate more.

Number them sequentially:

USER STORY #1
USER STORY #2
USER STORY #3

...

USER STORY #{count}


==================================================
IMPORTANT
==================================================

Return ONLY the user stories.

Do not explain your reasoning.

Do not provide JSON.

Do not provide Python dictionaries.

Do not use markdown tables.

Do not generate an Executive Summary.

Do not generate a Product Roadmap.

Do not generate a Product Strategy.

Do not generate testing reports.

Do not generate a new PRD.

The output must be normal human-readable text.
"""


        # =================================================
        # CALL LLM
        # =================================================

        result = self.llm.generate(
            prompt
        )


        # =================================================
        # VALIDATE RESULT
        # =================================================

        valid = self.validate_user_story_output(
            result,
            count
        )


        if not valid:

            print(
                "WARNING: User story output "
                "did not pass validation."
            )


            return {

                "status":
                    "failed",

                "message":
                    "The AI generated an incomplete or invalid user story response. Please try again.",

                "count":
                    0,

                "requested_count":
                    count,

                "user_stories":
                    result or ""
            }


        # =================================================
        # COUNT GENERATED STORIES
        # =================================================

        story_matches = re.findall(
            r"USER STORY\s*#?\s*\d+",
            str(result),
            re.IGNORECASE
        )


        generated_count = len(
            story_matches
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
                generated_count,

            "requested_count":
                count,

            "user_stories":
                result
        }