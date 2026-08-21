from services.llm_service import LLMService


class MilestoneRecommender:

    def __init__(self):

        self.llm = LLMService()

    def recommend(self, roadmap):

        if not roadmap:
            raise ValueError(
                "No roadmap data available."
            )

        roadmap_text = ""

        for item in roadmap:

            roadmap_text += f"""
Feature: {item["feature"]}
Priority: {item["priority"]}
Score: {item["score"]}
Rank: {item["rank"]}
Recommended Milestone: {item["milestone"]}
Roadmap Phase: {item["phase"]}

"""

        prompt = f"""
You are an experienced AI Product Manager.

You are reviewing a product roadmap generated
from an existing feature prioritization system.

The prioritization system has already calculated
the feature score, priority and rank.

Your task is to provide a clear and human-readable
milestone recommendation.

FEATURE DATA:

{roadmap_text}

Your responsibilities:

1. Review the existing feature priorities.
2. Respect the calculated priority and score.
3. Explain why each feature belongs in its
   recommended milestone.
4. Do not create new features.
5. Do not change feature names.
6. Do not change the calculated priority.
7. Keep the recommendation practical.
8. Write the answer for a Product Manager,
   not as a technical JSON response.

Return the answer in this exact style:

PRODUCT ROADMAP RECOMMENDATION

Milestone 1 – Core Product Improvements

Feature Name
Priority: High
Score: 8.5

Reason:
Explain clearly why this feature should
be developed in Milestone 1.


Milestone 2 – Product Enhancements

Feature Name
Priority: Medium
Score: 6.5

Reason:
Explain why this feature can be developed
after the core improvements.


Milestone 3 – Future Enhancements

Feature Name
Priority: Low
Score: 3.5

Reason:
Explain why this feature can be considered
for a later release.


OVERALL RECOMMENDATION

Provide a short and practical explanation
of the overall product roadmap.

IMPORTANT:
Do not return JSON.
Do not return Python dictionaries.
Do not use code blocks.
Use normal human-readable text.
"""

        response = self.llm.generate(prompt)

        return response