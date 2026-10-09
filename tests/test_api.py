"""
FutureVerse FastAPI Test Suite (test_api.py)
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "version" in data

def test_metadata_endpoint():
    response = client.get("/api/metadata")
    assert response.status_code == 200
    data = response.json()
    assert "Solapur" in data["supported_districts"]
    assert "target" in data

def test_predict_endpoint_success():
    payload = {
        "district": "Solapur",
        "soil_type": "Loam",
        "irrigation_adequacy": "Adequate",
        "soil_ph": 6.8,
        "nitrogen": 150,
        "phosphorus": 60,
        "potassium": 150,
        "temperature": 28.0,
        "humidity": 65.0,
        "rainfall": 1100.0,
        "crop_age_months": 5
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "predicted_yield" in data
    assert data["predicted_yield"] > 0
    assert "selected_model" in data

def test_predict_endpoint_validation_error():
    # Invalid pH (>10.0)
    payload = {
        "district": "Solapur",
        "soil_type": "Loam",
        "irrigation_adequacy": "Adequate",
        "soil_ph": 15.0,
        "nitrogen": 150,
        "phosphorus": 60,
        "potassium": 150,
        "temperature": 28.0,
        "humidity": 65.0,
        "rainfall": 1100.0,
        "crop_age_months": 5
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422

def test_predict_compare_endpoint():
    payload = {
        "district": "Kolhapur",
        "soil_type": "Clay",
        "irrigation_adequacy": "Adequate",
        "soil_ph": 6.5,
        "nitrogen": 140,
        "phosphorus": 55,
        "potassium": 160,
        "temperature": 26.0,
        "humidity": 70.0,
        "rainfall": 1300.0,
        "crop_age_months": 6
    }
    response = client.post("/api/predict/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["predictions"]) == 4

def test_metrics_endpoint():
    response = client.get("/api/models/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "models_performance" in data
    assert len(data["models_performance"]) == 4

def test_recommendations_endpoint():
    payload = {
        "district": "Solapur",
        "soil_type": "Clay",
        "irrigation_adequacy": "Deficient",
        "soil_ph": 5.5,
        "nitrogen": 90,
        "phosphorus": 35,
        "potassium": 100,
        "temperature": 32.0,
        "humidity": 45.0,
        "rainfall": 550.0,
        "crop_age_months": 4
    }
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["recommendations"]) == 4

def test_datasets_endpoint():
    response = client.get("/api/datasets")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "data_dictionary" in data
