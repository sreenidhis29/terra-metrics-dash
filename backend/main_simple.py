"""
Terra Metrics Dashboard Backend - Simplified Version
Agricultural AI Analytics API Server with Sentinel Hub Integration
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
from datetime import datetime, timedelta
import random

# Import Sentinel Hub service
from sentinel_hub_service import SentinelHubService

# Initialize FastAPI app
app = FastAPI(
    title="KRUSHI Dashboard API",
    description="Agricultural AI Analytics Backend for Field Monitoring",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Pydantic Models
# -----------------------------
class FieldData(BaseModel):
    field_id: str
    name: str
    area: float
    location: Dict[str, float]
    crop_type: str
    planting_date: str
    last_updated: str

class SensorReading(BaseModel):
    timestamp: str
    field_id: str
    temperature: float
    humidity: float
    soil_moisture: float
    ph_level: float
    nitrogen: float
    phosphorus: float
    potassium: float

class Alert(BaseModel):
    id: str
    type: str
    severity: str
    field_id: str
    zone: str
    description: str
    detected: str
    status: str
    confidence: float

# -----------------------------
# Mock Data
# -----------------------------
mock_fields = [
    {
        "id": "field_001",
        "name": "North Farm - Plot A",
        "area": 48.2,
        "health": 92,
        "status": "Healthy",
        "location": {"lat": 40.7128, "lng": -74.0060},
        "last_updated": "2025-01-15T12:30:00Z",
        "alerts": 2
    },
    {
        "id": "field_002", 
        "name": "South Field",
        "area": 32.1,
        "health": 78,
        "status": "Moderate",
        "location": {"lat": 40.7580, "lng": -73.9855},
        "last_updated": "2025-01-15T11:15:00Z",
        "alerts": 5
    },
    {
        "id": "field_003",
        "name": "East Field", 
        "area": 56.8,
        "health": 65,
        "status": "Stressed",
        "location": {"lat": 40.7614, "lng": -73.9776},
        "last_updated": "2025-01-15T09:45:00Z",
        "alerts": 8
    },
    {
        "id": "field_004",
        "name": "West Pasture",
        "area": 24.5,
        "health": 89,
        "status": "Healthy", 
        "location": {"lat": 40.7505, "lng": -73.9934},
        "last_updated": "2025-01-15T12:00:00Z",
        "alerts": 0
    }
]

# -----------------------------
# API Routes
# -----------------------------
@app.get("/")
async def root():
    return {"message": "Terra Metrics Dashboard API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# --- Fields endpoints ---
@app.get("/api/fields", response_model=List[Dict])
async def get_fields():
    return mock_fields

@app.get("/api/fields/{field_id}", response_model=Dict)
async def get_field(field_id: str):
    field = next((f for f in mock_fields if f["id"] == field_id), None)
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field

# --- Sensor Data ---
@app.get("/api/sensor-data/{field_id}")
async def get_sensor_data(field_id: str, hours: int = 24):
    end_time = datetime.now()
    start_time = end_time - timedelta(hours=hours)

    data_points = []
    current_time = start_time

    while current_time <= end_time:
        data_points.append({
            "timestamp": current_time.isoformat(),
            "field_id": field_id,
            "temperature": round(random.uniform(15, 35), 1),
            "humidity": round(random.uniform(40, 90), 1),
            "soil_moisture": round(random.uniform(20, 80), 1),
            "ph_level": round(random.uniform(5.5, 7.5), 2),
            "nitrogen": round(random.uniform(10, 50), 1),
            "phosphorus": round(random.uniform(5, 25), 1),
            "potassium": round(random.uniform(15, 40), 1)
        })
        current_time += timedelta(minutes=30)

    return {"data": data_points, "field_id": field_id, "period_hours": hours}

# --- Alerts ---
@app.get("/api/alerts")
async def get_alerts(status: Optional[str] = None):
    mock_alerts = [
        {
            "id": "alert_001",
            "type": "Pest Risk",
            "severity": "High",
            "field_id": "field_001",
            "zone": "Zone 3A",
            "description": "Potential pest outbreak detected",
            "detected": "2025-01-15T10:30:00Z",
            "status": "active",
            "confidence": 91.0
        },
        {
            "id": "alert_002",
            "type": "Water Stress", 
            "severity": "Medium",
            "field_id": "field_002",
            "zone": "Zone 2B",
            "description": "Soil moisture dropping",
            "detected": "2025-01-15T09:15:00Z",
            "status": "active",
            "confidence": 87.0
        }
    ]

    if status:
        mock_alerts = [alert for alert in mock_alerts if alert["status"] == status]
    return mock_alerts

# --- Geocode ---
@app.get("/api/geocode")
async def geocode_address(address: str):
    try:
        import requests
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": address, "format": "json", "limit": 1, "addressdetails": 1}
        headers = {"User-Agent": "TerraMetricsDashboard/1.0"}
        resp = requests.get(url, params=params, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        if not data:
            raise HTTPException(status_code=404, detail="Address not found")
        result = data[0]
        return {
            "address": result.get("display_name", address),
            "latitude": float(result["lat"]),
            "longitude": float(result["lon"]),
            "bounding_box": result.get("boundingbox", []),
            "place_id": result.get("place_id")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Geocoding failed: {str(e)}")

# --- NDVI Analysis ---
@app.get("/api/ndvi")
async def get_ndvi_analysis(min_lat: float, min_lon: float, max_lat: float, max_lon: float):
    try:
        if min_lat >= max_lat or min_lon >= max_lon:
            raise HTTPException(status_code=400, detail="Invalid bounding box")

        bbox_coords = [min_lon, min_lat, max_lon, max_lat]
        ndvi_data = sentinel_hub_service.fetch_ndvi_image(bbox_coords)

        return {
            "id": f"ndvi_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "bounding_box": ndvi_data["bbox"],
            "ndvi_image": ndvi_data["ndvi_image"],
            "statistics": ndvi_data.get("statistics", {}),
            "created_at": ndvi_data["timestamp"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NDVI analysis failed: {str(e)}")

# --- Satellite Image ---
@app.get("/api/satellite-image")
async def get_satellite_image(min_lat: float, min_lon: float, max_lat: float, max_lon: float, width: int = 512, height: int = 512):
    try:
        if min_lat >= max_lat or min_lon >= max_lon:
            raise HTTPException(status_code=400, detail="Invalid bounding box")

        bbox_coords = [min_lon, min_lat, max_lon, max_lat]
        image_data = sentinel_hub_service.fetch_satellite_image(bbox_coords, width, height)

        return {
            "image_base64": image_data["image_base64"],
            "width": image_data["width"],
            "height": image_data["height"],
            "bounding_box": {"min_lat": min_lat, "min_lon": min_lon, "max_lat": max_lat, "max_lon": max_lon},
            "timestamp": image_data["timestamp"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Satellite image fetch failed: {str(e)}")

# -----------------------------
# Entry
# -----------------------------
if __name__ == "__main__":
    uvicorn.run("main_simple:app", host="127.0.0.1", port=8000, reload=True)
