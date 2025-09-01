from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class TravelRecord(Base):
    __tablename__ = "travel_records"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False) 
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    visit_date = Column(DateTime, nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 scale
    category = Column(String(50), nullable=False)  # beach, city, nature, cultural, etc.
    notes = Column(Text, nullable=True)
    image_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())