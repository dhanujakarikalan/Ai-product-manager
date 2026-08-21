from services.llm_service import LLMService


class ExecutiveSummary:

    def __init__(self):
        self.llm = LLMService()

    def generate(
        self,
        roadmap,
        recommendation,
        strategy_report,
        pain_points=None,
        feature_requests=None,
        sentiment=None,
        trends=None
    ):

        prompt = f"""
You are a senior Product Manager.

Create an executive summary for the product based on
the information below.

ROADMAP:
{roadmap}

MILESTONE RECOMMENDATION:
{recommendation}

PRODUCT STRATEGY:
{strategy_report}

CUSTOMER PAIN POINTS:
{pain_points}

FEATURE REQUESTS:
{feature_requests}

CUSTOMER SENTIMENT:
{sentiment}

PRODUCT TRENDS:
{trends}

Write a concise executive summary for product managers
and business stakeholders.

Include:

1. Current Product Situation
2. Main Customer Problems
3. Key Product Priorities
4. Roadmap Direction
5. Expected Business Impact
6. Expected Customer Impact
7. Key Risks
8. Recommended Next Action

Use normal human-readable language.

Do NOT return JSON.
Do NOT return Python dictionaries.
Keep it concise and business-focused.
"""

        return self.llm.generate(prompt)