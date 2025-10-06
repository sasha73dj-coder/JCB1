import json
import os
import uuid
from datetime import datetime
import bcrypt

# Database file paths
DATA_DIR = "/app/backend/data"
PRODUCTS_FILE = f"{DATA_DIR}/products.json"
USERS_FILE = f"{DATA_DIR}/users.json"
ORDERS_FILE = f"{DATA_DIR}/orders.json"
CART_FILE = f"{DATA_DIR}/cart.json"
SETTINGS_FILE = f"{DATA_DIR}/settings.json"
PAYMENTS_FILE = f"{DATA_DIR}/payments.json"
SUPPLIERS_FILE = f"{DATA_DIR}/suppliers.json"
PAYMENT_SETTINGS_FILE = f"{DATA_DIR}/payment_settings.json"
ABCP_SETTINGS_FILE = f"{DATA_DIR}/abcp_settings.json"
SITE_SETTINGS_FILE = f"{DATA_DIR}/site_settings.json"

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

def load_json(file_path, default=None):
    """Load JSON data from file"""
    if default is None:
        default = []
    
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return default
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return default

def save_json(file_path, data):
    """Save JSON data to file"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {file_path}: {e}")
        return False

def init_database():
    """Initialize database with default data"""
    
    # Initialize products
    if not os.path.exists(PRODUCTS_FILE):
        products = [
            {
                "id": str(uuid.uuid4()),
                "name": "Фильтр гидравлический JCB 32/925994",
                "description": "Оригинальный гидравлический фильтр для экскаваторов JCB. Высокое качество, длительный срок службы.",
                "part_number": "32/925994",
                "brand": "JCB",
                "category": "Гидравлика",
                "price": 8500,
                "image_url": "/images/hydraulic-filter.jpg",
                "slug": "filtr-gidravlicheskij-jcb-32-925994",
                "in_stock": True,
                "stock_quantity": 15,
                "created_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Тормозные колодки передние JCB 15/920200",
                "description": "Высококачественные тормозные колодки для спецтехники JCB. Обеспечивают надежное торможение.",
                "part_number": "15/920200",
                "brand": "JCB",
                "category": "Тормозная система",
                "price": 12500,
                "image_url": "/images/brake-pads.jpg",
                "slug": "tormoznye-kolodki-jcb-15-920200",
                "in_stock": True,
                "stock_quantity": 8,
                "created_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Масляный фильтр двигателя JCB 02/100284",
                "description": "Оригинальный масляный фильтр для двигателей JCB. Обеспечивает чистоту масла и продлевает срок службы двигателя.",
                "part_number": "02/100284",
                "brand": "JCB",
                "category": "Двигатель",
                "price": 1200,
                "image_url": "/images/oil-filter.jpg",
                "slug": "maslyanyj-filtr-jcb-02-100284",
                "in_stock": True,
                "stock_quantity": 25,
                "created_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Коленвал JCB 320/03336",
                "description": "Коленчатый вал для двигателей JCB. Высокое качество изготовления, точное соответствие оригинальным спецификациям.",
                "part_number": "320/03336",
                "brand": "JCB",
                "category": "Двигатель",
                "price": 95000,
                "image_url": "/images/crankshaft.jpg",
                "slug": "kolenval-jcb-320-03336",
                "in_stock": True,
                "stock_quantity": 3,
                "created_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Гидронасос основной JCB 20/925592",
                "description": "Основной гидравлический насос для экскаваторов JCB. Обеспечивает стабильную работу гидросистемы.",
                "part_number": "20/925592",
                "brand": "JCB",
                "category": "Гидравлика", 
                "price": 185000,
                "image_url": "/images/hydraulic-pump.jpg",
                "slug": "gidronasos-osnovnoj-jcb-20-925592",
                "in_stock": True,
                "stock_quantity": 2,
                "created_at": datetime.now().isoformat()
            }
        ]
        save_json(PRODUCTS_FILE, products)

    # Initialize users
    if not os.path.exists(USERS_FILE):
        password_hash = bcrypt.hashpw("Sashanata1/".encode(), bcrypt.gensalt()).decode()
        users = [
            {
                "id": str(uuid.uuid4()),
                "username": "bluxs",
                "email": "admin@nexx.ru",
                "password_hash": password_hash,
                "name": "Администратор NEXX",
                "role": "admin",
                "created_at": datetime.now().isoformat()
            }
        ]
        save_json(USERS_FILE, users)

    # Initialize empty collections
    if not os.path.exists(ORDERS_FILE):
        save_json(ORDERS_FILE, [])
    
    if not os.path.exists(CART_FILE):
        save_json(CART_FILE, {})
    
    if not os.path.exists(SETTINGS_FILE):
        settings = {
            "site_name": "NEXX",
            "site_description": "Оригинальные запчасти JCB",
            "currency": "RUB",
            "tax_rate": 0.2,
            "shipping_cost": 500
        }
        save_json(SETTINGS_FILE, settings)

# Database operations
class Database:
    
    @staticmethod
    def get_products():
        return load_json(PRODUCTS_FILE, [])
    
    @staticmethod
    def get_product(product_id):
        products = Database.get_products()
        return next((p for p in products if p["id"] == product_id), None)
    
    @staticmethod
    def add_product(product_data):
        products = Database.get_products()
        product = {
            "id": str(uuid.uuid4()),
            **product_data,
            "created_at": datetime.now().isoformat()
        }
        products.append(product)
        save_json(PRODUCTS_FILE, products)
        return product
    
    @staticmethod
    def update_product(product_id, product_data):
        products = Database.get_products()
        for i, product in enumerate(products):
            if product["id"] == product_id:
                products[i].update({
                    **product_data,
                    "updated_at": datetime.now().isoformat()
                })
                save_json(PRODUCTS_FILE, products)
                return products[i]
        return None
    
    @staticmethod
    def delete_product(product_id):
        products = Database.get_products()
        products = [p for p in products if p["id"] != product_id]
        save_json(PRODUCTS_FILE, products)
        return True
    
    @staticmethod
    def get_users():
        return load_json(USERS_FILE, [])
    
    @staticmethod
    def get_user_by_username(username):
        users = Database.get_users()
        return next((u for u in users if u["username"] == username or u["email"] == username), None)
    
    @staticmethod
    def add_user(user_data):
        users = Database.get_users()
        user = {
            "id": str(uuid.uuid4()),
            **user_data,
            "created_at": datetime.now().isoformat()
        }
        users.append(user)
        save_json(USERS_FILE, users)
        return user
    
    @staticmethod
    def get_cart(user_id):
        carts = load_json(CART_FILE, {})
        return carts.get(user_id, [])
    
    @staticmethod
    def add_to_cart(user_id, product_id, quantity=1):
        carts = load_json(CART_FILE, {})
        if user_id not in carts:
            carts[user_id] = []
        
        # Check if product already in cart
        for item in carts[user_id]:
            if item["product_id"] == product_id:
                item["quantity"] += quantity
                save_json(CART_FILE, carts)
                return carts[user_id]
        
        # Add new item
        product = Database.get_product(product_id)
        if product:
            cart_item = {
                "id": str(uuid.uuid4()),
                "product_id": product_id,
                "product_name": product["name"],
                "product_price": product["price"],
                "quantity": quantity,
                "added_at": datetime.now().isoformat()
            }
            carts[user_id].append(cart_item)
            save_json(CART_FILE, carts)
        
        return carts[user_id]
    
    @staticmethod
    def update_cart_item(user_id, item_id, quantity):
        carts = load_json(CART_FILE, {})
        if user_id in carts:
            for item in carts[user_id]:
                if item["id"] == item_id:
                    if quantity <= 0:
                        carts[user_id] = [i for i in carts[user_id] if i["id"] != item_id]
                    else:
                        item["quantity"] = quantity
                    save_json(CART_FILE, carts)
                    break
        return carts.get(user_id, [])
    
    @staticmethod
    def remove_from_cart(user_id, item_id):
        carts = load_json(CART_FILE, {})
        if user_id in carts:
            carts[user_id] = [i for i in carts[user_id] if i["id"] != item_id]
            save_json(CART_FILE, carts)
        return carts.get(user_id, [])
    
    @staticmethod
    def clear_cart(user_id):
        carts = load_json(CART_FILE, {})
        if user_id in carts:
            carts[user_id] = []
            save_json(CART_FILE, carts)
        return []
    
    @staticmethod
    def get_orders():
        return load_json(ORDERS_FILE, [])
    
    @staticmethod
    def add_order(order_data):
        orders = Database.get_orders()
        order = {
            "id": str(uuid.uuid4()),
            "order_number": f"NEXX-{len(orders) + 1:06d}",
            **order_data,
            "status": "pending",
            "created_at": datetime.now().isoformat()
        }
        orders.append(order)
        save_json(ORDERS_FILE, orders)
        return order

# Initialize database on import
init_database()