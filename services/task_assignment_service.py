from services.llm_service import LLMService


class TaskAssignmentService:

    def __init__(self):

        self.llm = LLMService()


    # =====================================================
    # GENERATE WORK ITEMS
    # =====================================================

    def generate_tasks(
        self,
        user_stories
    ):

        if not user_stories:

            return {
                "status": "failed",
                "message": "No user stories available.",
                "tasks": ""
            }


        # =================================================
        # PROMPT
        # =================================================

        prompt = f"""
You are an experienced Agile Technical Product Manager.

Convert the following selected user stories into
developer-ready work items.

USER STORIES:

{user_stories}


For every user story, create practical development
work items.

Do NOT create unrelated work.

Each work item must directly support its user story.

Use this format:

User Story ID: US-001

Title:
Short title.

Work Items:

1. Task:
   [Development task]

   Type:
   Backend / Frontend / Database / API / Testing / UI

2. Task:
   [Development task]

   Type:
   Backend / Frontend / Database / API / Testing / UI

3. Task:
   [Development task]

   Type:
   Backend / Frontend / Database / API / Testing / UI

Priority:
High / Medium / Low

Definition of Done:
[Short completion condition]


Important rules:

- Break large requirements into smaller actionable tasks.
- Keep tasks specific enough for developers.
- Include frontend, backend, API, database or testing work
  only when required by the user story.
- Do not invent unrelated functionality.
- Do not rewrite the entire PRD.
"""

        # =================================================
        # GEMINI
        # =================================================

        tasks = self.llm.generate(
            prompt
        )


        return {

            "status": "success",

            "message":
                "Development work items generated successfully.",

            "tasks":
                tasks
        }