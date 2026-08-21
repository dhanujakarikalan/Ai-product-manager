from services.llm_service import LLMService


class ProductStrategyReport:

    def __init__(self):

        self.llm = LLMService()

    def generate(
        self,
        roadmap,
        milestone_recommendation,
        executive_summary,
        pain_points=None,
        feature_requests=None,
        sentiment=None,
        trends=None
    ):

        prompt = f"""
You are a Senior Product Manager.

Create a Product Strategy Report using the following
product information.

EXECUTIVE SUMMARY:
{executive_summary}

CUSTOMER PAIN POINTS:
{pain_points}

FEATURE REQUESTS:
{feature_requests}

CUSTOMER SENTIMENT:
{sentiment}

PRODUCT TRENDS:
{trends}

PRODUCT ROADMAP:
{roadmap}

MILESTONE RECOMMENDATION:
{milestone_recommendation}

Create the following sections:

1. Strategic Overview

2. Customer Problems

3. Strategic Product Priorities

4. Roadmap Strategy

5. Milestone Strategy

6. Customer Impact

7. Business Impact

8. Risks and Dependencies

9. Success Metrics

10. Recommended Next Steps

Use normal human-readable language.

Do not return JSON.

Do not return Python dictionaries.

Do not invent unsupported information.
"""

        return self.llm.generate(prompt)