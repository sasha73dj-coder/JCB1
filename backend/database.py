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
PAGES_FILE = f"{DATA_DIR}/pages.json"
MEDIA_FILE = f"{DATA_DIR}/media.json"
ONEC_SETTINGS_FILE = f"{DATA_DIR}/1c_settings.json"
ONEC_SYNC_FILE = f"{DATA_DIR}/1c_sync.json"
SEO_SETTINGS_FILE = f"{DATA_DIR}/seo_settings.json"

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
    
    # Платежные системы
    @staticmethod
    def get_payment_settings():
        return load_json(PAYMENT_SETTINGS_FILE, [])
    
    @staticmethod
    def add_payment_settings(payment_data):
        settings = Database.get_payment_settings()
        payment_settings = {
            "id": str(uuid.uuid4()),
            **payment_data,
            "created_at": datetime.now().isoformat()
        }
        settings.append(payment_settings)
        save_json(PAYMENT_SETTINGS_FILE, settings)
        return payment_settings
    
    @staticmethod
    def get_payments():
        return load_json(PAYMENTS_FILE, [])
    
    @staticmethod
    def add_payment(payment_data):
        payments = Database.get_payments()
        payment = {
            "id": str(uuid.uuid4()),
            **payment_data,
            "created_at": datetime.now().isoformat()
        }
        payments.append(payment)
        save_json(PAYMENTS_FILE, payments)
        return payment
    
    @staticmethod
    def update_payment_status(payment_id, status):
        payments = Database.get_payments()
        for payment in payments:
            if payment.get("payment_id") == payment_id:
                payment["status"] = status
                payment["updated_at"] = datetime.now().isoformat()
                save_json(PAYMENTS_FILE, payments)
                return payment
        return None
    
    # Поставщики
    @staticmethod
    def get_suppliers():
        return load_json(SUPPLIERS_FILE, [])
    
    @staticmethod
    def add_supplier(supplier_data):
        suppliers = Database.get_suppliers()
        supplier = {
            "id": str(uuid.uuid4()),
            **supplier_data,
            "created_at": datetime.now().isoformat()
        }
        suppliers.append(supplier)
        save_json(SUPPLIERS_FILE, suppliers)
        return supplier
    
    @staticmethod
    def get_abcp_settings():
        settings = load_json(ABCP_SETTINGS_FILE, {})
        return settings
    
    @staticmethod
    def add_abcp_settings(settings_data):
        settings = {
            "id": str(uuid.uuid4()),
            **settings_data,
            "updated_at": datetime.now().isoformat()
        }
        save_json(ABCP_SETTINGS_FILE, settings)
        return settings
    
    # Настройки сайта
    @staticmethod
    def get_site_settings():
        settings = load_json(SITE_SETTINGS_FILE, {
            "company_name": "NEXX Auto Parts",
            "company_phone": "+7 (495) 123-45-67",
            "company_email": "info@nexx-auto.ru",
            "logo_url": "/logo.png",
            "primary_color": "#1e40af",
            "secondary_color": "#64748b",
            "meta_title": "NEXX - Автозапчасти онлайн",
            "meta_description": "Широкий выбор автозапчастей с доставкой по России"
        })
        return settings
    
    @staticmethod
    def update_site_settings(settings_data):
        current_settings = Database.get_site_settings()
        current_settings.update(settings_data)
        current_settings["updated_at"] = datetime.now().isoformat()
        save_json(SITE_SETTINGS_FILE, current_settings)
        return current_settings
    
    # Расширенные методы для пользователей
    @staticmethod
    def get_user_by_phone(phone):
        """Получить пользователя по номеру телефона"""
        users = Database.get_users()
        for user in users:
            if user.get("phone") == phone:
                return user
        return None
    
    @staticmethod
    def get_user_by_email(email):
        """Получить пользователя по email"""
        users = Database.get_users()
        for user in users:
            if user.get("email") == email:
                return user
        return None
    
    @staticmethod
    def get_user_by_id(user_id):
        """Получить пользователя по ID"""
        users = Database.get_users()
        for user in users:
            if user.get("id") == user_id:
                return user
        return None
    
    @staticmethod
    def update_user(user_id, update_data):
        """Обновить пользователя"""
        users = Database.get_users()
        for i, user in enumerate(users):
            if user.get("id") == user_id:
                users[i].update(update_data)
                save_json(USERS_FILE, users)
                return users[i]
        return None
    
    @staticmethod
    def delete_user(user_id):
        """Удалить пользователя"""
        users = Database.get_users()
        for i, user in enumerate(users):
            if user.get("id") == user_id:
                users.pop(i)
                save_json(USERS_FILE, users)
                return True
        return False
    
    # Управление страницами
    @staticmethod
    def get_pages():
        """Получить все страницы"""
        return load_json(PAGES_FILE, [])
    
    @staticmethod
    def add_page(page_data):
        """Добавить страницу"""
        pages = Database.get_pages()
        page = {
            "id": str(uuid.uuid4()),
            **page_data
        }
        pages.append(page)
        save_json(PAGES_FILE, pages)
        return page
    
    @staticmethod
    def get_page_by_slug(slug):
        """Получить страницу по slug"""
        pages = Database.get_pages()
        for page in pages:
            if page.get("slug") == slug:
                return page
        return None
    
    @staticmethod
    def update_page(page_id, update_data):
        """Обновить страницу"""
        pages = Database.get_pages()
        for i, page in enumerate(pages):
            if page.get("id") == page_id:
                pages[i].update(update_data)
                save_json(PAGES_FILE, pages)
                return pages[i]
        return None
    
    @staticmethod
    def delete_page(page_id):
        """Удалить страницу"""
        pages = Database.get_pages()
        for i, page in enumerate(pages):
            if page.get("id") == page_id:
                pages.pop(i)
                save_json(PAGES_FILE, pages)
                return True
        return False
    
    # Управление медиафайлами
    @staticmethod
    def get_media_files():
        """Получить все медиафайлы"""
        return load_json(MEDIA_FILE, [])
    
    @staticmethod
    def add_media_file(file_data):
        """Добавить медиафайл"""
        files = Database.get_media_files()
        files.append(file_data)
        save_json(MEDIA_FILE, files)
        return file_data
    
    # 1C интеграция
    @staticmethod
    def get_1c_settings():
        """Получить настройки 1C"""
        return load_json(ONEC_SETTINGS_FILE, {})
    
    @staticmethod
    def save_1c_settings(settings_data):
        """Сохранить настройки 1C"""
        save_json(ONEC_SETTINGS_FILE, settings_data)
        return settings_data
    
    @staticmethod
    def get_1c_sync_history():
        """Получить историю синхронизации 1C"""
        return load_json(ONEC_SYNC_FILE, [])
    
    @staticmethod
    def save_1c_sync_log(sync_data):
        """Сохранить лог синхронизации 1C"""
        history = Database.get_1c_sync_history()
        history.append(sync_data)
        # Оставляем только последние 100 записей
        if len(history) > 100:
            history = history[-100:]
        save_json(ONEC_SYNC_FILE, history)
        return sync_data
    
    # SEO настройки
    @staticmethod
    def get_seo_settings():
        """Получить SEO настройки"""
        return load_json(SEO_SETTINGS_FILE, {
            "sitemap_enabled": True,
            "structured_data": True,
            "open_graph": True
        })
    
    @staticmethod
    def save_seo_settings(settings_data):
        """Сохранить SEO настройки"""
        save_json(SEO_SETTINGS_FILE, settings_data)
        return settings_data

# Initialize database on import
init_database()