"""
FutureVerse FastAPI Route Handlers (endpoints.py)
"""

import os
import json
import pandas as pd
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any

from app.schemas.farmer_input import (
    FarmerInputSchema, PredictionResponse, ComparisonResponse,
    ModelPredictionDetail, RecommendationResponse
)
from app.ml.model_loader import model_loader_service
from app.recommendations.engine import AgronomicRecommendationEngine

router = APIRouter()

# 1. GET /api/health
@router.get("/health", tags=["System"])
def get_health_status():
    if not model_loader_service.is_loaded:
        return {
            "status": "degraded",
            "version": "1.0.0",
            "model_loaded": False,
            "message": model_loader_service.load_error or "Models not loaded."
        }
    return {
        "status": "healthy",
        "version": "1.0.0",
        "model_loaded": True,
        "selected_best_model": model_loader_service.metadata.get("selected_model", "Gradient Boosting Regressor")
    }

# 2. GET /api/metadata
@router.get("/metadata", tags=["Metadata"])
def get_system_metadata():
    if not model_loader_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_531_SERVICE_UNAVAILABLE if hasattr(status, 'HTTP_531_SERVICE_UNAVAILABLE') else 503,
            detail=model_loader_service.load_error or "Model artifacts unavailable."
        )
    return {
        "supported_districts": [
            'Solapur', 'Pune', 'Satara', 'Sangli', 'Kolhapur',
            'Ahmednagar', 'Nashik', 'Chhatrapati Sambhajinagar',
            'Nanded', 'Latur', 'Dharashiv', 'Jalgaon'
        ],
        "supported_soil_types": ['Clay', 'Loam', 'Sandy Loam', 'Silt Loam'],
        "supported_irrigation": ['Adequate', 'Deficient', 'Excessive'],
        "features_schema": model_loader_service.metadata.get("numerical_features", []) + model_loader_service.metadata.get("categorical_features", []),
        "selected_best_model": model_loader_service.metadata.get("selected_model", "Gradient Boosting Regressor"),
        "target": "yield_t_ha (Tonnes per Hectare)"
    }

# Helper to build DataFrame from input schema
def _build_input_df(data: FarmerInputSchema) -> pd.DataFrame:
    return pd.DataFrame([{
        'district': data.district,
        'soil_type': data.soil_type,
        'irrigation_adequacy': data.irrigation_adequacy,
        'soil_ph': data.soil_ph,
        'nitrogen': data.nitrogen,
        'phosphorus': data.phosphorus,
        'potassium': data.potassium,
        'temperature': data.temperature,
        'humidity': data.humidity,
        'rainfall': data.rainfall,
        'crop_age_months': data.crop_age_months
    }])

# 3. POST /api/predict
@router.post("/predict", response_model=PredictionResponse, tags=["Inference"])
def predict_yield_and_growth(data: FarmerInputSchema):
    if not model_loader_service.is_loaded:
        raise HTTPException(
            status_code=503,
            detail=model_loader_service.load_error or "Model pipelines not loaded. Run scripts/train_models.py first."
        )

    try:
        input_df = _build_input_df(data)
        yield_pred, model_name = model_loader_service.predict_single(input_df)
        
        # Calculate conditional growth percentage if crop age is <= 12 months
        growth_pred = round(float((data.crop_age_months / 12.0) * 100.0), 1) if data.crop_age_months <= 12 else 100.0
        growth_note = "Conditional estimate derived from crop age stage." if data.crop_age_months <= 12 else "Crop at full maturity stage."

        outlook = AgronomicRecommendationEngine.calculate_outlook(data)

        return PredictionResponse(
            status="success",
            selected_model=model_name,
            predicted_yield=yield_pred,
            predicted_growth=growth_pred,
            growth_prediction_note=growth_note,
            field_status=outlook["field_status"],
            top_priority=outlook["top_priority"],
            next_step=outlook["next_step"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

# 4. POST /api/predict/compare
@router.post("/predict/compare", response_model=ComparisonResponse, tags=["Inference"])
def compare_4_models(data: FarmerInputSchema):
    if not model_loader_service.is_loaded:
        raise HTTPException(
            status_code=503,
            detail=model_loader_service.load_error or "Model pipelines not loaded."
        )

    try:
        input_df = _build_input_df(data)
        preds = model_loader_service.predict_all(input_df)

        comparison_list = [
            ModelPredictionDetail(
                model_name=name,
                predicted_yield=val
            )
            for name, val in preds.items()
        ]

        best_name = model_loader_service.metadata.get("selected_model", "Gradient Boosting Regressor")

        return ComparisonResponse(
            status="success",
            selected_best_model=best_name,
            predictions=comparison_list
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")

# 5. GET /api/models/metrics
@router.get("/models/metrics", tags=["Metrics"])
def get_model_metrics():
    if not model_loader_service.is_loaded or not model_loader_service.metrics_data:
        raise HTTPException(status_code=503, detail="Model metrics unavailable. Run training pipeline.")
    return model_loader_service.metrics_data

# 7. POST /api/recommendations
@router.post("/recommendations", response_model=RecommendationResponse, tags=["Recommendations"])
def generate_farming_recommendations(data: FarmerInputSchema):
    cards = AgronomicRecommendationEngine.generate_recommendations(data)
    return RecommendationResponse(
        status="success",
        district=data.district,
        crop_age_months=data.crop_age_months,
        recommendations=cards
    )

# 8. GET /api/datasets
@router.get("/datasets", tags=["Dataset"])
def get_dataset_info():
    dict_path = os.path.join("data", "metadata", "data_dictionary.json")
    report_path = os.path.join("data", "metadata", "data_quality_report.md")

    if not os.path.exists(dict_path):
        raise HTTPException(status_code=404, detail="Dataset dictionary not found.")

    with open(dict_path, 'r', encoding='utf-8') as f:
        dictionary = json.load(f)

    report_summary = ""
    if os.path.exists(report_path):
        with open(report_path, 'r', encoding='utf-8') as f:
            report_summary = f.read()

    return {
        "status": "success",
        "data_dictionary": dictionary,
        "quality_report_markdown": report_summary
    }
