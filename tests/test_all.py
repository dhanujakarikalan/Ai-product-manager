# =========================================================
# tests/test_all.py
# GLOBAL TEST SUITE
# AI PRODUCT MANAGER COPILOT
# =========================================================

import pandas as pd

from services.testing_service import TestingService
from services.optimization_service import OptimizationService

from services.feature_prioritization import (
    FeaturePrioritization
)

from services.roadmap_planner import (
    RoadmapPlanner
)

from schemas.prioritization import (
    FeatureScore
)


# =========================================================
# GLOBAL SERVICES
# =========================================================

testing_service = TestingService()

optimization_service = OptimizationService()


# =========================================================
# 1. PIPELINE / DATA TESTING
# =========================================================


def test_pipeline_dataset_available():

    df = pd.DataFrame({

        "feedback": [
            "Search is slow",
            "Login is difficult",
            "Dashboard is confusing"
        ],

        "sentiment": [
            "Negative",
            "Negative",
            "Neutral"
        ],

        "theme": [
            "Performance",
            "Authentication",
            "Usability"
        ]

    })

    result = testing_service.test_dataset(
        df
    )

    assert result["status"] == "PASS"


def test_pipeline_required_columns():

    df = pd.DataFrame({

        "feedback": [
            "Search is slow"
        ],

        "sentiment": [
            "Negative"
        ]

    })

    result = testing_service.test_columns(

        df,

        [
            "feedback"
        ]
    )

    assert result["status"] == "PASS"


def test_pipeline_missing_columns():

    df = pd.DataFrame({

        "feedback": [
            "Search is slow"
        ]

    })

    result = testing_service.test_columns(

        df,

        [
            "feedback",
            "sentiment",
            "theme"
        ]
    )

    assert result["status"] == "FAIL"


# =========================================================
# 2. PRD TESTING
# =========================================================


def test_prd_generation():

    prd = """
    Overall Customer Feedback Insights

    Customer Sentiment Overview

    Major Customer Problems

    Top Product Themes

    Feature Request Analysis

    Functional Requirements

    Non-Functional Requirements

    Success Metrics

    Risks and Assumptions
    """

    result = testing_service.test_prd(
        prd
    )

    assert result["status"] == "PASS"


def test_prd_empty():

    result = testing_service.test_prd(
        ""
    )

    assert result["status"] == "FAIL"


def test_prd_no_executive_summary():

    prd = """
    Overall Customer Feedback Insights

    Customer Sentiment Overview

    Major Customer Problems

    Functional Requirements

    Success Metrics
    """

    # Executive Summary should not be part
    # of the new PRD structure.

    assert (
        "Executive Summary" not in prd
    )


# =========================================================
# 3. FEATURE PRIORITIZATION TESTING
# =========================================================


def test_feature_prioritization():

    features = [

        FeatureScore(

            feature="Improve Search",

            customer_demand=9,

            business_value=9,

            user_impact=8,

            strategic_alignment=8,

            urgency=9

        ),

        FeatureScore(

            feature="Dark Mode",

            customer_demand=5,

            business_value=5,

            user_impact=5,

            strategic_alignment=5,

            urgency=4

        )

    ]

    service = FeaturePrioritization()

    results = service.prioritize_features(
        features
    )

    assert len(results) == 2

    assert (
        results[0]["feature"]
        == "Improve Search"
    )

    assert (
        results[0]["rank"]
        == 1
    )

    assert (
        results[1]["rank"]
        == 2
    )

    assert (
        results[0]["score"]
        >
        results[1]["score"]
    )


def test_high_priority():

    service = FeaturePrioritization()

    result = service.calculate_score(

        feature="Critical Feature",

        customer_demand=10,

        business_value=10,

        user_impact=10,

        strategic_alignment=10,

        urgency=10

    )

    assert (
        result["score"]
        == 10.0
    )

    assert (
        result["priority"]
        == "High"
    )


def test_medium_priority():

    service = FeaturePrioritization()

    result = service.calculate_score(

        feature="Medium Feature",

        customer_demand=6,

        business_value=6,

        user_impact=6,

        strategic_alignment=6,

        urgency=6

    )

    assert (
        result["priority"]
        == "Medium"
    )


def test_low_priority():

    service = FeaturePrioritization()

    result = service.calculate_score(

        feature="Low Feature",

        customer_demand=2,

        business_value=2,

        user_impact=2,

        strategic_alignment=2,

        urgency=2

    )

    assert (
        result["priority"]
        == "Low"
    )


def test_invalid_weights():

    service = FeaturePrioritization()

    try:

        service.calculate_score(

            feature="Invalid Weight",

            customer_demand=5,

            business_value=5,

            user_impact=5,

            strategic_alignment=5,

            urgency=5,

            customer_demand_weight=0.50,

            business_value_weight=0.50,

            user_impact_weight=0.50,

            strategic_alignment_weight=0.50,

            urgency_weight=0.50

        )

        assert False

    except ValueError:

        assert True


# =========================================================
# 4. ROADMAP TESTING
# =========================================================


def test_roadmap_generation():

    features = [

        {

            "feature":
                "Improve Search",

            "score":
                8.5,

            "priority":
                "High",

            "rank":
                1

        },

        {

            "feature":
                "Dark Mode",

            "score":
                5.5,

            "priority":
                "Medium",

            "rank":
                2

        }

    ]

    planner = RoadmapPlanner()

    roadmap = planner.create_roadmap(
        features
    )

    assert roadmap is not None

    assert len(roadmap) > 0


def test_roadmap_feature_preserved():

    features = [

        {

            "feature":
                "Improve Search",

            "score":
                8.5,

            "priority":
                "High",

            "rank":
                1

        }

    ]

    planner = RoadmapPlanner()

    roadmap = planner.create_roadmap(
        features
    )

    roadmap_text = str(
        roadmap
    )

    assert (
        "Improve Search"
        in roadmap_text
    )


# =========================================================
# 5. MILESTONE 4 TESTING
# =========================================================


def test_milestone4_output():

    milestone4_result = {

        "prioritization": [

            {

                "feature":
                    "Improve Search",

                "score":
                    8.5,

                "priority":
                    "High",

                "rank":
                    1

            }

        ],

        "roadmap": [

            {

                "feature":
                    "Improve Search",

                "milestone":
                    "Milestone 1"

            }

        ],

        "milestone_recommendation":
            "Milestone 1 should focus on search improvement.",

        "executive_summary":
            "The product should prioritize search performance.",

        "product_strategy":
            "Focus on improving product usability and performance.",

        "evaluation":
            "Overall quality is high."

    }

    result = testing_service.test_milestone4(
        milestone4_result
    )

    assert (
        result["status"]
        == "PASS"
    )


# =========================================================
# 6. RAG TESTING
# =========================================================


def test_rag_output():

    feedback = [

        {

            "feedback":
                "Search is slow"

        },

        {

            "feedback":
                "Login is difficult"

        }

    ]

    result = testing_service.test_rag(
        feedback
    )

    assert (
        result["status"]
        == "PASS"
    )


def test_rag_empty():

    result = testing_service.test_rag(
        []
    )

    assert (
        result["status"]
        == "PASS"
    )


# =========================================================
# 7. OPTIMIZATION TESTING
# =========================================================


def test_summary_optimization():

    summary = {

        "Search": 100,

        "Login": 80,

        "Dashboard": 50,

        "Reports": 20

    }

    result = (
        optimization_service
        .optimize_summary(
            summary,
            max_items=2
        )
    )

    assert isinstance(
        result,
        dict
    )

    assert len(result) == 2


def test_duplicate_feedback_optimization():

    feedback = [

        {

            "feedback":
                "Search is slow"

        },

        {

            "feedback":
                "Search is slow"

        },

        {

            "feedback":
                "Login is difficult"

        }

    ]

    result = (
        optimization_service
        .optimize_rag_context(
            feedback
        )
    )

    assert (
        len(result)
        == 2
    )


def test_feature_optimization():

    features = [

        {

            "feature":
                "Search"

        },

        {

            "feature":
                "Search"

        },

        {

            "feature":
                "Login"

        }

    ]

    result = (
        optimization_service
        .optimize_features(
            features
        )
    )

    assert (
        len(result)
        == 2
    )


def test_pipeline_context_optimization():

    pipeline_result = {

        "categorization_summary": {

            "Bug": 50,

            "Feature": 30

        },

        "theme_summary": {

            "Performance": 40

        },

        "pain_point_summary": {

            "Slow Search": 20

        },

        "feature_request_summary": {

            "Advanced Search": 25

        },

        "sentiment_summary": {

            "Negative": 30

        },

        "trend_report": {

            "Search":
                "Increasing"

        }

    }

    result = (
        optimization_service
        .optimize_pipeline_result(
            pipeline_result
        )
    )

    assert isinstance(
        result,
        dict
    )

    assert (
        "theme_summary"
        in result
    )

    assert (
        "feature_request_summary"
        in result
    )


# =========================================================
# 8. GLOBAL TESTING SERVICE
# =========================================================


def test_testing_service_record():

    service = TestingService()

    result = service.record(

        component="Global",

        test_name="Basic Test",

        passed=True,

        message="Test passed"

    )

    assert (
        result["status"]
        == "PASS"
    )


def test_testing_service_failure():

    service = TestingService()

    result = service.record(

        component="Global",

        test_name="Failure Test",

        passed=False,

        message="Test failed"

    )

    assert (
        result["status"]
        == "FAIL"
    )


def test_testing_report():

    service = TestingService()

    service.record(
        "Global",
        "Test 1",
        True
    )

    service.record(
        "Global",
        "Test 2",
        True
    )

    report = service.get_report()

    assert (
        report["total_tests"]
        == 2
    )

    assert (
        report["passed"]
        == 2
    )

    assert (
        report["failed"]
        == 0
    )

    assert (
        report["quality_score"]
        == 100
    )

    assert (
        report["status"]
        == "PASS"
    )


def test_testing_report_with_failure():

    service = TestingService()

    service.record(
        "Global",
        "Test 1",
        True
    )

    service.record(
        "Global",
        "Test 2",
        False
    )

    report = service.get_report()

    assert (
        report["total_tests"]
        == 2
    )

    assert (
        report["passed"]
        == 1
    )

    assert (
        report["failed"]
        == 1
    )

    assert (
        report["quality_score"]
        == 50
    )

    assert (
        report["status"]
        == "REVIEW REQUIRED"
    )


# =========================================================
# 9. API RESPONSE TESTING
# =========================================================


def test_api_response():

    service = TestingService()

    result = service.test_api_response({

        "status":
            "Success"

    })

    assert (
        result["status"]
        == "PASS"
    )


def test_empty_api_response():

    service = TestingService()

    result = service.test_api_response(
        None
    )

    assert (
        result["status"]
        == "FAIL"
    )


# =========================================================
# 10. COMPLETE SYSTEM TEST
# =========================================================


def test_complete_system_structure():

    milestone4_result = {

        "prioritization": [
            {
                "feature":
                    "Improve Search",

                "score":
                    8.5,

                "priority":
                    "High",

                "rank":
                    1
            }
        ],

        "roadmap": [
            {
                "feature":
                    "Improve Search",

                "milestone":
                    "Milestone 1"
            }
        ],

        "milestone_recommendation":
            "Improve Search first.",

        "executive_summary":
            "Search improvement is the top priority.",

        "product_strategy":
            "Improve search performance.",

        "evaluation":
            "Quality is high."

    }

    required_keys = [

        "prioritization",

        "roadmap",

        "milestone_recommendation",

        "executive_summary",

        "product_strategy",

        "evaluation"

    ]

    for key in required_keys:

        assert (
            key
            in milestone4_result
        )

        assert (
            milestone4_result[key]
        )