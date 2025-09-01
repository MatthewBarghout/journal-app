from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import os
import shutil
import uuid

from app.database import get_db
from app.services.travel_service import TravelService
from app.schemas.travel_record import (
    TravelRecord, 
    TravelRecordCreate, 
    TravelRecordUpdate, 
    TravelRecordList,
    AggregateStats
)

router = APIRouter(prefix="/api/v1/travel-records", tags=["travel-records"])

@router.post("/", response_model=TravelRecord, status_code=201)
def create_travel_record(
    record: TravelRecordCreate,
    db: Session = Depends(get_db)
):
    """Create a new travel record"""
    try:
        return TravelService.create_record(db, record)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating record: {str(e)}")

@router.get("/", response_model=TravelRecordList)
def get_travel_records(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    country: Optional[str] = Query(None, description="Filter by country name (partial match)"),
    city: Optional[str] = Query(None, description="Filter by city name (partial match)"),
    category: Optional[str] = Query(None, description="Filter by category (partial match)"),
    min_rating: Optional[int] = Query(None, ge=1, le=5, description="Minimum rating filter"),
    max_rating: Optional[int] = Query(None, ge=1, le=5, description="Maximum rating filter"),
    start_date: Optional[datetime] = Query(None, description="Filter records after this date (ISO format)"),
    end_date: Optional[datetime] = Query(None, description="Filter records before this date (ISO format)"),
    db: Session = Depends(get_db)
):
    """Get travel records with optional filtering"""
    records = TravelService.get_records(
        db, skip, limit, country, city, category, 
        min_rating, max_rating, start_date, end_date
    )
    total = TravelService.count_records(
        db, country, city, category, 
        min_rating, max_rating, start_date, end_date
    )
    
    return TravelRecordList(
        records=records,  # type: ignore
        total=total,
        page=skip // limit + 1,
        per_page=limit
    )

@router.get("/{record_id}", response_model=TravelRecord)
def get_travel_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific travel record by ID"""
    record = TravelService.get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Travel record not found")
    return record

@router.put("/{record_id}", response_model=TravelRecord)
def update_travel_record(
    record_id: int,
    record_update: TravelRecordUpdate,
    db: Session = Depends(get_db)
):
    """Update a travel record"""
    record = TravelService.update_record(db, record_id, record_update)
    if not record:
        raise HTTPException(status_code=404, detail="Travel record not found")
    return record

@router.delete("/{record_id}", status_code=204)
def delete_travel_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    """Delete a travel record"""
    success = TravelService.delete_record(db, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Travel record not found")

@router.get("/stats/aggregate", response_model=AggregateStats)
def get_aggregate_stats(db: Session = Depends(get_db)):
    """Get aggregated travel statistics"""
    return TravelService.get_aggregate_stats(db)

@router.post("/{record_id}/image", response_model=dict)
async def upload_travel_image(
    record_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload an image for a travel record"""
    # Check if record exists
    record = TravelService.get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Travel record not found")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename or "")[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join("uploads", unique_filename)
    
    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Update record with image filename  
        update_data = TravelRecordUpdate()  # type: ignore
        update_data.image_filename = unique_filename
        TravelService.update_record(db, record_id, update_data)
        
        return {"message": "Image uploaded successfully", "filename": unique_filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@router.get("/{record_id}/image")
def get_travel_image(
    record_id: int,
    db: Session = Depends(get_db)
):
    """Get the image for a travel record"""
    record = TravelService.get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Travel record not found")
    
    if record.image_filename is None:
        raise HTTPException(status_code=404, detail="No image found for this record")
    
    file_path = os.path.join("uploads", str(record.image_filename))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image file not found")
    
    return FileResponse(file_path)