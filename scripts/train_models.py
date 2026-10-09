"""
FutureVerse - Sugarcane Growth & Yield Prediction ML Framework
Machine Learning Training & Empirical Model Evaluation Pipeline (train_models.py)
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split, cross_validate, KFold
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor

# Fix stdout encoding for Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_ml_training_pipeline():
    print("=" * 70)
    print("FutureVerse ML Training Pipeline: 4-Model Regression Framework")
    print("Evaluates: Decision Tree, Random Forest, Gradient Boosting, XGBoost")
    print("=" * 70)

    # 1. Load Processed Dataset
    dataset_path = os.path.join('data', 'processed', 'maharashtra_sugarcane_processed.csv')
    if not os.path.exists(dataset_path):
        print(f"[ERROR] Processed dataset not found at '{dataset_path}'. Please run preprocess_data.py first.")
        sys.exit(1)

    df = pd.read_csv(dataset_path)
    print(f"Loaded dataset: {len(df)} total observations from 12 Maharashtra districts.")

    # 2. Define Features & Target
    cat_features = ['district', 'soil_type', 'irrigation_adequacy']
    num_features = ['soil_ph', 'nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'rainfall', 'crop_age_months']
    feature_cols = cat_features + num_features
    target_col = 'yield_t_ha'

    X = df[feature_cols]
    y = df[target_col]

    print(f"\nFeature Schema ({len(feature_cols)} features):")
    print(f" - Categorical ({len(cat_features)}): {cat_features}")
    print(f" - Numerical ({len(num_features)}): {num_features}")
    print(f"Target Output: '{target_col}' (Tonnes per Hectare)")

    # 3. Train-Test Split (80% Train, 20% Held-out Test, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    print(f"\nTrain/Test Split: {len(X_train)} Training samples (80%), {len(X_test)} Test samples (20%).")

    # 4. Define Preprocessor (Fitted strictly on Training Data to prevent leakage)
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_features)
        ]
    )

    # Fit preprocessor on training data only
    preprocessor.fit(X_train)

    # Create models directory
    os.makedirs('models', exist_ok=True)
    joblib.dump(preprocessor, os.path.join('models', 'preprocessor.pkl'))
    print("Saved Preprocessing Pipeline to 'models/preprocessor.pkl'.")

    # 5. Define 4 Regression Algorithms
    models_dict = {
        'Decision Tree Regressor': DecisionTreeRegressor(random_state=42),
        'Random Forest Regressor': RandomForestRegressor(n_estimators=120, random_state=42, max_depth=12),
        'Gradient Boosting Regressor': GradientBoostingRegressor(n_estimators=120, learning_rate=0.08, random_state=42),
        'XGBoost Regressor': XGBRegressor(n_estimators=120, learning_rate=0.08, random_state=42, max_depth=6)
    }

    results = []
    trained_pipelines = {}

    kf = KFold(n_splits=5, shuffle=True, random_state=42)

    print("\nExecuting 5-Fold Cross-Validation & Model Evaluation:")
    print("-" * 70)

    for name, model_instance in models_dict.items():
        # Create complete pipeline
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', model_instance)
        ])

        # Cross Validation Metrics
        cv_scoring = {
            'mae': 'neg_mean_absolute_error',
            'rmse': 'neg_root_mean_squared_error',
            'r2': 'r2'
        }
        cv_res = cross_validate(pipeline, X_train, y_train, cv=kf, scoring=cv_scoring)

        cv_mae = -np.mean(cv_res['test_mae'])
        cv_rmse = -np.mean(cv_res['test_rmse'])
        cv_r2 = np.mean(cv_res['test_r2'])

        # Fit on full training set
        pipeline.fit(X_train, y_train)

        # Test set evaluation
        y_test_pred = pipeline.predict(X_test)
        test_mae = mean_absolute_error(y_test, y_test_pred)
        test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
        test_r2 = r2_score(y_test, y_test_pred)

        results.append({
            'model_name': name,
            'val_mae': round(float(cv_mae), 3),
            'val_rmse': round(float(cv_rmse), 3),
            'val_r2': round(float(cv_r2), 4),
            'test_mae': round(float(test_mae), 3),
            'test_rmse': round(float(test_rmse), 3),
            'test_r2': round(float(test_r2), 4)
        })

        # Save individual model pipeline
        file_slug = name.lower().replace(' ', '_')
        model_save_path = os.path.join('models', f'{file_slug}.pkl')
        joblib.dump(pipeline, model_save_path)
        trained_pipelines[name] = pipeline

        print(f" Model: {name:30s} | Val R²: {cv_r2:.4f} | Val RMSE: {cv_rmse:.3f} | Test R²: {test_r2:.4f}")

    # 6. Empirical Best Model Selection (Selection Rule: Highest Validation R² Score & lowest RMSE)
    results_df = pd.DataFrame(results)
    best_row = results_df.sort_values(by=['val_r2', 'val_rmse'], ascending=[False, True]).iloc[0]
    best_model_name = best_row['model_name']
    best_pipeline = trained_pipelines[best_model_name]

    print("\n" + "=" * 70)
    print(f"EMPIRICAL SELECTION RESULT: Best Performing Model is '{best_model_name}'")
    print(f"Validation R²: {best_row['val_r2']:.4f} | Validation RMSE: {best_row['val_rmse']:.3f} t/ha")
    print(f"Held-out Test R²: {best_row['test_r2']:.4f} | Test RMSE: {best_row['test_rmse']:.3f} t/ha")
    print("=" * 70)

    # Save Best Model Pipeline
    joblib.dump(best_pipeline, os.path.join('models', 'best_yield_model.pkl'))

    # Save Metrics CSV & JSON
    metrics_path_csv = os.path.join('models', 'metrics_summary.csv')
    results_df.to_csv(metrics_path_csv, index=False)

    metrics_json = {
        'selected_best_model': best_model_name,
        'dataset_size': len(df),
        'train_samples': len(X_train),
        'test_samples': len(X_test),
        'target_name': 'yield_t_ha',
        'models_performance': results
    }

    metrics_path_json = os.path.join('models', 'metrics.json')
    with open(metrics_path_json, 'w', encoding='utf-8') as f:
        json.dump(metrics_json, f, indent=2)

    # Save Metadata & Retraining Instructions
    metadata = {
        'project': 'FutureVerse Sugarcane Growth & Yield ML Framework',
        'region': 'Maharashtra, India',
        'selected_model': best_model_name,
        'categorical_features': cat_features,
        'numerical_features': num_features,
        'target': target_col,
        'growth_target_status': 'Conditional / Experimental (Yield target prioritized)'
    }

    with open(os.path.join('models', 'metadata.json'), 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)

    # 7. Model Reload & In-Memory Inference Sanity Test
    print("\nVerifying Reload & In-Memory Inference Test:")
    reloaded_best = joblib.load(os.path.join('models', 'best_yield_model.pkl'))

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

    predicted_val = reloaded_best.predict(sample_input)[0]
    print(f"[VERIFIED] Reloaded '{best_model_name}' prediction for Solapur sample input: {predicted_val:.2f} t/ha.")

if __name__ == '__main__':
    run_ml_training_pipeline()
