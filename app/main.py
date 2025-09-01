from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import travel_record
from app.routers import travel_records

# Create database tables
travel_record.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Travel Journal API",
    description="A REST API for managing travel records and journal entries",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(travel_records.router)

@app.get("/", tags=["root"])
def read_root():
    """Welcome message and API info"""
    return {
        "message": "Welcome to the Travel Journal API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health", tags=["health"])
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}