from services.llm_service import LLMService


class UserStoryGenerationService:

    def __init__(self):

        self.llm = LLMService()


    # =====================================================
    # GENERATE USER STORIES + WORK ITEMS
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
        # PROMPT
        # =================================================

        prompt = f"""
You are an experienced Agile Product Manager.

The Product Requirements Document has already been
generated from analyzed customer feedback.

Your task is to convert the Functional Requirements
from the PRD into prioritized Agile User Stories.

Generate exactly {count} user stories.


=========================================================
PRIORITIZATION
=========================================================

Identify the Functional Requirements from the PRD.

Prioritize them based on:

1. Customer impact
2. Frequency of the problem
3. Pain-point severity
4. Business importance
5. Product priority
6. Evidence already present in the PRD

The most important requirement must appear first.

Do not randomly select requirements.


=========================================================
USER STORY RULES
=========================================================

Each story must:

- Come from a Functional Requirement.
- Be written from the customer/user perspective.
- Clearly describe what the user wants.
- Clearly describe why the user needs it.
- Be concise.
- Be actionable.
- Not invent unrelated functionality.
- Not create functionality unsupported by the PRD.


=========================================================
WORK ITEM RULES
=========================================================

For every User Story, generate only 2–3 lightweight
development work items.

Work items should be directly related to the User Story.

Examples:

- Backend implementation
- Frontend implementation
- API integration
- Database change
- Testing

Do not generate unnecessary technical details.

Do not generate more than 3 work items for one story.


=========================================================
OUTPUT FORMAT
=========================================================

RECOMMENDED USER STORY #1

User Story ID:
US-001

Recommendation Rank:
1

Priority:
High

Functional Requirement:
[One-line requirement]

Title:
[Short title]

User Story:
As a [type of user],
I want [specific capability],
So that [customer/business benefit].


Acceptance Criteria:

1. Given [condition],
   When [action],
   Then [expected result].

2. Given [condition],
   When [action],
   Then [expected result].

3. Given [condition],
   When [action],
   Then [expected result].


Work Items:

1. [Simple actionable development task]

2. [Simple actionable development task]

3. [Testing/integration task if required]


---------------------------------------------------------

RECOMMENDED USER STORY #2

User Story ID:
US-002

Recommendation Rank:
2

Priority:
High / Medium / Low

Functional Requirement:
[One-line requirement]

Title:
[Short title]

User Story:
As a [type of user],
I want [specific capability],
So that [customer/business benefit].


Acceptance Criteria:

1. Given...
   When...
   Then...


Work Items:

1. [Development task]

2. [Development task]

3. [Testing/integration task if required]


Continue until exactly {count} user stories are generated.


=========================================================
IMPORTANT
=========================================================

Do not analyze the raw feedback again.

Do not generate a new PRD.

Use the Functional Requirements and priorities already
available in the PRD.

The first story should represent the most important
customer/product requirement.

Keep work items short and practical.


=========================================================
PRD
=========================================================

{prd}
"""


        # =================================================
        # GEMINI
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