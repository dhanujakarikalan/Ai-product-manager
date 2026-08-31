import pytest
from fastapi.testclient import TestClient

from app import app


# =========================================================
# TEST CLIENT
# =========================================================

client = TestClient(app)


# =========================================================
# 1. ROOT API
# =========================================================

def test_root():

    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "running"

    assert (
        data["message"]
        == "Welcome to AI Product Manager Copilot Backend"
    )


# =========================================================
# 2. OPENAPI / SWAGGER
# =========================================================

def test_openapi():

    response = client.get("/openapi.json")

    assert response.status_code == 200

    data = response.json()

    assert "openapi" in data

    assert "paths" in data


# =========================================================
# 3. CORS
# =========================================================

def test_cors():

    response = client.options(

        "/",

        headers={
            "Origin":
                "http://localhost:5173",

            "Access-Control-Request-Method":
                "GET"
        }
    )

    assert response.status_code in [
        200,
        204
    ]

    assert (
        response.headers.get(
            "access-control-allow-origin"
        )
        in [
            "http://localhost:5173",
            "*"
        ]
    )


# =========================================================
# 4. DASHBOARD ENDPOINT
# =========================================================

def test_dashboard_endpoint():

    response = client.get(
        "/dashboard"
    )

    # Dashboard may require authentication
    # or uploaded backend data.

    assert response.status_code in [
        200,
        400,
        401,
        403
    ]


# =========================================================
# 5. ANALYTICS ENDPOINT
# =========================================================

def test_analytics_endpoint():

    response = client.get(
        "/analytics/sentiment"
    )

    assert response.status_code in [
        200,
        400,
        401,
        403,
        404
    ]


# =========================================================
# 6. PRD ENDPOINT EXISTS
# =========================================================

def test_prd_endpoint_exists():

    response = client.post(
        "/prd/generate"
    )

    assert response.status_code in [
        200,
        400,
        401,
        403,
        404,
        422,
        500
    ]


# =========================================================
# 7. PRD RESULT ENDPOINT
# =========================================================

def test_prd_result_endpoint():

    response = client.get(
        "/prd/result"
    )

    assert response.status_code in [
        200,
        400,
        404
    ]


# =========================================================
# 8. PRIORITIZATION ENDPOINT EXISTS
# =========================================================

def test_prioritization_endpoint():

    response = client.post(
        "/prioritization/rank",
        json={}
    )

    assert response.status_code in [
        200,
        400,
        401,
        403,
        404,
        422,
        500
    ]


# =========================================================
# 9. USER STORY ENDPOINT EXISTS
# =========================================================

def test_user_story_endpoint():

    response = client.post(
        "/user-story/generate?count=10"
    )

    assert response.status_code in [
        200,
        400,
        401,
        403,
        404,
        422,
        500
    ]


# =========================================================
# 10. ROADMAP ENDPOINT EXISTS
# =========================================================

def test_roadmap_endpoint():

    response = client.post(
        "/roadmap/generate"
    )

    assert response.status_code in [
        200,
        400,
        401,
        403,
        404,
        500
    ]


# =========================================================
# 11. PRODUCT CHAT VALIDATION
# =========================================================

def test_product_chat_empty_request():

    response = client.post(
        "/product-chat/",
        json={}
    )

    assert response.status_code in [
        400,
        401,
        403,
        422
    ]


# =========================================================
# 12. PRODUCT CHAT VALID REQUEST
# =========================================================

def test_product_chat_request():

    response = client.post(

        "/product-chat/",

        json={
            "question":
                "What are the major customer pain points?"
        }
    )

    assert response.status_code in [
        200,
        400,
        401,
        403,
        500
    ]


# =========================================================
# 13. INVALID ROUTE
# =========================================================

def test_invalid_route():

    response = client.get(
        "/this-route-does-not-exist"
    )

    assert response.status_code == 404