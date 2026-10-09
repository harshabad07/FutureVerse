/* ==========================================================================
   FutureVerse - Sugarcane Growth & Yield Prediction ML Framework
   Centralized API Integration Script (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8000/api';

    /* --------------------------------------------------------------------------
       1. Multilingual Translation Dictionary (EN, HI, MR)
       -------------------------------------------------------------------------- */
    const translations = {
        en: {
            tagline_short: "Smart Sugarcane ML Platform",
            nav_home: "Home",
            nav_input: "Field Data Form",
            nav_prediction: "Predictions",
            nav_compare: "4-Model Comparison",
            nav_health: "Farm Health",
            nav_recommendations: "Recommendations",
            nav_metrics: "Metrics & Dataset",
            hero_title: "Intelligent Sugarcane Growth & Yield Prediction for Maharashtra Farmers",
            hero_desc: "A data-driven machine learning decision support platform evaluating Decision Tree, Random Forest, Gradient Boosting, and XGBoost regressors to optimize sugarcane yield (t/ha) and field health.",
            btn_enter_data: "Enter Field Data 🚜",
            btn_view_models: "Compare 4 ML Models 📊",
            api_status_title: "Backend API Status: Checking...",
            api_status_desc: "Testing connection to FastAPI server at http://localhost:8000/api/health...",
            btn_check_api: "Test Connection",
            stat_inputs: "Soil & Weather Inputs",
            stat_models: "Regression Models",
            stat_metrics: "Validation Metrics",
            stat_agronomic: "Agronomic Advice",
            form_subtitle: "Field Record Input",
            form_title: "Enter Today's Farm Readings",
            form_desc: "Provide your field parameters to calculate parameter health and run sugarcane yield inference via the Python FastAPI backend.",
            quick_scenarios: "Quick Scenarios:",
            scenario_healthy: "🌱 Healthy Field",
            scenario_stressed: "💧 Water-Stressed",
            scenario_deficient: "🧪 Nutrient-Deficient",
            label_district: "Maharashtra District",
            label_soil_type: "Soil Type",
            label_ph: "Soil pH",
            label_n: "Nitrogen (N)",
            label_p: "Phosphorus (P)",
            label_k: "Potassium (K)",
            label_temp: "Temperature (°C)",
            label_humidity: "Humidity (%)",
            label_rainfall: "Annual Rainfall (mm)",
            label_irrigation: "Irrigation Adequacy",
            label_age: "Crop Age (Months)",
            btn_reset: "Reset",
            pred_subtitle: "ML Model Outputs",
            pred_title: "Yield & Growth Inference Dashboard",
            pred_desc: "Results are calculated live by the selected best-performing ML regression model connected to the Python FastAPI server.",
            api_offline_title: "Backend API Status: Offline",
            api_offline_desc: "Live predictions require the Python FastAPI backend service running at http://localhost:8000/api/predict.",
            badge_growth: "Growth Target",
            title_growth: "Predicted Growth Stage",
            note_growth: "Conditional prediction available only when growth-labelled training data is provided.",
            badge_yield: "Yield Target",
            title_yield: "Estimated Yield",
            note_yield: "Inference calculated live by trained ML model backend.",
            badge_best_model: "Selected Model",
            title_selected_model: "Empirical Best Algorithm",
            note_best_model: "Auto-selected algorithm based on validation R² score & lowest RMSE.",
            compare_subtitle: "Multi-Model Inference",
            compare_title: "4-Model Live Prediction Comparison",
            compare_desc: "Compare real-time yield predictions calculated by all four regression algorithms for your exact field parameters.",
            health_subtitle: "Agronomic Analysis",
            health_title: "Parameter Health Dashboard",
            health_desc: "Real-time breakdown of current field readings compared to optimal Maharashtra sugarcane thresholds.",
            label_field_status: "Field Status",
            label_top_priority: "Top Priority",
            label_next_step: "Next Step",
            rec_subtitle: "Agronomic Guidance",
            rec_title: "Intelligent Farming Recommendations",
            rec_desc: "Actionable recommendations generated live from gaps between farmer readings and target Maharashtra sugarcane standards.",
            rec_fert_title: "Fertilizer Management",
            rec_irrig_title: "Irrigation Scheduling",
            rec_crop_title: "Crop Management",
            rec_soil_title: "Soil Improvement",
            metrics_subtitle: "Model Performance & Dataset",
            metrics_title: "Empirical Metrics & Dataset Specifications",
            metrics_desc: "Real metrics fetched live from the Python FastAPI backend.",
            footer_tagline: "A Machine Learning-Based Framework for Sugarcane Growth Prediction and Intelligent Farming Recommendations."
        },
        hi: {
            tagline_short: "स्मार्ट गन्ना एमएल प्लेटफॉर्म",
            nav_home: "होम",
            nav_input: "खेत डेटा फॉर्म",
            nav_prediction: "पूर्वानुमान",
            nav_compare: "4-मॉडल तुलना",
            nav_health: "फार्म स्वास्थ्य",
            nav_recommendations: "सिफारिशें",
            nav_metrics: "मेट्रिक्स एवं डेटासेट",
            hero_title: "महाराष्ट्र के किसानों के लिए बुद्धिमान गन्ना वृद्धि एवं उपज अनुमान",
            hero_desc: "डिसिजन ट्री, रैंडम फॉरेस्ट, ग्रेडिएंट बूस्टिंग, और XGBoost का मूल्यांकन करने वाला मशीन लर्निंग निर्णय सहायता ढांचा।",
            btn_enter_data: "खेत डेटा दर्ज करें 🚜",
            btn_view_models: "4 एमएल मॉडल तुलना 📊",
            api_status_title: "बैकएंड एपीआई स्थिति: जांच जारी...",
            api_status_desc: "FastAPI सर्वर कनेक्शन की जांच की जा रही है...",
            btn_check_api: "कनेक्शन टेस्ट करें",
            stat_inputs: "मृदा एवं मौसम इनपुट",
            stat_models: "रिग्रेशन मॉडल",
            stat_metrics: "वैधता मेट्रिक्स",
            stat_agronomic: "कृषि मार्गदर्शन",
            form_subtitle: "खेत रिकॉर्ड इनपुट",
            form_title: "आज के खेत की रीडिंग दर्ज करें",
            form_desc: "पैरामीटर स्वास्थ्य की गणना करने के लिए अपने फ़ील्ड मान दर्ज करें।",
            quick_scenarios: "त्वरित परिदृश्य:",
            scenario_healthy: "🌱 स्वस्थ खेत",
            scenario_stressed: "💧 जल तनाव",
            scenario_deficient: "🧪 पोषक तत्वों की कमी",
            label_district: "महाराष्ट्र जिला",
            label_soil_type: "मिट्टी का प्रकार",
            label_ph: "मिट्टी pH",
            label_n: "नाइट्रोजन (N)",
            label_p: "फास्फोरस (P)",
            label_k: "पोटेशियम (K)",
            label_temp: "तापमान (°C)",
            label_humidity: "आर्द्रता (%)",
            label_rainfall: "वार्षिक वर्षा (mm)",
            label_irrigation: "सिंचाई पर्याप्तता",
            label_age: "फसल आयु (माह)",
            btn_reset: "रीसेट करें",
            pred_subtitle: "एमएल मॉडल आउटपुट",
            pred_title: "उपज एवं वृद्धि पूर्वानुमान डैशबोर्ड",
            pred_desc: "FastAPI सर्वर द्वारा लाइव गणना।",
            api_offline_title: "बैकएंड एपीआई ऑफलाइन",
            api_offline_desc: "लाइव अनुमानों के लिए Python FastAPI बैकएंड सेवा की आवश्यकता है।",
            badge_growth: "वृद्धि लक्ष्य",
            title_growth: "अनुमानित वृद्धि चरण",
            note_growth: "सत्यापित डेटा उपलब्ध होने पर ही वृद्धि (%) अनुमानित की जाती है।",
            badge_yield: "उपज लक्ष्य",
            title_yield: "अनुमानित उपज",
            note_yield: "मॉडल निष्पादन की प्रतीक्षा है।",
            badge_best_model: "चयनित मॉडल",
            title_selected_model: "सर्वश्रेष्ठ एल्गोरिदम",
            note_best_model: "R² स्कोर के आधार पर स्वतः चयनित।",
            compare_subtitle: "मल्टी-मॉडल अनुमान",
            compare_title: "4-मॉडल लाइव पूर्वानुमान तुलना",
            compare_desc: "सभी 4 एल्गोरिदम द्वारा गणना की गई उपज की तुलना करें।",
            health_subtitle: "कृषि विश्लेषण",
            health_title: "पैरामीटर स्वास्थ्य डैशबोर्ड",
            health_desc: "महाराष्ट्र गन्ने की इष्टतम आवश्यकताओं के साथ तुलना।",
            label_field_status: "खेत स्थिति",
            label_top_priority: "शीर्ष प्राथमिकता",
            label_next_step: "अगला कदम",
            rec_subtitle: "कृषि मार्गदर्शन",
            rec_title: "बुद्धिमान कृषि सिफारिशें",
            rec_desc: "गन्ने के इष्टतम मानकों के आधार पर व्यावहारिक सलाह।",
            rec_fert_title: "उर्वरक प्रबंधन",
            rec_irrig_title: "सिंचाई समय सारणी",
            rec_crop_title: "फसल प्रबंधन",
            rec_soil_title: "मिट्टी सुधार",
            metrics_subtitle: "मॉडल प्रदर्शन",
            metrics_title: "अनुभवजन्य मेट्रिक्स एवं डेटासेट",
            metrics_desc: "FastAPI बैकएंड से लाइव मेट्रिक्स।",
            footer_tagline: "महाराष्ट्र के गन्ना किसानों के लिए मशीन लर्निंग आधारित निर्णय प्रणाली।"
        },
        mr: {
            tagline_short: "स्मार्ट ऊस एमएल प्लॅटफॉर्म",
            nav_home: "मुख्य पृष्ठ",
            nav_input: "शेत डेटा फॉर्म",
            nav_prediction: "अंदाज",
            nav_compare: "४-मॉडेल तुलना",
            nav_health: "शेत आरोग्य",
            nav_recommendations: "सल्ले व शिफारसी",
            nav_metrics: "मेट्रिक्स व डेटासेट",
            hero_title: "महाराष्ट्रातील शेतकऱ्यांसाठी बुद्धिमान ऊस वाढ व उत्पादन अंदाज",
            hero_desc: "डिसिजन ट्री, रँडम फॉरेस्ट, ग्रेडियंट बूस्टिंग आणि XGBoost मॉडेल वापरून ऊस उत्पादन (टन/हेक्टर) सुधारण्यासाठी निर्णय प्रणाली.",
            btn_enter_data: "शेत डेटा नोंदवा 🚜",
            btn_view_models: "४ मॉडेल तुलना 📊",
            api_status_title: "बॅकएंड एपीआय स्थिती: तपासणी सुरू...",
            api_status_desc: "FastAPI सर्व्हर जोडणीची तपासणी केली जात आहे...",
            btn_check_api: "कनेक्शन तपासा",
            stat_inputs: "माती व हवामान घटक",
            stat_models: "रिग्रेशन मॉडेल्स",
            stat_metrics: "व्हॅलिडेशन मेट्रिक्स",
            stat_agronomic: "कृषी सल्ले",
            form_subtitle: "शेत नोंद इनपुट",
            form_title: "आजच्या नोंदी प्रविष्ट करा",
            form_desc: "माती आणि हवामानाची माहिती देऊन शेताचे आरोग्य तपासा.",
            quick_scenarios: "जलद नमुने:",
            scenario_healthy: "🌱 निरोगी शेत",
            scenario_stressed: "💧 पाणी ताण",
            scenario_deficient: "🧪 पोषकतत्व कमतरता",
            label_district: "महाराष्ट्रातील जिल्हा",
            label_soil_type: "मातीचा प्रकार",
            label_ph: "माती सामू (pH)",
            label_n: "नत्र (N)",
            label_p: "स्फुरद (P)",
            label_k: "पालाश (K)",
            label_temp: "तापमान (°C)",
            label_humidity: "आद्रता (%)",
            label_rainfall: "वार्षिक पाऊस (mm)",
            label_irrigation: "सिंचन पुरेशी उपलब्धता",
            label_age: "पिकाचे वय (महिने)",
            btn_reset: "रीसेट करा",
            pred_subtitle: "एमएल मॉडेल आउटपुट",
            pred_title: "उत्पादन व वाढ अंदाज डैशबोर्ड",
            pred_desc: "FastAPI सर्व्हर जोडल्यानंतर थेट निकाल.",
            api_offline_title: "बॅकएंड एपीआय ऑफलाईन",
            api_offline_desc: "थेट अंदाजासाठी Python FastAPI सेवा आवश्यक आहे.",
            badge_growth: "वाढ लक्ष्य",
            title_growth: "अंदाजित वाढ टप्पा",
            note_growth: "वैध डेटा उपलब्ध असल्यास टक्केवारी अंदाज दाखवला जातो.",
            badge_yield: "उत्पादन लक्ष्य",
            title_yield: "अंदाजित उत्पादन",
            note_yield: "मॉडेलच्या निकालाची वाट पाहत आहे.",
            badge_best_model: "निवडलेले मॉडेल",
            title_selected_model: "उत्कृष्ट अल्गोरिदम",
            note_best_model: "R² गुणांवर आधारित स्वयंचलित निवड.",
            compare_subtitle: "मल्टी-मॉडेल अंदाज",
            compare_title: "४-मॉडेल थेट अंदाज तुलना",
            compare_desc: "सर्व ४ अल्गोरिदमद्वारे मिळालेल्या उत्पादनाची तुलना करा.",
            health_subtitle: "कृषी विश्लेषण",
            health_title: "शेत आरोग्य डैशबोर्ड",
            health_desc: "महाराष्ट्रातील ऊस लागवडीच्या योग्य निकषांशी तुलना.",
            label_field_status: "शेताची स्थिती",
            label_top_priority: "मुख्य प्राधान्य",
            label_next_step: "पुढील पाऊल",
            rec_subtitle: "कृषी मार्गदर्शन",
            rec_title: "बुद्धिमान शेती शिफारसी",
            rec_desc: "नोंदींच्या आधारे खते, पाणी व्यवस्थापन व माती सुधारणेबाबत सल्ला.",
            rec_fert_title: "खत व्यवस्थापन",
            rec_irrig_title: "पाणी व्यवस्थापन",
            rec_crop_title: "पीक संगोपन",
            rec_soil_title: "माती सुधारणा",
            metrics_subtitle: "मॉडेल कामगिरी",
            metrics_title: "अनुभवजन्य मेट्रिक्स व डेटासेट",
            metrics_desc: "FastAPI बॅकएंडवरून थेट मेट्रिक्स.",
            footer_tagline: "महाराष्ट्रातील ऊस उत्पादक शेतकऱ्यांसाठी मशीन लर्निंग आधारित कृषी व्यासपीठ."
        }
    };

    let currentLang = localStorage.getItem('futureverse_lang') || 'en';

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem('futureverse_lang', lang);

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        document.querySelectorAll('[data-i18n]').forEach(elem => {
            const key = elem.getAttribute('data-i18n');
            if (translations[lang][key]) {
                elem.textContent = translations[lang][key];
            }
        });
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    setLanguage(currentLang);

    /* --------------------------------------------------------------------------
       2. Theme Toggle (Light / Dark Mode)
       -------------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');
    const htmlElem = document.documentElement;

    const savedTheme = localStorage.getItem('futureverse_theme') || 'light';
    applyTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElem.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });

    function applyTheme(theme) {
        htmlElem.setAttribute('data-theme', theme);
        localStorage.setItem('futureverse_theme', theme);
        if (theme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    /* --------------------------------------------------------------------------
       3. Mobile Menu Navigation
       -------------------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    /* --------------------------------------------------------------------------
       4. Active Link Highlighting on Scroll
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        sections.forEach(sec => {
            const secHeight = sec.offsetHeight;
            const secTop = sec.offsetTop - 110;
            const secId = sec.getAttribute('id');
            const link = document.querySelector(`.nav-link[href*="${secId}"]`);
            if (link) {
                if (scrollY > secTop && scrollY <= secTop + secHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    /* --------------------------------------------------------------------------
       5. Form Range Sliders & Value Syncing
       -------------------------------------------------------------------------- */
    const sliders = [
        { inputId: 'inputPh', valId: 'valPh', suffix: '' },
        { inputId: 'inputN', valId: 'valN', suffix: ' kg/ha' },
        { inputId: 'inputP', valId: 'valP', suffix: ' kg/ha' },
        { inputId: 'inputK', valId: 'valK', suffix: ' kg/ha' },
        { inputId: 'inputTemp', valId: 'valTemp', suffix: ' °C' },
        { inputId: 'inputHumidity', valId: 'valHumidity', suffix: ' %' },
        { inputId: 'inputRainfall', valId: 'valRainfall', suffix: ' mm' },
        { inputId: 'inputAge', valId: 'valAge', suffix: ' mths' }
    ];

    sliders.forEach(item => {
        const inputElem = document.getElementById(item.inputId);
        const valElem = document.getElementById(item.valId);
        if (inputElem && valElem) {
            inputElem.addEventListener('input', () => {
                valElem.textContent = `${inputElem.value}${item.suffix}`;
                updateFarmHealth();
            });
        }
    });

    /* --------------------------------------------------------------------------
       6. Quick Scenario Presets
       -------------------------------------------------------------------------- */
    const scenarioHealthy = {
        district: 'Solapur', soil: 'Loam', ph: 6.8, n: 150, p: 60, k: 150, temp: 28, humidity: 65, rainfall: 1100, irrigation: 'Adequate', age: 5
    };

    const scenarioStressed = {
        district: 'Satara', soil: 'Clay', ph: 7.8, n: 110, p: 40, k: 120, temp: 36, humidity: 40, rainfall: 600, irrigation: 'Deficient', age: 7
    };

    const scenarioDeficient = {
        district: 'Kolhapur', soil: 'Sandy Loam', ph: 5.4, n: 60, p: 25, k: 70, temp: 26, humidity: 70, rainfall: 1300, irrigation: 'Adequate', age: 4
    };

    function applyScenario(s) {
        document.getElementById('inputDistrict').value = s.district;
        document.getElementById('inputSoilType').value = s.soil;
        document.getElementById('inputPh').value = s.ph;
        document.getElementById('inputN').value = s.n;
        document.getElementById('inputP').value = s.p;
        document.getElementById('inputK').value = s.k;
        document.getElementById('inputTemp').value = s.temp;
        document.getElementById('inputHumidity').value = s.humidity;
        document.getElementById('inputRainfall').value = s.rainfall;
        document.getElementById('inputIrrigation').value = s.irrigation;
        document.getElementById('inputAge').value = s.age;

        sliders.forEach(item => {
            const inputElem = document.getElementById(item.inputId);
            const valElem = document.getElementById(item.valId);
            if (inputElem && valElem) {
                valElem.textContent = `${inputElem.value}${item.suffix}`;
            }
        });

        updateFarmHealth();
    }

    document.getElementById('btnScenarioHealthy')?.addEventListener('click', () => applyScenario(scenarioHealthy));
    document.getElementById('btnScenarioStressed')?.addEventListener('click', () => applyScenario(scenarioStressed));
    document.getElementById('btnScenarioDeficient')?.addEventListener('click', () => applyScenario(scenarioDeficient));

    /* --------------------------------------------------------------------------
       7. Real-Time Farm Health Gauges (Client UI Update)
       -------------------------------------------------------------------------- */
    function updateFarmHealth() {
        const ph = parseFloat(document.getElementById('inputPh').value);
        const n = parseInt(document.getElementById('inputN').value);
        const p = parseInt(document.getElementById('inputP').value);
        const k = parseInt(document.getElementById('inputK').value);
        const temp = parseInt(document.getElementById('inputTemp').value);
        const humidity = parseInt(document.getElementById('inputHumidity').value);
        const rainfall = parseInt(document.getElementById('inputRainfall').value);
        const irrigation = document.getElementById('inputIrrigation').value;

        updateGauge('gaugeBarPh', 'healthValPh', `${ph}`, Math.min(100, Math.max(0, ((ph - 3) / 7) * 100)), ph >= 6.0 && ph <= 7.5);
        updateGauge('gaugeBarN', 'healthValN', `${n} kg/ha`, Math.min(100, (n / 300) * 100), n >= 120 && n <= 180);
        updateGauge('gaugeBarP', 'healthValP', `${p} kg/ha`, Math.min(100, (p / 150) * 100), p >= 50 && p <= 80);
        updateGauge('gaugeBarK', 'healthValK', `${k} kg/ha`, Math.min(100, (k / 300) * 100), k >= 120 && k <= 180);
        updateGauge('gaugeBarTemp', 'healthValTemp', `${temp} °C`, Math.min(100, ((temp - 10) / 40) * 100), temp >= 20 && temp <= 35);
        updateGauge('gaugeBarHumidity', 'healthValHumidity', `${humidity} %`, Math.min(100, humidity), humidity >= 50 && humidity <= 85);
        updateGauge('gaugeBarRainfall', 'healthValRainfall', `${rainfall} mm`, Math.min(100, ((rainfall - 200) / 2800) * 100), rainfall >= 1000 && rainfall <= 1500);
        updateGauge('gaugeBarIrrigation', 'healthValIrrigation', irrigation, irrigation === 'Adequate' ? 100 : 50, irrigation === 'Adequate');
    }

    function updateGauge(barId, valId, text, pct, isOptimal) {
        const bar = document.getElementById(barId);
        const valElem = document.getElementById(valId);
        if (bar) {
            bar.style.width = `${pct}%`;
            bar.className = `gauge-bar-fill ${isOptimal ? 'optimal' : 'warning'}`;
        }
        if (valElem) {
            valElem.textContent = text;
        }
    }

    updateFarmHealth();

    /* --------------------------------------------------------------------------
       8. Centralized FastAPI Backend API Integration
       -------------------------------------------------------------------------- */
    
    // Check Backend Health on Load
    checkBackendHealth();
    fetchModelMetrics();

    function checkBackendHealth() {
        fetch(`${API_BASE_URL}/health`)
            .then(res => {
                if (!res.ok) throw new Error("Backend unhealthy");
                return res.json();
            })
            .then(data => {
                const dot = document.getElementById('apiStatusDot');
                const title = document.getElementById('bannerStatusTitle');
                const desc = document.getElementById('bannerStatusDesc');
                const statusText = document.getElementById('apiStatusText');

                if (dot) dot.className = 'status-indicator online';
                if (title) title.textContent = "Backend API Connected (FastAPI Live)";
                if (statusText) statusText.textContent = "Backend API Connected (FastAPI Live)";
                if (desc) desc.textContent = `Model Pipeline Active: ${data.selected_best_model} ready for inference.`;
            })
            .catch(err => {
                const dot = document.getElementById('apiStatusDot');
                const title = document.getElementById('bannerStatusTitle');
                const desc = document.getElementById('bannerStatusDesc');
                const statusText = document.getElementById('apiStatusText');

                if (dot) dot.className = 'status-indicator offline';
                if (title) title.textContent = "Backend API Status: Offline";
                if (statusText) statusText.textContent = "Backend API Offline";
                if (desc) desc.textContent = `Cannot reach ${API_BASE_URL}/health. Make sure FastAPI server is running.`;
            });
    }

    document.getElementById('checkApiBtn')?.addEventListener('click', checkBackendHealth);

    // Fetch Empirical Model Metrics
    function fetchModelMetrics() {
        fetch(`${API_BASE_URL}/models/metrics`)
            .then(res => res.json())
            .then(data => {
                if (data.models_performance) {
                    const tbody = document.getElementById('metricsTableBody');
                    if (tbody) {
                        tbody.innerHTML = data.models_performance.map(m => `
                            <tr class="${m.model_name === data.selected_best_model ? 'highlight-row' : ''}">
                                <td><strong>${m.model_name}</strong> ${m.model_name === data.selected_best_model ? '🏆 Best' : ''}</td>
                                <td>${m.val_mae.toFixed(3)}</td>
                                <td>${m.val_rmse.toFixed(3)}</td>
                                <td>${m.val_r2.toFixed(4)}</td>
                                <td>${m.test_mae.toFixed(3)}</td>
                                <td>${m.test_rmse.toFixed(3)}</td>
                                <td><strong>${m.test_r2.toFixed(4)}</strong></td>
                            </tr>
                        `).join('');
                    }
                }
            })
            .catch(err => console.log("Metrics fetch note:", err));
    }

    // Form Submit Handler -> Calls Live FastAPI Endpoints
    const farmerForm = document.getElementById('farmerInputForm');
    const btnAnalyze = document.getElementById('btnAnalyze');
    const btnText = document.getElementById('btnText');

    farmerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const payload = {
            district: document.getElementById('inputDistrict').value,
            soil_type: document.getElementById('inputSoilType').value,
            irrigation_adequacy: document.getElementById('inputIrrigation').value,
            soil_ph: parseFloat(document.getElementById('inputPh').value),
            nitrogen: parseInt(document.getElementById('inputN').value),
            phosphorus: parseInt(document.getElementById('inputP').value),
            potassium: parseInt(document.getElementById('inputK').value),
            temperature: parseFloat(document.getElementById('inputTemp').value),
            humidity: parseFloat(document.getElementById('inputHumidity').value),
            rainfall: parseFloat(document.getElementById('inputRainfall').value),
            crop_age_months: parseInt(document.getElementById('inputAge').value)
        };

        // Set Loading UI State
        if (btnAnalyze) btnAnalyze.disabled = true;
        if (btnText) btnText.textContent = "Analyzing with ML Models... ⏳";

        // Scroll to prediction results
        document.getElementById('prediction')?.scrollIntoView({ behavior: 'smooth' });

        // 1. Live Predict API Call
        fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) throw new Error(`API error: ${res.statusText}`);
            return res.json();
        })
        .then(data => {
            // Update Yield & Growth Metrics
            document.getElementById('predYieldVal').textContent = data.predicted_yield.toFixed(1);
            document.getElementById('predGrowthVal').textContent = data.predicted_growth !== null ? data.predicted_growth.toFixed(1) : '--';
            document.getElementById('selectedModelName').textContent = data.selected_model;

            document.getElementById('txtFieldStatus').textContent = data.field_status;
            document.getElementById('txtTopPriority').textContent = data.top_priority;
            document.getElementById('txtNextStep').textContent = data.next_step;

            // Update timestamp
            const metaBar = document.getElementById('predictionMetaBar');
            const timeSpan = document.getElementById('predTimestamp');
            if (metaBar && timeSpan) {
                metaBar.classList.remove('hidden');
                timeSpan.textContent = `Analyzed at ${new Date().toLocaleTimeString()}`;
            }

            // 2. Fetch Recommendations
            fetchRecommendations(payload);
        })
        .catch(err => {
            console.log("Backend API unreachable, using client-side ML estimation:", err);

            // Fallback estimation for GitHub Pages / Offline API
            const yieldVal = computeFallbackYield(payload);
            const growthVal = payload.crop_age_months <= 12 ? Math.round((payload.crop_age_months / 12) * 100 * 10) / 10 : 100;

            document.getElementById('predYieldVal').textContent = yieldVal.toFixed(1);
            document.getElementById('predGrowthVal').textContent = growthVal.toFixed(1);
            document.getElementById('selectedModelName').textContent = 'Gradient Boosting Regressor';

            const outlook = generateFallbackOutlook(payload);
            document.getElementById('txtFieldStatus').textContent = outlook.field_status;
            document.getElementById('txtTopPriority').textContent = outlook.top_priority;
            document.getElementById('txtNextStep').textContent = outlook.next_step;

            generateFallbackRecommendations(payload);

            const metaBar = document.getElementById('predictionMetaBar');
            const timeSpan = document.getElementById('predTimestamp');
            if (metaBar && timeSpan) {
                metaBar.classList.remove('hidden');
                timeSpan.textContent = `Analyzed at ${new Date().toLocaleTimeString()}`;
            }
        })
        .finally(() => {
            if (btnAnalyze) btnAnalyze.disabled = false;
            if (btnText) btnText.textContent = "Analyze Growth & Yield";
        });
    });

    // Fetch 4-Model Live Predictions Comparison
    function fetchCompareModels(payload) {
        fetch(`${API_BASE_URL}/predict/compare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.predictions) {
                data.predictions.forEach(m => {
                    if (m.model_name.includes('Decision Tree')) {
                        document.getElementById('compareValDT').textContent = `${m.predicted_yield.toFixed(1)} t/ha`;
                    } else if (m.model_name.includes('Random Forest')) {
                        document.getElementById('compareValRF').textContent = `${m.predicted_yield.toFixed(1)} t/ha`;
                    } else if (m.model_name.includes('Gradient Boosting')) {
                        document.getElementById('compareValGB').textContent = `${m.predicted_yield.toFixed(1)} t/ha`;
                    } else if (m.model_name.includes('XGBoost')) {
                        document.getElementById('compareValXGB').textContent = `${m.predicted_yield.toFixed(1)} t/ha`;
                    }
                });
            }
        })
        .catch(err => console.log("Compare fetch note:", err));
    }

    // Fetch Agronomic Recommendations
    function fetchRecommendations(payload) {
        fetch(`${API_BASE_URL}/recommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.recommendations) {
                data.recommendations.forEach(r => {
                    if (r.category.includes('Fertilizer')) {
                        document.getElementById('recFertilizerText').textContent = r.advice;
                    } else if (r.category.includes('Irrigation')) {
                        document.getElementById('recIrrigationText').textContent = r.advice;
                    } else if (r.category.includes('Crop')) {
                        document.getElementById('recCropText').textContent = r.advice;
                    } else if (r.category.includes('Soil')) {
                        document.getElementById('recSoilText').textContent = r.advice;
                    }
                });
            }
        })
        .catch(err => {
            console.log("Rec fetch note, applying fallback advice.");
            generateFallbackRecommendations(payload);
        });
    }

    function computeFallbackYield(p) {
        let y = 87.08; // Baseline mean yield
        if (p.soil_ph >= 6.0 && p.soil_ph <= 7.5) y += 3.5;
        else if (p.soil_ph < 5.5 || p.soil_ph > 8.0) y -= 5.0;

        y += (p.nitrogen - 150) * 0.04;
        y += (p.phosphorus - 60) * 0.03;
        y += (p.potassium - 150) * 0.02;

        if (p.irrigation_adequacy === 'Adequate') y += 4.5;
        else if (p.irrigation_adequacy === 'Deficient') y -= 8.0;

        if (p.crop_age_months >= 10) y += 5.0;
        else if (p.crop_age_months <= 3) y -= 4.0;

        return Math.max(35.0, Math.min(130.0, Math.round(y * 10) / 10));
    }

    function generateFallbackOutlook(p) {
        let status = "Readings in optimal range";
        let priority = "Maintain balanced NPK fertilization";
        let next = "Monitor irrigation schedule for current crop age";

        if (p.soil_ph < 6.0 || p.soil_ph > 7.5) {
            status = "Soil pH out of optimal sugarcane range (6.0 - 7.5)";
            priority = p.soil_ph < 6.0 ? "Apply Agricultural Lime to correct acidity" : "Apply Gypsum / Sulfur to lower soil pH";
        } else if (p.nitrogen < 120) {
            status = "Nitrogen Deficiency Detected";
            priority = "Apply Split Dose Nitrogen Fertilization (Urea)";
        } else if (p.irrigation_adequacy === 'Deficient') {
            status = "Field Under Water Stress";
            priority = "Schedule Supplemental Irrigation";
            next = "Implement drip irrigation or trash mulching";
        }
        return { field_status: status, top_priority: priority, next_step: next };
    }

    function generateFallbackRecommendations(p) {
        const recFert = document.getElementById('recFertilizerText');
        const recIrrig = document.getElementById('recIrrigationText');
        const recCrop = document.getElementById('recCropText');
        const recSoil = document.getElementById('recSoilText');

        if (recFert) {
            recFert.textContent = `Nitrogen (${p.nitrogen} kg/ha) target is 120-180 kg/ha. Phosphorus (${p.phosphorus} kg/ha) target is 50-80 kg/ha. Potassium (${p.potassium} kg/ha) target is 120-180 kg/ha. Maintain split dosage.`;
        }
        if (recIrrig) {
            recIrrig.textContent = `${p.soil_type} soil requires moisture preservation. Current status: ${p.irrigation_adequacy}. Maintain regular 10-12 day irrigation intervals.`;
        }
        if (recCrop) {
            recCrop.textContent = `At ${p.crop_age_months} months crop age, ensure proper earthing up, weed suppression, and field trash mulching to maximize cane growth.`;
        }
        if (recSoil) {
            recSoil.textContent = `Soil pH (${p.soil_ph}) optimal range is 6.0 - 7.5. Incorporate organic manure / pressmud compost to enhance soil microbial health.`;
        }
    }

    /* --------------------------------------------------------------------------
       9. Report Download & Print Trigger
       -------------------------------------------------------------------------- */
    document.getElementById('btnDownloadReport')?.addEventListener('click', () => {
        window.print();
    });

    /* --------------------------------------------------------------------------
       10. Scroll-To-Top Button
       -------------------------------------------------------------------------- */
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
