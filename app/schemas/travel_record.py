from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TravelRecordBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Title or name of the location/trip")
    country: str = Field(..., min_length=1, max_length=100, description="Country visited")
    city: str = Field(..., min_length=1, max_length=100, description="City visited")
    latitude: Optional[float] = Field(None, ge=-90, le=90, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, ge=-180, le=180, description="Longitude coordinate")
    visit_date: datetime = Field(..., description="Date and time of visit")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1-5")
    category: str = Field(..., description="Type of destination (beach, city, nature, cultural, etc.)")
    notes: Optional[str] = Field(None, description="Additional notes about the trip")

class TravelRecordCreate(TravelRecordBase):
    pass

class TravelRecordUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    country: Optional[str] = Field(None, min_length=1, max_length=100)
    city: Optional[str] = Field(None, min_length=1, max_length=100)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    visit_date: Optional[datetime] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    category: Optional[str] = None
    notes: Optional[str] = None
    image_filename: Optional[str] = None

class TravelRecord(TravelRecordBase):
    id: int
    image_filename: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TravelRecordList(BaseModel):
    records: list[TravelRecord]
    total: int
    page: int
    per_page: int
    
class AggregateStats(BaseModel):
    average_rating_by_country: dict[str, float]
    top_destinations_by_month: dict[str, str]
    category_distribution: dict[str, int]
    total_countries_visited: int
    total_cities_visited: int