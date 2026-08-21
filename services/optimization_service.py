class OptimizationService:

    def __init__(self):

        self.max_rag_results = 10

        self.max_features = 20

        self.max_context_items = 20


    # =====================================================
    # DATAFRAME OPTIMIZATION
    # =====================================================

    def optimize_dataframe(
        self,
        df
    ):

        if df is None:

            return df

        optimized_df = df.copy()

        # -------------------------------------------------
        # Remove completely empty columns
        # -------------------------------------------------

        optimized_df = optimized_df.dropna(
            axis=1,
            how="all"
        )

        # -------------------------------------------------
        # Remove duplicate rows
        # -------------------------------------------------

        optimized_df = (
            optimized_df
            .drop_duplicates()
            .reset_index(drop=True)
        )

        return optimized_df


    # =====================================================
    # SUMMARY OPTIMIZATION
    # =====================================================

    def optimize_summary(
        self,
        summary,
        max_items=20
    ):

        if summary is None:

            return {}

        # -------------------------------------------------
        # Dictionary
        # -------------------------------------------------

        if isinstance(
            summary,
            dict
        ):

            items = list(
                summary.items()
            )

            # Keep highest-value items
            items = sorted(
                items,
                key=lambda x: (
                    x[1]
                    if isinstance(
                        x[1],
                        (int, float)
                    )
                    else 0
                ),
                reverse=True
            )

            return dict(
                items[:max_items]
            )

        # -------------------------------------------------
        # List
        # -------------------------------------------------

        if isinstance(
            summary,
            list
        ):

            return summary[:max_items]

        # -------------------------------------------------
        # String
        # -------------------------------------------------

        if isinstance(
            summary,
            str
        ):

            return summary[:5000]

        return summary


    # =====================================================
    # RAG CONTEXT OPTIMIZATION
    # =====================================================

    def optimize_rag_context(
        self,
        feedback,
        max_items=None
    ):

        if max_items is None:

            max_items = (
                self.max_rag_results
            )

        if not feedback:

            return []

        optimized = []

        seen = set()

        for item in feedback:

            if isinstance(
                item,
                dict
            ):

                text = str(
                    item.get(
                        "feedback",
                        ""
                    )
                )

                key = text.strip().lower()

                if (
                    key
                    and key not in seen
                ):

                    seen.add(key)

                    optimized.append(
                        item
                    )

            elif isinstance(
                item,
                str
            ):

                key = item.strip().lower()

                if (
                    key
                    and key not in seen
                ):

                    seen.add(key)

                    optimized.append(
                        item
                    )

            if len(optimized) >= max_items:

                break

        return optimized


    # =====================================================
    # FEATURE OPTIMIZATION
    # =====================================================

    def optimize_features(
        self,
        features
    ):

        if not features:

            return []

        # Remove duplicates
        unique = []

        seen = set()

        for feature in features:

            if isinstance(
                feature,
                dict
            ):

                name = str(
                    feature.get(
                        "feature",
                        ""
                    )
                ).strip()

            else:

                name = str(
                    feature
                ).strip()

            key = name.lower()

            if (
                name
                and key not in seen
            ):

                seen.add(key)

                unique.append(
                    feature
                )

        # Keep only useful number
        return unique[
            :self.max_features
        ]


    # =====================================================
    # PIPELINE CONTEXT
    # =====================================================

    def optimize_pipeline_result(
        self,
        pipeline_result
    ):

        if not pipeline_result:

            return {}

        return {

            "category_summary":
                self.optimize_summary(
                    pipeline_result.get(
                        "categorization_summary",
                        {}
                    )
                ),

            "theme_summary":
                self.optimize_summary(
                    pipeline_result.get(
                        "theme_summary",
                        {}
                    )
                ),

            "pain_point_summary":
                self.optimize_summary(
                    pipeline_result.get(
                        "pain_point_summary",
                        {}
                    )
                ),

            "feature_request_summary":
                self.optimize_summary(
                    pipeline_result.get(
                        "feature_request_summary",
                        {}
                    )
                ),

            "sentiment_summary":
                self.optimize_summary(
                    pipeline_result.get(
                        "sentiment_summary",
                        {}
                    )
                ),

            "trend_report":
                self.optimize_summary(
                    pipeline_result.get(
                        "trend_report",
                        {}
                    )
                )
        }


    # =====================================================
    # FINAL OPTIMIZED CONTEXT
    # =====================================================

    def build_ai_context(
        self,
        pipeline_result
    ):

        context = (
            self.optimize_pipeline_result(
                pipeline_result
            )
        )

        return context