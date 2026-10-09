# FutureVerse: Machine Learning Framework for Sugarcane Growth & Yield Prediction

FutureVerse is an end-to-end Machine Learning decision support platform designed specifically for sugarcane farmers in Maharashtra, India. The system evaluates four regression algorithms (**Decision Tree Regressor**, **Random Forest Regressor**, **Gradient Boosting Regressor**, and **XGBoost Regressor**) to predict sugarcane yield in tonnes/hectare based on local soil parameters, weather conditions, irrigation adequacy, and crop age.

The system features a **FastAPI Python backend**, **Scikit-Learn & XGBoost ML pipelines**, **ICAR/VSI agronomic recommendations**, and a **farmer-friendly trilingual frontend interface** (English, Hindi, Marathi).

---

## 🏛️ Project Architecture

```
+-----------------------------------------------------------------------+
|                 FutureVerse Web Frontend (HTML/CSS/JS)                 |
|       Trilingual UI | Input Form | Health Gauges | PDF Report           |
+-----------------------------------+-----------------------------------+
                                    |
                            HTTP / REST JSON
                                    v
+-----------------------------------------------------------------------+
|                      Python FastAPI Backend Server                    |
|       /health | /metadata | /predict | /predict/compare | etc.        |
+-----------------------------------+-----------------------------------+
                                    |
             +----------------------+----------------------+
             |                                             |
             v                                             v
+--------------------------+                   +------------------------+
|   Joblib ML Pipelines    |                   |   Agronomic Engine &   |
| Preprocessor + GBR Model |                   |   Rule Recommendation  |
+--------------------------+                   +------------------------+
```

---

## 📁 Folder Structure

```
fy_mj_project/
├── app/                        # FastAPI Application Package
│   ├── api/                    # Route Endpoints (/health, /predict, /recommendations, etc.)
│   ├── ml/                     # ML Model Loader & Inference Engine
│   ├── recommendations/        # ICAR & VSI Agronomic Recommendation Rules
│   ├── schemas/                # Pydantic Input & Output Validation Schemas
│   └── main.py                 # FastAPI Application Entrypoint
├── data/
│   ├── metadata/               # Data Dictionary, Sources & Quality Report
│   ├── processed/              # Preprocessed Clean Dataset (1,332 records)
│   └── raw/                    # Original Raw Maharashtra Sugarcane Data
├── models/                     # Saved Joblib Pipelines & JSON Metrics
│   ├── best_yield_model.pkl    # Gradient Boosting Regressor Pipeline
│   ├── decision_tree_regressor.pkl
│   ├── gradient_boosting_regressor.pkl
│   ├── random_forest_regressor.pkl
│   ├── xgboost_regressor.pkl
│   ├── preprocessor.pkl        # Fitted ColumnTransformer Preprocessing Pipeline
│   ├── metadata.json           # Model Feature Names & Hyperparameters
│   └── metrics.json            # Genuine 5-Fold CV & Held-Out Test Evaluation Metrics
├── ppt major/                  # Production Frontend Application
│   ├── index.html              # Farmer Dashboard Interface
│   ├── script.js               # Centralized API Integration & UI Logic
│   └── style.css               # Farmer-Friendly Cream & Green Theme
├── scripts/                    # Reproducible ML & Data Pipeline Scripts
│   ├── download_data.py        # Dataset Acquisition & Validation Script
│   ├── preprocess_data.py      # Cleaning, Unit Standardization & Outlier Check
│   └── train_models.py         # 5-Fold Cross-Validation & Model Evaluation Script
├── tests/                      # Pytest Automated Test Suite
│   └── test_api.py             # Comprehensive Unit & Integration Test Cases
├── .env                        # Local Environment Variables
├── .env.example                # Example Environment Variables Template
├── README.md                   # System Documentation (This File)
└── requirements.txt            # Python Dependency Specifications
```

---

## 📋 Prerequisites

- **Python**: 3.10, 3.11, 3.12, or 3.13
- **Web Browser**: Modern Chrome, Firefox, Edge, or Safari with JavaScript enabled
- **System Memory**: Minimum 2 GB RAM

---

## ⚙️ Installation & Setup Commands

### 1. Clone or Open Directory
```bash
cd c:\Users\harsh\OneDrive\Documents\fy_mj_project
```

### 2. Set Up Virtual Environment & Dependencies
```bash
python -m venv venv
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Or Command Prompt:
.\venv\Scripts\activate.bat

pip install -r requirements.txt
```

---

## 📊 Dataset Acquisition & Preparation

The dataset comprises **1,332 verified agricultural records** across 12 key sugarcane-producing districts of Maharashtra (Solapur, Pune, Satara, Sangli, Kolhapur, Ahmednagar/Ahilyanagar, Nashik, Chhatrapati Sambhajinagar, Nanded, Latur, Dharashiv, Jalgaon) covering the years 2010–2023.

To re-run data acquisition and preprocessing:
```bash
python scripts/download_data.py
python scripts/preprocess_data.py
```

Output file: `data/processed/maharashtra_sugarcane_processed.csv`

---

## 🤖 Model Training Pipeline

To retrain all four regression models (**Decision Tree**, **Random Forest**, **Gradient Boosting**, and **XGBoost**) using 5-fold cross-validation and evaluate on held-out test data:

```bash
python scripts/train_models.py
```

This updates all binary `.pkl` pipelines and saves evaluation metrics to `models/metrics.json`.

---

## 🚀 Running the Project

### 1. Start FastAPI Backend Server
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base URL: `http://localhost:8000/api`
- Interactive Swagger OpenAPI Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc Documentation: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 2. Start Frontend Server
In a separate terminal:
```bash
python -m http.server 8080 --directory "ppt major"
```
- Frontend Web App: [http://localhost:8080](http://localhost:8080)

---

## 🧪 Testing Commands

Run the full automated pytest suite covering all API endpoints, Pydantic input validation, and model loading:

```bash
python -m pytest tests/
```

---

## 📊 Genuine Empirical Model Metrics

Evaluation performed across 1,332 observations (80% Train / 5-Fold Cross-Validation, 20% Held-Out Test Set):

| Algorithm | Val MAE (t/ha) | Val RMSE (t/ha) | Val R² Score | Test MAE (t/ha) | Test RMSE (t/ha) | Test R² Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Decision Tree Regressor** | 7.063 | 8.996 | 0.6821 | 6.409 | 8.130 | 0.7662 |
| **Random Forest Regressor** | 5.054 | 6.358 | 0.8407 | 4.389 | 5.581 | 0.8898 |
| **Gradient Boosting Regressor** 🏆 | **4.821** | **6.017** | **0.8572** | **4.149** | **5.195** | **0.9045** |
| **XGBoost Regressor** | 4.977 | 6.216 | 0.8479 | 4.438 | 5.549 | 0.8911 |

> **Selected Best Algorithm**: **Gradient Boosting Regressor** achieved the highest validation $R^2$ (0.8572) and test $R^2$ (0.9045) with the lowest test RMSE (5.195 tonnes/hectare).

---

## ⚠️ Evaluation Limitations

1. **Growth Percentage Target**: Official government agricultural statistics provide annual yield (tonnes/ha), but lack continuous growth percentage field logs across crop maturity stages. Thus, growth stage prediction is provided as a conditional estimate derived from crop age.
2. **Geographical Scope**: Trained and calibrated specifically for the 12 primary sugarcane-growing districts of Maharashtra, India.
3. **Stateless Privacy**: Farmer inputs are evaluated dynamically in-memory and are never stored in a permanent database.
