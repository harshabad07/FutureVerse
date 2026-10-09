# FutureVerse Machine Learning Retraining & Model Loading Guide

## 1. Directory Artifacts Overview
The `models/` directory contains serialized Scikit-learn and XGBoost pipelines saved via `joblib`:
- `preprocessor.pkl`: `ColumnTransformer` (StandardScaler for numerical features, OneHotEncoder for categorical features).
- `best_yield_model.pkl`: Serialized pipeline of the empirically selected top model (**Gradient Boosting Regressor**).
- `decision_tree_regressor.pkl`: Serialized Decision Tree model pipeline.
- `random_forest_regressor.pkl`: Serialized Random Forest model pipeline.
- `gradient_boosting_regressor.pkl`: Serialized Gradient Boosting model pipeline.
- `xgboost_regressor.pkl`: Serialized XGBoost model pipeline.
- `metrics.json` & `metrics_summary.csv`: Empirical evaluation metrics (5-Fold Cross-Validation MAE/RMSE/R² & Held-out Test evaluation).
- `metadata.json`: Feature schema & model configuration metadata.

## 2. Reloading Models in Python
To reload and run inference in Python or FastAPI:

```python
import joblib
import pandas as pd

# Load empirical best model pipeline
model_pipeline = joblib.load('models/best_yield_model.pkl')

# Construct input matching feature schema
sample_input = pd.DataFrame([{
    'district': 'Solapur',
    'soil_type': 'Loam',
    'irrigation_adequacy': 'Adequate',
    'soil_ph': 6.8,
    'nitrogen': 150,
    'phosphorus': 60,
    'potassium': 150,
    'temperature': 28.0,
    'humidity': 65.0,
    'rainfall': 1100.0,
    'crop_age_months': 5
}])

# Generate yield inference (tonnes/hectare)
predicted_yield = model_pipeline.predict(sample_input)[0]
print(f"Estimated Sugarcane Yield: {predicted_yield:.2f} t/ha")
```

## 3. Retraining the Models
Whenever new agricultural data is added to `data/raw/maharashtra_sugarcane_raw.csv`:
1. Re-run preprocessing:
   ```bash
   python scripts/preprocess_data.py
   ```
2. Re-run training & empirical selection:
   ```bash
   python scripts/train_models.py
   ```
The pipeline will automatically perform 5-fold cross-validation, compare all 4 regression algorithms, select the best model on validation metrics, evaluate on test data, and overwrite the serialized artifacts in `models/`.
