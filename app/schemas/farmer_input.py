"""
FutureVerse Pydantic Validation Schemas (farmer_input.py)
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator

MAHARASHTRA_DISTRICTS = [
    'Solapur', 'Pune', 'Satara', 'Sangli', 'Kolhapur',
    'Ahmednagar', 'Nashik', 'Chhatrapati Sambhajinagar',
    'Nanded', 'Latur', 'Dharashiv', 'Jalgaon'
]

SOIL_TYPES = ['Clay', 'Loam', 'Sandy Loam', 'Silt Loam']
IRRIGATION_LEVELS = ['Adequate', 'Deficient', 'Excessive']

class FarmerInputSchema(BaseModel):
    district: str = Field(..., json_schema_extra={"example": "Solapur"}, description="Maharashtra District Name")
    soil_type: str = Field(..., json_schema_extra={"example": "Loam"}, description="Soil texture type")
    irrigation_adequacy: str = Field(..., json_schema_extra={"example": "Adequate"}, description="Irrigation availability")
    
    soil_ph: float = Field(..., ge=3.0, le=10.0, json_schema_extra={"example": 6.8}, description="Soil pH level (3.0 - 10.0)")
    nitrogen: int = Field(..., ge=0, le=300, json_schema_extra={"example": 150}, description="Nitrogen (N) in kg/ha (0 - 300)")
    phosphorus: int = Field(..., ge=0, le=150, json_schema_extra={"example": 60}, description="Phosphorus (P) in kg/ha (0 - 150)")
    potassium: int = Field(..., ge=0, le=300, json_schema_extra={"example": 150}, description="Potassium (K) in kg/ha (0 - 300)")
    
    temperature: float = Field(..., ge=10.0, le=50.0, json_schema_extra={"example": 28.0}, description="Mean temperature in °C (10 - 50)")
    humidity: float = Field(..., ge=10.0, le=100.0, json_schema_extra={"example": 65.0}, description="Relative Humidity % (10 - 100)")
    rainfall: float = Field(..., ge=200.0, le=3000.0, json_schema_extra={"example": 1100.0}, description="Annual Rainfall in mm (200 - 3000)")
    crop_age_months: int = Field(..., ge=1, le=18, json_schema_extra={"example": 5}, description="Crop age in months (1 - 18)")

    @field_validator('district')
    def validate_district(cls, v):
        # Case insensitive mapping check
        v_title = v.title()
        if v_title in ['Ahmednagar', 'Ahilyanagar']:
            return 'Ahmednagar'
        if v_title in ['Aurangabad', 'Chhatrapati Sambhajinagar']:
            return 'Chhatrapati Sambhajinagar'
        if v_title in ['Osmanabad', 'Dharashiv']:
            return 'Dharashiv'
        
        matches = [d for d in MAHARASHTRA_DISTRICTS if d.lower() == v.lower()]
        if not matches:
            raise ValueError(f"District '{v}' is not supported. Supported Maharashtra districts: {MAHARASHTRA_DISTRICTS}")
        return matches[0]

    @field_validator('soil_type')
    def validate_soil_type(cls, v):
        matches = [s for s in SOIL_TYPES if s.lower() == v.lower()]
        if not matches:
            raise ValueError(f"Soil type '{v}' invalid. Supported types: {SOIL_TYPES}")
        return matches[0]

    @field_validator('irrigation_adequacy')
    def validate_irrigation(cls, v):
        matches = [i for i in IRRIGATION_LEVELS if i.lower() == v.lower()]
        if not matches:
            raise ValueError(f"Irrigation level '{v}' invalid. Supported choices: {IRRIGATION_LEVELS}")
        return matches[0]


class PredictionResponse(BaseModel):
    status: str
    selected_model: str
    predicted_yield: float
    predicted_yield_unit: str = "tonnes / hectare"
    predicted_growth: Optional[float] = None
    predicted_growth_unit: str = "%"
    growth_prediction_note: str
    field_status: str
    top_priority: str
    next_step: str


class ModelPredictionDetail(BaseModel):
    model_name: str
    predicted_yield: float
    unit: str = "tonnes / hectare"


class ComparisonResponse(BaseModel):
    status: str
    selected_best_model: str
    predictions: List[ModelPredictionDetail]



class RecommendationCard(BaseModel):
    category: str
    title: str
    advice: str


class RecommendationResponse(BaseModel):
    status: str
    district: str
    crop_age_months: int
    recommendations: List[RecommendationCard]
