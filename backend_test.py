#!/usr/bin/env python3
"""
Comprehensive Backend Testing for NEXX E-Commerce Supplier Management System
Tests all API endpoints with realistic Russian data
"""

import requests
import json
import uuid
from datetime import datetime
import time

# Backend URL from environment
BACKEND_URL = "https://ecom-nexx.preview.emergentagent.com/api"

class NEXXBackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_suppliers = []
        self.created_products = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_api_health(self):
        """Test basic API connectivity"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                self.log_test("API Health Check", True, f"API responding: {data.get('message', 'OK')}")
                return True
            else:
                self.log_test("API Health Check", False, f"API returned status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection failed: {str(e)}")
            return False
    
    def test_supplier_crud(self):
        """Test complete Supplier CRUD operations"""
        print("\n=== TESTING SUPPLIER MANAGEMENT API ===")
        
        # Test data with realistic Russian supplier information
        supplier_data = {
            "name": "ООО Автозапчасти Москва",
            "description": "Крупный поставщик автозапчастей и комплектующих для легковых и грузовых автомобилей",
            "status": "active",
            "rating": 4.5,
            "api_config": {
                "api_type": "rest",
                "base_url": "https://api.avtozapchasti-moscow.ru/v1",
                "api_key": "ak_test_12345678901234567890",
                "additional_headers": {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                "timeout": 30,
                "rate_limit": 100
            },
            "pricing_config": {
                "markup_percentage": 25.0,
                "min_markup_amount": 500.0,
                "currency": "RUB"
            },
            "supported_brands": ["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Toyota"],
            "delivery_time_days": 3
        }
        
        # 1. CREATE Supplier
        try:
            response = self.session.post(f"{self.base_url}/suppliers", json=supplier_data)
            if response.status_code == 200:
                created_supplier = response.json()
                supplier_id = created_supplier["id"]
                self.created_suppliers.append(supplier_id)
                self.log_test("Create Supplier", True, f"Supplier created with ID: {supplier_id}")
                
                # Verify all fields are correctly saved
                if (created_supplier["name"] == supplier_data["name"] and 
                    created_supplier["rating"] == supplier_data["rating"] and
                    created_supplier["api_config"]["api_key"] == supplier_data["api_config"]["api_key"]):
                    self.log_test("Supplier Data Integrity", True, "All supplier fields saved correctly")
                else:
                    self.log_test("Supplier Data Integrity", False, "Some supplier fields not saved correctly")
                    
            else:
                self.log_test("Create Supplier", False, f"Failed with status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Create Supplier", False, f"Exception: {str(e)}")
            return False
        
        # 2. READ Supplier by ID
        try:
            response = self.session.get(f"{self.base_url}/suppliers/{supplier_id}")
            if response.status_code == 200:
                supplier = response.json()
                self.log_test("Get Supplier by ID", True, f"Retrieved supplier: {supplier['name']}")
            else:
                self.log_test("Get Supplier by ID", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Get Supplier by ID", False, f"Exception: {str(e)}")
        
        # 3. READ All Suppliers
        try:
            response = self.session.get(f"{self.base_url}/suppliers")
            if response.status_code == 200:
                suppliers = response.json()
                self.log_test("Get All Suppliers", True, f"Retrieved {len(suppliers)} suppliers")
                
                # Test filtering by status
                response = self.session.get(f"{self.base_url}/suppliers?status=active")
                if response.status_code == 200:
                    active_suppliers = response.json()
                    self.log_test("Filter Suppliers by Status", True, f"Retrieved {len(active_suppliers)} active suppliers")
                else:
                    self.log_test("Filter Suppliers by Status", False, f"Failed with status {response.status_code}")
                    
            else:
                self.log_test("Get All Suppliers", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Get All Suppliers", False, f"Exception: {str(e)}")
        
        # 4. UPDATE Supplier
        update_data = {
            "rating": 4.8,
            "description": "Обновленное описание: Ведущий поставщик автозапчастей с расширенным ассортиментом",
            "delivery_time_days": 2
        }
        
        try:
            response = self.session.put(f"{self.base_url}/suppliers/{supplier_id}", json=update_data)
            if response.status_code == 200:
                updated_supplier = response.json()
                if updated_supplier["rating"] == 4.8 and updated_supplier["delivery_time_days"] == 2:
                    self.log_test("Update Supplier", True, "Supplier updated successfully")
                else:
                    self.log_test("Update Supplier", False, "Update data not reflected correctly")
            else:
                self.log_test("Update Supplier", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Update Supplier", False, f"Exception: {str(e)}")
        
        # 5. Test API Connection
        try:
            response = self.session.post(f"{self.base_url}/suppliers/{supplier_id}/test-connection")
            if response.status_code == 200:
                test_result = response.json()
                self.log_test("Test Supplier API Connection", True, f"Connection test: {test_result['status']}")
            else:
                self.log_test("Test Supplier API Connection", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Test Supplier API Connection", False, f"Exception: {str(e)}")
        
        return True
    
    def test_product_management(self):
        """Test Product Management API"""
        print("\n=== TESTING PRODUCT MANAGEMENT API ===")
        
        # Test data with realistic Russian auto parts
        products_data = [
            {
                "name": "Тормозные колодки передние",
                "description": "Высококачественные тормозные колодки для передних тормозов",
                "part_number": "BP-001-BMW-F30",
                "brand": "BMW",
                "category": "Тормозная система",
                "base_price": 8500.0,
                "image_url": "https://example.com/brake-pads.jpg"
            },
            {
                "name": "Масляный фильтр",
                "description": "Оригинальный масляный фильтр для двигателей Mercedes",
                "part_number": "OF-002-MB-W204",
                "brand": "Mercedes-Benz", 
                "category": "Система смазки",
                "base_price": 1200.0
            },
            {
                "name": "Амортизатор задний",
                "description": "Газомасляный амортизатор задней подвески",
                "part_number": "SA-003-AUDI-A4",
                "brand": "Audi",
                "category": "Подвеска",
                "base_price": 12000.0
            }
        ]
        
        # Create products
        for product_data in products_data:
            try:
                response = self.session.post(f"{self.base_url}/products", json=product_data)
                if response.status_code == 200:
                    created_product = response.json()
                    product_id = created_product["id"]
                    self.created_products.append(product_id)
                    self.log_test("Create Product", True, f"Product '{product_data['name']}' created with ID: {product_id}")
                else:
                    self.log_test("Create Product", False, f"Failed to create '{product_data['name']}': {response.status_code}")
            except Exception as e:
                self.log_test("Create Product", False, f"Exception creating '{product_data['name']}': {str(e)}")
        
        # Test getting all products
        try:
            response = self.session.get(f"{self.base_url}/products")
            if response.status_code == 200:
                products = response.json()
                self.log_test("Get All Products", True, f"Retrieved {len(products)} products")
                
                # Test filtering by brand
                response = self.session.get(f"{self.base_url}/products?brand=BMW")
                if response.status_code == 200:
                    bmw_products = response.json()
                    self.log_test("Filter Products by Brand", True, f"Retrieved {len(bmw_products)} BMW products")
                else:
                    self.log_test("Filter Products by Brand", False, f"Failed with status {response.status_code}")
                    
            else:
                self.log_test("Get All Products", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Get All Products", False, f"Exception: {str(e)}")
        
        # Test getting product by ID
        if self.created_products:
            try:
                product_id = self.created_products[0]
                response = self.session.get(f"{self.base_url}/products/{product_id}")
                if response.status_code == 200:
                    product = response.json()
                    self.log_test("Get Product by ID", True, f"Retrieved product: {product['name']}")
                else:
                    self.log_test("Get Product by ID", False, f"Failed with status {response.status_code}")
            except Exception as e:
                self.log_test("Get Product by ID", False, f"Exception: {str(e)}")
        
        return True
    
    def test_supplier_offers(self):
        """Test Supplier Offers API"""
        print("\n=== TESTING SUPPLIER OFFERS API ===")
        
        if not self.created_products:
            self.log_test("Supplier Offers Test", False, "No products available for testing offers")
            return False
        
        # Test getting offers for each product
        for product_id in self.created_products:
            try:
                response = self.session.get(f"{self.base_url}/products/{product_id}/offers")
                if response.status_code == 200:
                    offers_data = response.json()
                    if offers_data.get("success") and offers_data.get("data"):
                        offers = offers_data["data"]
                        self.log_test("Get Product Offers", True, f"Retrieved {len(offers)} offers for product {product_id}")
                        
                        # Validate offer structure
                        if offers:
                            offer = offers[0]
                            required_fields = ["supplier_id", "supplier_name", "wholesale_price", "client_price", 
                                             "stock_quantity", "delivery_time_days", "supplier_rating"]
                            
                            missing_fields = [field for field in required_fields if field not in offer]
                            if not missing_fields:
                                self.log_test("Offer Data Structure", True, "All required fields present in offers")
                                
                                # Validate pricing logic (client_price should be higher than wholesale_price)
                                if offer["client_price"] > offer["wholesale_price"]:
                                    self.log_test("Pricing Logic", True, "Client price correctly higher than wholesale price")
                                else:
                                    self.log_test("Pricing Logic", False, "Client price not higher than wholesale price")
                            else:
                                self.log_test("Offer Data Structure", False, f"Missing fields: {missing_fields}")
                    else:
                        self.log_test("Get Product Offers", False, "Invalid response structure")
                else:
                    self.log_test("Get Product Offers", False, f"Failed with status {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Get Product Offers", False, f"Exception: {str(e)}")
        
        return True
    
    def test_payment_systems(self):
        """Test Payment Systems API"""
        print("\n=== TESTING PAYMENT SYSTEMS API ===")
        
        # Test payment settings creation
        payment_settings_data = [
            {
                "provider": "yoomoney",
                "merchant_id": "123456789",
                "secret_key": "test_secret_key_yoomoney_12345",
                "webhook_url": "https://ecom-nexx.preview.emergentagent.com/api/webhooks/yoomoney",
                "active": True
            },
            {
                "provider": "sberbank",
                "merchant_id": "sber_merchant_001",
                "secret_key": "test_secret_key_sberbank_67890",
                "webhook_url": "https://ecom-nexx.preview.emergentagent.com/api/webhooks/sberbank",
                "active": True
            },
            {
                "provider": "tinkoff",
                "merchant_id": "tinkoff_terminal_001",
                "secret_key": "test_secret_key_tinkoff_54321",
                "webhook_url": "https://ecom-nexx.preview.emergentagent.com/api/webhooks/tinkoff",
                "active": False
            }
        ]
        
        # Create payment settings
        for settings_data in payment_settings_data:
            try:
                response = self.session.post(f"{self.base_url}/payments/settings", json=settings_data)
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success"):
                        self.log_test("Create Payment Settings", True, f"Payment settings for {settings_data['provider']} created successfully")
                    else:
                        self.log_test("Create Payment Settings", False, f"Failed to create payment settings for {settings_data['provider']}")
                else:
                    self.log_test("Create Payment Settings", False, f"Failed with status {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Create Payment Settings", False, f"Exception: {str(e)}")
        
        # Get payment settings
        try:
            response = self.session.get(f"{self.base_url}/payments/settings")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    settings = result["data"]
                    self.log_test("Get Payment Settings", True, f"Retrieved {len(settings)} payment settings")
                    
                    # Verify we have the expected providers
                    providers = [s.get("provider") for s in settings]
                    expected_providers = ["yoomoney", "sberbank", "tinkoff"]
                    if all(provider in providers for provider in expected_providers):
                        self.log_test("Payment Providers Validation", True, "All expected payment providers found")
                    else:
                        self.log_test("Payment Providers Validation", False, f"Missing providers. Found: {providers}")
                else:
                    self.log_test("Get Payment Settings", False, "Invalid response structure")
            else:
                self.log_test("Get Payment Settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Payment Settings", False, f"Exception: {str(e)}")
        
        # Test payment creation
        payment_data = {
            "order_id": str(uuid.uuid4()),
            "amount": 15000.0,
            "currency": "RUB",
            "description": "Оплата заказа автозапчастей NEXX",
            "return_url": "https://ecom-nexx.preview.emergentagent.com/payment/success",
            "payment_method": "card"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/payments/create", json=payment_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("payment_id"):
                    self.log_test("Create Payment", True, f"Payment created with ID: {result['payment_id']}")
                    if result.get("confirmation_url"):
                        self.log_test("Payment Confirmation URL", True, "Payment confirmation URL generated")
                    else:
                        self.log_test("Payment Confirmation URL", False, "No confirmation URL in response")
                else:
                    self.log_test("Create Payment", False, "Invalid payment creation response")
            else:
                # Payment creation might fail due to missing YooMoney service - this is expected
                self.log_test("Create Payment", False, f"Payment creation failed (expected if YooMoney not configured): {response.status_code}")
        except Exception as e:
            self.log_test("Create Payment", False, f"Exception (expected if YooMoney not configured): {str(e)}")
        
        return True
    
    def test_abcp_integration(self):
        """Test ABCP Integration API"""
        print("\n=== TESTING ABCP INTEGRATION API ===")
        
        # Test ABCP settings creation
        abcp_settings = {
            "username": "test_abcp_user",
            "password": "test_abcp_password_123",
            "host": "api.abcp.ru",
            "active": True
        }
        
        try:
            response = self.session.post(f"{self.base_url}/suppliers/abcp/settings", json=abcp_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Create ABCP Settings", True, "ABCP settings created successfully")
                else:
                    self.log_test("Create ABCP Settings", False, "Failed to create ABCP settings")
            else:
                self.log_test("Create ABCP Settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create ABCP Settings", False, f"Exception: {str(e)}")
        
        # Test ABCP connection
        try:
            response = self.session.get(f"{self.base_url}/suppliers/abcp/test")
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Test ABCP Connection", True, "ABCP connection test successful")
                else:
                    self.log_test("Test ABCP Connection", False, "ABCP connection test failed")
            else:
                # Connection test might fail if ABCP service not properly configured - this is expected
                self.log_test("Test ABCP Connection", False, f"ABCP connection test failed (expected if not configured): {response.status_code}")
        except Exception as e:
            self.log_test("Test ABCP Connection", False, f"Exception (expected if ABCP not configured): {str(e)}")
        
        return True
    
    def test_new_supplier_api(self):
        """Test New Supplier API endpoints"""
        print("\n=== TESTING NEW SUPPLIER API ===")
        
        # Test creating supplier with new API structure
        supplier_data = {
            "name": "ООО АБЦП Поставщик",
            "api_type": "abcp",
            "api_credentials": {
                "username": "abcp_supplier_user",
                "password": "abcp_supplier_pass",
                "host": "api.abcp.ru"
            },
            "markup_percentage": 15.0,
            "delivery_days": 2,
            "min_order_amount": 1000.0,
            "active": True
        }
        
        try:
            response = self.session.post(f"{self.base_url}/suppliers", json=supplier_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    supplier = result["data"]
                    supplier_id = supplier.get("id")
                    self.created_suppliers.append(supplier_id)
                    self.log_test("Create New Supplier", True, f"New supplier created with ID: {supplier_id}")
                    
                    # Validate supplier data structure
                    if (supplier.get("name") == supplier_data["name"] and 
                        supplier.get("api_type") == supplier_data["api_type"] and
                        supplier.get("markup_percentage") == supplier_data["markup_percentage"]):
                        self.log_test("New Supplier Data Integrity", True, "All supplier fields saved correctly")
                    else:
                        self.log_test("New Supplier Data Integrity", False, "Some supplier fields not saved correctly")
                else:
                    self.log_test("Create New Supplier", False, "Invalid response structure")
            else:
                self.log_test("Create New Supplier", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create New Supplier", False, f"Exception: {str(e)}")
        
        # Test getting suppliers with new API structure
        try:
            response = self.session.get(f"{self.base_url}/suppliers")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    suppliers = result["data"]
                    self.log_test("Get New Suppliers", True, f"Retrieved {len(suppliers)} suppliers")
                else:
                    self.log_test("Get New Suppliers", False, "Invalid response structure")
            else:
                self.log_test("Get New Suppliers", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get New Suppliers", False, f"Exception: {str(e)}")
        
        return True
    
    def test_site_settings(self):
        """Test Site Settings API"""
        print("\n=== TESTING SITE SETTINGS API ===")
        
        # Test site settings update
        site_settings = {
            "company_name": "NEXX Автозапчасти",
            "company_inn": "7701234567",
            "company_address": "г. Москва, ул. Автозаводская, д. 123",
            "company_phone": "+7 (495) 123-45-67",
            "company_email": "info@nexx-auto.ru",
            "logo_url": "https://nexx-auto.ru/logo.png",
            "primary_color": "#1e40af",
            "secondary_color": "#64748b",
            "meta_title": "NEXX - Автозапчасти и комплектующие",
            "meta_description": "Интернет-магазин автозапчастей NEXX. Широкий ассортимент качественных запчастей для всех марок автомобилей."
        }
        
        try:
            response = self.session.post(f"{self.base_url}/settings/site", json=site_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    settings = result["data"]
                    self.log_test("Update Site Settings", True, f"Site settings updated for company: {settings.get('company_name')}")
                    
                    # Validate settings data
                    if (settings.get("company_name") == site_settings["company_name"] and
                        settings.get("company_inn") == site_settings["company_inn"] and
                        settings.get("primary_color") == site_settings["primary_color"]):
                        self.log_test("Site Settings Data Integrity", True, "All site settings saved correctly")
                    else:
                        self.log_test("Site Settings Data Integrity", False, "Some site settings not saved correctly")
                else:
                    self.log_test("Update Site Settings", False, "Invalid response structure")
            else:
                self.log_test("Update Site Settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Update Site Settings", False, f"Exception: {str(e)}")
        
        # Test getting site settings
        try:
            response = self.session.get(f"{self.base_url}/settings/site")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    settings = result["data"]
                    self.log_test("Get Site Settings", True, f"Retrieved site settings for: {settings.get('company_name', 'Unknown')}")
                else:
                    self.log_test("Get Site Settings", False, "Invalid response structure")
            else:
                self.log_test("Get Site Settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Site Settings", False, f"Exception: {str(e)}")
        
        return True
    
    def test_analytics_dashboard(self):
        """Test Analytics Dashboard API"""
        print("\n=== TESTING ANALYTICS DASHBOARD API ===")
        
        try:
            response = self.session.get(f"{self.base_url}/analytics/dashboard")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    analytics = result["data"]
                    self.log_test("Get Dashboard Analytics", True, "Analytics data retrieved successfully")
                    
                    # Validate analytics structure
                    required_sections = ["orders", "revenue", "products", "users"]
                    missing_sections = [section for section in required_sections if section not in analytics]
                    
                    if not missing_sections:
                        self.log_test("Analytics Data Structure", True, "All required analytics sections present")
                        
                        # Validate each section has required fields
                        orders = analytics.get("orders", {})
                        if all(field in orders for field in ["total", "today", "pending", "completed"]):
                            self.log_test("Orders Analytics", True, f"Orders analytics: {orders['total']} total orders")
                        else:
                            self.log_test("Orders Analytics", False, "Missing fields in orders analytics")
                        
                        products = analytics.get("products", {})
                        if all(field in products for field in ["total", "low_stock", "out_of_stock"]):
                            self.log_test("Products Analytics", True, f"Products analytics: {products['total']} total products")
                        else:
                            self.log_test("Products Analytics", False, "Missing fields in products analytics")
                        
                        users = analytics.get("users", {})
                        if all(field in users for field in ["total", "new_today", "active"]):
                            self.log_test("Users Analytics", True, f"Users analytics: {users['total']} total users")
                        else:
                            self.log_test("Users Analytics", False, "Missing fields in users analytics")
                            
                    else:
                        self.log_test("Analytics Data Structure", False, f"Missing sections: {missing_sections}")
                else:
                    self.log_test("Get Dashboard Analytics", False, "Invalid response structure")
            else:
                self.log_test("Get Dashboard Analytics", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Dashboard Analytics", False, f"Exception: {str(e)}")
        
        return True
    
    def test_error_handling(self):
        """Test API error handling"""
        print("\n=== TESTING ERROR HANDLING ===")
        
        # Test 404 errors
        fake_id = str(uuid.uuid4())
        
        # Test non-existent supplier
        try:
            response = self.session.get(f"{self.base_url}/suppliers/{fake_id}")
            if response.status_code == 404:
                self.log_test("404 Error Handling - Supplier", True, "Correctly returns 404 for non-existent supplier")
            else:
                self.log_test("404 Error Handling - Supplier", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("404 Error Handling - Supplier", False, f"Exception: {str(e)}")
        
        # Test non-existent product
        try:
            response = self.session.get(f"{self.base_url}/products/{fake_id}")
            if response.status_code == 404:
                self.log_test("404 Error Handling - Product", True, "Correctly returns 404 for non-existent product")
            else:
                self.log_test("404 Error Handling - Product", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("404 Error Handling - Product", False, f"Exception: {str(e)}")
        
        # Test invalid data validation
        invalid_supplier = {
            "name": "",  # Empty name should fail
            "rating": 6.0,  # Rating > 5 should fail
            "api_config": {
                "api_type": "invalid_type",  # Invalid API type
                "base_url": "not_a_url",
                "api_key": ""
            },
            "pricing_config": {
                "markup_percentage": -10.0,  # Negative markup should fail
                "currency": "RUB"
            },
            "delivery_time_days": -1  # Negative delivery time should fail
        }
        
        try:
            response = self.session.post(f"{self.base_url}/suppliers", json=invalid_supplier)
            if response.status_code == 422:  # FastAPI validation error
                self.log_test("Data Validation", True, "Correctly rejects invalid supplier data")
            else:
                self.log_test("Data Validation", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_test("Data Validation", False, f"Exception: {str(e)}")
    
    def cleanup(self):
        """Clean up test data"""
        print("\n=== CLEANING UP TEST DATA ===")
        
        # Delete created suppliers
        for supplier_id in self.created_suppliers:
            try:
                response = self.session.delete(f"{self.base_url}/suppliers/{supplier_id}")
                if response.status_code == 200:
                    self.log_test("Cleanup Supplier", True, f"Deleted supplier {supplier_id}")
                else:
                    self.log_test("Cleanup Supplier", False, f"Failed to delete supplier {supplier_id}")
            except Exception as e:
                self.log_test("Cleanup Supplier", False, f"Exception deleting supplier {supplier_id}: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting NEXX E-Commerce Extended Backend API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Run tests in sequence
        if not self.test_api_health():
            print("❌ API Health Check failed - aborting tests")
            return False
        
        # Test existing functionality
        self.test_supplier_crud()
        self.test_product_management()
        self.test_supplier_offers()
        
        # Test new extended functionality
        self.test_payment_systems()
        self.test_abcp_integration()
        self.test_new_supplier_api()
        self.test_site_settings()
        self.test_analytics_dashboard()
        
        # Test error handling
        self.test_error_handling()
        
        # Cleanup
        self.cleanup()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["success"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = NEXXBackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend API is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        exit(1)