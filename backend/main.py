"""
Terra Metrics Dashboard Backend
Agricultural AI Analytics API Server
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
from datetime import datetime, timedelta
import random
import numpy as np
from sqlalchemy.orm import Session

# Import inference module
from inference import AgriculturalInference
# Import satellite service and database models
from satellite_service import satellite_service
from models import get_db, NDVIResult

# Initialize FastAPI app
app = FastAPI(
    title="Terra Metrics Dashboard API",
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

# Initialize inference engine
inference_engine = AgriculturalInference()

# Pydantic models for API
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

class ReportRequest(BaseModel):
    field_ids: List[str]
    report_type: str
    start_date: str
    end_date: str
    include_predictions: bool = True

# Mock data for development
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

# API Routes
@app.get("/")
async def root():
    return {"message": "Terra Metrics Dashboard API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Fields endpoints
@app.get("/api/fields", response_model=List[Dict])
async def get_fields():
    """Get all agricultural fields"""
    return mock_fields

@app.get("/api/fields/{field_id}", response_model=Dict)
async def get_field(field_id: str):
    """Get specific field details"""
    field = next((f for f in mock_fields if f["id"] == field_id), None)
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field

@app.post("/api/fields")
async def create_field(field: FieldData):
    """Create a new field"""
    # In a real implementation, this would save to database
    return {"message": "Field created successfully", "field_id": field.field_id}

# Sensor data endpoints
@app.get("/api/sensor-data/{field_id}")
async def get_sensor_data(field_id: str, hours: int = 24):
    """Get recent sensor data for a field"""
    # Generate mock sensor data
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

# Alerts endpoints
@app.get("/api/alerts")
async def get_alerts(status: Optional[str] = None):
    """Get all alerts, optionally filtered by status"""
    mock_alerts = [
        {
            "id": "alert_001",
            "type": "Pest Risk",
            "severity": "High",
            "field_id": "field_001",
            "zone": "Zone 3A",
            "description": "Potential pest outbreak detected in northern section",
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
            "description": "Soil moisture levels dropping below optimal range",
            "detected": "2025-01-15T09:15:00Z",
            "status": "active",
            "confidence": 87.0
        },
        {
            "id": "alert_003",
            "type": "Temperature Anomaly",
            "severity": "Low", 
            "field_id": "field_003",
            "zone": "Zone 1C",
            "description": "Unusual temperature pattern detected in crop canopy",
            "detected": "2025-01-15T08:45:00Z",
            "status": "investigating",
            "confidence": 73.0
        }
    ]
    
    if status:
        mock_alerts = [alert for alert in mock_alerts if alert["status"] == status]
    
    return mock_alerts

@app.get("/api/alerts/{alert_id}")
async def get_alert(alert_id: str):
    """Get specific alert details"""
    # Mock detailed alert data
    return {
        "id": alert_id,
        "type": "Pest Risk",
        "severity": "High",
        "field_id": "field_001",
        "zone": "Zone 3A",
        "description": "Potential pest outbreak detected in northern section",
        "detected": "2025-01-15T10:30:00Z",
        "status": "active",
        "confidence": 91.0,
        "detailed_analysis": {
            "affected_area_percentage": 15.3,
            "recommended_actions": [
                "Apply targeted pest control measures",
                "Increase monitoring frequency",
                "Consider preventive treatments"
            ],
            "risk_factors": [
                "High humidity conditions",
                "Previous pest history",
                "Crop stress indicators"
            ]
        }
    }

# Analytics endpoints
@app.get("/api/analytics/health-summary")
async def get_health_summary():
    """Get overall field health summary"""
    total_fields = len(mock_fields)
    avg_health = sum(field["health"] for field in mock_fields) / total_fields
    total_alerts = sum(field["alerts"] for field in mock_fields)
    
    return {
        "total_fields": total_fields,
        "average_health": round(avg_health, 1),
        "total_alerts": total_alerts,
        "healthy_fields": len([f for f in mock_fields if f["health"] >= 85]),
        "stressed_fields": len([f for f in mock_fields if f["health"] < 70])
    }

@app.get("/api/analytics/trends/{field_id}")
async def get_field_trends(field_id: str, days: int = 7):
    """Get trend data for a specific field"""
    # Generate mock trend data
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    trends = []
    current_date = start_date
    
    while current_date <= end_date:
        trends.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "health_score": round(random.uniform(60, 95), 1),
            "yield_prediction": round(random.uniform(80, 120), 1),
            "disease_risk": round(random.uniform(5, 35), 1),
            "pest_risk": round(random.uniform(10, 45), 1)
        })
        current_date += timedelta(days=1)
    
    return {"field_id": field_id, "trends": trends, "period_days": days}

# AI Prediction endpoints
@app.post("/api/predict/field-health")
async def predict_field_health(field_id: str, sensor_data: List[SensorReading]):
    """Predict field health using AI models"""
    try:
        # Use inference engine for prediction
        prediction = inference_engine.predict_field_health(sensor_data)
        return {
            "field_id": field_id,
            "predicted_health": prediction["health_score"],
            "confidence": prediction["confidence"],
            "recommendations": prediction["recommendations"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/predict/yield")
async def predict_yield(field_id: str, growth_data: Dict):
    """Predict crop yield using LSTM model"""
    try:
        prediction = inference_engine.predict_yield(growth_data)
        return {
            "field_id": field_id,
            "predicted_yield": prediction["yield_per_hectare"],
            "confidence": prediction["confidence"],
            "factors": prediction["key_factors"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Yield prediction failed: {str(e)}")

# Reports endpoints
@app.post("/api/reports/generate")
async def generate_report(request: ReportRequest):
    """Generate agricultural reports"""
    # Mock report generation
    report_id = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    return {
        "report_id": report_id,
        "status": "processing",
        "estimated_completion": (datetime.now() + timedelta(minutes=5)).isoformat(),
        "fields_included": request.field_ids,
        "report_type": request.report_type
    }

@app.get("/api/reports/{report_id}")
async def get_report(report_id: str):
    """Get report status and download link"""
    return {
        "report_id": report_id,
        "status": "ready",
        "download_url": f"/api/reports/{report_id}/download",
        "generated_at": datetime.now().isoformat(),
        "file_size": "2.4 MB"
    }

# Geocoding endpoints
@app.get("/api/geocode")
async def geocode_address(address: str):
    """
    Geocode an address to get coordinates
    
    Args:
        address: Address string to geocode
    
    Returns:
        Coordinates and formatted address
    """
    try:
        # Using Nominatim (OpenStreetMap) for geocoding
        import requests
        
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': address,
            'format': 'json',
            'limit': 1,
            'addressdetails': 1
        }
        headers = {
            'User-Agent': 'TerraMetricsDashboard/1.0'
        }
        
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
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
        
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Geocoding service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Geocoding failed: {str(e)}")

@app.get("/api/reverse-geocode")
async def reverse_geocode(lat: float, lon: float):
    """
    Reverse geocode coordinates to get address
    
    Args:
        lat: Latitude
        lon: Longitude
    
    Returns:
        Formatted address
    """
    try:
        import requests
        
        url = "https://nominatim.openstreetmap.org/reverse"
        params = {
            'lat': lat,
            'lon': lon,
            'format': 'json',
            'addressdetails': 1
        }
        headers = {
            'User-Agent': 'TerraMetricsDashboard/1.0'
        }
        
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        return {
            "address": data.get("display_name", "Unknown location"),
            "latitude": lat,
            "longitude": lon,
            "place_id": data.get("place_id")
        }
        
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Reverse geocoding service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reverse geocoding failed: {str(e)}")

# NDVI Analysis endpoints
@app.get("/api/ndvi")
async def get_ndvi_analysis(
    min_lat: float,
    min_lon: float, 
    max_lat: float,
    max_lon: float,
    db: Session = Depends(get_db)
):
    """
    Get NDVI analysis for a specified bounding box
    
    Args:
        min_lat: Minimum latitude (south)
        min_lon: Minimum longitude (west)
        max_lat: Maximum latitude (north)
        max_lon: Maximum longitude (east)
    
    Returns:
        NDVI analysis results with base64-encoded image
    """
    try:
        # Validate bounding box
        if min_lat >= max_lat or min_lon >= max_lon:
            raise HTTPException(
                status_code=400, 
                detail="Invalid bounding box: min values must be less than max values"
            )
        
        # Check if coordinates are within valid ranges
        if not (-90 <= min_lat <= 90) or not (-90 <= max_lat <= 90):
            raise HTTPException(status_code=400, detail="Latitude must be between -90 and 90")
        
        if not (-180 <= min_lon <= 180) or not (-180 <= max_lon <= 180):
            raise HTTPException(status_code=400, detail="Longitude must be between -180 and 180")
        
        # Create bounding box coordinates
        bbox_coords = [min_lon, min_lat, max_lon, max_lat]
        
        # Fetch NDVI data
        ndvi_array = satellite_service.fetch_ndvi_image(bbox_coords)
        
        # Convert to base64 PNG
        ndvi_image_base64 = satellite_service.ndvi_to_png_base64(ndvi_array)
        
        # Calculate NDVI statistics
        ndvi_stats = satellite_service.get_ndvi_statistics(ndvi_array)
        
        # Save to database
        ndvi_result = NDVIResult(
            min_lat=min_lat,
            min_lon=min_lon,
            max_lat=max_lat,
            max_lon=max_lon,
            image_base64=ndvi_image_base64,
            ndvi_mean=ndvi_stats["mean"],
            ndvi_min=ndvi_stats["min"],
            ndvi_max=ndvi_stats["max"],
            ndvi_std=ndvi_stats["std"],
            valid_pixels=ndvi_stats["valid_pixels"],
            total_pixels=ndvi_stats["total_pixels"]
        )
        
        db.add(ndvi_result)
        db.commit()
        db.refresh(ndvi_result)
        
        return {
            "id": ndvi_result.id,
            "bounding_box": {
                "min_lat": min_lat,
                "min_lon": min_lon,
                "max_lat": max_lat,
                "max_lon": max_lon
            },
            "ndvi_image": ndvi_image_base64,
            "statistics": ndvi_stats,
            "created_at": ndvi_result.created_at.isoformat()
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NDVI analysis failed: {str(e)}")

@app.get("/api/ndvi/history")
async def get_ndvi_history(db: Session = Depends(get_db), limit: int = 10):
    """Get recent NDVI analysis history"""
    results = db.query(NDVIResult).order_by(NDVIResult.created_at.desc()).limit(limit).all()
    
    return [
        {
            "id": result.id,
            "bounding_box": {
                "min_lat": result.min_lat,
                "min_lon": result.min_lon,
                "max_lat": result.max_lat,
                "max_lon": result.max_lon
            },
            "statistics": {
                "mean": result.ndvi_mean,
                "min": result.ndvi_min,
                "max": result.ndvi_max,
                "std": result.ndvi_std,
                "valid_pixels": result.valid_pixels,
                "total_pixels": result.total_pixels
            },
            "created_at": result.created_at.isoformat()
        }
        for result in results
    ]

@app.get("/api/ndvi/{result_id}")
async def get_ndvi_result(result_id: int, db: Session = Depends(get_db)):
    """Get specific NDVI analysis result"""
    result = db.query(NDVIResult).filter(NDVIResult.id == result_id).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="NDVI result not found")
    
    return {
        "id": result.id,
        "bounding_box": {
            "min_lat": result.min_lat,
            "min_lon": result.min_lon,
            "max_lat": result.max_lat,
            "max_lon": result.max_lon
        },
        "ndvi_image": result.image_base64,
        "statistics": {
            "mean": result.ndvi_mean,
            "min": result.ndvi_min,
            "max": result.ndvi_max,
            "std": result.ndvi_std,
            "valid_pixels": result.valid_pixels,
            "total_pixels": result.total_pixels
        },
        "created_at": result.created_at.isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
