from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Supplier Management Models
class SupplierStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TESTING = "testing"

class APIType(str, Enum):
    REST = "rest"
    SOAP = "soap"
    XML = "xml"
    JSON = "json"

class SupplierAPIConfig(BaseModel):
    api_type: APIType
    base_url: str
    api_key: str
    additional_headers: Optional[Dict[str, str]] = {}
    timeout: int = 30
    rate_limit: Optional[int] = None  # requests per minute

class PricingConfig(BaseModel):
    markup_percentage: float = Field(ge=0, description="Markup percentage for client prices")
    min_markup_amount: Optional[float] = Field(ge=0, description="Minimum markup amount in rubles")
    currency: str = "RUB"

class Supplier(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    status: SupplierStatus = SupplierStatus.ACTIVE
    rating: float = Field(ge=0, le=5, default=0)
    api_config: SupplierAPIConfig
    pricing_config: PricingConfig
    supported_brands: List[str] = []
    delivery_time_days: int = Field(ge=0, description="Average delivery time in days")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SupplierCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: SupplierStatus = SupplierStatus.ACTIVE
    rating: float = Field(ge=0, le=5, default=0)
    api_config: SupplierAPIConfig
    pricing_config: PricingConfig
    supported_brands: List[str] = []
    delivery_time_days: int = Field(ge=0, description="Average delivery time in days")

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[SupplierStatus] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    api_config: Optional[SupplierAPIConfig] = None
    pricing_config: Optional[PricingConfig] = None
    supported_brands: Optional[List[str]] = None
    delivery_time_days: Optional[int] = Field(None, ge=0)

# Product Offer Models
class ProductOffer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    supplier_id: str
    supplier_name: str
    product_id: str  # Reference to main product
    part_number: str
    wholesale_price: float
    client_price: float  # Price with markup
    currency: str = "RUB"
    stock_quantity: int = Field(ge=0)
    delivery_time_days: int = Field(ge=0)
    supplier_rating: float = Field(ge=0, le=5)
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Product Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    part_number: str
    brand: str
    category: str
    base_price: Optional[float] = None
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    part_number: str
    brand: str
    category: str
    base_price: Optional[float] = None
    image_url: Optional[str] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
