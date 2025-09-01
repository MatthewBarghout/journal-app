from sqlalchemy.orm import Session
from sqlalchemy import desc, func, extract
from app.models.travel_record import TravelRecord
from app.schemas.travel_record import TravelRecordCreate, TravelRecordUpdate
from typing import Optional, List
from datetime import datetime

class TravelService:
    
    @staticmethod
    def create_record(db: Session, record: TravelRecordCreate) -> TravelRecord:
        db_record = TravelRecord(**record.dict())
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        return db_record
    
    @staticmethod
    def get_record(db: Session, record_id: int) -> Optional[TravelRecord]:
        return db.query(TravelRecord).filter(TravelRecord.id == record_id).first()
    
    @staticmethod
    def get_records(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        country: Optional[str] = None,
        city: Optional[str] = None,
        category: Optional[str] = None,
        min_rating: Optional[int] = None,
        max_rating: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[TravelRecord]:
        query = db.query(TravelRecord)
        
        if country:
            query = query.filter(TravelRecord.country.ilike(f"%{country}%"))
        if city:
            query = query.filter(TravelRecord.city.ilike(f"%{city}%"))
        if category:
            query = query.filter(TravelRecord.category.ilike(f"%{category}%"))
        if min_rating:
            query = query.filter(TravelRecord.rating >= min_rating)
        if max_rating:
            query = query.filter(TravelRecord.rating <= max_rating)
        if start_date:
            query = query.filter(TravelRecord.visit_date >= start_date)
        if end_date:
            query = query.filter(TravelRecord.visit_date <= end_date)
            
        return query.order_by(desc(TravelRecord.visit_date)).offset(skip).limit(limit).all()
    
    @staticmethod
    def count_records(
        db: Session,
        country: Optional[str] = None,
        city: Optional[str] = None,
        category: Optional[str] = None,
        min_rating: Optional[int] = None,
        max_rating: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> int:
        query = db.query(TravelRecord)
        
        if country:
            query = query.filter(TravelRecord.country.ilike(f"%{country}%"))
        if city:
            query = query.filter(TravelRecord.city.ilike(f"%{city}%"))
        if category:
            query = query.filter(TravelRecord.category.ilike(f"%{category}%"))
        if min_rating:
            query = query.filter(TravelRecord.rating >= min_rating)
        if max_rating:
            query = query.filter(TravelRecord.rating <= max_rating)
        if start_date:
            query = query.filter(TravelRecord.visit_date >= start_date)
        if end_date:
            query = query.filter(TravelRecord.visit_date <= end_date)
            
        return query.count()
    
    @staticmethod
    def update_record(db: Session, record_id: int, record_update: TravelRecordUpdate) -> Optional[TravelRecord]:
        db_record = db.query(TravelRecord).filter(TravelRecord.id == record_id).first()
        if not db_record:
            return None
            
        update_data = record_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_record, field, value)
            
        db.commit()
        db.refresh(db_record)
        return db_record
    
    @staticmethod
    def delete_record(db: Session, record_id: int) -> bool:
        db_record = db.query(TravelRecord).filter(TravelRecord.id == record_id).first()
        if not db_record:
            return False
            
        db.delete(db_record)
        db.commit()
        return True
    
    @staticmethod
    def get_aggregate_stats(db: Session) -> dict:
        # Average rating by country
        avg_rating_by_country = db.query(
            TravelRecord.country,
            func.avg(TravelRecord.rating).label("avg_rating")
        ).group_by(TravelRecord.country).all()
        
        # Top destination by month (most recent record for each month)
        top_by_month = db.query(
            extract('year', TravelRecord.visit_date).label('year'),
            extract('month', TravelRecord.visit_date).label('month'),
            TravelRecord.title,
            func.max(TravelRecord.rating).label('max_rating')
        ).group_by(
            extract('year', TravelRecord.visit_date),
            extract('month', TravelRecord.visit_date)
        ).all()
        
        # Category distribution
        category_dist = db.query(
            TravelRecord.category,
            func.count(TravelRecord.id).label("count")
        ).group_by(TravelRecord.category).all()
        
        # Total unique countries and cities
        total_countries = db.query(func.count(func.distinct(TravelRecord.country))).scalar()
        total_cities = db.query(func.count(func.distinct(TravelRecord.city))).scalar()
        
        return {
            "average_rating_by_country": {country: float(rating) for country, rating in avg_rating_by_country},
            "top_destinations_by_month": {f"{int(year)}-{int(month):02d}": title for year, month, title, _ in top_by_month},
            "category_distribution": {category: count for category, count in category_dist},
            "total_countries_visited": total_countries or 0,
            "total_cities_visited": total_cities or 0
        }