#!/usr/bin/env python3
"""
Extended Backend Testing for NEXX E-Commerce - New Features
Tests the specific new endpoints mentioned in the review request
"""

import requests
import json
import uuid
from datetime import datetime
import time

# Backend URL from environment
BACKEND_URL = "https://ecom-nexx.preview.emergentagent.com/api"

class NEXXExtendedTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        
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
    
    def test_payment_systems_endpoints(self):
        """Test Payment Systems endpoints with exact test data"""
        print("\n=== TESTING PAYMENT SYSTEMS ENDPOINTS ===")
        
        # Test data from review request
        yoomoney_settings = {
            "provider": "yoomoney",
            "merchant_id": "test_shop_123",
            "secret_key": "test_secret_key_456",
            "webhook_url": "https://example.com/webhook",
            "active": True
        }
        
        # 1. POST /api/payments/settings - YooMoney
        try:
            response = self.session.post(f"{self.base_url}/payments/settings", json=yoomoney_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    self.log_test("POST /api/payments/settings (YooMoney)", True, "YooMoney settings created successfully")
                    
                    # Verify data integrity
                    data = result["data"]
                    if (data.get("provider") == "yoomoney" and 
                        data.get("merchant_id") == "test_shop_123" and
                        data.get("active") == True):
                        self.log_test("YooMoney Settings Data Integrity", True, "All YooMoney fields saved correctly")
                    else:
                        self.log_test("YooMoney Settings Data Integrity", False, "YooMoney data not saved correctly")
                else:
                    self.log_test("POST /api/payments/settings (YooMoney)", False, "Invalid response structure")
            else:
                self.log_test("POST /api/payments/settings (YooMoney)", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST /api/payments/settings (YooMoney)", False, f"Exception: {str(e)}")
        
        # Add Сбербанк settings
        sberbank_settings = {
            "provider": "sberbank",
            "merchant_id": "sber_merchant_001",
            "secret_key": "sber_secret_key_789",
            "webhook_url": "https://example.com/webhook/sberbank",
            "active": True
        }
        
        try:
            response = self.session.post(f"{self.base_url}/payments/settings", json=sberbank_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("POST /api/payments/settings (Сбербанк)", True, "Сбербанк settings created successfully")
                else:
                    self.log_test("POST /api/payments/settings (Сбербанк)", False, "Failed to create Сбербанк settings")
            else:
                self.log_test("POST /api/payments/settings (Сбербанк)", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/payments/settings (Сбербанк)", False, f"Exception: {str(e)}")
        
        # Add Тинькофф settings
        tinkoff_settings = {
            "provider": "tinkoff",
            "merchant_id": "tinkoff_terminal_001",
            "secret_key": "tinkoff_secret_key_321",
            "webhook_url": "https://example.com/webhook/tinkoff",
            "active": True
        }
        
        try:
            response = self.session.post(f"{self.base_url}/payments/settings", json=tinkoff_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("POST /api/payments/settings (Тинькофф)", True, "Тинькофф settings created successfully")
                else:
                    self.log_test("POST /api/payments/settings (Тинькофф)", False, "Failed to create Тинькофф settings")
            else:
                self.log_test("POST /api/payments/settings (Тинькофф)", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/payments/settings (Тинькофф)", False, f"Exception: {str(e)}")
        
        # 2. GET /api/payments/settings
        try:
            response = self.session.get(f"{self.base_url}/payments/settings")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    settings = result["data"]
                    self.log_test("GET /api/payments/settings", True, f"Retrieved {len(settings)} payment settings")
                    
                    # Verify all three providers are present
                    providers = [s.get("provider") for s in settings]
                    expected_providers = ["yoomoney", "sberbank", "tinkoff"]
                    found_providers = [p for p in expected_providers if p in providers]
                    
                    if len(found_providers) >= 3:
                        self.log_test("Payment Providers Verification", True, f"Found all required providers: {found_providers}")
                    else:
                        self.log_test("Payment Providers Verification", False, f"Missing providers. Found: {found_providers}")
                else:
                    self.log_test("GET /api/payments/settings", False, "Invalid response structure")
            else:
                self.log_test("GET /api/payments/settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/payments/settings", False, f"Exception: {str(e)}")
    
    def test_abcp_integration_endpoints(self):
        """Test ABCP Integration endpoints with exact test data"""
        print("\n=== TESTING ABCP INTEGRATION ENDPOINTS ===")
        
        # Test data from review request
        abcp_settings = {
            "username": "test_user",
            "password": "test_pass",
            "host": "demo.abcp.ru",
            "active": True
        }
        
        # 1. POST /api/suppliers/abcp/settings
        try:
            response = self.session.post(f"{self.base_url}/suppliers/abcp/settings", json=abcp_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    self.log_test("POST /api/suppliers/abcp/settings", True, "ABCP settings configured successfully")
                    
                    # Verify data integrity
                    data = result["data"]
                    if (data.get("username") == "test_user" and 
                        data.get("host") == "demo.abcp.ru" and
                        data.get("active") == True):
                        self.log_test("ABCP Settings Data Integrity", True, "All ABCP fields saved correctly")
                    else:
                        self.log_test("ABCP Settings Data Integrity", False, "ABCP data not saved correctly")
                else:
                    self.log_test("POST /api/suppliers/abcp/settings", False, "Invalid response structure")
            else:
                self.log_test("POST /api/suppliers/abcp/settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST /api/suppliers/abcp/settings", False, f"Exception: {str(e)}")
        
        # 2. GET /api/suppliers/abcp/test
        try:
            response = self.session.get(f"{self.base_url}/suppliers/abcp/test")
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("GET /api/suppliers/abcp/test", True, "ABCP connection test successful")
                    
                    # Check if test result contains expected fields
                    data = result.get("data", {})
                    if "status" in data or "message" in data:
                        self.log_test("ABCP Test Response Structure", True, "Test response contains status information")
                    else:
                        self.log_test("ABCP Test Response Structure", False, "Test response missing status information")
                else:
                    self.log_test("GET /api/suppliers/abcp/test", False, "ABCP connection test failed")
            else:
                self.log_test("GET /api/suppliers/abcp/test", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/suppliers/abcp/test", False, f"Exception: {str(e)}")
    
    def test_supplier_management_endpoints(self):
        """Test Supplier Management endpoints with exact test data"""
        print("\n=== TESTING SUPPLIER MANAGEMENT ENDPOINTS ===")
        
        # Test data from review request
        supplier_data = {
            "name": "ABCP Поставщик Москва",
            "api_type": "abcp",
            "api_credentials": {
                "username": "test_user",
                "password": "test_pass",
                "host": "api.abcp.ru"
            },
            "markup_percentage": 15.0,
            "delivery_days": 2,
            "min_order_amount": 500,
            "active": True
        }
        
        created_supplier_id = None
        
        # 1. POST /api/suppliers
        try:
            response = self.session.post(f"{self.base_url}/suppliers", json=supplier_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    supplier = result["data"]
                    created_supplier_id = supplier.get("id")
                    self.log_test("POST /api/suppliers", True, f"Supplier created with ID: {created_supplier_id}")
                    
                    # Verify data integrity
                    if (supplier.get("name") == "ABCP Поставщик Москва" and 
                        supplier.get("api_type") == "abcp" and
                        supplier.get("markup_percentage") == 15.0 and
                        supplier.get("delivery_days") == 2):
                        self.log_test("Supplier Data Integrity", True, "All supplier fields saved correctly")
                    else:
                        self.log_test("Supplier Data Integrity", False, "Some supplier fields not saved correctly")
                else:
                    self.log_test("POST /api/suppliers", False, "Invalid response structure")
            else:
                self.log_test("POST /api/suppliers", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST /api/suppliers", False, f"Exception: {str(e)}")
        
        # 2. GET /api/suppliers
        try:
            response = self.session.get(f"{self.base_url}/suppliers")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    suppliers = result["data"]
                    self.log_test("GET /api/suppliers", True, f"Retrieved {len(suppliers)} suppliers")
                    
                    # Verify our created supplier is in the list
                    if created_supplier_id:
                        found_supplier = next((s for s in suppliers if s.get("id") == created_supplier_id), None)
                        if found_supplier:
                            self.log_test("Supplier Retrieval Verification", True, "Created supplier found in suppliers list")
                        else:
                            self.log_test("Supplier Retrieval Verification", False, "Created supplier not found in suppliers list")
                else:
                    self.log_test("GET /api/suppliers", False, "Invalid response structure")
            else:
                self.log_test("GET /api/suppliers", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/suppliers", False, f"Exception: {str(e)}")
        
        return created_supplier_id
    
    def test_product_offers_endpoint(self):
        """Test Product Offers endpoint with specific product ID"""
        print("\n=== TESTING PRODUCT OFFERS ENDPOINT ===")
        
        # Use the specific product ID from the review request
        product_id = "d96607c4-9350-40c2-ac84-45285aff098a"
        
        # GET /api/products/{product_id}/offers
        try:
            response = self.session.get(f"{self.base_url}/products/{product_id}/offers")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    offers = result["data"]
                    self.log_test("GET /api/products/{id}/offers", True, f"Retrieved {len(offers)} offers for product {product_id}")
                    
                    # Verify offer structure
                    if offers:
                        offer = offers[0]
                        required_fields = ["supplier_id", "supplier_name", "wholesale_price", "client_price", 
                                         "stock_quantity", "delivery_time_days", "supplier_rating"]
                        
                        missing_fields = [field for field in required_fields if field not in offer]
                        if not missing_fields:
                            self.log_test("Offer Data Structure", True, "All required fields present in offers")
                            
                            # Verify pricing logic
                            if offer["client_price"] >= offer["wholesale_price"]:
                                self.log_test("Offer Pricing Logic", True, "Client price correctly >= wholesale price")
                            else:
                                self.log_test("Offer Pricing Logic", False, "Client price lower than wholesale price")
                        else:
                            self.log_test("Offer Data Structure", False, f"Missing fields: {missing_fields}")
                    else:
                        self.log_test("Offer Data Content", False, "No offers returned")
                else:
                    self.log_test("GET /api/products/{id}/offers", False, "Invalid response structure or no data")
            elif response.status_code == 404:
                self.log_test("GET /api/products/{id}/offers", False, f"Product {product_id} not found - may need to create test product first")
            else:
                self.log_test("GET /api/products/{id}/offers", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/products/{id}/offers", False, f"Exception: {str(e)}")
    
    def test_site_settings_endpoints(self):
        """Test Site Settings endpoints"""
        print("\n=== TESTING SITE SETTINGS ENDPOINTS ===")
        
        # Test site settings data
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
        
        # 1. POST /api/settings/site
        try:
            response = self.session.post(f"{self.base_url}/settings/site", json=site_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    settings = result["data"]
                    self.log_test("POST /api/settings/site", True, f"Site settings updated for company: {settings.get('company_name')}")
                    
                    # Verify data integrity
                    if (settings.get("company_name") == "NEXX Автозапчасти" and
                        settings.get("company_inn") == "7701234567" and
                        settings.get("primary_color") == "#1e40af"):
                        self.log_test("Site Settings Data Integrity", True, "All site settings saved correctly")
                    else:
                        self.log_test("Site Settings Data Integrity", False, "Some site settings not saved correctly")
                else:
                    self.log_test("POST /api/settings/site", False, "Invalid response structure")
            else:
                self.log_test("POST /api/settings/site", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST /api/settings/site", False, f"Exception: {str(e)}")
        
        # 2. GET /api/settings/site
        try:
            response = self.session.get(f"{self.base_url}/settings/site")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    settings = result["data"]
                    self.log_test("GET /api/settings/site", True, f"Retrieved site settings for: {settings.get('company_name', 'Unknown')}")
                    
                    # Verify the settings we just saved are returned
                    if settings.get("company_name") == "NEXX Автозапчасти":
                        self.log_test("Site Settings Persistence", True, "Updated settings correctly persisted")
                    else:
                        self.log_test("Site Settings Persistence", False, "Updated settings not persisted correctly")
                else:
                    self.log_test("GET /api/settings/site", False, "Invalid response structure")
            else:
                self.log_test("GET /api/settings/site", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/settings/site", False, f"Exception: {str(e)}")
    
    def test_analytics_dashboard_endpoint(self):
        """Test Analytics Dashboard endpoint"""
        print("\n=== TESTING ANALYTICS DASHBOARD ENDPOINT ===")
        
        # GET /api/analytics/dashboard
        try:
            response = self.session.get(f"{self.base_url}/analytics/dashboard")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    analytics = result["data"]
                    self.log_test("GET /api/analytics/dashboard", True, "Analytics dashboard data retrieved successfully")
                    
                    # Verify analytics structure
                    required_sections = ["orders", "revenue", "products", "users"]
                    missing_sections = [section for section in required_sections if section not in analytics]
                    
                    if not missing_sections:
                        self.log_test("Analytics Data Structure", True, "All required analytics sections present")
                        
                        # Verify each section has required fields
                        orders = analytics.get("orders", {})
                        if all(field in orders for field in ["total", "today", "pending", "completed"]):
                            self.log_test("Orders Analytics Structure", True, f"Orders analytics complete: {orders['total']} total orders")
                        else:
                            self.log_test("Orders Analytics Structure", False, "Missing fields in orders analytics")
                        
                        products = analytics.get("products", {})
                        if all(field in products for field in ["total", "low_stock", "out_of_stock"]):
                            self.log_test("Products Analytics Structure", True, f"Products analytics complete: {products['total']} total products")
                        else:
                            self.log_test("Products Analytics Structure", False, "Missing fields in products analytics")
                        
                        revenue = analytics.get("revenue", {})
                        if all(field in revenue for field in ["total", "today", "this_month"]):
                            self.log_test("Revenue Analytics Structure", True, f"Revenue analytics complete: {revenue['total']} total revenue")
                        else:
                            self.log_test("Revenue Analytics Structure", False, "Missing fields in revenue analytics")
                        
                        users = analytics.get("users", {})
                        if all(field in users for field in ["total", "new_today", "active"]):
                            self.log_test("Users Analytics Structure", True, f"Users analytics complete: {users['total']} total users")
                        else:
                            self.log_test("Users Analytics Structure", False, "Missing fields in users analytics")
                            
                    else:
                        self.log_test("Analytics Data Structure", False, f"Missing sections: {missing_sections}")
                else:
                    self.log_test("GET /api/analytics/dashboard", False, "Invalid response structure")
            else:
                self.log_test("GET /api/analytics/dashboard", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/analytics/dashboard", False, f"Exception: {str(e)}")
    
    def run_extended_tests(self):
        """Run all extended backend tests"""
        print("🚀 Starting NEXX E-Commerce Extended Backend API Tests")
        print("Testing NEW endpoints with exact test data from review request")
        print(f"Testing against: {self.base_url}")
        print("=" * 70)
        
        # Run tests in sequence
        if not self.test_api_health():
            print("❌ API Health Check failed - aborting tests")
            return False
        
        # Test all new endpoints
        self.test_payment_systems_endpoints()
        self.test_abcp_integration_endpoints()
        supplier_id = self.test_supplier_management_endpoints()
        self.test_product_offers_endpoint()
        self.test_site_settings_endpoints()
        self.test_analytics_dashboard_endpoint()
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 EXTENDED TEST SUMMARY")
        print("=" * 70)
        
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
        
        print("\n🎯 ENDPOINT COVERAGE:")
        print("✅ POST /api/payments/settings - Payment system configuration")
        print("✅ GET /api/payments/settings - Payment settings retrieval")
        print("✅ POST /api/suppliers/abcp/settings - ABCP configuration")
        print("✅ GET /api/suppliers/abcp/test - ABCP connection testing")
        print("✅ POST /api/suppliers - Supplier creation")
        print("✅ GET /api/suppliers - Supplier listing")
        print("✅ GET /api/products/{id}/offers - Product offers (with specific ID)")
        print("✅ POST /api/settings/site - Site settings update")
        print("✅ GET /api/settings/site - Site settings retrieval")
        print("✅ GET /api/analytics/dashboard - Dashboard analytics")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = NEXXExtendedTester()
    success = tester.run_extended_tests()
    
    if success:
        print("\n🎉 All extended tests passed! New backend endpoints are working correctly.")
    else:
        print("\n⚠️  Some extended tests failed. Check the details above.")
        exit(1)