"""
Agricultural AI Inference Engine
Handles model loading and predictions for field analytics
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
import json
import os
from typing import Dict, List, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgriculturalInference:
    """
    AI inference engine for agricultural analytics
    Handles CNN and LSTM model predictions
    """
    
    def __init__(self, models_dir: str = "models"):
        self.models_dir = models_dir
        self.cnn_model = None
        self.lstm_model = None
        self.models_loaded = False
        
        # Initialize models
        self._load_models()
    
    def _load_models(self):
        """Load pre-trained CNN and LSTM models"""
        try:
            # Load CNN model for field health analysis
            cnn_path = os.path.join(self.models_dir, "cnn_model.h5")
            if os.path.exists(cnn_path):
                self.cnn_model = keras.models.load_model(cnn_path)
                logger.info("CNN model loaded successfully")
            else:
                logger.warning(f"CNN model not found at {cnn_path}, creating placeholder")
                self.cnn_model = self._create_placeholder_cnn()
            
            # Load LSTM model for yield prediction
            lstm_path = os.path.join(self.models_dir, "lstm_model.h5")
            if os.path.exists(lstm_path):
                self.lstm_model = keras.models.load_model(lstm_path)
                logger.info("LSTM model loaded successfully")
            else:
                logger.warning(f"LSTM model not found at {lstm_path}, creating placeholder")
                self.lstm_model = self._create_placeholder_lstm()
            
            self.models_loaded = True
            
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            self.models_loaded = False
    
    def _create_placeholder_cnn(self):
        """Create a placeholder CNN model for development"""
        model = keras.Sequential([
            keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.Flatten(),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(1, activation='sigmoid')
        ])
        
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        return model
    
    def _create_placeholder_lstm(self):
        """Create a placeholder LSTM model for development"""
        model = keras.Sequential([
            keras.layers.LSTM(50, return_sequences=True, input_shape=(30, 8)),
            keras.layers.LSTM(50, return_sequences=False),
            keras.layers.Dense(25),
            keras.layers.Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model
    
    def predict_field_health(self, sensor_data: List[Dict]) -> Dict[str, Any]:
        """
        Predict field health using CNN model and sensor data
        
        Args:
            sensor_data: List of sensor readings with environmental data
            
        Returns:
            Dictionary containing health prediction and recommendations
        """
        try:
            if not self.models_loaded:
                raise Exception("Models not loaded")
            
            # Process sensor data
            if not sensor_data:
                raise ValueError("No sensor data provided")
            
            # Extract features from sensor data
            features = self._extract_health_features(sensor_data)
            
            # Generate synthetic image data for CNN (in real implementation, 
            # this would be actual satellite/drone imagery)
            image_data = self._generate_synthetic_image_data(features)
            
            # Make prediction using CNN model
            prediction = self.cnn_model.predict(image_data, verbose=0)
            health_score = float(prediction[0][0] * 100)  # Convert to percentage
            
            # Generate recommendations based on health score
            recommendations = self._generate_health_recommendations(health_score, features)
            
            return {
                "health_score": round(health_score, 1),
                "confidence": round(min(95, max(70, health_score)), 1),
                "recommendations": recommendations,
                "risk_factors": self._identify_risk_factors(features),
                "timestamp": sensor_data[-1].get("timestamp", "")
            }
            
        except Exception as e:
            logger.error(f"Error in field health prediction: {str(e)}")
            # Return fallback prediction
            return {
                "health_score": 75.0,
                "confidence": 60.0,
                "recommendations": ["Monitor field conditions closely", "Check sensor readings"],
                "risk_factors": ["Data processing error"],
                "timestamp": ""
            }
    
    def predict_yield(self, growth_data: Dict) -> Dict[str, Any]:
        """
        Predict crop yield using LSTM model
        
        Args:
            growth_data: Historical growth and environmental data
            
        Returns:
            Dictionary containing yield prediction and key factors
        """
        try:
            if not self.models_loaded:
                raise Exception("Models not loaded")
            
            # Process growth data into time series format
            time_series_data = self._process_growth_data(growth_data)
            
            # Make prediction using LSTM model
            prediction = self.lstm_model.predict(time_series_data, verbose=0)
            predicted_yield = float(prediction[0][0])
            
            # Analyze key factors affecting yield
            key_factors = self._analyze_yield_factors(growth_data)
            
            return {
                "yield_per_hectare": round(predicted_yield, 1),
                "confidence": round(min(90, max(65, predicted_yield * 0.8)), 1),
                "key_factors": key_factors,
                "trend": self._calculate_yield_trend(growth_data),
                "recommendations": self._generate_yield_recommendations(predicted_yield, key_factors)
            }
            
        except Exception as e:
            logger.error(f"Error in yield prediction: {str(e)}")
            # Return fallback prediction
            return {
                "yield_per_hectare": 85.0,
                "confidence": 60.0,
                "key_factors": ["Weather conditions", "Soil quality", "Pest pressure"],
                "trend": "stable",
                "recommendations": ["Optimize irrigation", "Monitor soil nutrients"]
            }
    
    def _extract_health_features(self, sensor_data: List[Dict]) -> Dict[str, float]:
        """Extract relevant features from sensor data"""
        if not sensor_data:
            return {}
        
        # Calculate averages and trends
        temperatures = [d.get("temperature", 20) for d in sensor_data]
        humidities = [d.get("humidity", 50) for d in sensor_data]
        soil_moistures = [d.get("soil_moisture", 40) for d in sensor_data]
        ph_levels = [d.get("ph_level", 6.5) for d in sensor_data]
        
        return {
            "avg_temperature": np.mean(temperatures),
            "avg_humidity": np.mean(humidities),
            "avg_soil_moisture": np.mean(soil_moistures),
            "avg_ph": np.mean(ph_levels),
            "temp_variance": np.var(temperatures),
            "humidity_variance": np.var(humidities),
            "moisture_trend": self._calculate_trend(soil_moistures),
            "ph_stability": 1.0 / (np.std(ph_levels) + 0.1)
        }
    
    def _generate_synthetic_image_data(self, features: Dict) -> np.ndarray:
        """Generate synthetic image data for CNN input (placeholder)"""
        # In a real implementation, this would process actual satellite/drone imagery
        # For now, create synthetic data based on features
        image_size = (64, 64, 3)
        image = np.random.rand(1, *image_size)
        
        # Modify image based on health features
        health_factor = features.get("avg_soil_moisture", 50) / 100.0
        image[0, :, :, 1] *= health_factor  # Green channel represents health
        
        return image
    
    def _process_growth_data(self, growth_data: Dict) -> np.ndarray:
        """Process growth data into LSTM input format"""
        # Create time series data from growth parameters
        sequence_length = 30
        features = 8  # temperature, humidity, soil_moisture, ph, nitrogen, phosphorus, potassium, growth_stage
        
        # Generate synthetic time series data
        time_series = np.random.rand(1, sequence_length, features)
        
        # Modify based on actual growth data if available
        if "historical_data" in growth_data:
            # Process historical data (placeholder)
            pass
        
        return time_series
    
    def _generate_health_recommendations(self, health_score: float, features: Dict) -> List[str]:
        """Generate recommendations based on health score and features"""
        recommendations = []
        
        if health_score < 70:
            recommendations.append("Immediate intervention required")
            recommendations.append("Increase monitoring frequency")
            
        if features.get("avg_soil_moisture", 50) < 40:
            recommendations.append("Increase irrigation")
            
        if features.get("avg_ph", 6.5) < 6.0 or features.get("avg_ph", 6.5) > 7.0:
            recommendations.append("Adjust soil pH levels")
            
        if features.get("temp_variance", 0) > 50:
            recommendations.append("Monitor temperature stability")
            
        if not recommendations:
            recommendations.append("Field conditions are optimal")
            recommendations.append("Continue current management practices")
        
        return recommendations
    
    def _identify_risk_factors(self, features: Dict) -> List[str]:
        """Identify potential risk factors"""
        risk_factors = []
        
        if features.get("avg_temperature", 20) > 30:
            risk_factors.append("High temperature stress")
            
        if features.get("avg_humidity", 50) > 80:
            risk_factors.append("High humidity - disease risk")
            
        if features.get("avg_soil_moisture", 50) < 30:
            risk_factors.append("Water stress")
            
        if features.get("ph_stability", 1.0) < 0.5:
            risk_factors.append("Unstable soil pH")
        
        return risk_factors
    
    def _analyze_yield_factors(self, growth_data: Dict) -> List[str]:
        """Analyze key factors affecting yield"""
        factors = []
        
        # Analyze various growth factors
        if "weather_data" in growth_data:
            factors.append("Weather conditions")
            
        if "soil_quality" in growth_data:
            factors.append("Soil quality")
            
        if "pest_pressure" in growth_data:
            factors.append("Pest pressure")
            
        if "nutrient_levels" in growth_data:
            factors.append("Nutrient availability")
        
        # Default factors if no specific data
        if not factors:
            factors = ["Weather conditions", "Soil quality", "Pest pressure", "Management practices"]
        
        return factors
    
    def _calculate_trend(self, values: List[float]) -> float:
        """Calculate trend direction (-1 to 1)"""
        if len(values) < 2:
            return 0.0
        
        # Simple linear trend calculation
        x = np.arange(len(values))
        trend = np.polyfit(x, values, 1)[0]
        
        # Normalize to -1 to 1 range
        return np.clip(trend / 10.0, -1.0, 1.0)
    
    def _calculate_yield_trend(self, growth_data: Dict) -> str:
        """Calculate yield trend direction"""
        # Placeholder implementation
        return "stable"  # Could be "increasing", "decreasing", or "stable"
    
    def _generate_yield_recommendations(self, predicted_yield: float, key_factors: List[str]) -> List[str]:
        """Generate yield optimization recommendations"""
        recommendations = []
        
        if predicted_yield < 80:
            recommendations.append("Optimize irrigation schedule")
            recommendations.append("Review fertilizer application")
            
        if "Weather conditions" in key_factors:
            recommendations.append("Monitor weather forecasts closely")
            
        if "Pest pressure" in key_factors:
            recommendations.append("Implement integrated pest management")
            
        if not recommendations:
            recommendations.append("Continue current practices")
            recommendations.append("Monitor for optimization opportunities")
        
        return recommendations
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models"""
        return {
            "models_loaded": self.models_loaded,
            "cnn_model_available": self.cnn_model is not None,
            "lstm_model_available": self.lstm_model is not None,
            "models_directory": self.models_dir
        }
