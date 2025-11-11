from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import packages
from .database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VUR API",
    description="Void User Repository API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(packages.router, prefix="/api/v1", tags=["packages"])

@app.get("/")
def read_root():
    return {"message": "VUR API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
