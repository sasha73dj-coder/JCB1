"""
NEXX Store - Полноценный Backend API
Комплексный интернет-магазин со всеми интеграциями
"""

from fastapi import FastAPI, HTTPException, APIRouter, Query, BackgroundTasks, File, UploadFile, Form, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
import uuid
from datetime import datetime, timedelta
import bcrypt
import logging
import os
import hashlib
import hmac
import httpx
import asyncio
import pandas as pd
import io
import json
import base64
import secrets
from pathlib import Path
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from database import Database
    from services.sms_service import sms_service
except ImportError:
    # Создаем базовую заглушку если модуль не найден
    class Database:
        @staticmethod
        def get_products():
            return []
        @staticmethod
        def get_users():
            return []
    
    class MockSMSService:
        def send_verification_code(self, phone):
            return {"success": True, "phone": phone}
        def verify_code(self, phone, code):
            return {"success": True, "phone": phone}
    
    sms_service = MockSMSService()

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
    user_type: str = "retail"  # "retail" или "legal"
    phone: Optional[str] = None
    company_name: Optional[str] = None
    inn: Optional[str] = None
    address: Optional[str] = None

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

# Новые модели для полноценного интернет-магазина
class PaymentSettings(BaseModel):
    provider: str  # yoomoney, sberbank, tinkoff
    merchant_id: str
    secret_key: str
    webhook_url: Optional[str] = None
    active: bool = True

class PaymentCreate(BaseModel):
    order_id: str
    amount: float
    currency: str = "RUB"
    description: str
    return_url: str
    payment_method: str = "card"

class ABCPSettings(BaseModel):
    username: str
    password: str
    host: str = "api.abcp.ru"
    active: bool = True

class SupplierCreate(BaseModel):
    name: str
    api_type: str  # "abcp", "exist", "emex"
    api_credentials: Dict[str, str]
    markup_percentage: float = 10.0
    delivery_days: int = 3
    min_order_amount: float = 0
    active: bool = True

class SiteSettings(BaseModel):
    company_name: str
    company_inn: Optional[str] = None
    company_address: Optional[str] = None
    company_phone: Optional[str] = None
    company_email: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: str = "#1e40af"
    secondary_color: str = "#64748b"
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

# SMS Authentication Models
class SMSLoginRequest(BaseModel):
    phone: str

class SMSVerifyRequest(BaseModel):
    phone: str
    code: str

class SMSSettingsRequest(BaseModel):
    provider: str  # "smsc", "smsru", "unifone"
    login: Optional[str] = None
    password: Optional[str] = None
    api_key: Optional[str] = None
    sender: str = "NEXX"

# Enhanced User Models
class UserCreate(BaseModel):
    username: str
    email: str
    password: Optional[str] = None
    phone: Optional[str] = None
    name: str
    user_type: str = "retail"  # "retail" или "legal" 
    role: str = "user"  # "user", "manager", "admin"
    # Для юридических лиц
    company_name: Optional[str] = None
    inn: Optional[str] = None
    kpp: Optional[str] = None
    ogrn: Optional[str] = None
    legal_address: Optional[str] = None
    postal_address: Optional[str] = None
    # Для физических лиц
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    passport_series: Optional[str] = None
    passport_number: Optional[str] = None
    birth_date: Optional[str] = None
    # Общие поля
    active: bool = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    name: Optional[str] = None
    user_type: Optional[str] = None
    role: Optional[str] = None
    company_name: Optional[str] = None
    inn: Optional[str] = None
    kpp: Optional[str] = None
    ogrn: Optional[str] = None
    legal_address: Optional[str] = None
    postal_address: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    passport_series: Optional[str] = None
    passport_number: Optional[str] = None
    birth_date: Optional[str] = None
    active: Optional[bool] = None

# Content Management Models
class PageCreate(BaseModel):
    title: str
    slug: str
    content: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    active: bool = True

class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    active: Optional[bool] = None

# 1C Integration Models
class OneCSettings(BaseModel):
    server_url: str
    database: str
    username: str
    password: str
    sync_products: bool = True
    sync_prices: bool = True
    sync_orders: bool = True
    active: bool = True

class OneCSync(BaseModel):
    sync_type: str  # "products", "prices", "orders", "all"
    force: bool = False

# SEO Settings Models
class SEOSettings(BaseModel):
    robots_txt: Optional[str] = None
    sitemap_enabled: bool = True
    google_analytics: Optional[str] = None
    yandex_metrika: Optional[str] = None
    google_search_console: Optional[str] = None
    yandex_webmaster: Optional[str] = None
    structured_data: bool = True
    open_graph: bool = True

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

# Платежные системы
@api_router.post("/payments/settings")
def create_payment_settings(settings: PaymentSettings):
    """Настройка платежной системы"""
    payment_settings = Database.add_payment_settings(settings.dict())
    return {"success": True, "data": payment_settings}

@api_router.get("/payments/settings")
def get_payment_settings():
    """Получение настроек платежных систем"""
    settings = Database.get_payment_settings()
    return {"success": True, "data": settings}

@api_router.post("/payments/create")
async def create_payment(payment_data: PaymentCreate):
    """Создание платежа"""
    try:
        from services.yoomoney_service import get_yoomoney_service
        
        yoomoney = get_yoomoney_service()
        payment = await yoomoney.create_payment(
            amount=payment_data.amount,
            description=payment_data.description,
            return_url=payment_data.return_url,
            metadata={"order_id": payment_data.order_id}
        )
        
        # Сохраняем платеж в базу данных
        payment_record = {
            "payment_id": payment.id,
            "order_id": payment_data.order_id,
            "amount": payment_data.amount,
            "currency": payment_data.currency,
            "status": payment.status,
            "provider": "yoomoney",
            "confirmation_url": payment.confirmation.get("confirmation_url") if payment.confirmation else None
        }
        
        Database.add_payment(payment_record)
        
        return {
            "success": True,
            "payment_id": payment.id,
            "confirmation_url": payment.confirmation.get("confirmation_url") if payment.confirmation else None
        }
        
    except Exception as e:
        logger.error(f"Payment creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/webhooks/yoomoney")
async def yoomoney_webhook(request: dict):
    """Webhook для уведомлений от YooMoney"""
    try:
        from services.yoomoney_service import get_yoomoney_service
        
        yoomoney = get_yoomoney_service()
        success = await yoomoney.process_webhook(request)
        
        if success:
            return {"status": "ok"}
        else:
            raise HTTPException(status_code=400, detail="Webhook processing failed")
            
    except Exception as e:
        logger.error(f"Webhook processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Поставщики ABCP
@api_router.post("/suppliers/abcp/settings")
def create_abcp_settings(settings: ABCPSettings):
    """Настройка интеграции с ABCP"""
    from services.abcp_service import init_abcp_service
    
    # Инициализируем сервис ABCP
    init_abcp_service(settings.username, settings.password, settings.host)
    
    # Сохраняем настройки
    abcp_settings = Database.add_abcp_settings(settings.dict())
    return {"success": True, "data": abcp_settings}

@api_router.get("/suppliers/abcp/test")
async def test_abcp_connection():
    """Тестирование подключения к ABCP"""
    try:
        from services.abcp_service import get_abcp_service
        
        abcp = get_abcp_service()
        if not abcp:
            raise HTTPException(status_code=400, detail="ABCP service not configured")
        
        result = await abcp.test_connection()
        return {"success": True, "data": result}
        
    except Exception as e:
        logger.error(f"ABCP connection test error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/products/{product_id}/offers")
async def get_product_offers(product_id: str):
    """Получение предложений поставщиков для товара"""
    try:
        # Получаем товар
        product = Database.get_product(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        from services.abcp_service import get_abcp_service
        
        abcp = get_abcp_service()
        if not abcp:
            # Возвращаем мок-данные если ABCP не настроен
            return get_mock_supplier_offers(product)
        
        # Получаем реальные предложения от ABCP
        offers = await abcp.get_product_offers(
            part_number=product.get("part_number"),
            brand=product.get("brand")
        )
        
        # Если ABCP не вернул предложения, используем мок-данные
        if not offers:
            logger.info("ABCP returned no offers, falling back to mock data")
            return get_mock_supplier_offers(product)
        
        return {"success": True, "data": offers}
        
    except Exception as e:
        logger.error(f"Error getting product offers: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/suppliers")
def create_supplier(supplier_data: SupplierCreate):
    """Создание поставщика"""
    supplier = Database.add_supplier(supplier_data.dict())
    return {"success": True, "data": supplier}

@api_router.get("/suppliers")
def get_suppliers():
    """Получение списка поставщиков"""
    suppliers = Database.get_suppliers()
    return {"success": True, "data": suppliers}

# Настройки сайта
@api_router.post("/settings/site")
def update_site_settings(settings: SiteSettings):
    """Обновление настроек сайта"""
    site_settings = Database.update_site_settings(settings.dict())
    return {"success": True, "data": site_settings}

@api_router.get("/settings/site")
def get_site_settings():
    """Получение настроек сайта"""
    settings = Database.get_site_settings()
    return {"success": True, "data": settings}

# Аналитика и статистика
@api_router.get("/analytics/dashboard")
def get_dashboard_analytics():
    """Получение данных для дашборда"""
    try:
        analytics = {
            "orders": {
                "total": len(Database.get_orders()),
                "today": 0,  # TODO: подсчет заказов за сегодня
                "pending": 0,  # TODO: подсчет ожидающих заказов
                "completed": 0  # TODO: подсчет выполненных заказов
            },
            "revenue": {
                "total": 0,  # TODO: подсчет общей выручки
                "today": 0,  # TODO: выручка за сегодня
                "this_month": 0  # TODO: выручка за месяц
            },
            "products": {
                "total": len(Database.get_products()),
                "low_stock": 0,  # TODO: товары с низким остатком
                "out_of_stock": 0  # TODO: товары без остатка
            },
            "users": {
                "total": len(Database.get_users()),
                "new_today": 0,  # TODO: новые пользователи за сегодня
                "active": 0  # TODO: активные пользователи
            }
        }
        
        return {"success": True, "data": analytics}
        
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def get_mock_supplier_offers(product):
    """Мок-данные для предложений поставщиков"""
    return {
        "success": True,
        "data": [
            {
                "supplier_id": "mock_supplier_1",
                "supplier_name": "Запчасти Плюс",
                "brand": product.get("brand", "Unknown"),
                "part_number": product.get("part_number", ""),
                "description": product.get("description", ""),
                "wholesale_price": product.get("price", 1000) * 0.8,
                "client_price": product.get("price", 1000),
                "stock_quantity": 5,
                "delivery_time_days": 2,
                "supplier_rating": 4.7,
                "item_key": "mock_key_1"
            },
            {
                "supplier_id": "mock_supplier_2",
                "supplier_name": "АвтоДеталь",
                "brand": product.get("brand", "Unknown"),
                "part_number": product.get("part_number", ""),
                "description": product.get("description", ""),
                "wholesale_price": product.get("price", 1000) * 0.85,
                "client_price": product.get("price", 1000) * 1.1,
                "stock_quantity": 3,
                "delivery_time_days": 3,
                "supplier_rating": 4.5,
                "item_key": "mock_key_2"
            }
        ]
    }

# Include API router
app.include_router(api_router)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)