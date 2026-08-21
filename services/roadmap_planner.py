class RoadmapPlanner:

    def __init__(self):
        pass

    def assign_milestone(self, priority):

        priority = str(priority).strip().lower()

        if priority == "high":
            return "Milestone 1"

        elif priority == "medium":
            return "Milestone 2"

        elif priority == "low":
            return "Milestone 3"

        return "Milestone 3"

    def assign_phase(self, milestone):

        if milestone == "Milestone 1":
            return "Core Product Improvements"

        elif milestone == "Milestone 2":
            return "Product Enhancements"

        elif milestone == "Milestone 3":
            return "Future Enhancements"

        return "Future Enhancements"

    def create_roadmap(self, prioritized_features):

        if not prioritized_features:
            raise ValueError(
                "No prioritized features available."
            )

        roadmap = []

        for item in prioritized_features:

            feature = item.get("feature")
            score = item.get("score")
            priority = item.get("priority")
            rank = item.get("rank")

            milestone = self.assign_milestone(
                priority
            )

            phase = self.assign_phase(
                milestone
            )

            roadmap.append({
                "feature": feature,
                "score": score,
                "priority": priority,
                "rank": rank,
                "milestone": milestone,
                "phase": phase
            })

        # Highest priority score first
        roadmap.sort(
            key=lambda item: item["score"],
            reverse=True
        )

        return roadmap

    def get_milestone_features(
        self,
        roadmap,
        milestone
    ):

        return [
            item
            for item in roadmap
            if item["milestone"] == milestone
        ]