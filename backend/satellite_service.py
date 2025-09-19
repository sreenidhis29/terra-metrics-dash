"""
Satellite Imagery Service for Terra Metrics Dashboard
Handles Sentinel-2 data retrieval and NDVI calculation using SentinelHub
"""

import os
import numpy as np
import base64
import io
from typing import List, Optional
from PIL import Image
import rasterio
from rasterio.transform import from_bounds
import requests
from sentinelhub import (
    SHConfig, 
    SentinelHubRequest, 
    DataCollection, 
    MimeType, 
    bbox_to_dimensions,
    BBox,
    CRS
)
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SatelliteService:
    def __init__(self):
        """Initialize SentinelHub configuration"""
        self.config = SHConfig()
        self.config.sh_client_id = os.getenv('SH_CLIENT_ID')
        self.config.sh_client_secret = os.getenv('SH_CLIENT_SECRET')
        
        if not self.config.sh_client_id or not self.config.sh_client_secret:
            raise ValueError("SentinelHub credentials not found. Please set SH_CLIENT_ID and SH_CLIENT_SECRET environment variables.")
    
    def fetch_ndvi_image(self, bbox_coords: List[float]) -> np.ndarray:
        """
        Fetch Sentinel-2 imagery and calculate NDVI
        
        Args:
            bbox_coords: [west, south, east, north] bounding box coordinates
            
        Returns:
            NDVI raster as NumPy array
        """
        if len(bbox_coords) != 4:
            raise ValueError("bbox_coords must contain exactly 4 values: [west, south, east, north]")
        
        west, south, east, north = bbox_coords
        
        # Create bounding box
        bbox = BBox(bbox=[west, south, east, north], crs=CRS.WGS84)
        
        # Calculate image dimensions (adjust resolution as needed)
        resolution = 10  # meters per pixel
        size = bbox_to_dimensions(bbox, resolution=resolution)
        
        # NDVI calculation evalscript
        evalscript = """
        //VERSION=3
        function setup() {
            return {
                input: [{
                    bands: ["B04", "B08"],
                    units: "DN"
                }],
                output: {
                    bands: 1,
                    sampleType: "FLOAT32"
                }
            };
        }
        
        function evaluatePixel(sample) {
            // Calculate NDVI = (NIR - Red) / (NIR + Red)
            // B08 = NIR, B04 = Red
            let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
            
            // Handle division by zero and invalid values
            if (isNaN(ndvi) || !isFinite(ndvi)) {
                return [0];
            }
            
            return [ndvi];
        }
        """
        
        # Create request
        request = SentinelHubRequest(
            evalscript=evalscript,
            input_data=[
                SentinelHubRequest.input_data(
                    data_collection=DataCollection.SENTINEL2_L2A,
                    time_interval=('2024-01-01', '2024-12-31'),  # Adjust date range as needed
                )
            ],
            responses=[
                SentinelHubRequest.output_response('default', MimeType.TIFF)
            ],
            bbox=bbox,
            size=size,
            config=self.config
        )
        
        # Execute request
        try:
            response = request.get_data()
            if len(response) > 0:
                return response[0]  # Return the first (and only) response
            else:
                raise ValueError("No data returned from SentinelHub")
        except Exception as e:
            raise Exception(f"Failed to fetch satellite data: {str(e)}")
    
    def ndvi_to_png_base64(self, ndvi_array: np.ndarray) -> str:
        """
        Convert NDVI array to base64-encoded PNG
        
        Args:
            ndvi_array: NDVI values as numpy array
            
        Returns:
            Base64-encoded PNG string
        """
        # Normalize NDVI values to 0-255 range for visualization
        # NDVI typically ranges from -1 to 1
        ndvi_normalized = np.clip(ndvi_array, -1, 1)
        ndvi_uint8 = ((ndvi_normalized + 1) / 2 * 255).astype(np.uint8)
        
        # Create PIL Image
        img = Image.fromarray(ndvi_uint8, mode='L')
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return img_str
    
    def get_ndvi_statistics(self, ndvi_array: np.ndarray) -> dict:
        """
        Calculate NDVI statistics
        
        Args:
            ndvi_array: NDVI values as numpy array
            
        Returns:
            Dictionary with NDVI statistics
        """
        # Remove invalid values
        valid_ndvi = ndvi_array[np.isfinite(ndvi_array)]
        
        if len(valid_ndvi) == 0:
            return {
                "mean": 0,
                "min": 0,
                "max": 0,
                "std": 0,
                "valid_pixels": 0,
                "total_pixels": ndvi_array.size
            }
        
        return {
            "mean": float(np.mean(valid_ndvi)),
            "min": float(np.min(valid_ndvi)),
            "max": float(np.max(valid_ndvi)),
            "std": float(np.std(valid_ndvi)),
            "valid_pixels": int(len(valid_ndvi)),
            "total_pixels": int(ndvi_array.size)
        }

# Global instance
satellite_service = SatelliteService()
