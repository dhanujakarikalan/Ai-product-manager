class TestingService:

    def __init__(self):

        self.results = []


    # =====================================================
    # RESET
    # =====================================================

    def reset(self):

        self.results = []


    # =====================================================
    # RECORD TEST
    # =====================================================

    def record(
        self,
        component,
        test_name,
        passed,
        message=""
    ):

        result = {

            "component":
                component,

            "test":
                test_name,

            "status":
                "PASS"
                if passed
                else "FAIL",

            "message":
                message
        }

        self.results.append(
            result
        )

        return result


    # =====================================================
    # DATASET TEST
    # =====================================================

    def test_dataset(
        self,
        df
    ):

        if df is None:

            return self.record(

                "Data Pipeline",

                "Dataset availability",

                False,

                "Processed dataframe is None."
            )

        return self.record(

            "Data Pipeline",

            "Dataset availability",

            len(df) > 0,

            f"Rows: {len(df)}"
        )


    # =====================================================
    # REQUIRED COLUMNS TEST
    # =====================================================

    def test_columns(
        self,
        df,
        required_columns
    ):

        if df is None:

            return self.record(

                "Data Pipeline",

                "Required columns",

                False,

                "Dataframe is None."
            )

        missing = [

            column

            for column in required_columns

            if column not in df.columns

        ]

        passed = (
            len(missing) == 0
        )

        return self.record(

            "Data Pipeline",

            "Required columns",

            passed,

            (
                "All required columns found."
                if passed
                else
                f"Missing columns: {missing}"
            )
        )


    # =====================================================
    # PRD TEST
    # =====================================================

    def test_prd(
        self,
        prd
    ):

        if not prd:

            return self.record(

                "PRD",

                "PRD generation",

                False,

                "PRD is empty."
            )

        required_sections = [

            "Customer",

            "Problem",

            "Functional Requirements",

            "Success Metrics"

        ]

        missing = [

            section

            for section in required_sections

            if section.lower()
            not in prd.lower()

        ]

        passed = (
            len(missing) == 0
        )

        return self.record(

            "PRD",

            "PRD structure",

            passed,

            (
                "Required PRD content found."
                if passed
                else
                f"Missing expected content: {missing}"
            )
        )


    # =====================================================
    # PRIORITIZATION TEST
    # =====================================================

    def test_prioritization(
        self,
        results
    ):

        if not results:

            return self.record(

                "Feature Prioritization",

                "Prioritization output",

                False,

                "No prioritization results."
            )

        valid = True

        for item in results:

            if "feature" not in item:
                valid = False

            if "score" not in item:
                valid = False

            if "priority" not in item:
                valid = False

            if "rank" not in item:
                valid = False

        return self.record(

            "Feature Prioritization",

            "Ranking structure",

            valid,

            (
                "All ranking fields are valid."
                if valid
                else
                "One or more ranking fields are missing."
            )
        )


    # =====================================================
    # ROADMAP TEST
    # =====================================================

    def test_roadmap(
        self,
        roadmap
    ):

        passed = bool(
            roadmap
        )

        return self.record(

            "Roadmap",

            "Roadmap generation",

            passed,

            (
                "Roadmap generated."
                if passed
                else
                "Roadmap is empty."
            )
        )


    # =====================================================
    # MILESTONE 4 TEST
    # =====================================================

    def test_milestone4(
        self,
        result
    ):

        required = [

            "prioritization",

            "roadmap",

            "milestone_recommendation",

            "executive_summary",

            "product_strategy",

            "evaluation"

        ]

        missing = [

            key

            for key in required

            if not result.get(key)

        ]

        passed = (
            len(missing) == 0
        )

        return self.record(

            "Milestone 4",

            "Complete milestone output",

            passed,

            (
                "All Milestone 4 outputs generated."
                if passed
                else
                f"Missing outputs: {missing}"
            )
        )


    # =====================================================
    # RAG TEST
    # =====================================================

    def test_rag(
        self,
        retrieved_feedback
    ):

        passed = isinstance(
            retrieved_feedback,
            list
        )

        return self.record(

            "RAG",

            "Feedback retrieval",

            passed,

            (
                f"Retrieved {len(retrieved_feedback)} items."
                if passed
                else
                "Invalid RAG output."
            )
        )


    # =====================================================
    # API TEST
    # =====================================================

    def test_api_response(
        self,
        response
    ):

        passed = (
            response is not None
        )

        return self.record(

            "API",

            "API response",

            passed,

            (
                "API returned a response."
                if passed
                else
                "API returned no response."
            )
        )


    # =====================================================
    # RUN GLOBAL TESTS
    # =====================================================

    def run_all(
        self,
        df=None,
        prd=None,
        prioritization=None,
        roadmap=None,
        milestone4=None,
        rag=None
    ):

        self.reset()


        # -------------------------------------------------
        # DATASET
        # -------------------------------------------------

        self.test_dataset(
            df
        )


        if df is not None:

            self.test_columns(

                df,

                [
                    "feedback"
                ]

            )


        # -------------------------------------------------
        # PRD
        # -------------------------------------------------

        self.test_prd(
            prd
        )


        # -------------------------------------------------
        # PRIORITIZATION
        # -------------------------------------------------

        self.test_prioritization(
            prioritization
        )


        # -------------------------------------------------
        # ROADMAP
        # -------------------------------------------------

        self.test_roadmap(
            roadmap
        )


        # -------------------------------------------------
        # RAG
        # -------------------------------------------------

        self.test_rag(
            rag
        )


        # -------------------------------------------------
        # MILESTONE 4
        # -------------------------------------------------

        if milestone4:

            self.test_milestone4(
                milestone4
            )


        return self.get_report()


    # =====================================================
    # REPORT
    # =====================================================

    def get_report(
        self
    ):

        total = len(
            self.results
        )

        passed = sum(

            1

            for result in self.results

            if result["status"] == "PASS"

        )

        failed = (
            total - passed
        )

        score = (

            round(
                passed / total * 100,
                2
            )

            if total > 0

            else 0

        )

        return {

            "total_tests":
                total,

            "passed":
                passed,

            "failed":
                failed,

            "quality_score":
                score,

            "status":
                (
                    "PASS"
                    if failed == 0
                    else
                    "REVIEW REQUIRED"
                ),

            "tests":
                self.results
        }