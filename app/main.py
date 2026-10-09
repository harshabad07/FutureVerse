"""
FutureVerse Python FastAPI Application Entry Point (main.py)
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.api.endpoints import router as api_router

app = FastAPI(
    title="FutureVerse: Sugarcane Growth & Yield Prediction API",
    description="RESTful API for Machine Learning Sugarcane Yield Inference, 4-Model Comparison, and Agronomic Farming Recommendations for Maharashtra, India.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
origins_env = os.getenv("CORS_ORIGINS", '["*"]')
try:
    import json
    allowed_origins = json.loads(origins_env)
except Exception:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")

@app.get("/", tags=["System"])
def root():
    return {
        "title": "FutureVerse Sugarcane Growth & Yield Prediction API",
        "status": "online",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "health_endpoint": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
