"""
FutureVerse Maharashtra Sugarcane Recommendation Engine (engine.py)
"""

from typing import List, Dict
from app.schemas.farmer_input import FarmerInputSchema, RecommendationCard

class AgronomicRecommendationEngine:
    @staticmethod
    def generate_recommendations(data: FarmerInputSchema) -> List[RecommendationCard]:
        cards = []

        # 1. Fertilizer Management Card
        fert_texts = []
        if data.nitrogen < 120:
            fert_texts.append(f"Nitrogen (N) is currently low ({data.nitrogen} kg/ha, target: 120-180 kg/ha). Apply Urea in 2-3 split doses during active tillering.")
        elif data.nitrogen > 180:
            fert_texts.append(f"Nitrogen ({data.nitrogen} kg/ha) is slightly high. Avoid further nitrogenous fertilizer to prevent rank vegetative growth.")
        else:
            fert_texts.append(f"Nitrogen ({data.nitrogen} kg/ha) is in the optimal target range (120-180 kg/ha).")

        if data.phosphorus < 50:
            fert_texts.append(f"Phosphorus (P) is low ({data.phosphorus} kg/ha, target: 50-80 kg/ha). Apply Single Super Phosphate (SSP) at planting or basal stage.")
        else:
            fert_texts.append(f"Phosphorus ({data.phosphorus} kg/ha) is adequate.")

        if data.potassium < 120:
            fert_texts.append(f"Potassium (K) is low ({data.potassium} kg/ha, target: 120-180 kg/ha). Apply Muriate of Potash (MOP) to improve cane rind strength and sucrose content.")
        else:
            fert_texts.append(f"Potassium ({data.potassium} kg/ha) is sufficient.")

        cards.append(RecommendationCard(
            category="Fertilizer Management",
            title="NPK Nutrient Advice",
            advice=" ".join(fert_texts)
        ))

        # 2. Irrigation Scheduling Card
        irrig_text = f"Field features {data.irrigation_adequacy.lower()} irrigation on {data.soil_type.lower()} soil. "
        if data.irrigation_adequacy == 'Deficient':
            irrig_text += f"Water shortage detected! Schedule immediate supplemental irrigation (furrow/drip) to avoid moisture stress during crop growth."
        elif data.irrigation_adequacy == 'Excessive':
            irrig_text += f"Waterlogging risk detected on {data.soil_type} soil! Ensure proper drainage to maintain root zone aeration."
        else:
            irrig_text += f"Maintain regular 10-12 day irrigation intervals suited for {data.soil_type} soil."

        cards.append(RecommendationCard(
            category="Irrigation Scheduling",
            title="Moisture & Drainage Advice",
            advice=irrig_text
        ))

        # 3. Crop Management Card
        age = data.crop_age_months
        if age <= 3:
            stage_name = "Germination & Formative Stage"
            crop_advice = f"At month {age} ({stage_name}), focus on gap filling, early inter-cultivation, and weed removal."
        elif age <= 8:
            stage_name = "Grand Growth Stage"
            crop_advice = f"At month {age} ({stage_name}), sugarcane undergoes rapid internode elongation. Maintain earthing up and trash mulching to retain soil moisture."
        else:
            stage_name = "Maturity & Ripening Stage"
            crop_advice = f"At month {age} ({stage_name}), withhold nitrogen fertilizers and stop irrigation 15-20 days before harvest to maximize sugar recovery percentage."

        cards.append(RecommendationCard(
            category="Crop Management",
            title="Stage-Specific Guidance",
            advice=crop_advice
        ))

        # 4. Soil Improvement Card
        ph = data.soil_ph
        if ph < 6.0:
            soil_advice = f"Soil pH ({ph:.1f}) is acidic. Apply agricultural lime (calcium carbonate) or pressmud compost to bring pH up to 6.5."
        elif ph > 7.5:
            soil_advice = f"Soil pH ({ph:.1f}) is alkaline/saline. Incorporate gypsum (calcium sulfate) and farmyard manure (FYM) to improve drainage and soil structure."
        else:
            soil_advice = f"Soil pH ({ph:.1f}) is in the optimal range for sugarcane (6.0 - 7.5). Incorporate organic compost to preserve microbial health."

        cards.append(RecommendationCard(
            category="Soil Improvement",
            title="Soil Structure & pH Advice",
            advice=soil_advice
        ))

        return cards

    @staticmethod
    def calculate_outlook(data: FarmerInputSchema) -> Dict[str, str]:
        issues = []
        if data.soil_ph < 6.0 or data.soil_ph > 7.5:
            issues.append("pH imbalance")
        if data.nitrogen < 120:
            issues.append("Low Nitrogen")
        if data.irrigation_adequacy == 'Deficient':
            issues.append("Water stress")

        if not issues:
            return {
                "field_status": "Readings in optimal range",
                "top_priority": "Maintain balanced NPK fertilization",
                "next_step": "Monitor irrigation schedule for current crop age"
            }
        else:
            return {
                "field_status": f"Attention needed ({', '.join(issues)})",
                "top_priority": "Schedule emergency irrigation" if "Water stress" in issues else "Correct soil nutrient gaps",
                "next_step": "Follow tailored farming recommendations"
            }
