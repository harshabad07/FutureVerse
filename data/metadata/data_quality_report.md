# FutureVerse Data Quality Report

## 1. Summary Metrics
- **Total Valid Observations**: 1332
- **Geographical Coverage**: 12 Maharashtra Districts (Ahmednagar, Chhatrapati Sambhajinagar, Dharashiv, Jalgaon, Kolhapur, Latur, Nanded, Nashik, Pune, Sangli, Satara, Solapur)
- **Temporal Horizon**: 2010 to 2023
- **Duplicate Records**: 0
- **Outliers Filtered**: 0

## 2. Parameter Distribution Summary
| Attribute | Min | Mean | Max | Std Dev |
| :--- | :--- | :--- | :--- | :--- |
| **Soil pH** | 5.20 | 6.77 | 8.48 | 0.59 |
| **Nitrogen (N)** | 50 | 145.6 | 244 | 30.4 |
| **Phosphorus (P)** | 15 | 57.5 | 101 | 15.1 |
| **Potassium (K)** | 60 | 154.4 | 265 | 35.2 |
| **Temperature (°C)** | 18.3 | 27.5 | 36.8 | 2.9 |
| **Humidity (%)** | 36.7 | 63.2 | 87.7 | 9.1 |
| **Rainfall (mm)** | 350.0 | 968.0 | 1811.5 | 296.8 |
| **Yield (t/ha)** | 45.83 | 87.08 | 121.75 | 16.24 |

## 3. Model Target Responsibility Assessment
- **Yield Target (`yield_t_ha`)**: **RESPONSIBLE & FULLY SUPPORTED**. Measured continuously across all 1,332 observations without missing values.
- **Growth Target (`growth_percentage`)**: **CONDITIONAL / EXPERIMENTAL**. Contains 33 missing observations (2.48%). Growth percentage prediction model will be evaluated strictly when labelled data is present, while yield prediction remains the core regression target.
