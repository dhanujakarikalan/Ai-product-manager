import streamlit as st
import requests


# =========================================================
# CONFIGURATION
# =========================================================

BACKEND_URL = "http://127.0.0.1:8000"


# =========================================================
# PAGE CONFIGURATION
# =========================================================

st.set_page_config(
    page_title="AI Product Manager Copilot",
    page_icon="🤖",
    layout="wide"
)


# =========================================================
# SESSION STATE
# =========================================================

if "uploaded" not in st.session_state:
    st.session_state.uploaded = False

if "prd_result" not in st.session_state:
    st.session_state.prd_result = None

if "analytics_result" not in st.session_state:
    st.session_state.analytics_result = None

if "user_story_result" not in st.session_state:
    st.session_state.user_story_result = None

if "chat_result" not in st.session_state:
    st.session_state.chat_result = None

if "prioritization_result" not in st.session_state:
    st.session_state.prioritization_result = None

if "roadmap_result" not in st.session_state:
    st.session_state.roadmap_result = None

if "roadmap_recommendation" not in st.session_state:
    st.session_state.roadmap_recommendation = None

if "roadmap_evaluation" not in st.session_state:
    st.session_state.roadmap_evaluation = None


# =========================================================
# HEADER
# =========================================================

st.title(
    "🤖 AI Product Manager Copilot"
)

st.caption(
    "AI-powered Product Management Assistant"
)

st.write(
    f"Backend API: {BACKEND_URL}"
)


# =========================================================
# TABS
# =========================================================

tab1, tab2, tab3, tab4, tab5, tab6, tab7 = st.tabs(
    [
        "📤 Upload",
        "📊 Analytics",
        "📄 PRD",
        "👤 User Stories & Work Items",
        "💬 Product Chat",
        "⭐ Feature Prioritization",
        "🗺️ Roadmap & Milestones"
    ]
)


# =========================================================
# TAB 1 — UPLOAD
# =========================================================

with tab1:

    st.header(
        "📤 Upload Customer Feedback"
    )

    uploaded_file = st.file_uploader(
        "Upload your feedback dataset",
        type=[
            "csv",
            "xlsx",
            "xls"
        ]
    )

    if uploaded_file:

        st.write(
            f"Selected file: **{uploaded_file.name}**"
        )

        if st.button(
            "Upload Dataset",
            type="primary"
        ):

            try:

                files = {
                    "file": (
                        uploaded_file.name,
                        uploaded_file.getvalue(),
                        uploaded_file.type
                    )
                }

                with st.spinner(
                    "Uploading and processing dataset..."
                ):

                    response = requests.post(
                        f"{BACKEND_URL}/upload",
                        files=files,
                        timeout=180
                    )

                if response.status_code == 200:

                    st.session_state.uploaded = True

                    # Reset dependent outputs
                    st.session_state.prioritization_result = None
                    st.session_state.roadmap_result = None
                    st.session_state.roadmap_recommendation = None
                    st.session_state.roadmap_evaluation = None

                    st.success(
                        "Dataset uploaded successfully!"
                    )

                    st.json(
                        response.json()
                    )

                else:

                    st.error(
                        f"Upload failed: {response.text}"
                    )

            except requests.exceptions.ConnectionError:

                st.error(
                    "Could not connect to the FastAPI backend."
                )

            except Exception as e:

                st.error(
                    f"Upload error: {e}"
                )


# =========================================================
# TAB 2 — ANALYTICS
# =========================================================

with tab2:

    st.header(
        "📊 Feedback Analytics"
    )

    if not st.session_state.uploaded:

        st.info(
            "Please upload a dataset first."
        )

    else:

        if st.button(
            "Load Analytics",
            type="primary"
        ):

            try:

                with st.spinner(
                    "Loading analytics..."
                ):

                    response = requests.get(
                        f"{BACKEND_URL}/analytics/",
                        timeout=60
                    )

                if response.status_code == 200:

                    st.session_state.analytics_result = (
                        response.json()
                    )

                    st.success(
                        "Analytics loaded successfully!"
                    )

                else:

                    st.error(
                        f"Analytics failed: {response.text}"
                    )

            except Exception as e:

                st.error(
                    f"Analytics error: {e}"
                )

        if st.session_state.analytics_result:

            st.json(
                st.session_state.analytics_result
            )


# =========================================================
# TAB 3 — PRD
# =========================================================

with tab3:

    st.header(
        "📄 Product Requirements Document"
    )

    if not st.session_state.uploaded:

        st.warning(
            "Please upload a dataset first."
        )

    else:

        if st.button(
            "Generate PRD",
            type="primary"
        ):

            try:

                with st.spinner(
                    "Generating PRD..."
                ):

                    response = requests.post(
                        f"{BACKEND_URL}/prd/generate",
                        timeout=300
                    )

                if response.status_code == 200:

                    st.session_state.prd_result = (
                        response.json()
                    )

                    st.success(
                        "PRD generated successfully!"
                    )

                else:

                    st.error(
                        f"PRD generation failed: "
                        f"{response.text}"
                    )

            except Exception as e:

                st.error(
                    f"PRD error: {e}"
                )

        if st.session_state.prd_result:

            prd = st.session_state.prd_result.get(
                "prd",
                ""
            )

            st.divider()

            st.markdown(
                prd
            )

            st.download_button(
                label="⬇️ Download PRD",
                data=prd,
                file_name="product_requirements_document.md",
                mime="text/markdown"
            )


# =========================================================
# TAB 4 — USER STORIES
# =========================================================

with tab4:

    st.header(
        "👤 User Stories & Work Items"
    )

    if not st.session_state.prd_result:

        st.warning(
            "Please generate the PRD first."
        )

    else:

        story_option = st.selectbox(
            "How many User Stories?",
            [
                "Top 5",
                "Top 10",
                "Top 15",
                "Top 20",
                "All"
            ],
            index=1
        )

        if story_option == "Top 5":
            story_count = 5
        elif story_option == "Top 10":
            story_count = 10
        elif story_option == "Top 15":
            story_count = 15
        elif story_option == "Top 20":
            story_count = 20
        else:
            story_count = 50

        if st.button(
            "Generate User Stories",
            type="primary"
        ):

            try:

                with st.spinner(
                    "Generating user stories..."
                ):

                    response = requests.post(
                        f"{BACKEND_URL}/user-story/generate",
                        params={
                            "count": story_count
                        },
                        timeout=300
                    )

                if response.status_code == 200:

                    st.session_state.user_story_result = (
                        response.json()
                    )

                    st.success(
                        "User stories generated successfully!"
                    )

                else:

                    st.error(
                        f"Generation failed: {response.text}"
                    )

            except Exception as e:

                st.error(
                    f"User story error: {e}"
                )

        if st.session_state.user_story_result:

            user_stories = (
                st.session_state.user_story_result.get(
                    "user_stories",
                    ""
                )
            )

            st.divider()

            st.markdown(
                user_stories
            )

            st.download_button(
                label="⬇️ Download User Stories",
                data=user_stories,
                file_name="user_stories.md",
                mime="text/markdown"
            )


# =========================================================
# TAB 5 — PRODUCT CHAT
# =========================================================

with tab5:

    st.header(
        "💬 Product Chat"
    )

    question = st.text_area(
        "Ask your product question",
        placeholder=(
            "Example: What is the major issue of the product?"
        ),
        height=100
    )

    if st.button(
        "Ask Product Manager Copilot",
        type="primary"
    ):

        if not question.strip():

            st.warning(
                "Please enter a question."
            )

        else:

            try:

                with st.spinner(
                    "Analyzing product information..."
                ):

                    response = requests.post(
                        f"{BACKEND_URL}/product-chat/",
                        json={
                            "question": question
                        },
                        timeout=180
                    )

                if response.status_code == 200:

                    st.session_state.chat_result = (
                        response.json()
                    )

                else:

                    st.error(
                        f"Product Chat failed: "
                        f"{response.text}"
                    )

            except Exception as e:

                st.error(
                    f"Product Chat error: {e}"
                )

    if st.session_state.chat_result:

        result = st.session_state.chat_result

        st.divider()

        st.subheader(
            "🤖 Product Manager Copilot"
        )

        st.markdown(
            result.get(
                "answer",
                ""
            )
        )


# =========================================================
# TAB 6 — AUTOMATIC FEATURE PRIORITIZATION
# =========================================================

with tab6:

    st.header(
        "⭐ Feature Prioritization"
    )

    st.write(
        "Automatically identify and prioritize product "
        "features from customer feedback."
    )

    st.info(
        "No manual feature names or scores are required. "
        "The backend analyzes the processed product data."
    )

    if not st.session_state.uploaded:

        st.warning(
            "Please upload and process your customer "
            "feedback dataset first."
        )

    else:

        st.success(
            "✓ Customer feedback is available."
        )

        if st.button(
            "🚀 Generate Feature Prioritization",
            type="primary"
        ):

            try:

                with st.spinner(
                    "Analyzing feedback and generating "
                    "feature priorities..."
                ):

                    response = requests.post(
                        f"{BACKEND_URL}/prioritization/auto",
                        timeout=180
                    )

                if response.status_code == 200:

                    result = response.json()

                    st.session_state.prioritization_result = (
                        result
                    )

                    st.success(
                        "Feature prioritization generated successfully!"
                    )

                else:

                    try:

                        error_data = response.json()

                        error_message = error_data.get(
                            "detail",
                            response.text
                        )

                    except Exception:

                        error_message = response.text

                    st.error(
                        f"Feature prioritization failed: "
                        f"{error_message}"
                    )

            except requests.exceptions.ConnectionError:

                st.error(
                    "Could not connect to the FastAPI backend."
                )

            except Exception as e:

                st.error(
                    f"Prioritization error: {e}"
                )

        # -------------------------------------------------
        # RESULTS
        # -------------------------------------------------

        if st.session_state.prioritization_result:

            st.divider()

            st.subheader(
                "📊 Automatically Prioritized Features"
            )

            results = (
                st.session_state.prioritization_result.get(
                    "results",
                    []
                )
            )

            if results:

                for item in results:

                    rank = item.get(
                        "rank",
                        "N/A"
                    )

                    feature = item.get(
                        "feature",
                        "Unknown Feature"
                    )

                    score = item.get(
                        "score",
                        "N/A"
                    )

                    priority = item.get(
                        "priority",
                        "N/A"
                    )

                    st.markdown(
                        f"### #{rank} — {feature}"
                    )

                    col1, col2, col3 = st.columns(3)

                    with col1:

                        st.metric(
                            "Priority Score",
                            score
                        )

                    with col2:

                        st.metric(
                            "Priority",
                            priority
                        )

                    with col3:

                        st.metric(
                            "Rank",
                            rank
                        )

                    st.divider()

            else:

                st.warning(
                    "No product features were identified "
                    "from the available data."
                )


# =========================================================
# TAB 7 — ROADMAP & MILESTONES
# =========================================================

with tab7:

    st.header(
        "🗺️ Product Roadmap & Milestones"
    )

    st.write(
        "Generate a product roadmap from the automatically "
        "prioritized product features."
    )

    if not st.session_state.prioritization_result:

        st.warning(
            "Please generate Feature Prioritization first."
        )

        st.info(
            "Go to ⭐ Feature Prioritization and click "
            "'Generate Feature Prioritization'."
        )

    else:

        st.success(
            "✓ Feature prioritization completed."
        )

        if st.button(
            "🚀 Generate Product Roadmap",
            type="primary"
        ):

            try:

                with st.spinner(
                    "Creating roadmap, AI milestone "
                    "recommendations and evaluation..."
                ):

                    response = requests.post(
                        f"{BACKEND_URL}/roadmap/generate",
                        timeout=300
                    )

                if response.status_code == 200:

                    result = response.json()

                    st.session_state.roadmap_result = (
                        result.get(
                            "roadmap",
                            []
                        )
                    )

                    st.session_state.roadmap_recommendation = (
                        result.get(
                            "recommendation",
                            ""
                        )
                    )

                    st.session_state.roadmap_evaluation = (
                        result.get(
                            "evaluation",
                            ""
                        )
                    )

                    st.success(
                        "Product roadmap generated successfully!"
                    )

                else:

                    try:

                        error_data = response.json()

                        error_message = error_data.get(
                            "detail",
                            response.text
                        )

                    except Exception:

                        error_message = response.text

                    st.error(
                        f"Roadmap generation failed: "
                        f"{error_message}"
                    )

            except requests.exceptions.ConnectionError:

                st.error(
                    "Could not connect to the FastAPI backend."
                )

            except Exception as e:

                st.error(
                    f"Roadmap error: {e}"
                )

        # -------------------------------------------------
        # ROADMAP
        # -------------------------------------------------

        if st.session_state.roadmap_result:

            roadmap = (
                st.session_state.roadmap_result
            )

            st.divider()

            st.subheader(
                "🗺️ Product Roadmap"
            )

            # ---------------------------------------------
            # Display roadmap dynamically
            # ---------------------------------------------

            if isinstance(
                roadmap,
                list
            ):

                milestones = {}

                for item in roadmap:

                    milestone = item.get(
                        "milestone",
                        "Other"
                    )

                    if milestone not in milestones:

                        milestones[milestone] = []

                    milestones[milestone].append(
                        item
                    )

                for milestone_name, items in milestones.items():

                    st.markdown(
                        f"### 📍 {milestone_name}"
                    )

                    for item in items:

                        feature = item.get(
                            "feature",
                            "Unknown Feature"
                        )

                        priority = item.get(
                            "priority",
                            "N/A"
                        )

                        score = item.get(
                            "score",
                            "N/A"
                        )

                        rank = item.get(
                            "rank",
                            "N/A"
                        )

                        st.markdown(
                            f"**{feature}**"
                        )

                        col1, col2, col3 = st.columns(3)

                        with col1:

                            st.write(
                                f"Priority: **{priority}**"
                            )

                        with col2:

                            st.write(
                                f"Score: **{score}**"
                            )

                        with col3:

                            st.write(
                                f"Rank: **{rank}**"
                            )

                    st.divider()

            else:

                st.markdown(
                    str(roadmap)
                )

        # -------------------------------------------------
        # AI RECOMMENDATION
        # -------------------------------------------------

        if st.session_state.roadmap_recommendation:

            st.subheader(
                "🤖 AI Milestone Recommendation"
            )

            st.markdown(
                st.session_state.roadmap_recommendation
            )

        # -------------------------------------------------
        # EVALUATION
        # -------------------------------------------------

        if st.session_state.roadmap_evaluation:

            st.divider()

            st.subheader(
                "🧪 Roadmap Evaluation"
            )

            st.markdown(
                st.session_state.roadmap_evaluation
            )

            st.download_button(
                label="⬇️ Download Roadmap Evaluation",
                data=st.session_state.roadmap_evaluation,
                file_name="roadmap_evaluation.md",
                mime="text/markdown"
            )


# =========================================================
# FOOTER
# =========================================================

st.divider()

st.caption(
    "AI Product Manager Copilot | "
    "Feature Prioritization | "
    "Roadmap Planning | "
    "Milestone Recommendation"
)