"""
FutureVerse Model Loader & Multi-Model Inference Manager (model_loader.py)
"""

import os
import json
import joblib
import pandas as pd
from typing import Dict, Any, Tuple

class ModelLoaderService:
    def __init__(self, models_dir: str = "models"):
        self.models_dir = models_dir
        self.preprocessor = None
        self.best_model_pipeline = None
        self.all_model_pipelines: Dict[str, Any] = {}
        self.metrics_data: Dict[str, Any] = {}
        self.metadata: Dict[str, Any] = {}
        self.is_loaded = False
        self.load_error = None

        self._load_artifacts()

    def _load_artifacts(self):
        try:
            # Check preprocessor
            preprocessor_path = os.path.join(self.models_dir, 'preprocessor.pkl')
            best_model_path = os.path.join(self.models_dir, 'best_yield_model.pkl')
            metrics_path = os.path.join(self.models_dir, 'metrics.json')
            metadata_path = os.path.join(self.models_dir, 'metadata.json')

            if not os.path.exists(best_model_path):
                self.load_error = f"Best model artifact not found at '{best_model_path}'. Run scripts/train_models.py first."
                return

            self.preprocessor = joblib.load(preprocessor_path)
            self.best_model_pipeline = joblib.load(best_model_path)

            if os.path.exists(metrics_path):
                with open(metrics_path, 'r', encoding='utf-8') as f:
                    self.metrics_data = json.load(f)

            if os.path.exists(metadata_path):
                with open(metadata_path, 'r', encoding='utf-8') as f:
                    self.metadata = json.load(f)

            # Load individual models
            model_files = {
                'Decision Tree Regressor': 'decision_tree_regressor.pkl',
                'Random Forest Regressor': 'random_forest_regressor.pkl',
                'Gradient Boosting Regressor': 'gradient_boosting_regressor.pkl',
                'XGBoost Regressor': 'xgboost_regressor.pkl'
            }

            for model_name, filename in model_files.items():
                p_path = os.path.join(self.models_dir, filename)
                if os.path.exists(p_path):
                    self.all_model_pipelines[model_name] = joblib.load(p_path)

            self.is_loaded = True
            print(f"[ModelLoader] Successfully loaded {len(self.all_model_pipelines)} model pipelines.")
        except Exception as e:
            self.load_error = f"Error loading model artifacts: {str(e)}"
            self.is_loaded = False

    def predict_single(self, input_df: pd.DataFrame) -> Tuple[float, str]:
        if not self.is_loaded or self.best_model_pipeline is None:
            raise RuntimeError(self.load_error or "Models not loaded.")

        best_name = self.metadata.get('selected_model', 'Best Model')
        yield_pred = float(self.best_model_pipeline.predict(input_df)[0])
        return round(yield_pred, 2), best_name

    def predict_all(self, input_df: pd.DataFrame) -> Dict[str, float]:
        if not self.is_loaded:
            raise RuntimeError(self.load_error or "Models not loaded.")

        results = {}
        for name, pipeline in self.all_model_pipelines.items():
            pred = float(pipeline.predict(input_df)[0])
            results[name] = round(pred, 2)
        return results

# Global singleton loader instance
model_loader_service = ModelLoaderService()
