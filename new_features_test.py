#!/usr/bin/env python3
"""
Comprehensive Testing for NEW NEXX E-Commerce Features
Tests all NEW API endpoints from the review request with exact test data
"""

import requests
import json
import uuid
from datetime import datetime
import time
import io
import os

# Backend URL from environment
BACKEND_URL = "https://ecom-nexx.preview.emergentagent.com/api"

class NEXXNewFeaturesTester:
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
    
    def test_sms_authentication(self):
        """Test SMS Authentication System"""
        print("\n=== TESTING SMS AUTHENTICATION SYSTEM ===")
        
        # Test SMS settings configuration
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
        
        # Test getting SMS settings
        try:
            response = self.session.get(f"{self.base_url}/admin/sms/settings")
            if response.status_code == 200:
                settings = response.json()
                self.log_test("Get SMS Settings", True, f"Retrieved SMS settings for provider: {settings.get('provider', 'Unknown')}")
            else:
                self.log_test("Get SMS Settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get SMS Settings", False, f"Exception: {str(e)}")
        
        # Test SMS code sending with exact test data from review request
        sms_send_data = {"phone": "+79001234567"}
        
        try:
            response = self.session.post(f"{self.base_url}/auth/sms/send", json=sms_send_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("phone") == "+79001234567":
                    self.log_test("SMS Code Send", True, f"SMS code sent to {result['phone']}")
                    
                    # Test SMS code verification with mock code
                    verify_data = {"phone": "+79001234567", "code": "1234"}
                    
                    try:
                        response = self.session.post(f"{self.base_url}/auth/sms/verify", json=verify_data)
                        if response.status_code == 200:
                            result = response.json()
                            if result.get("success") and result.get("user"):
                                user = result["user"]
                                self.log_test("SMS Code Verification", True, f"SMS verification successful, user: {user.get('name', 'Unknown')}")
                                
                                # Validate user data structure
                                required_fields = ["id", "username", "phone", "email", "name", "user_type", "role"]
                                missing_fields = [field for field in required_fields if field not in user]
                                if not missing_fields:
                                    self.log_test("SMS User Data Structure", True, "All required user fields present")
                                else:
                                    self.log_test("SMS User Data Structure", False, f"Missing fields: {missing_fields}")
                            else:
                                self.log_test("SMS Code Verification", False, "Invalid verification response")
                        else:
                            self.log_test("SMS Code Verification", False, f"Failed with status {response.status_code}: {response.text}")
                    except Exception as e:
                        self.log_test("SMS Code Verification", False, f"Exception: {str(e)}")
                        
                else:
                    self.log_test("SMS Code Send", False, "Invalid SMS send response")
            else:
                self.log_test("SMS Code Send", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("SMS Code Send", False, f"Exception: {str(e)}")
        
        return True
    
    def test_enhanced_user_management(self):
        """Test Enhanced User Management API"""
        print("\n=== TESTING ENHANCED USER MANAGEMENT API ===")
        
        # Test user creation with exact test data from review request
        user_data = {
            "username": "test_user",
            "email": "test@example.com",
            "name": "Тестовый Пользователь",
            "user_type": "retail",
            "role": "user",
            "phone": "+79001234567",
            "password": "testpass123"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/users", json=user_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    user = result["data"]
                    user_id = user.get("id")
                    self.created_users.append(user_id)
                    self.log_test("Create User", True, f"User created with ID: {user_id}")
                    
                    # Validate user data integrity
                    if (user.get("username") == user_data["username"] and
                        user.get("email") == user_data["email"] and
                        user.get("user_type") == user_data["user_type"] and
                        user.get("role") == user_data["role"]):
                        self.log_test("User Data Integrity", True, "All user fields saved correctly")
                    else:
                        self.log_test("User Data Integrity", False, "Some user fields not saved correctly")
                        
                else:
                    self.log_test("Create User", False, "Invalid response structure")
            else:
                self.log_test("Create User", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create User", False, f"Exception: {str(e)}")
        
        # Test getting all users
        try:
            response = self.session.get(f"{self.base_url}/admin/users")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    users = result["data"]
                    self.log_test("Get All Users", True, f"Retrieved {len(users)} users")
                    
                    # Test filtering by role
                    response = self.session.get(f"{self.base_url}/admin/users?role=user")
                    if response.status_code == 200:
                        result = response.json()
                        if result.get("success"):
                            filtered_users = result["data"]
                            self.log_test("Filter Users by Role", True, f"Retrieved {len(filtered_users)} users with role 'user'")
                        else:
                            self.log_test("Filter Users by Role", False, "Invalid response structure")
                    else:
                        self.log_test("Filter Users by Role", False, f"Failed with status {response.status_code}")
                    
                    # Test filtering by user_type
                    response = self.session.get(f"{self.base_url}/admin/users?user_type=retail")
                    if response.status_code == 200:
                        result = response.json()
                        if result.get("success"):
                            filtered_users = result["data"]
                            self.log_test("Filter Users by Type", True, f"Retrieved {len(filtered_users)} retail users")
                        else:
                            self.log_test("Filter Users by Type", False, "Invalid response structure")
                    else:
                        self.log_test("Filter Users by Type", False, f"Failed with status {response.status_code}")
                    
                    # Test search functionality
                    response = self.session.get(f"{self.base_url}/admin/users?search=test")
                    if response.status_code == 200:
                        result = response.json()
                        if result.get("success"):
                            search_users = result["data"]
                            self.log_test("Search Users", True, f"Found {len(search_users)} users matching 'test'")
                        else:
                            self.log_test("Search Users", False, "Invalid response structure")
                    else:
                        self.log_test("Search Users", False, f"Failed with status {response.status_code}")
                        
                else:
                    self.log_test("Get All Users", False, "Invalid response structure")
            else:
                self.log_test("Get All Users", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get All Users", False, f"Exception: {str(e)}")
        
        # Test getting user by ID
        if self.created_users:
            user_id = self.created_users[0]
            try:
                response = self.session.get(f"{self.base_url}/admin/users/{user_id}")
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success") and result.get("data"):
                        user = result["data"]
                        self.log_test("Get User by ID", True, f"Retrieved user: {user.get('name', 'Unknown')}")
                    else:
                        self.log_test("Get User by ID", False, "Invalid response structure")
                else:
                    self.log_test("Get User by ID", False, f"Failed with status {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Get User by ID", False, f"Exception: {str(e)}")
            
            # Test updating user
            update_data = {
                "name": "Обновленный Пользователь",
                "role": "manager"
            }
            
            try:
                response = self.session.put(f"{self.base_url}/admin/users/{user_id}", json=update_data)
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success") and result.get("data"):
                        updated_user = result["data"]
                        if (updated_user.get("name") == update_data["name"] and
                            updated_user.get("role") == update_data["role"]):
                            self.log_test("Update User", True, "User updated successfully")
                        else:
                            self.log_test("Update User", False, "Update data not reflected correctly")
                    else:
                        self.log_test("Update User", False, "Invalid response structure")
                else:
                    self.log_test("Update User", False, f"Failed with status {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Update User", False, f"Exception: {str(e)}")
        
        # Test creating legal entity user
        legal_user_data = {
            "username": "legal_test_user",
            "email": "legal@example.com",
            "name": "ООО Тестовая Компания",
            "user_type": "legal",
            "role": "user",
            "phone": "+79001234568",
            "password": "testpass123",
            "company_name": "ООО Тестовая Компания",
            "inn": "7701234567",
            "kpp": "770101001",
            "ogrn": "1027700000000",
            "legal_address": "г. Москва, ул. Тестовая, д. 1",
            "postal_address": "г. Москва, ул. Тестовая, д. 1"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/users", json=legal_user_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    legal_user = result["data"]
                    legal_user_id = legal_user.get("id")
                    self.created_users.append(legal_user_id)
                    self.log_test("Create Legal User", True, f"Legal entity user created with ID: {legal_user_id}")
                    
                    # Validate legal entity fields
                    if (legal_user.get("user_type") == "legal" and
                        legal_user.get("company_name") == legal_user_data["company_name"] and
                        legal_user.get("inn") == legal_user_data["inn"]):
                        self.log_test("Legal User Data Integrity", True, "All legal entity fields saved correctly")
                    else:
                        self.log_test("Legal User Data Integrity", False, "Some legal entity fields not saved correctly")
                        
                else:
                    self.log_test("Create Legal User", False, "Invalid response structure")
            else:
                self.log_test("Create Legal User", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create Legal User", False, f"Exception: {str(e)}")
        
        return True
    
    def test_content_management(self):
        """Test Content Management System API"""
        print("\n=== TESTING CONTENT MANAGEMENT SYSTEM API ===")
        
        # Test page creation with exact test data from review request
        page_data = {
            "title": "О компании",
            "slug": "about",
            "content": "Информация о компании NEXX",
            "active": True
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/pages", json=page_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    page = result["data"]
                    page_id = page.get("id")
                    self.created_pages.append(page_id)
                    self.log_test("Create Page", True, f"Page created with ID: {page_id}")
                    
                    # Validate page data integrity
                    if (page.get("title") == page_data["title"] and
                        page.get("slug") == page_data["slug"] and
                        page.get("content") == page_data["content"] and
                        page.get("active") == page_data["active"]):
                        self.log_test("Page Data Integrity", True, "All page fields saved correctly")
                    else:
                        self.log_test("Page Data Integrity", False, "Some page fields not saved correctly")
                        
                else:
                    self.log_test("Create Page", False, "Invalid response structure")
            else:
                self.log_test("Create Page", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create Page", False, f"Exception: {str(e)}")
        
        # Test getting all pages
        try:
            response = self.session.get(f"{self.base_url}/pages")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    pages = result["data"]
                    self.log_test("Get All Pages", True, f"Retrieved {len(pages)} pages")
                    
                    # Test filtering by active status
                    response = self.session.get(f"{self.base_url}/pages?active=true")
                    if response.status_code == 200:
                        result = response.json()
                        if result.get("success"):
                            active_pages = result["data"]
                            self.log_test("Filter Pages by Active Status", True, f"Retrieved {len(active_pages)} active pages")
                        else:
                            self.log_test("Filter Pages by Active Status", False, "Invalid response structure")
                    else:
                        self.log_test("Filter Pages by Active Status", False, f"Failed with status {response.status_code}")
                        
                else:
                    self.log_test("Get All Pages", False, "Invalid response structure")
            else:
                self.log_test("Get All Pages", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get All Pages", False, f"Exception: {str(e)}")
        
        # Test getting page by slug
        try:
            response = self.session.get(f"{self.base_url}/pages/about")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    page = result["data"]
                    self.log_test("Get Page by Slug", True, f"Retrieved page: {page.get('title', 'Unknown')}")
                else:
                    self.log_test("Get Page by Slug", False, "Invalid response structure")
            else:
                self.log_test("Get Page by Slug", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Page by Slug", False, f"Exception: {str(e)}")
        
        # Test updating page
        if self.created_pages:
            page_id = self.created_pages[0]
            update_data = {
                "title": "О компании NEXX",
                "content": "Обновленная информация о компании NEXX - ведущем поставщике автозапчастей",
                "meta_title": "О компании NEXX - автозапчасти",
                "meta_description": "Узнайте больше о компании NEXX и наших услугах"
            }
            
            try:
                response = self.session.put(f"{self.base_url}/admin/pages/{page_id}", json=update_data)
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success") and result.get("data"):
                        updated_page = result["data"]
                        if (updated_page.get("title") == update_data["title"] and
                            updated_page.get("meta_title") == update_data["meta_title"]):
                            self.log_test("Update Page", True, "Page updated successfully")
                        else:
                            self.log_test("Update Page", False, "Update data not reflected correctly")
                    else:
                        self.log_test("Update Page", False, "Invalid response structure")
                else:
                    self.log_test("Update Page", False, f"Failed with status {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Update Page", False, f"Exception: {str(e)}")
        
        # Test media file upload
        try:
            # Create a test file
            test_content = b"Test file content for NEXX media upload"
            files = {'file': ('test_image.jpg', io.BytesIO(test_content), 'image/jpeg')}
            
            response = self.session.post(f"{self.base_url}/admin/media/upload", files=files)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    file_info = result["data"]
                    file_id = file_info.get("id")
                    self.uploaded_files.append(file_id)
                    self.log_test("Upload Media File", True, f"File uploaded with ID: {file_id}")
                    
                    # Validate file info structure
                    required_fields = ["id", "original_filename", "filename", "url", "content_type", "size"]
                    missing_fields = [field for field in required_fields if field not in file_info]
                    if not missing_fields:
                        self.log_test("Media File Data Structure", True, "All required file fields present")
                    else:
                        self.log_test("Media File Data Structure", False, f"Missing fields: {missing_fields}")
                        
                else:
                    self.log_test("Upload Media File", False, "Invalid response structure")
            else:
                self.log_test("Upload Media File", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Upload Media File", False, f"Exception: {str(e)}")
        
        # Test getting media files list
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
                self.log_test("Get Media Files", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Media Files", False, f"Exception: {str(e)}")
        
        return True
    
    def test_1c_integration(self):
        """Test 1C Integration API"""
        print("\n=== TESTING 1C INTEGRATION API ===")
        
        # Test 1C settings with exact test data from review request
        onec_settings = {
            "server_url": "http://1c-server",
            "database": "trade",
            "username": "user1c",
            "password": "pass1c",
            "active": True
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/1c/settings", json=onec_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("1C Settings Configuration", True, "1C settings configured successfully")
                else:
                    self.log_test("1C Settings Configuration", False, "Failed to configure 1C settings")
            else:
                self.log_test("1C Settings Configuration", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("1C Settings Configuration", False, f"Exception: {str(e)}")
        
        # Test getting 1C settings
        try:
            response = self.session.get(f"{self.base_url}/admin/1c/settings")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    settings = result["data"]
                    self.log_test("Get 1C Settings", True, f"Retrieved 1C settings for server: {settings.get('server_url', 'Unknown')}")
                    
                    # Validate settings data (password should be masked)
                    if (settings.get("server_url") == onec_settings["server_url"] and
                        settings.get("database") == onec_settings["database"] and
                        settings.get("username") == onec_settings["username"] and
                        settings.get("password") == "***"):  # Password should be masked
                        self.log_test("1C Settings Data Integrity", True, "1C settings saved correctly with masked password")
                    else:
                        self.log_test("1C Settings Data Integrity", False, "Some 1C settings not saved correctly")
                else:
                    self.log_test("Get 1C Settings", False, "Invalid response structure")
            else:
                self.log_test("Get 1C Settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get 1C Settings", False, f"Exception: {str(e)}")
        
        # Test 1C synchronization
        sync_data = {
            "sync_type": "all",
            "force": False
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/1c/sync", json=sync_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    sync_result = result["data"]
                    self.log_test("1C Synchronization", True, f"1C sync completed with status: {sync_result.get('status', 'Unknown')}")
                    
                    # Validate sync result structure
                    if "results" in sync_result:
                        results = sync_result["results"]
                        if all(key in results for key in ["products_synced", "prices_updated", "orders_sent", "errors"]):
                            self.log_test("1C Sync Result Structure", True, "All required sync result fields present")
                        else:
                            self.log_test("1C Sync Result Structure", False, "Missing fields in sync results")
                    else:
                        self.log_test("1C Sync Result Structure", False, "No results field in sync response")
                else:
                    self.log_test("1C Synchronization", False, "Invalid response structure")
            else:
                self.log_test("1C Synchronization", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("1C Synchronization", False, f"Exception: {str(e)}")
        
        # Test getting 1C sync history
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
                self.log_test("Get 1C Sync History", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get 1C Sync History", False, f"Exception: {str(e)}")
        
        return True
    
    def test_seo_settings(self):
        """Test SEO Settings API"""
        print("\n=== TESTING SEO SETTINGS API ===")
        
        # Test SEO settings configuration
        seo_settings = {
            "robots_txt": "User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: https://nexx.ru/sitemap.xml",
            "sitemap_enabled": True,
            "google_analytics": "GA-123456789-1",
            "yandex_metrika": "12345678",
            "google_search_console": "https://search.google.com/search-console",
            "yandex_webmaster": "https://webmaster.yandex.ru",
            "structured_data": True,
            "open_graph": True
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/seo/settings", json=seo_settings)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("SEO Settings Configuration", True, "SEO settings configured successfully")
                else:
                    self.log_test("SEO Settings Configuration", False, "Failed to configure SEO settings")
            else:
                self.log_test("SEO Settings Configuration", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("SEO Settings Configuration", False, f"Exception: {str(e)}")
        
        # Test getting SEO settings
        try:
            response = self.session.get(f"{self.base_url}/admin/seo/settings")
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    settings = result["data"]
                    self.log_test("Get SEO Settings", True, "Retrieved SEO settings successfully")
                    
                    # Validate SEO settings data
                    if (settings.get("google_analytics") == seo_settings["google_analytics"] and
                        settings.get("yandex_metrika") == seo_settings["yandex_metrika"] and
                        settings.get("sitemap_enabled") == seo_settings["sitemap_enabled"]):
                        self.log_test("SEO Settings Data Integrity", True, "All SEO settings saved correctly")
                    else:
                        self.log_test("SEO Settings Data Integrity", False, "Some SEO settings not saved correctly")
                else:
                    self.log_test("Get SEO Settings", False, "Invalid response structure")
            else:
                self.log_test("Get SEO Settings", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get SEO Settings", False, f"Exception: {str(e)}")
        
        # Test robots.txt generation
        try:
            response = self.session.get(f"{self.base_url.replace('/api', '')}/robots.txt")
            if response.status_code == 200:
                robots_content = response.text
                if "User-agent:" in robots_content and "Sitemap:" in robots_content:
                    self.log_test("Robots.txt Generation", True, "Robots.txt generated successfully")
                else:
                    self.log_test("Robots.txt Generation", False, "Invalid robots.txt content")
            else:
                self.log_test("Robots.txt Generation", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Robots.txt Generation", False, f"Exception: {str(e)}")
        
        # Test sitemap.xml generation
        try:
            response = self.session.get(f"{self.base_url.replace('/api', '')}/sitemap.xml")
            if response.status_code == 200:
                sitemap_content = response.text
                if "<?xml version=" in sitemap_content and "<urlset" in sitemap_content:
                    self.log_test("Sitemap.xml Generation", True, "Sitemap.xml generated successfully")
                else:
                    self.log_test("Sitemap.xml Generation", False, "Invalid sitemap.xml content")
            else:
                self.log_test("Sitemap.xml Generation", False, f"Failed with status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Sitemap.xml Generation", False, f"Exception: {str(e)}")
        
        return True
    
    def test_error_handling(self):
        """Test API error handling for new endpoints"""
        print("\n=== TESTING ERROR HANDLING FOR NEW ENDPOINTS ===")
        
        # Test 404 errors for non-existent resources
        fake_id = str(uuid.uuid4())
        
        # Test non-existent user
        try:
            response = self.session.get(f"{self.base_url}/admin/users/{fake_id}")
            if response.status_code == 404:
                self.log_test("404 Error Handling - User", True, "Correctly returns 404 for non-existent user")
            else:
                self.log_test("404 Error Handling - User", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("404 Error Handling - User", False, f"Exception: {str(e)}")
        
        # Test non-existent page
        try:
            response = self.session.get(f"{self.base_url}/pages/non-existent-page")
            if response.status_code == 404:
                self.log_test("404 Error Handling - Page", True, "Correctly returns 404 for non-existent page")
            else:
                self.log_test("404 Error Handling - Page", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("404 Error Handling - Page", False, f"Exception: {str(e)}")
        
        # Test duplicate user creation
        duplicate_user = {
            "username": "test_user",  # Same as created earlier
            "email": "duplicate@example.com",
            "name": "Duplicate User",
            "user_type": "retail",
            "role": "user",
            "password": "testpass123"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/users", json=duplicate_user)
            if response.status_code == 400:
                self.log_test("Duplicate User Validation", True, "Correctly rejects duplicate username")
            else:
                self.log_test("Duplicate User Validation", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("Duplicate User Validation", False, f"Exception: {str(e)}")
        
        # Test duplicate page slug
        duplicate_page = {
            "title": "Duplicate About",
            "slug": "about",  # Same as created earlier
            "content": "Duplicate content",
            "active": True
        }
        
        try:
            response = self.session.post(f"{self.base_url}/admin/pages", json=duplicate_page)
            if response.status_code == 400:
                self.log_test("Duplicate Page Slug Validation", True, "Correctly rejects duplicate slug")
            else:
                self.log_test("Duplicate Page Slug Validation", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("Duplicate Page Slug Validation", False, f"Exception: {str(e)}")
    
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
    
    def run_all_tests(self):
        """Run all new feature tests"""
        print("🚀 Starting NEXX E-Commerce NEW FEATURES Backend API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Run tests in sequence
        if not self.test_api_health():
            print("❌ API Health Check failed - aborting tests")
            return False
        
        # Test new functionality from review request
        self.test_sms_authentication()
        self.test_enhanced_user_management()
        self.test_content_management()
        self.test_1c_integration()
        self.test_seo_settings()
        
        # Test error handling
        self.test_error_handling()
        
        # Cleanup
        self.cleanup()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 NEW FEATURES TEST SUMMARY")
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
    tester = NEXXNewFeaturesTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All new feature tests passed! Backend API is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        exit(1)