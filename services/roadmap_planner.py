# =========================================================
# services/roadmap_planner.py
# AI Product Manager Copilot
# Data-driven Roadmap Generator
# =========================================================


class RoadmapPlanner:

    def __init__(self):
        pass


    # =====================================================
    # ASSIGN MILESTONE
    # =====================================================

    def assign_milestone(self, priority):

        priority = str(
            priority
        ).strip().lower()


        if priority == "high":

            return "Milestone 1"


        elif priority == "medium":

            return "Milestone 2"


        elif priority == "low":

            return "Milestone 3"


        return "Milestone 3"


    # =====================================================
    # ASSIGN PHASE
    # =====================================================

    def assign_phase(self, milestone):

        if milestone == "Milestone 1":

            return "Core Product Improvements"


        elif milestone == "Milestone 2":

            return "Product Enhancements"


        elif milestone == "Milestone 3":

            return "Future Enhancements"


        return "Future Enhancements"


    # =====================================================
    # CREATE ROADMAP
    # =====================================================

    def create_roadmap(
        self,
        prioritized_features
    ):

        if not prioritized_features:

            raise ValueError(
                "No prioritized features available."
            )


        roadmap = []


        # =================================================
        # PROCESS EVERY FEATURE
        # =================================================

        for index, item in enumerate(
            prioritized_features,
            start=1
        ):

            if not isinstance(
                item,
                dict
            ):

                continue


            feature = (
                item.get(
                    "feature"
                )
            )


            if not feature:

                continue


            score = (
                item.get(
                    "score",
                    0
                )
            )


            priority = (
                item.get(
                    "priority",
                    "Low"
                )
            )


            rank = (
                item.get(
                    "rank",
                    index
                )
            )


            # =============================================
            # MILESTONE
            # =============================================

            milestone = (
                self.assign_milestone(
                    priority
                )
            )


            # =============================================
            # PHASE
            # =============================================

            phase = (
                self.assign_phase(
                    milestone
                )
            )


            # =============================================
            # ROADMAP ITEM
            # =============================================

            roadmap_item = {

                "feature":
                    feature,

                "score":
                    round(
                        float(score),
                        2
                    ),

                "priority":
                    priority,

                "rank":
                    rank,

                "milestone":
                    milestone,

                "phase":
                    phase,

                "status":
                    "Planned"

            }


            roadmap.append(
                roadmap_item
            )


        # =================================================
        # SORT BY SCORE
        # =================================================

        roadmap.sort(

            key=lambda item:
                item["score"],

            reverse=True

        )


        # =================================================
        # RE-CALCULATE RANK
        # =================================================

        for index, item in enumerate(
            roadmap,
            start=1
        ):

            item["rank"] = index


        return roadmap


    # =====================================================
    # GET MILESTONE FEATURES
    # =====================================================

    def get_milestone_features(
        self,
        roadmap,
        milestone
    ):

        if not roadmap:

            return []


        return [

            item

            for item in roadmap

            if item.get(
                "milestone"
            ) == milestone

        ]


    # =====================================================
    # GET PHASE FEATURES
    # =====================================================

    def get_phase_features(
        self,
        roadmap,
        phase
    ):

        if not roadmap:

            return []


        return [

            item

            for item in roadmap

            if item.get(
                "phase"
            ) == phase

        ]


    # =====================================================
    # ROADMAP SUMMARY
    # =====================================================

    def get_summary(
        self,
        roadmap
    ):

        if not roadmap:

            return {

                "total_features": 0,

                "milestone_1": 0,

                "milestone_2": 0,

                "milestone_3": 0

            }


        return {

            "total_features":
                len(roadmap),

            "milestone_1":
                len(
                    self.get_milestone_features(
                        roadmap,
                        "Milestone 1"
                    )
                ),

            "milestone_2":
                len(
                    self.get_milestone_features(
                        roadmap,
                        "Milestone 2"
                    )
                ),

            "milestone_3":
                len(
                    self.get_milestone_features(
                        roadmap,
                        "Milestone 3"
                    )
                )

        }