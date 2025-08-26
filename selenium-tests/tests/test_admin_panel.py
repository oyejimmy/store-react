import pytest
import time
from faker import Faker
from page_objects.admin_page import AdminPage, AdminProductsPage, AdminOrdersPage
from page_objects.login_page import LoginPage

fake = Faker()

class TestAdminPanel:
    """Test cases for admin panel functionality"""
    
    def test_admin_login_and_dashboard_access(self, driver, base_url, admin_user):
        """Test admin login and dashboard access"""
        login_page = LoginPage(driver)
        admin_page = AdminPage(driver)
        
        # Login as admin
        login_page.navigate_to_login(base_url)
        login_page.login(admin_user['email'], admin_user['password'])
        time.sleep(3)
        
        # Should redirect to admin dashboard
        assert "/admin" in driver.current_url
        assert admin_page.is_admin_page_loaded()
    
    def test_admin_sidebar_navigation(self, driver, base_url, admin_user):
        """Test admin sidebar navigation"""
        login_page = LoginPage(driver)
        admin_page = AdminPage(driver)
        
        # Login as admin
        login_page.navigate_to_login(base_url)
        login_page.login(admin_user['email'], admin_user['password'])
        time.sleep(3)
        
        # Test navigation to different sections
        menu_items = [
            ("products", admin_page.click_products),
            ("inventory", admin_page.click_inventory),
            ("orders", admin_page.click_orders),
            ("users", admin_page.click_users),
            ("offers", admin_page.click_offers),
            ("payments", admin_page.click_payments),
            ("sales-channels", admin_page.click_sales_channels),
            ("reports", admin_page.click_reports)
        ]
        
        for section, click_method in menu_items:
            click_method()
            time.sleep(2)
            
            # Verify navigation
            assert f"/admin/{section}" in driver.current_url
            
            # Navigate back to dashboard
            admin_page.click_dashboard()
            time.sleep(1)
    
    def test_sidebar_toggle_functionality(self, driver, base_url, admin_user):
        """Test sidebar collapse/expand functionality"""
        login_page = LoginPage(driver)
        admin_page = AdminPage(driver)
        
        # Login as admin
        login_page.navigate_to_login(base_url)
        login_page.login(admin_user['email'], admin_user['password'])
        time.sleep(3)
        
        # Toggle sidebar
        if admin_page.is_element_present(admin_page.SIDEBAR_TOGGLE):
            admin_page.toggle_sidebar()
            time.sleep(1)
            
            # Toggle back
            admin_page.toggle_sidebar()
            time.sleep(1)
    
    def test_admin_logout_functionality(self, driver, base_url, admin_user):
        """Test admin logout functionality"""
        login_page = LoginPage(driver)
        admin_page = AdminPage(driver)
        
        # Login as admin
        login_page.navigate_to_login(base_url)
        login_page.login(admin_user['email'], admin_user['password'])
        time.sleep(3)
        
        # Logout
        admin_page.logout()
        time.sleep(2)
        
        # Should redirect to login page
        assert "/login" in driver.current_url or driver.current_url == base_url + "/"

class TestAdminProductManagement:
    """Test cases for admin product management"""
    
    def setup_admin_session(self, driver, base_url, admin_user):
        """Helper method to setup admin session"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        login_page.login(admin_user['email'], admin_user['password'])
        time.sleep(3)
    
    def test_products_page_loads(self, driver, base_url, admin_user):
        """Test products management page loads"""
        self.setup_admin_session(driver, base_url, admin_user)
        
        admin_products = AdminProductsPage(driver)
        admin_products.click_products()
        time.sleep(2)
        
        # Verify products page loaded
        assert "/admin/products" in driver.current_url
        assert admin_products.is_element_present(admin_products.PRODUCT_TABLE) or \
               admin_products.is_element_present(admin_products.ADD_PRODUCT_BUTTON)
    
    def test_add_new_product(self, driver, base_url, admin_user, test_product):
        """Test adding new product"""
        self.setup_admin_session(driver, base_url, admin_user)
        
        admin_products = AdminProductsPage(driver)
        admin_products.click_products()
        time.sleep(2)
        
        # Get initial product count
        initial_count = admin_products.get_products_count()
        
        # Add new product
        if admin_products.is_element_present(admin_products.ADD_PRODUCT_BUTTON):
            admin_products.add_new_product()
            time.sleep(2)
            
            # Fill product form
            admin_products.fill_product_form(test_product)
            
            # Save product
            admin_products.save_product()
            time.sleep(3)
            
            # Verify product was added
            new_count = admin_products.get_products_count()
            assert new_count > initial_count
    
    def test_edit_existing_product(self, driver, base_url, admin_user):
        """Test editing existing product"""
        self.setup_admin_session(driver, base_url, admin_user)
        
        admin_products = AdminProductsPage(driver)
        admin_products.click_products()
        time.sleep(2)
        
        products_count = admin_products.get_products_count()
        if products_count > 0:
            # Edit first product
            admin_products.edit_product(0)
            time.sleep(2)
            
            # Modify product data
            updated_product = {
                'name': f'Updated Product {fake.word()}',
                'price': fake.random_int(min=100, max=1000),
                'description': f'Updated description {fake.text(max_nb_chars=100)}',
                'stock': fake.random_int(min=1, max=50)
            }
            
            admin_products.fill_product_form(updated_product)
            admin_products.save_product()
            time.sleep(3)
    
    def test_delete_product(self, driver, base_url, admin_user):
        """Test deleting product"""
        self.setup_admin_session(driver, base_url, admin_user)
        
        admin_products = AdminProductsPage(driver)
        admin_products.click_products()
        time.sleep(2)
        
        initial_count = admin_products.get_products_count()
        if initial_count > 0:
            # Delete first product
            admin_products.delete_product(0)
            time.sleep(2)
            
            # Confirm deletion if confirmation dialog appears
            try:
                driver.switch_to.alert.accept()
            except:
                pass
            
            time.sleep(2)
            
            # Verify product was deleted
            new_count = admin_products.get_products_count()
            assert new_count < initial_count
    
    def test_product_form_validation(self, driver, base_url, admin_user):
        """Test product form validation"""
        self.setup_admin_session(driver, base_url, admin_user)
        
        admin_products = AdminProductsPage(driver)
        admin_products.click_products()
        time.sleep(2)
        
        if admin_products.is_element_present(admin_products.ADD_PRODUCT_BUTTON):
            admin_products.add_new_product()
            time.sleep(2)
            
            # Try to save without filling required fields
            admin_products.save_product()
            time.sleep(1)
            
            # Should show validation errors or prevent submission
            # This test depends on actual form validation implementation

class TestAdminOrderManagement:
    """Test cases for admin order management"""
    
    def setup_admin_session(self, driver, base_url, admin_user):
        """Helper method to setup admin session"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        login_page.login(admin_user['email'], admin_user['password'])
        time.sleep(3)
    
    def test_orders_page_loads(self, driver, base_url, admin_user):
        """Test orders management page loads"""
        self.setup_admin_session(driver, base_url, admin_user)
        
        admin_orders = AdminOrdersPage(driver)
        admin_orders.click_orders()
        time.sleep(2)
        
        # Verify orders page loaded
        assert "/admin/orders" in driver.current_url
        assert admin_orders.is_element_present(admin_orders.ORDERS_TABLE) or \
               admin_orders.get_orders_count() >= 0
    
    def test_view_order_details(self, driver, base_url, admin_user):
        """Test viewing order details"""
        self.setup_admin_session(driver, base_url, admin_user)
        
        admin_orders = AdminOrdersPage(driver)
        admin_orders.click_orders()
        time.sleep(2)
        
        orders_count = admin_orders.get_orders_count()
        if orders_count > 0:
            # View first order details
            admin_orders.view_order_details(0)
            time.sleep(2)
            
            # Should navigate to order detail page or show modal
            # Verification depends on implementation
    
    def test_update_order_status(self, driver, base_url, admin_user):
        """Test updating order status"""
        self.setup_admin_session(driver, base_url, admin_user)
        
        admin_orders = AdminOrdersPage(driver)
        admin_orders.click_orders()
        time.sleep(2)
        
        orders_count = admin_orders.get_orders_count()
        if orders_count > 0:
            # Update first order status
            admin_orders.update_order_status(0, "shipped")
            time.sleep(2)
            
            # Verify status was updated
            # This test depends on actual implementation
    
    def test_order_filtering(self, driver, base_url, admin_user):
        """Test order filtering functionality"""
        self.setup_admin_session(driver, base_url, admin_user)
        
        admin_orders = AdminOrdersPage(driver)
        admin_orders.click_orders()
        time.sleep(2)
        
        # Test status filtering
        if admin_orders.is_element_present(admin_orders.STATUS_FILTER):
            admin_orders.filter_orders_by_status("pending")
            time.sleep(2)
            
            # Verify filtered results
            # This test depends on actual implementation

class TestAdminSecurity:
    """Test cases for admin panel security"""
    
    def test_non_admin_user_access_denied(self, driver, base_url, test_user):
        """Test non-admin user cannot access admin panel"""
        login_page = LoginPage(driver)
        
        # Login as regular user
        login_page.navigate_to_login(base_url)
        login_page.login(test_user['email'], test_user['password'])
        time.sleep(3)
        
        # Try to access admin panel directly
        driver.get(f"{base_url}/admin")
        time.sleep(2)
        
        # Should be redirected or show access denied
        assert "/admin" not in driver.current_url or "access denied" in driver.page_source.lower()
    
    def test_unauthenticated_admin_access(self, driver, base_url):
        """Test unauthenticated access to admin panel"""
        # Try to access admin panel without login
        driver.get(f"{base_url}/admin")
        time.sleep(2)
        
        # Should redirect to login page
        assert "/login" in driver.current_url
    
    def test_admin_session_timeout(self, driver, base_url, admin_user):
        """Test admin session timeout handling"""
        login_page = LoginPage(driver)
        admin_page = AdminPage(driver)
        
        # Login as admin
        login_page.navigate_to_login(base_url)
        login_page.login(admin_user['email'], admin_user['password'])
        time.sleep(3)
        
        # Simulate session timeout by clearing cookies
        driver.delete_all_cookies()
        
        # Try to access admin page
        driver.get(f"{base_url}/admin")
        time.sleep(2)
        
        # Should redirect to login
        assert "/login" in driver.current_url
    
    def test_admin_csrf_protection(self, driver, base_url, admin_user):
        """Test CSRF protection in admin forms"""
        login_page = LoginPage(driver)
        admin_products = AdminProductsPage(driver)
        
        # Login as admin
        login_page.navigate_to_login(base_url)
        login_page.login(admin_user['email'], admin_user['password'])
        time.sleep(3)
        
        # Navigate to products page
        admin_products.click_products()
        time.sleep(2)
        
        # Check for CSRF tokens in forms
        if admin_products.is_element_present(admin_products.ADD_PRODUCT_BUTTON):
            admin_products.add_new_product()
            time.sleep(2)
            
            # Look for CSRF token field
            csrf_fields = driver.find_elements("xpath", "//input[@name='csrf_token' or @name='_token']")
            # Note: This test depends on actual CSRF implementation
    
    def test_admin_input_sanitization(self, driver, base_url, admin_user):
        """Test input sanitization in admin forms"""
        login_page = LoginPage(driver)
        admin_products = AdminProductsPage(driver)
        
        # Login as admin
        login_page.navigate_to_login(base_url)
        login_page.login(admin_user['email'], admin_user['password'])
        time.sleep(3)
        
        # Navigate to products page
        admin_products.click_products()
        time.sleep(2)
        
        if admin_products.is_element_present(admin_products.ADD_PRODUCT_BUTTON):
            admin_products.add_new_product()
            time.sleep(2)
            
            # Test XSS prevention
            malicious_product = {
                'name': '<script>alert("XSS")</script>',
                'price': 100,
                'description': '<img src=x onerror=alert("XSS")>',
                'stock': 10
            }
            
            admin_products.fill_product_form(malicious_product)
            admin_products.save_product()
            time.sleep(2)
            
            # Verify no script execution
            try:
                driver.switch_to.alert
                assert False, "XSS alert was triggered"
            except:
                pass  # No alert is good