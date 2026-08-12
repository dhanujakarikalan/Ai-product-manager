from services.llm_service import LLMService


class TaskAssignmentService:

    def __init__(self):

        self.llm = LLMService()


    def generate_tasks(self, user_stories):

        # ==========================================
        # STEP 1: CHECK USER STORIES
        # ==========================================

        if not user_stories:

            return {
                "status": "failed",
                "message": "User stories are required."
            }


        # ==========================================
        # STEP 2: CREATE PROMPT
        # ==========================================

        prompt = f"""
You are an experienced Agile Product Manager
and Software Development Team Lead.

You are given a set of Agile User Stories.

Your task is to break each User Story into
clear, actionable development tasks.

USER STORIES:

{user_stories}


For every User Story, generate tasks using
the following structure:

User Story ID:
US-001

User Story:
<user story>

Tasks:

TASK-001
Task Title:
<short task name>

Description:
<what needs to be implemented>

Task Type:
Backend / Frontend / Database / API / AI-ML / Testing / Documentation

Priority:
High / Medium / Low

Dependencies:
<dependency if applicable>


TASK-002
Task Title:
<short task name>

Description:
<what needs to be implemented>

Task Type:
Backend / Frontend / Database / API / AI-ML / Testing / Documentation

Priority:
High / Medium / Low

Dependencies:
<dependency if applicable>


IMPORTANT RULES:

1. Generate tasks only from the provided user stories.

2. Do not invent new product requirements.

3. Each task should be actionable by a developer.

4. Break large user stories into smaller implementation tasks.

5. Clearly identify frontend, backend, database,
   API, AI/ML and testing tasks when applicable.

6. Include dependencies when one task depends on another.

7. Keep tasks practical and implementation-oriented.

8. Do not repeat the complete PRD.

9. Cover all important user stories.

10. The output should be suitable for assigning
    work to a software development team.
"""


        # ==========================================
        # STEP 3: GENERATE USING GEMINI
        # ==========================================

        tasks = self.llm.generate(
            prompt
        )


        # ==========================================
        # STEP 4: RETURN
        # ==========================================

        return {

            "status": "success",

            "tasks": tasks

        }