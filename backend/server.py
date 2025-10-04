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

# E-commerce Models
class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

# User Management
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: Optional[str] = None
    phone: Optional[str] = None
    password_hash: str
    name: str
    role: UserRole = UserRole.USER
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    name: str

class UserLogin(BaseModel):
    email_or_phone: str
    password: str

# Cart Management
class CartItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    product_name: str
    product_price: float
    quantity: int = 1
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

# Order Management
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    product_price: float
    quantity: int
    total_price: float

class DeliveryMethod(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    estimated_days: int
    is_active: bool = True

class PaymentMethod(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # stripe, robokassa, yandex, etc.
    config: Dict[str, Any] = {}
    is_active: bool = True

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    items: List[OrderItem]
    subtotal: float
    delivery_method: DeliveryMethod
    delivery_cost: float
    total_amount: float
    status: OrderStatus = OrderStatus.PENDING
    payment_status: PaymentStatus = PaymentStatus.PENDING
    payment_method: Optional[PaymentMethod] = None
    delivery_address: str
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    user_name: str
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    delivery_method_id: str
    payment_method_id: Optional[str] = None
    delivery_address: str
    notes: Optional[str] = None

# Settings Management
class IntegrationSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # payment, delivery, supplier, 1c, etc.
    provider: str  # stripe, cdek, api_name, etc.
    config: Dict[str, Any]
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class IntegrationCreate(BaseModel):
    name: str
    type: str
    provider: str
    config: Dict[str, Any]
    is_active: bool = True

class SiteSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str
    value: Any
    type: str  # string, number, boolean, json
    category: str  # general, payment, delivery, notifications
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    part_number: str
    brand: str
    category: str
    base_price: Optional[float] = None
    image_url: Optional[str] = None

# Helper functions
def prepare_for_mongo(data):
    """Convert datetime objects to ISO strings for MongoDB storage"""
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
            elif isinstance(value, dict):
                data[key] = prepare_for_mongo(value)
            elif isinstance(value, list):
                data[key] = [prepare_for_mongo(item) if isinstance(item, dict) else item for item in value]
    return data

def parse_from_mongo(item):
    """Parse datetime strings back from MongoDB"""
    if isinstance(item, dict):
        for key, value in item.items():
            if key in ['created_at', 'updated_at', 'timestamp', 'last_updated'] and isinstance(value, str):
                try:
                    item[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                except:
                    pass
            elif isinstance(value, dict):
                item[key] = parse_from_mongo(value)
            elif isinstance(value, list):
                item[key] = [parse_from_mongo(subitem) if isinstance(subitem, dict) else subitem for subitem in value]
    return item

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "NEXX E-Commerce API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    prepared_data = prepare_for_mongo(status_obj.dict())
    _ = await db.status_checks.insert_one(prepared_data)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**parse_from_mongo(status_check)) for status_check in status_checks]

# Supplier Management Routes
@api_router.post("/suppliers", response_model=Supplier)
async def create_supplier(supplier_data: SupplierCreate):
    supplier = Supplier(**supplier_data.dict())
    prepared_data = prepare_for_mongo(supplier.dict())
    result = await db.suppliers.insert_one(prepared_data)
    return supplier

@api_router.get("/suppliers", response_model=List[Supplier])
async def get_suppliers(
    status: Optional[SupplierStatus] = None,
    brand: Optional[str] = None
):
    query = {}
    if status:
        query["status"] = status.value
    if brand:
        query["supported_brands"] = {"$in": [brand]}
    
    suppliers = await db.suppliers.find(query).to_list(1000)
    return [Supplier(**parse_from_mongo(supplier)) for supplier in suppliers]

@api_router.get("/suppliers/{supplier_id}", response_model=Supplier)
async def get_supplier(supplier_id: str):
    supplier = await db.suppliers.find_one({"id": supplier_id})
    if not supplier:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Supplier not found")
    return Supplier(**parse_from_mongo(supplier))

@api_router.put("/suppliers/{supplier_id}", response_model=Supplier)
async def update_supplier(supplier_id: str, supplier_update: SupplierUpdate):
    # Get existing supplier
    existing_supplier = await db.suppliers.find_one({"id": supplier_id})
    if not existing_supplier:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    # Update only provided fields
    update_data = supplier_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    prepared_update = prepare_for_mongo(update_data)
    await db.suppliers.update_one({"id": supplier_id}, {"$set": prepared_update})
    
    # Return updated supplier
    updated_supplier = await db.suppliers.find_one({"id": supplier_id})
    return Supplier(**parse_from_mongo(updated_supplier))

@api_router.delete("/suppliers/{supplier_id}")
async def delete_supplier(supplier_id: str):
    result = await db.suppliers.delete_one({"id": supplier_id})
    if result.deleted_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Supplier not found")
    return {"message": "Supplier deleted successfully"}

# Product Routes
@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate):
    product_dict = product_data.dict()
    if product_dict.get('id') is None:
        product_dict['id'] = str(uuid.uuid4())
    
    product = Product(**product_dict)
    prepared_data = prepare_for_mongo(product.dict())
    result = await db.products.insert_one(prepared_data)
    return product

@api_router.get("/products", response_model=List[Product])
async def get_products(
    brand: Optional[str] = None,
    category: Optional[str] = None,
    part_number: Optional[str] = None
):
    query = {}
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}
    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    if part_number:
        query["part_number"] = {"$regex": part_number, "$options": "i"}
    
    products = await db.products.find(query).to_list(1000)
    return [Product(**parse_from_mongo(product)) for product in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id})
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**parse_from_mongo(product))

# Product Offers from Suppliers
@api_router.get("/products/{product_id}/offers", response_model=List[ProductOffer])
async def get_product_offers(product_id: str):
    """Get all supplier offers for a specific product"""
    # First check if product exists
    product = await db.products.find_one({"id": product_id})
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get offers from all active suppliers
    offers = []
    active_suppliers = await db.suppliers.find({"status": "active"}).to_list(1000)
    
    for supplier_data in active_suppliers:
        supplier = Supplier(**parse_from_mongo(supplier_data))
        
        # Mock supplier API call - in real implementation, this would call actual supplier APIs
        offer = await mock_supplier_api_call(supplier, product_id, Product(**parse_from_mongo(product)))
        if offer:
            offers.append(offer)
    
    return offers

async def mock_supplier_api_call(supplier: Supplier, product_id: str, product: Product) -> Optional[ProductOffer]:
    """Mock supplier API call - replace with actual API integration"""
    import random
    
    # Mock stock availability (70% chance of having stock)
    if random.random() < 0.3:
        return None
    
    # Mock wholesale price calculation
    base_price = product.base_price or random.uniform(10000, 200000)
    wholesale_price = base_price * random.uniform(0.7, 0.9)  # 70-90% of base price
    
    # Calculate client price with markup
    markup_percentage = supplier.pricing_config.markup_percentage
    min_markup = supplier.pricing_config.min_markup_amount or 0
    
    markup_amount = max(wholesale_price * (markup_percentage / 100), min_markup)
    client_price = wholesale_price + markup_amount
    
    return ProductOffer(
        supplier_id=supplier.id,
        supplier_name=supplier.name,
        product_id=product_id,
        part_number=product.part_number,
        wholesale_price=round(wholesale_price, 2),
        client_price=round(client_price, 2),
        currency=supplier.pricing_config.currency,
        stock_quantity=random.randint(1, 50),
        delivery_time_days=supplier.delivery_time_days + random.randint(0, 3),
        supplier_rating=supplier.rating,
        last_updated=datetime.now(timezone.utc)
    )

# User Management Routes
@api_router.post("/users/register", response_model=User)
async def register_user(user_data: UserCreate):
    # Check if user exists
    existing_user = None
    if user_data.email:
        existing_user = await db.users.find_one({"email": user_data.email})
    if user_data.phone and not existing_user:
        existing_user = await db.users.find_one({"phone": user_data.phone})
    
    if existing_user:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Hash password
    import bcrypt
    password_hash = bcrypt.hashpw(user_data.password.encode(), bcrypt.gensalt()).decode()
    
    user = User(
        email=user_data.email,
        phone=user_data.phone,
        password_hash=password_hash,
        name=user_data.name
    )
    
    prepared_data = prepare_for_mongo(user.dict())
    await db.users.insert_one(prepared_data)
    return user

@api_router.post("/users/login")
async def login_user(login_data: UserLogin):
    # Find user by email or phone
    user = None
    if "@" in login_data.email_or_phone:
        user = await db.users.find_one({"email": login_data.email_or_phone})
    else:
        user = await db.users.find_one({"phone": login_data.email_or_phone})
    
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    import bcrypt
    if not bcrypt.checkpw(login_data.password.encode(), user["password_hash"].encode()):
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_obj = User(**parse_from_mongo(user))
    return {
        "user": user_obj,
        "token": f"token_{user_obj.id}",  # In real app, use JWT
        "message": "Login successful"
    }

@api_router.get("/users", response_model=List[User])
async def get_users():
    users = await db.users.find().to_list(1000)
    return [User(**parse_from_mongo(user)) for user in users]

# Cart Management Routes
@api_router.post("/cart/{user_id}/items", response_model=CartItem)
async def add_to_cart(user_id: str, item_data: CartItemCreate):
    # Get product info
    product = await db.products.find_one({"id": item_data.product_id})
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already in cart
    existing_item = await db.cart.find_one({
        "user_id": user_id, 
        "product_id": item_data.product_id
    })
    
    if existing_item:
        # Update quantity
        new_quantity = existing_item["quantity"] + item_data.quantity
        await db.cart.update_one(
            {"id": existing_item["id"]}, 
            {"$set": {"quantity": new_quantity}}
        )
        existing_item["quantity"] = new_quantity
        return CartItem(**parse_from_mongo(existing_item))
    else:
        # Create new cart item
        cart_item = CartItem(
            user_id=user_id,
            product_id=item_data.product_id,
            product_name=product["name"],
            product_price=product["base_price"] or 0,
            quantity=item_data.quantity
        )
        
        prepared_data = prepare_for_mongo(cart_item.dict())
        await db.cart.insert_one(prepared_data)
        return cart_item

@api_router.get("/cart/{user_id}", response_model=List[CartItem])
async def get_cart(user_id: str):
    cart_items = await db.cart.find({"user_id": user_id}).to_list(1000)
    return [CartItem(**parse_from_mongo(item)) for item in cart_items]

@api_router.put("/cart/{user_id}/items/{item_id}", response_model=CartItem)
async def update_cart_item(user_id: str, item_id: str, update_data: CartItemUpdate):
    result = await db.cart.update_one(
        {"id": item_id, "user_id": user_id},
        {"$set": {"quantity": update_data.quantity}}
    )
    
    if result.matched_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    cart_item = await db.cart.find_one({"id": item_id})
    return CartItem(**parse_from_mongo(cart_item))

@api_router.delete("/cart/{user_id}/items/{item_id}")
async def remove_from_cart(user_id: str, item_id: str):
    result = await db.cart.delete_one({"id": item_id, "user_id": user_id})
    if result.deleted_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

@api_router.delete("/cart/{user_id}")
async def clear_cart(user_id: str):
    await db.cart.delete_many({"user_id": user_id})
    return {"message": "Cart cleared"}

# Order Management Routes
@api_router.post("/orders", response_model=Order)
async def create_order(order_data: OrderCreate, user_id: str):
    # Get cart items
    cart_items = await db.cart.find({"user_id": user_id}).to_list(1000)
    if not cart_items:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Get delivery method
    delivery = await db.delivery_methods.find_one({"id": order_data.delivery_method_id})
    if not delivery:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Delivery method not found")
    
    # Convert cart items to order items
    order_items = []
    subtotal = 0
    for item in cart_items:
        order_item = OrderItem(
            product_id=item["product_id"],
            product_name=item["product_name"],
            product_price=item["product_price"],
            quantity=item["quantity"],
            total_price=item["product_price"] * item["quantity"]
        )
        order_items.append(order_item)
        subtotal += order_item.total_price
    
    # Create order
    delivery_obj = DeliveryMethod(**parse_from_mongo(delivery))
    order = Order(
        user_id=user_id,
        user_name=order_data.user_name,
        user_email=order_data.user_email,
        user_phone=order_data.user_phone,
        items=order_items,
        subtotal=subtotal,
        delivery_method=delivery_obj,
        delivery_cost=delivery_obj.price,
        total_amount=subtotal + delivery_obj.price,
        delivery_address=order_data.delivery_address,
        notes=order_data.notes
    )
    
    prepared_data = prepare_for_mongo(order.dict())
    await db.orders.insert_one(prepared_data)
    
    # Clear cart
    await db.cart.delete_many({"user_id": user_id})
    
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_orders(user_id: Optional[str] = None):
    query = {"user_id": user_id} if user_id else {}
    orders = await db.orders.find(query).to_list(1000)
    return [Order(**parse_from_mongo(order)) for order in orders]

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id})
    if not order:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**parse_from_mongo(order))

@api_router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: OrderStatus):
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.matched_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": f"Order status updated to {status.value}"}

# Settings Management Routes
@api_router.post("/settings/integrations", response_model=IntegrationSettings)
async def create_integration(integration_data: IntegrationCreate):
    integration = IntegrationSettings(**integration_data.dict())
    prepared_data = prepare_for_mongo(integration.dict())
    await db.integrations.insert_one(prepared_data)
    return integration

@api_router.get("/settings/integrations", response_model=List[IntegrationSettings])
async def get_integrations(type: Optional[str] = None):
    query = {"type": type} if type else {}
    integrations = await db.integrations.find(query).to_list(1000)
    return [IntegrationSettings(**parse_from_mongo(integration)) for integration in integrations]

@api_router.put("/settings/integrations/{integration_id}", response_model=IntegrationSettings)
async def update_integration(integration_id: str, integration_data: IntegrationCreate):
    update_data = integration_data.dict()
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    prepared_update = prepare_for_mongo(update_data)
    result = await db.integrations.update_one(
        {"id": integration_id},
        {"$set": prepared_update}
    )
    
    if result.matched_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Integration not found")
    
    integration = await db.integrations.find_one({"id": integration_id})
    return IntegrationSettings(**parse_from_mongo(integration))

@api_router.delete("/settings/integrations/{integration_id}")
async def delete_integration(integration_id: str):
    result = await db.integrations.delete_one({"id": integration_id})
    if result.deleted_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Integration not found")
    return {"message": "Integration deleted"}

# Delivery Methods
@api_router.post("/delivery-methods", response_model=DeliveryMethod)
async def create_delivery_method(delivery_data: dict):
    delivery = DeliveryMethod(**delivery_data)
    prepared_data = prepare_for_mongo(delivery.dict())
    await db.delivery_methods.insert_one(prepared_data)
    return delivery

@api_router.get("/delivery-methods", response_model=List[DeliveryMethod])
async def get_delivery_methods():
    methods = await db.delivery_methods.find({"is_active": True}).to_list(1000)
    return [DeliveryMethod(**parse_from_mongo(method)) for method in methods]

# Payment Methods
@api_router.post("/payment-methods", response_model=PaymentMethod)
async def create_payment_method(payment_data: dict):
    payment = PaymentMethod(**payment_data)
    prepared_data = prepare_for_mongo(payment.dict())
    await db.payment_methods.insert_one(prepared_data)
    return payment

@api_router.get("/payment-methods", response_model=List[PaymentMethod])
async def get_payment_methods():
    methods = await db.payment_methods.find({"is_active": True}).to_list(1000)
    return [PaymentMethod(**parse_from_mongo(method)) for method in methods]

# Test supplier API connection
@api_router.post("/suppliers/{supplier_id}/test-connection")
async def test_supplier_connection(supplier_id: str):
    """Test connection to supplier API"""
    supplier = await db.suppliers.find_one({"id": supplier_id})
    if not supplier:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    supplier_obj = Supplier(**parse_from_mongo(supplier))
    
    # Mock API test - in real implementation, make actual API call
    import random
    import asyncio
    
    # Simulate API call delay
    await asyncio.sleep(1)
    
    # Mock success/failure (90% success rate)
    if random.random() < 0.9:
        return {
            "status": "success",
            "message": "Connection successful",
            "response_time_ms": random.randint(100, 500)
        }
    else:
        return {
            "status": "error",
            "message": "Connection failed: Invalid API key or network error",
            "response_time_ms": 5000
        }

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
