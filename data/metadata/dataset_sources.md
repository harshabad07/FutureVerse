# FutureVerse Dataset Sources & Metadata

## 1. Primary Data Sources
- **Ministry of Agriculture & Farmers Welfare (Govt of India / APY Portal)**:
  - Dataset: District-wise Crop Production & Yield Statistics for Maharashtra (1997-2023).
  - Coverage: 12 Sugarcane Districts (Solapur, Pune, Sangli, Kolhapur, Satara, Ahmednagar, Nashik, Chhatrapati Sambhajinagar, Nanded, Latur, Dharashiv, Jalgaon).
- **Soil Health Card Scheme (Department of Agriculture, Govt of Maharashtra)**:
  - Parameters: Soil pH, Available Nitrogen (N), Available Phosphorus (P), Available Potassium (K), Soil Texture classification.
- **India Meteorological Department (IMD) / Open-Meteo Archive**:
  - Parameters: Annual Temperature (°C), Relative Humidity (%), Annual Rainfall (mm).

## 2. Target Variables & Feasibility
- **Yield Target (`yield_t_ha`)**: Fully supported. Measured in tonnes per hectare (t/ha). High data quality with continuous observations across all 12 districts.
- **Growth Target (`growth_percentage`)**: Conditional / Experimental. Official APY government statistics do not record daily growth percentage labels. Where growth labels are missing (`NaN`), yield prediction models remain fully functional while growth prediction is conditionally evaluated.

## 3. Geographical & Temporal Scope
- **Region**: Maharashtra, India.
- **Districts**: 12 Sugarcane Belts.
- **Time Horizon**: 2010 – 2023.
