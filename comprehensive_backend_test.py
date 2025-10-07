#!/usr/bin/env python3
"""
ФИНАЛЬНОЕ КОМПЛЕКСНОЕ ТЕСТИРОВАНИЕ - NEXX E-Commerce Backend API
Comprehensive testing of all NEW API endpoints as requested
"""

import requests
import json
import uuid
from datetime import datetime
import time

# Backend URL from environment
BACKEND_URL = "https://ecom-nexx.preview.emergentagent.com/api"

class NEXXComprehensiveTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_users = []
        self.created_pages = []
        self.uploaded_files = []
        
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
    
    def test_sms_authentication_system(self):
        """Test SMS Authentication System APIs"""
        print("\n=== TESTING SMS AUTHENTICATION SYSTEM ===")
        
        # 1. Test SMS Settings Configuration
        sms_settings = {
            "provider": "smsc",
            "login": "test_login",
            "password": "test_password",
            "sender": "NEXX"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/sms/settings", json=sms_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("SMS Settings Configuration", True, "SMS settings configured successfully")
                else:
                    self.log_test("SMS Settings Configuration", False, "Failed to configure SMS settings")
            else:
                self.log_test("SMS Settings Configuration", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("SMS Settings Configuration", False, f"Exception: {str(e)}")
        
        # 2. Test Get SMS Settings
        try:
            response = self.session.get(f"{self.base_url}/admin/sms/settings")
            if response.status_code == 200:
                settings = response.json()
                self.log_test("Get SMS Settings", True, f"Retrieved SMS settings for provider: {settings.get('provider', 'Unknown')}")
            else:
                self.log_test("Get SMS Settings", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Get SMS Settings", False, f"Exception: {str(e)}")
        
        # 3. Test SMS Code Sending
        sms_request = {
            "phone": "+79161234567"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/auth/sms/send", json=sms_request)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("SMS Code Sending", True, f"SMS code sent to {result.get('phone')}")
                else:
                    self.log_test("SMS Code Sending", False, f"Failed to send SMS: {result.get('message', 'Unknown error')}")
            else:
                # Expected to fail with test credentials
                self.log_test("SMS Code Sending", False, f"SMS sending failed (expected with test credentials): {response.status_code}")
        except Exception as e:
            self.log_test("SMS Code Sending", False, f"Exception (expected with test credentials): {str(e)}")
        
        # 4. Test SMS Code Verification
        verify_request = {
            "phone": "+79161234567",
            "code": "1234"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/auth/sms/verify", json=verify_request)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("SMS Code Verification", True, f"SMS verification successful for {result.get('user', {}).get('phone')}")
                else:
                    self.log_test("SMS Code Verification", False, "SMS verification failed")
            else:
                self.log_test("SMS Code Verification", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("SMS Code Verification", False, f"Exception: {str(e)}")
    
    def test_enhanced_user_management(self):
        """Test Enhanced User Management APIs"""
        print("\n=== TESTING ENHANCED USER MANAGEMENT ===")
        
        # Test data from review request
        retail_user_data = {
            "username": "test_retail_user",
            "email": "retail@test.com",
            "password": "test123",
            "name": "Тестовый Пользователь",
            "user_type": "retail",
            "role": "user",
            "first_name": "Иван",
            "last_name": "Петров",
            "middle_name": "Сергеевич",
            "passport_series": "1234",
            "passport_number": "567890",
            "birth_date": "1990-01-01",
            "phone": "+79161111111",
            "active": True
        }
        
        legal_user_data = {
            "username": "test_legal_user",
            "email": "legal@test.com",
            "password": "test123",
            "name": "ООО Тестовая Компания",
            "user_type": "legal",
            "role": "user",
            "company_name": "ООО Тестовая Компания",
            "inn": "7701234567",
            "kpp": "770101001",
            "ogrn": "1027700000000",
            "legal_address": "г. Москва, ул. Тестовая, д. 1",
            "postal_address": "г. Москва, ул. Тестовая, д. 1",
            "phone": "+79162222222",
            "active": True
        }
        
        # 1. Create Retail User
        try:
            response = self.session.post(f"{self.base_url}/admin/users", json=retail_user_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    user = result["data"]
                    user_id = user.get("id")
                    self.created_users.append(user_id)
                    self.log_test("Create Retail User", True, f"Retail user created: {user.get('name')}")
                    
                    # Validate user data
                    if (user.get("user_type") == "retail" and 
                        user.get("first_name") == retail_user_data["first_name"] and
                        user.get("inn") is None):
                        self.log_test("Retail User Data Integrity", True, "Retail user data saved correctly")
                    else:
                        self.log_test("Retail User Data Integrity", False, "Retail user data not saved correctly")
                else:
                    self.log_test("Create Retail User", False, "Invalid response structure")
            else:
                self.log_test("Create Retail User", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create Retail User", False, f"Exception: {str(e)}")
        
        # 2. Create Legal Entity User
        try:
            response = self.session.post(f"{self.base_url}/admin/users", json=legal_user_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    user = result["data"]
                    user_id = user.get("id")
                    self.created_users.append(user_id)
                    self.log_test("Create Legal User", True, f"Legal entity user created: {user.get('company_name')}")
                    
                    # Validate legal entity data
                    if (user.get("user_type") == "legal" and 
                        user.get("inn") == legal_user_data["inn"] and
                        user.get("ogrn") == legal_user_data["ogrn"]):
                        self.log_test("Legal User Data Integrity", True, "Legal entity data saved correctly")
                    else:
                        self.log_test("Legal User Data Integrity", False, "Legal entity data not saved correctly")
                else:
                    self.log_test("Create Legal User", False, "Invalid response structure")
            else:
                self.log_test("Create Legal User", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create Legal User", False, f"Exception: {str(e)}")
        
        # 3. Test Get All Users with Filters
        try:
            # Test role filter
            response = self.session.get(f"{self.base_url}/admin/users?role=user")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    users = result["data"]
                    self.log_test("Get Users by Role", True, f"Retrieved {len(users)} users with role 'user'")
                else:
                    self.log_test("Get Users by Role", False, "Invalid response structure")
            else:
                self.log_test("Get Users by Role", False, f"Failed with status {response.status_code}")
            
            # Test user_type filter
            response = self.session.get(f"{self.base_url}/admin/users?user_type=retail")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    retail_users = result["data"]
                    self.log_test("Get Users by Type", True, f"Retrieved {len(retail_users)} retail users")
                else:
                    self.log_test("Get Users by Type", False, "Invalid response structure")
            else:
                self.log_test("Get Users by Type", False, f"Failed with status {response.status_code}")
            
            # Test search filter
            response = self.session.get(f"{self.base_url}/admin/users?search=test")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    search_users = result["data"]
                    self.log_test("Search Users", True, f"Found {len(search_users)} users matching 'test'")
                else:
                    self.log_test("Search Users", False, "Invalid response structure")
            else:
                self.log_test("Search Users", False, f"Failed with status {response.status_code}")
                
        except Exception as e:
            self.log_test("Get Users with Filters", False, f"Exception: {str(e)}")
        
        # 4. Test Update User
        if self.created_users:
            user_id = self.created_users[0]
            update_data = {
                "name": "Обновленный Тестовый Пользователь",
                "phone": "+79163333333"
            }
            
            try:
                response = self.session.put(f"{self.base_url}/admin/users/{user_id}", json=update_data)
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success") and result.get("data"):
                        updated_user = result["data"]
                        if updated_user.get("name") == update_data["name"]:
                            self.log_test("Update User", True, "User updated successfully")
                        else:
                            self.log_test("Update User", False, "User update not reflected")
                    else:
                        self.log_test("Update User", False, "Invalid response structure")
                else:
                    self.log_test("Update User", False, f"Failed with status {response.status_code}")
            except Exception as e:
                self.log_test("Update User", False, f"Exception: {str(e)}")
        
        # 5. Test Get User by ID
        if self.created_users:
            user_id = self.created_users[0]
            try:
                response = self.session.get(f"{self.base_url}/admin/users/{user_id}")
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success") and result.get("data"):
                        user = result["data"]
                        self.log_test("Get User by ID", True, f"Retrieved user: {user.get('name')}")
                    else:
                        self.log_test("Get User by ID", False, "Invalid response structure")
                else:
                    self.log_test("Get User by ID", False, f"Failed with status {response.status_code}")
            except Exception as e:
                self.log_test("Get User by ID", False, f"Exception: {str(e)}")
    
    def test_content_management_system(self):
        """Test Content Management System APIs"""
        print("\n=== TESTING CONTENT MANAGEMENT SYSTEM ===")
        
        # Test data from review request
        page_data = {
            "title": "О компании",
            "slug": "about",
            "content": "<h1>О компании NEXX</h1><p>Мы являемся ведущим поставщиком автозапчастей в России.</p>",
            "meta_title": "О компании NEXX - Автозапчасти",
            "meta_description": "Информация о компании NEXX, ведущем поставщике автозапчастей",
            "meta_keywords": "NEXX, автозапчасти, о компании",
            "active": True
        }
        
        # 1. Create Page
        try:
            response = self.session.post(f"{self.base_url}/admin/pages", json=page_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    page = result["data"]
                    page_id = page.get("id")
                    self.created_pages.append(page_id)
                    self.log_test("Create Page", True, f"Page created: {page.get('title')}")
                    
                    # Validate page data
                    if (page.get("slug") == page_data["slug"] and 
                        page.get("meta_title") == page_data["meta_title"]):
                        self.log_test("Page Data Integrity", True, "Page data saved correctly")
                    else:
                        self.log_test("Page Data Integrity", False, "Page data not saved correctly")
                else:
                    self.log_test("Create Page", False, "Invalid response structure")
            else:
                self.log_test("Create Page", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create Page", False, f"Exception: {str(e)}")
        
        # 2. Get All Pages
        try:
            response = self.session.get(f"{self.base_url}/pages")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    pages = result["data"]
                    self.log_test("Get All Pages", True, f"Retrieved {len(pages)} pages")
                else:
                    self.log_test("Get All Pages", False, "Invalid response structure")
            else:
                self.log_test("Get All Pages", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Get All Pages", False, f"Exception: {str(e)}")
        
        # 3. Get Page by Slug
        try:
            response = self.session.get(f"{self.base_url}/pages/about")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    page = result["data"]
                    self.log_test("Get Page by Slug", True, f"Retrieved page: {page.get('title')}")
                else:
                    self.log_test("Get Page by Slug", False, "Invalid response structure")
            else:
                self.log_test("Get Page by Slug", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Get Page by Slug", False, f"Exception: {str(e)}")
        
        # 4. Update Page
        if self.created_pages:
            page_id = self.created_pages[0]
            update_data = {
                "title": "О компании NEXX - Обновлено",
                "meta_description": "Обновленная информация о компании NEXX"
            }
            
            try:
                response = self.session.put(f"{self.base_url}/admin/pages/{page_id}", json=update_data)
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success") and result.get("data"):
                        updated_page = result["data"]
                        if updated_page.get("title") == update_data["title"]:
                            self.log_test("Update Page", True, "Page updated successfully")
                        else:
                            self.log_test("Update Page", False, "Page update not reflected")
                    else:
                        self.log_test("Update Page", False, "Invalid response structure")
                else:
                    self.log_test("Update Page", False, f"Failed with status {response.status_code}")
            except Exception as e:
                self.log_test("Update Page", False, f"Exception: {str(e)}")
        
        # 5. Test Media Upload (simulated)
        try:
            # Create a simple test file content
            test_file_content = b"Test file content for media upload"
            files = {'file': ('test.txt', test_file_content, 'text/plain')}
            
            response = self.session.post(f"{self.base_url}/admin/media/upload", files=files)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    file_info = result["data"]
                    self.uploaded_files.append(file_info.get("id"))
                    self.log_test("Media Upload", True, f"File uploaded: {file_info.get('original_filename')}")
                else:
                    self.log_test("Media Upload", False, "Invalid response structure")
            else:
                self.log_test("Media Upload", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Media Upload", False, f"Exception: {str(e)}")
        
        # 6. Get Media Files
        try:
            response = self.session.get(f"{self.base_url}/admin/media")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    media_files = result["data"]
                    self.log_test("Get Media Files", True, f"Retrieved {len(media_files)} media files")
                else:
                    self.log_test("Get Media Files", False, "Invalid response structure")
            else:
                self.log_test("Get Media Files", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Get Media Files", False, f"Exception: {str(e)}")
    
    def test_1c_integration(self):
        """Test 1C Integration APIs"""
        print("\n=== TESTING 1C INTEGRATION ===")
        
        # Test data from review request
        onec_settings = {
            "server_url": "http://1c-server:1540/trade",
            "database": "trade_db",
            "username": "admin1c",
            "password": "secret123",
            "sync_products": True,
            "sync_prices": True,
            "sync_orders": True,
            "active": True
        }
        
        # 1. Save 1C Settings
        try:
            response = self.session.post(f"{self.base_url}/admin/1c/settings", json=onec_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Save 1C Settings", True, "1C settings saved successfully")
                else:
                    self.log_test("Save 1C Settings", False, "Failed to save 1C settings")
            else:
                self.log_test("Save 1C Settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Save 1C Settings", False, f"Exception: {str(e)}")
        
        # 2. Get 1C Settings
        try:
            response = self.session.get(f"{self.base_url}/admin/1c/settings")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    settings = result["data"]
                    self.log_test("Get 1C Settings", True, f"Retrieved 1C settings for server: {settings.get('server_url')}")
                    
                    # Verify password is masked
                    if settings.get("password") == "***":
                        self.log_test("1C Password Security", True, "Password correctly masked in response")
                    else:
                        self.log_test("1C Password Security", False, "Password not properly masked")
                else:
                    self.log_test("Get 1C Settings", False, "Invalid response structure")
            else:
                self.log_test("Get 1C Settings", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Get 1C Settings", False, f"Exception: {str(e)}")
        
        # 3. Test 1C Synchronization
        sync_request = {
            "sync_type": "all",
            "force": False
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/1c/sync", json=sync_request)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    sync_result = result["data"]
                    self.log_test("1C Synchronization", True, f"Sync completed with status: {sync_result.get('status')}")
                    
                    # Validate sync results
                    results = sync_result.get("results", {})
                    if (results.get("products_synced", 0) > 0 and 
                        results.get("prices_updated", 0) > 0):
                        self.log_test("1C Sync Results", True, f"Synced {results['products_synced']} products, {results['prices_updated']} prices")
                    else:
                        self.log_test("1C Sync Results", False, "No sync results returned")
                else:
                    self.log_test("1C Synchronization", False, "Invalid response structure")
            else:
                self.log_test("1C Synchronization", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("1C Synchronization", False, f"Exception: {str(e)}")
        
        # 4. Get 1C Sync History
        try:
            response = self.session.get(f"{self.base_url}/admin/1c/sync/history")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    history = result["data"]
                    self.log_test("Get 1C Sync History", True, f"Retrieved {len(history)} sync history records")
                else:
                    self.log_test("Get 1C Sync History", False, "Invalid response structure")
            else:
                self.log_test("Get 1C Sync History", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Get 1C Sync History", False, f"Exception: {str(e)}")
    
    def test_seo_settings(self):
        """Test SEO Settings APIs"""
        print("\n=== TESTING SEO SETTINGS ===")
        
        # Test data from review request
        seo_settings = {
            "google_analytics": "G-TEST123456",
            "yandex_metrika": "87654321",
            "google_search_console": "google-site-verification=abc123",
            "yandex_webmaster": "yandex-verification=def456",
            "sitemap_enabled": True,
            "structured_data": True,
            "open_graph": True
        }
        
        # 1. Save SEO Settings
        try:
            response = self.session.post(f"{self.base_url}/admin/seo/settings", json=seo_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Save SEO Settings", True, "SEO settings saved successfully")
                else:
                    self.log_test("Save SEO Settings", False, "Failed to save SEO settings")
            else:
                self.log_test("Save SEO Settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Save SEO Settings", False, f"Exception: {str(e)}")
        
        # 2. Get SEO Settings
        try:
            response = self.session.get(f"{self.base_url}/admin/seo/settings")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    settings = result["data"]
                    self.log_test("Get SEO Settings", True, f"Retrieved SEO settings with GA: {settings.get('google_analytics')}")
                    
                    # Validate settings data
                    if (settings.get("google_analytics") == seo_settings["google_analytics"] and
                        settings.get("yandex_metrika") == seo_settings["yandex_metrika"]):
                        self.log_test("SEO Settings Data Integrity", True, "SEO settings saved correctly")
                    else:
                        self.log_test("SEO Settings Data Integrity", False, "SEO settings not saved correctly")
                else:
                    self.log_test("Get SEO Settings", False, "Invalid response structure")
            else:
                self.log_test("Get SEO Settings", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Get SEO Settings", False, f"Exception: {str(e)}")
        
        # 3. Test robots.txt Generation
        try:
            response = self.session.get(f"{self.base_url.replace('/api', '')}/robots.txt")
            if response.status_code == 200:
                robots_content = response.text
                if "User-agent:" in robots_content and "Sitemap:" in robots_content:
                    self.log_test("Robots.txt Generation", True, "robots.txt generated successfully")
                else:
                    self.log_test("Robots.txt Generation", False, "Invalid robots.txt format")
            else:
                self.log_test("Robots.txt Generation", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Robots.txt Generation", False, f"Exception: {str(e)}")
        
        # 4. Test sitemap.xml Generation
        try:
            response = self.session.get(f"{self.base_url.replace('/api', '')}/sitemap.xml")
            if response.status_code == 200:
                sitemap_content = response.text
                if "<?xml" in sitemap_content and "<urlset" in sitemap_content:
                    self.log_test("Sitemap.xml Generation", True, "sitemap.xml generated successfully")
                else:
                    self.log_test("Sitemap.xml Generation", False, "Invalid sitemap.xml format")
            else:
                self.log_test("Sitemap.xml Generation", False, f"Failed with status {response.status_code}")
        except Exception as e:
            self.log_test("Sitemap.xml Generation", False, f"Exception: {str(e)}")
    
    def cleanup(self):
        """Clean up test data"""
        print("\n=== CLEANING UP TEST DATA ===")
        
        # Delete created users
        for user_id in self.created_users:
            try:
                response = self.session.delete(f"{self.base_url}/admin/users/{user_id}")
                if response.status_code == 200:
                    self.log_test("Cleanup User", True, f"Deleted user {user_id}")
                else:
                    self.log_test("Cleanup User", False, f"Failed to delete user {user_id}")
            except Exception as e:
                self.log_test("Cleanup User", False, f"Exception deleting user {user_id}: {str(e)}")
        
        # Delete created pages
        for page_id in self.created_pages:
            try:
                response = self.session.delete(f"{self.base_url}/admin/pages/{page_id}")
                if response.status_code == 200:
                    self.log_test("Cleanup Page", True, f"Deleted page {page_id}")
                else:
                    self.log_test("Cleanup Page", False, f"Failed to delete page {page_id}")
            except Exception as e:
                self.log_test("Cleanup Page", False, f"Exception deleting page {page_id}: {str(e)}")
    
    def run_comprehensive_tests(self):
        """Run all comprehensive backend tests"""
        print("🚀 ФИНАЛЬНОЕ КОМПЛЕКСНОЕ ТЕСТИРОВАНИЕ - NEXX E-Commerce Backend API")
        print(f"Testing against: {self.base_url}")
        print("=" * 80)
        
        # Run tests in sequence
        if not self.test_api_health():
            print("❌ API Health Check failed - aborting tests")
            return False
        
        # Test all NEW API endpoints as requested
        self.test_sms_authentication_system()
        self.test_enhanced_user_management()
        self.test_content_management_system()
        self.test_1c_integration()
        self.test_seo_settings()
        
        # Cleanup
        self.cleanup()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 80)
        
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
        
        print("\n🎯 TESTED API ENDPOINTS:")
        print("✅ SMS Authentication System:")
        print("   - POST /api/auth/sms/send")
        print("   - POST /api/auth/sms/verify")
        print("   - POST /api/admin/sms/settings")
        print("   - GET /api/admin/sms/settings")
        print("✅ Enhanced User Management:")
        print("   - GET /api/admin/users")
        print("   - POST /api/admin/users")
        print("   - PUT /api/admin/users/{id}")
        print("   - DELETE /api/admin/users/{id}")
        print("   - GET /api/admin/users/{id}")
        print("✅ Content Management System:")
        print("   - GET /api/pages")
        print("   - POST /api/admin/pages")
        print("   - PUT /api/admin/pages/{id}")
        print("   - DELETE /api/admin/pages/{id}")
        print("   - POST /api/admin/media/upload")
        print("   - GET /api/admin/media")
        print("✅ 1C Integration:")
        print("   - POST /api/admin/1c/settings")
        print("   - GET /api/admin/1c/settings")
        print("   - POST /api/admin/1c/sync")
        print("   - GET /api/admin/1c/sync/history")
        print("✅ SEO Settings:")
        print("   - POST /api/admin/seo/settings")
        print("   - GET /api/admin/seo/settings")
        print("   - GET /robots.txt")
        print("   - GET /sitemap.xml")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = NEXXComprehensiveTester()
    success = tester.run_comprehensive_tests()
    
    if success:
        print("\n🎉 ФИНАЛЬНОЕ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО УСПЕШНО! All comprehensive tests passed!")
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        exit(1)