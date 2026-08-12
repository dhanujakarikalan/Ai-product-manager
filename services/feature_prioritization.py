class FeaturePrioritization:

    def __init__(self):
        pass

    def calculate_score(
        self,
        feature,
        customer_demand,
        business_value,
        user_impact,
        strategic_alignment,
        urgency,
        customer_demand_weight=0.30,
        business_value_weight=0.25,
        user_impact_weight=0.20,
        strategic_alignment_weight=0.15,
        urgency_weight=0.10
    ):

        total_weight = (
            customer_demand_weight
            + business_value_weight
            + user_impact_weight
            + strategic_alignment_weight
            + urgency_weight
        )

        if round(total_weight, 2) != 1.00:
            raise ValueError(
                "Prioritization weights must total 1.0"
            )

        score = (
            customer_demand * customer_demand_weight
            + business_value * business_value_weight
            + user_impact * user_impact_weight
            + strategic_alignment * strategic_alignment_weight
            + urgency * urgency_weight
        )

        score = round(score, 2)

        if score >= 7.5:
            priority = "High"

        elif score >= 5.0:
            priority = "Medium"

        else:
            priority = "Low"

        return {
            "feature": feature,
            "score": score,
            "priority": priority
        }

    def prioritize_features(
        self,
        features,
        customer_demand_weight=0.30,
        business_value_weight=0.25,
        user_impact_weight=0.20,
        strategic_alignment_weight=0.15,
        urgency_weight=0.10
    ):

        results = []

        for feature in features:

            result = self.calculate_score(
                feature=feature.feature,
                customer_demand=feature.customer_demand,
                business_value=feature.business_value,
                user_impact=feature.user_impact,
                strategic_alignment=feature.strategic_alignment,
                urgency=feature.urgency,
                customer_demand_weight=customer_demand_weight,
                business_value_weight=business_value_weight,
                user_impact_weight=user_impact_weight,
                strategic_alignment_weight=strategic_alignment_weight,
                urgency_weight=urgency_weight
            )

            results.append(result)

        results.sort(
            key=lambda item: item["score"],
            reverse=True
        )

        for index, item in enumerate(results, start=1):
            item["rank"] = index

        return results