from fastapi import FastAPI, HTTPException, APIRouter, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import bcrypt
import logging
import os
import hashlib
import hmac
import httpx
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from database import Database

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create FastAPI app
app = FastAPI(title="NEXX E-Commerce API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router with /api prefix
api_router = APIRouter(prefix="/api")

# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.now)

class StatusCheckCreate(BaseModel):
    client_name: str

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    name: str

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    part_number: str
    brand: str
    category: str
    price: float
    image_url: Optional[str] = None
    stock_quantity: int = 0

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    part_number: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    stock_quantity: Optional[int] = None

class CartAddRequest(BaseModel):
    product_id: str
    quantity: int = 1

class OrderCreate(BaseModel):
    user_name: str
    user_email: str
    user_phone: str
    delivery_address: str
    notes: Optional[str] = None

# Routes
@api_router.get("/")
def root():
    return {"message": "NEXX E-Commerce API"}

@api_router.post("/status")
def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.dict())
    return status_obj

@api_router.get("/status")
def get_status_checks():
    return []

# Authentication Routes
@api_router.post("/auth/login")
def login_user(login_data: LoginRequest):
    user = Database.get_user_by_username(login_data.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not bcrypt.checkpw(login_data.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Return user without password
    user_response = {
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }
    
    return {
        "success": True,
        "user": user_response,
        "message": "Login successful"
    }

@api_router.post("/auth/register")
def register_user(register_data: RegisterRequest):
    # Check if user exists
    existing_user = Database.get_user_by_username(register_data.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Hash password
    password_hash = bcrypt.hashpw(register_data.password.encode(), bcrypt.gensalt()).decode()
    
    user_data = {
        "username": register_data.username,
        "email": register_data.email,
        "password_hash": password_hash,
        "name": register_data.name,
        "role": "user"
    }
    
    user = Database.add_user(user_data)
    
    # Return user without password
    user_response = {
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }
    
    return {
        "success": True,
        "user": user_response,
        "message": "Registration successful"
    }

# Product Routes
@api_router.post("/products")
def create_product(product_data: ProductCreate):
    product = Database.add_product(product_data.dict())
    return product

@api_router.get("/products")
def get_products(
    brand: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    products = Database.get_products()
    
    # Filter products
    if brand:
        products = [p for p in products if p.get("brand", "").lower() == brand.lower()]
    if category:
        products = [p for p in products if p.get("category", "").lower() == category.lower()]
    if search:
        search_lower = search.lower()
        products = [p for p in products if 
                   search_lower in p.get("name", "").lower() or 
                   search_lower in p.get("description", "").lower() or
                   search_lower in p.get("part_number", "").lower()]
    
    return products

@api_router.get("/products/{product_id}")
def get_product(product_id: str):
    product = Database.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.put("/products/{product_id}")
def update_product(product_id: str, product_data: ProductUpdate):
    updated_product = Database.update_product(product_id, product_data.dict(exclude_unset=True))
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product

@api_router.delete("/products/{product_id}")
def delete_product(product_id: str):
    success = Database.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Cart Routes
@api_router.post("/cart/{user_id}/items")
def add_to_cart(user_id: str, request: CartAddRequest):
    cart = Database.add_to_cart(user_id, request.product_id, request.quantity)
    return {"message": "Product added to cart", "cart": cart}

@api_router.get("/cart/{user_id}")
def get_cart(user_id: str):
    cart = Database.get_cart(user_id)
    return cart

@api_router.put("/cart/{user_id}/items/{item_id}")
def update_cart_item(user_id: str, item_id: str, request: dict):
    quantity = request.get("quantity", 1)
    cart = Database.update_cart_item(user_id, item_id, quantity)
    return cart

@api_router.delete("/cart/{user_id}/items/{item_id}")
def remove_from_cart(user_id: str, item_id: str):
    cart = Database.remove_from_cart(user_id, item_id)
    return {"message": "Item removed from cart", "cart": cart}

@api_router.delete("/cart/{user_id}")
def clear_cart(user_id: str):
    cart = Database.clear_cart(user_id)
    return {"message": "Cart cleared", "cart": cart}

# Orders Routes
@api_router.post("/orders/{user_id}")
def create_order(user_id: str, order_data: OrderCreate):
    cart = Database.get_cart(user_id)
    if not cart:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    order = Database.add_order({
        "user_id": user_id,
        "items": cart,
        "total_amount": sum(item["product_price"] * item["quantity"] for item in cart),
        **order_data.dict()
    })
    
    # Clear cart after creating order
    Database.clear_cart(user_id)
    
    return order

@api_router.get("/orders")
def get_orders():
    return Database.get_orders()

# Include API router
app.include_router(api_router)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)