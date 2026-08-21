# =========================================================
# services/milestone4_service.py
# AI Product Manager Copilot
# Complete Milestone 4 Service
# =========================================================

from services.feature_prioritization import (
    FeaturePrioritization
)

from services.roadmap_planner import (
    RoadmapPlanner
)

from services.milestone_recommender import (
    MilestoneRecommender
)

from services.executive_summary import (
    ExecutiveSummary
)

from services.product_strategy import (
    ProductStrategyReport
)

from services.evaluation import (
    RoadmapEvaluation
)

from schemas.prioritization import (
    FeatureScore
)

from services import app_state


class Milestone4Service:

    def __init__(self):

        # =================================================
        # INITIALIZE SERVICES
        # =================================================

        self.prioritizer = (
            FeaturePrioritization()
        )

        self.roadmap_planner = (
            RoadmapPlanner()
        )

        self.milestone_recommender = (
            MilestoneRecommender()
        )

        self.executive_summary = (
            ExecutiveSummary()
        )

        self.product_strategy = (
            ProductStrategyReport()
        )

        self.evaluation = (
            RoadmapEvaluation()
        )

    # =====================================================
    # 1. AUTOMATIC FEATURE EXTRACTION
    # =====================================================

    def extract_features(
        self,
        processed_df,
        pipeline_result
    ):

        feature_names = []

        feature_request_summary = (
            pipeline_result.get(
                "feature_request_summary",
                {}
            )
        )

        # -------------------------------------------------
        # FEATURE REQUEST SUMMARY - DICTIONARY
        # -------------------------------------------------

        if isinstance(
            feature_request_summary,
            dict
        ):

            for key, value in (
                feature_request_summary.items()
            ):

                # Example:
                # {"Search Improvement": 25}

                if isinstance(
                    value,
                    (int, float)
                ):

                    feature_names.append(
                        str(key)
                    )

                # Example:
                # {"feature": "Search Improvement"}

                elif isinstance(
                    value,
                    str
                ):

                    feature_names.append(
                        value
                    )

                # Example:
                # {"features": [...]}

                elif isinstance(
                    value,
                    list
                ):

                    for item in value:

                        if isinstance(
                            item,
                            str
                        ):

                            feature_names.append(
                                item
                            )

                        elif isinstance(
                            item,
                            dict
                        ):

                            feature = (

                                item.get(
                                    "feature"
                                )

                                or item.get(
                                    "feature_name"
                                )

                                or item.get(
                                    "name"
                                )

                                or item.get(
                                    "request"
                                )

                                or item.get(
                                    "feature_request"
                                )

                            )

                            if feature:

                                feature_names.append(
                                    str(feature)
                                )

        # -------------------------------------------------
        # FEATURE REQUEST SUMMARY - LIST
        # -------------------------------------------------

        elif isinstance(
            feature_request_summary,
            list
        ):

            for item in (
                feature_request_summary
            ):

                if isinstance(
                    item,
                    str
                ):

                    feature_names.append(
                        item
                    )

                elif isinstance(
                    item,
                    dict
                ):

                    feature = (

                        item.get(
                            "feature"
                        )

                        or item.get(
                            "feature_name"
                        )

                        or item.get(
                            "name"
                        )

                        or item.get(
                            "request"
                        )

                        or item.get(
                            "feature_request"
                        )

                    )

                    if feature:

                        feature_names.append(
                            str(feature)
                        )

        # -------------------------------------------------
        # FALLBACK TO DATAFRAME
        # -------------------------------------------------

        if not feature_names:

            possible_columns = [

                "feature",

                "feature_name",

                "feature_request",

                "request"

            ]

            if processed_df is not None:

                for column in (
                    possible_columns
                ):

                    if column in (
                        processed_df.columns
                    ):

                        values = (

                            processed_df[
                                column
                            ]

                            .dropna()

                            .astype(str)

                            .tolist()

                        )

                        feature_names.extend(
                            values
                        )

                        break

        # -------------------------------------------------
        # CLEAN FEATURE NAMES
        # -------------------------------------------------

        cleaned_features = []

        for feature in feature_names:

            feature = str(
                feature
            ).strip()

            if not feature:

                continue

            if feature.lower() in [

                "nan",

                "none",

                "null"

            ]:

                continue

            if feature not in (
                cleaned_features
            ):

                cleaned_features.append(
                    feature
                )

        return cleaned_features

    # =====================================================
    # 2. AUTOMATIC FEATURE SCORE CREATION
    # =====================================================

    def create_feature_scores(
        self,
        feature_names,
        processed_df
    ):

        feature_scores = []

        total_rows = (

            len(processed_df)

            if processed_df is not None

            else 0

        )

        # -------------------------------------------------
        # CALCULATE NEGATIVE SENTIMENT RATIO
        # -------------------------------------------------

        negative_ratio = 0.0

        if (

            processed_df is not None

            and "sentiment"
            in processed_df.columns

            and total_rows > 0

        ):

            sentiment_values = (

                processed_df[
                    "sentiment"
                ]

                .astype(str)

                .str.lower()

            )

            negative_count = (

                sentiment_values

                .str.contains(
                    "negative",
                    na=False
                )

                .sum()

            )

            negative_ratio = (

                negative_count
                / total_rows

            )

        # -------------------------------------------------
        # CREATE FEATURE SCORES
        # -------------------------------------------------

        for feature_name in (
            feature_names
        ):

            # -------------------------------------------------
            # AUTOMATIC SCORING
            # -------------------------------------------------

            customer_demand = 7.0

            business_value = 7.0

            user_impact = max(

                1.0,

                min(
                    10.0,
                    negative_ratio * 10
                )

            )

            strategic_alignment = (

                customer_demand
                + business_value

            ) / 2

            urgency = user_impact

            # -------------------------------------------------
            # CREATE PYDANTIC FEATURE SCORE
            # -------------------------------------------------

            feature_score = FeatureScore(

                feature=feature_name,

                customer_demand=round(
                    customer_demand,
                    2
                ),

                business_value=round(
                    business_value,
                    2
                ),

                user_impact=round(
                    user_impact,
                    2
                ),

                strategic_alignment=round(
                    strategic_alignment,
                    2
                ),

                urgency=round(
                    urgency,
                    2
                )

            )

            feature_scores.append(
                feature_score
            )

        return feature_scores

    # =====================================================
    # 3. COMPLETE MILESTONE 4 PIPELINE
    # =====================================================

    def run(
        self,
        processed_df,
        pipeline_result
    ):

        # =================================================
        # STEP 1 - EXTRACT FEATURES
        # =================================================

        feature_names = (
            self.extract_features(

                processed_df,

                pipeline_result

            )
        )

        if not feature_names:

            raise ValueError(

                "No feature requests found "
                "in the processed product data."

            )

        # =================================================
        # STEP 2 - AUTOMATIC FEATURE SCORES
        # =================================================

        feature_scores = (
            self.create_feature_scores(

                feature_names,

                processed_df

            )
        )

        app_state.feature_scores = (
            feature_scores
        )

        # =================================================
        # STEP 3 - FEATURE PRIORITIZATION
        # =================================================

        prioritized_features = (

            self.prioritizer
            .prioritize_features(

                features=feature_scores

            )

        )

        app_state.generated_prioritization = (
            prioritized_features
        )

        # =================================================
        # STEP 4 - ROADMAP GENERATION
        # =================================================

        roadmap = (

            self.roadmap_planner
            .create_roadmap(

                prioritized_features

            )

        )

        app_state.generated_roadmap = (
            roadmap
        )

        # =================================================
        # PIPELINE INFORMATION
        # =================================================

        pain_points = (

            pipeline_result.get(

                "pain_point_summary",

                {}

            )

        )

        feature_requests = (

            pipeline_result.get(

                "feature_request_summary",

                {}

            )

        )

        sentiment = (

            pipeline_result.get(

                "sentiment_summary",

                {}

            )

        )

        trends = (

            pipeline_result.get(

                "trend_report",

                {}

            )

        )

        # =================================================
        # STEP 5 - MILESTONE RECOMMENDATION
        # =================================================
        #
        # MilestoneRecommender:
        #
        # recommend(self, roadmap)
        #
        # =================================================

        recommendation = (

            self.milestone_recommender
            .recommend(

                roadmap

            )

        )

        app_state.generated_milestone_recommendation = (
            recommendation
        )

        # =================================================
        # STEP 6 - EXECUTIVE SUMMARY
        # =================================================
        #
        # ExecutiveSummary:
        #
        # generate(
        #     roadmap,
        #     milestone_recommendation,
        #     pain_points,
        #     feature_requests,
        #     sentiment,
        #     trends
        # )
        #
        # Positional arguments are used intentionally.
        # =================================================

        executive_summary = (

            self.executive_summary
            .generate(

                roadmap,

                recommendation,

                pain_points,

                feature_requests,

                sentiment,

                trends

            )

        )

        app_state.generated_executive_summary = (
            executive_summary
        )

        # =================================================
        # STEP 7 - PRODUCT STRATEGY
        # =================================================

        product_strategy = (

            self.product_strategy
            .generate(

                roadmap,

                recommendation,

                executive_summary,

                pain_points,

                feature_requests,

                sentiment,

                trends

            )

        )

        app_state.generated_product_strategy = (
            product_strategy
        )

        # =================================================
        # STEP 8 - EVALUATION
        # =================================================

        evaluation = (

            self.evaluation
            .evaluate(

                roadmap,

                recommendation,

                executive_summary,

                product_strategy

            )

        )

        app_state.generated_roadmap_evaluation = (
            evaluation
        )

        # =================================================
        # STEP 9 - FINAL RESULT
        # =================================================

        result = {

            "feature_scores":
                feature_scores,

            "prioritization":
                prioritized_features,

            "roadmap":
                roadmap,

            "milestone_recommendation":
                recommendation,

            "executive_summary":
                executive_summary,

            "product_strategy":
                product_strategy,

            "evaluation":
                evaluation

        }

        return result