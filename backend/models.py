"""
Database Models for Terra Metrics Dashboard
SQLAlchemy models for data persistence
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./terra_metrics.db")

# Create engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class
Base = declarative_base()

class NDVIResult(Base):
    """Model for storing NDVI analysis results"""
    __tablename__ = "ndvi_results"
    
    id = Column(Integer, primary_key=True, index=True)
    min_lat = Column(Float, nullable=False)
    min_lon = Column(Float, nullable=False)
    max_lat = Column(Float, nullable=False)
    max_lon = Column(Float, nullable=False)
    image_path = Column(String(500), nullable=True)  # Path to saved image file
    image_base64 = Column(Text, nullable=True)  # Base64 encoded image data
    ndvi_mean = Column(Float, nullable=True)
    ndvi_min = Column(Float, nullable=True)
    ndvi_max = Column(Float, nullable=True)
    ndvi_std = Column(Float, nullable=True)
    valid_pixels = Column(Integer, nullable=True)
    total_pixels = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<NDVIResult(id={self.id}, bbox=({self.min_lat}, {self.min_lon}, {self.max_lat}, {self.max_lon}), created_at={self.created_at})>"

class Field(Base):
    """Model for agricultural fields"""
    __tablename__ = "fields"
    
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    area = Column(Float, nullable=False)
    health = Column(Float, nullable=True)
    status = Column(String(50), nullable=True)
    min_lat = Column(Float, nullable=False)
    min_lon = Column(Float, nullable=False)
    max_lat = Column(Float, nullable=False)
    max_lon = Column(Float, nullable=False)
    crop_type = Column(String(100), nullable=True)
    planting_date = Column(String(50), nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow)
    alerts_count = Column(Integer, default=0)
    
    def __repr__(self):
        return f"<Field(id={self.id}, name={self.name}, area={self.area})>"

class SensorReading(Base):
    """Model for sensor data readings"""
    __tablename__ = "sensor_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(String(50), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    soil_moisture = Column(Float, nullable=True)
    ph_level = Column(Float, nullable=True)
    nitrogen = Column(Float, nullable=True)
    phosphorus = Column(Float, nullable=True)
    potassium = Column(Float, nullable=True)
    
    def __repr__(self):
        return f"<SensorReading(id={self.id}, field_id={self.field_id}, timestamp={self.timestamp})>"

class Alert(Base):
    """Model for field alerts"""
    __tablename__ = "alerts"
    
    id = Column(String(50), primary_key=True, index=True)
    type = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)
    field_id = Column(String(50), nullable=False, index=True)
    zone = Column(String(50), nullable=True)
    description = Column(Text, nullable=False)
    detected = Column(DateTime, nullable=False)
    status = Column(String(20), nullable=False, default="active")
    confidence = Column(Float, nullable=True)
    
    def __repr__(self):
        return f"<Alert(id={self.id}, type={self.type}, severity={self.severity}, field_id={self.field_id})>"

# Create all tables
def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

# Dependency to get database session
def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database
create_tables()
