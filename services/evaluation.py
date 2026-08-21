from services.llm_service import LLMService


class RoadmapEvaluation:

    def __init__(self):

        self.llm = LLMService()

    def evaluate(
        self,
        roadmap,
        milestone_recommendation,
        executive_summary,
        product_strategy
    ):

        # =================================================
        # STRUCTURAL VALIDATION
        # =================================================

        total_features = len(roadmap)

        valid_features = 0

        valid_milestones = 0

        valid_scores = 0

        for item in roadmap:

            if item.get("feature"):

                valid_features += 1

            if item.get("milestone"):

                valid_milestones += 1

            score = item.get("score")

            if (
                isinstance(
                    score,
                    (int, float)
                )
                and 0 <= score <= 10
            ):

                valid_scores += 1

        if total_features > 0:

            feature_quality = (
                valid_features
                / total_features
                * 100
            )

            milestone_quality = (
                valid_milestones
                / total_features
                * 100
            )

            score_quality = (
                valid_scores
                / total_features
                * 100
            )

        else:

            feature_quality = 0
            milestone_quality = 0
            score_quality = 0

        structural_score = round(
            (
                feature_quality
                + milestone_quality
                + score_quality
            ) / 3,
            2
        )

        # =================================================
        # AI EVALUATION
        # =================================================

        prompt = f"""
You are a Product Management Quality Reviewer.

Evaluate the following Milestone 4 output.

ROADMAP:
{roadmap}

MILESTONE RECOMMENDATION:
{milestone_recommendation}

EXECUTIVE SUMMARY:
{executive_summary}

PRODUCT STRATEGY:
{product_strategy}

Evaluate:

1. Priority alignment
2. Customer impact
3. Business impact
4. Milestone sequencing
5. Strategic alignment
6. Roadmap consistency
7. Recommendation quality
8. Risks and dependencies
9. Overall output quality

Return:

Overall Quality:
High / Medium / Low

Strengths:
...

Issues:
...

Recommended Improvements:
...

Use normal human-readable language.

Do not return JSON.
Do not return Python dictionaries.
"""

        ai_evaluation = self.llm.generate(
            prompt
        )

        # =================================================
        # FINAL REPORT
        # =================================================

        return f"""
ROADMAP QUALITY EVALUATION

Structural Quality Score:
{structural_score}/100

Features Validated:
{valid_features}/{total_features}

Milestones Validated:
{valid_milestones}/{total_features}

Scores Validated:
{valid_scores}/{total_features}


AI QUALITY REVIEW

{ai_evaluation}
"""