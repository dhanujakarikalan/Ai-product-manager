# =========================================================
# services/milestone4_service.py
# AI Product Manager Copilot
# =========================================================

from collections import Counter

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

        self.prioritizer = FeaturePrioritization()

        self.roadmap_planner = RoadmapPlanner()

        self.milestone_recommender = MilestoneRecommender()

        self.executive_summary = ExecutiveSummary()

        self.product_strategy = ProductStrategyReport()

        self.evaluation = RoadmapEvaluation()


    # =====================================================
    # 1. EXTRACT FEATURES
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
        # FEATURE DISTRIBUTION
        # -------------------------------------------------

        if isinstance(
            feature_request_summary,
            dict
        ):

            distribution = (
                feature_request_summary.get(
                    "feature_request_distribution",
                    {}
                )
            )

            if isinstance(
                distribution,
                dict
            ):

                for feature in distribution.keys():

                    feature = str(
                        feature
                    ).strip()

                    if feature:
                        feature_names.append(
                            feature
                        )


            # -------------------------------------------------
            # FALLBACK: features
            # -------------------------------------------------

            if not feature_names:

                distribution = (
                    feature_request_summary.get(
                        "features",
                        {}
                    )
                )

                if isinstance(
                    distribution,
                    dict
                ):

                    for feature in distribution.keys():

                        feature = str(
                            feature
                        ).strip()

                        if feature:
                            feature_names.append(
                                feature
                            )


            # -------------------------------------------------
            # FALLBACK: legacy dictionary
            # -------------------------------------------------

            if not feature_names:

                for key, value in (
                    feature_request_summary.items()
                ):

                    if key in {
                        "total_feature_requests",
                        "unique_features",
                        "most_requested_feature",
                        "feature_request_distribution",
                        "features"
                    }:

                        continue

                    if isinstance(
                        value,
                        (int, float)
                    ):

                        feature_names.append(
                            str(key)
                        )


        # -------------------------------------------------
        # FALLBACK TO DATAFRAME
        # -------------------------------------------------

        if (
            not feature_names
            and processed_df is not None
        ):

            if (
                "feature_request"
                in processed_df.columns
            ):

                values = (

                    processed_df[
                        "feature_request"
                    ]

                    .dropna()

                    .astype(str)

                    .str.strip()

                    .tolist()

                )

                feature_names.extend(
                    values
                )


        # -------------------------------------------------
        # CLEAN
        # -------------------------------------------------

        cleaned_features = []

        for feature in feature_names:

            feature = str(
                feature
            ).strip()

            if not feature:
                continue

            if feature.lower() in {
                "nan",
                "none",
                "null"
            }:
                continue

            if feature not in cleaned_features:

                cleaned_features.append(
                    feature
                )


        return cleaned_features


    # =====================================================
    # 2. GET FEATURE COUNTS
    # =====================================================

    def get_feature_counts(
        self,
        processed_df,
        pipeline_result
    ):

        counts = {}


        feature_summary = (
            pipeline_result.get(
                "feature_request_summary",
                {}
            )
        )


        # -------------------------------------------------
        # BEST SOURCE
        # -------------------------------------------------

        if isinstance(
            feature_summary,
            dict
        ):

            distribution = (
                feature_summary.get(
                    "feature_request_distribution",
                    {}
                )
            )

            if isinstance(
                distribution,
                dict
            ):

                for feature, count in (
                    distribution.items()
                ):

                    try:

                        counts[
                            str(feature)
                        ] = int(count)

                    except (
                        TypeError,
                        ValueError
                    ):

                        pass


        # -------------------------------------------------
        # DATAFRAME FALLBACK
        # -------------------------------------------------

        if (
            not counts
            and processed_df is not None
            and "feature_request"
            in processed_df.columns
        ):

            values = (

                processed_df[
                    "feature_request"
                ]

                .dropna()

                .astype(str)

                .str.strip()

                .tolist()

            )

            counts = dict(
                Counter(values)
            )


        return counts


    # =====================================================
    # 3. CREATE FEATURE SCORES
    # =====================================================

    def create_feature_scores(
        self,
        feature_names,
        processed_df,
        pipeline_result
    ):

        feature_scores = []


        total_rows = (

            len(processed_df)

            if processed_df is not None

            else 0

        )


        # -------------------------------------------------
        # FEATURE REQUEST COUNTS
        # -------------------------------------------------

        feature_counts = (
            self.get_feature_counts(
                processed_df,
                pipeline_result
            )
        )


        max_count = max(
            feature_counts.values(),
            default=1
        )


        # -------------------------------------------------
        # SENTIMENT INFORMATION
        # -------------------------------------------------

        sentiment_by_feature = {}


        if (
            processed_df is not None
            and "feature_request"
            in processed_df.columns
            and "sentiment"
            in processed_df.columns
        ):

            for feature in feature_names:

                feature_rows = (
                    processed_df[
                        processed_df[
                            "feature_request"
                        ]
                        .astype(str)
                        .str.strip()
                        == feature
                    ]
                )


                if len(feature_rows) == 0:

                    sentiment_by_feature[
                        feature
                    ] = 0

                    continue


                negative_count = (

                    feature_rows[
                        "sentiment"
                    ]

                    .astype(str)

                    .str.lower()

                    .str.contains(
                        "negative",
                        na=False
                    )

                    .sum()

                )


                sentiment_by_feature[
                    feature
                ] = (

                    negative_count
                    / len(feature_rows)

                )


        # -------------------------------------------------
        # CREATE SCORES
        # -------------------------------------------------

        for feature_name in feature_names:

            request_count = (
                feature_counts.get(
                    feature_name,
                    0
                )
            )


            # -------------------------------------------------
            # CUSTOMER DEMAND
            #
            # More requests = higher demand
            # -------------------------------------------------

            demand_ratio = (

                request_count
                / max_count

            )


            customer_demand = max(
                1.0,
                min(
                    10.0,
                    demand_ratio * 10
                )
            )


            # -------------------------------------------------
            # USER IMPACT
            #
            # Feature request frequency + negative feedback
            # -------------------------------------------------

            negative_ratio = (
                sentiment_by_feature.get(
                    feature_name,
                    0
                )
            )


            user_impact = (

                demand_ratio * 7.0
                + negative_ratio * 3.0

            )


            user_impact = max(
                1.0,
                min(
                    10.0,
                    user_impact
                )
            )


            # -------------------------------------------------
            # BUSINESS VALUE
            #
            # Demand is used as a practical proxy.
            # -------------------------------------------------

            business_value = (

                customer_demand * 0.7
                + user_impact * 0.3

            )


            business_value = max(
                1.0,
                min(
                    10.0,
                    business_value
                )
            )


            # -------------------------------------------------
            # STRATEGIC ALIGNMENT
            # -------------------------------------------------

            strategic_alignment = (

                customer_demand * 0.5
                + business_value * 0.5

            )


            strategic_alignment = max(
                1.0,
                min(
                    10.0,
                    strategic_alignment
                )
            )


            # -------------------------------------------------
            # URGENCY
            #
            # High demand + negative feedback = urgent
            # -------------------------------------------------

            urgency = (

                customer_demand * 0.6
                + user_impact * 0.4

            )


            urgency = max(
                1.0,
                min(
                    10.0,
                    urgency
                )
            )


            # -------------------------------------------------
            # PYDANTIC MODEL
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
    # 4. RUN COMPLETE MILESTONE 4
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
        # STEP 2 - CREATE FEATURE SCORES
        # =================================================

        feature_scores = (
            self.create_feature_scores(
                feature_names,
                processed_df,
                pipeline_result
            )
        )


        app_state.feature_scores = (
            feature_scores
        )


        # =================================================
        # STEP 3 - PRIORITIZATION
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
        # STEP 4 - ROADMAP
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
        # SUPPORTING DATA
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
        # FINAL RESULT
        # =================================================

        return {

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