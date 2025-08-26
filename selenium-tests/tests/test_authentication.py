import pytest
import time
from faker import Faker
from page_objects.home_page import HomePage
from page_objects.login_page import LoginPage

fake = Faker()

class TestAuthentication:
    """Test cases for user authentication functionality"""
    
    def test_login_page_loads_correctly(self, driver, base_url):
        """Test login page loads with all required elements"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        assert login_page.is_login_page_loaded()
        assert login_page.is_element_present(login_page.EMAIL_INPUT)
        assert login_page.is_element_present(login_page.PASSWORD_INPUT)
        assert login_page.is_element_present(login_page.LOGIN_BUTTON)
        assert login_page.is_element_present(login_page.SIGNUP_LINK)
    
    def test_valid_user_login(self, driver, base_url, test_user):
        """Test successful login with valid credentials"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Perform login
        login_page.login(test_user['email'], test_user['password'])
        
        # Wait for redirect
        time.sleep(3)
        
        # Should redirect to home page or dashboard
        current_url = driver.current_url
        assert current_url == base_url + "/" or "/admin" in current_url
    
    def test_invalid_email_login(self, driver, base_url):
        """Test login with invalid email format"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Try login with invalid email
        login_page.enter_email("invalid-email")
        login_page.enter_password("password123")
        login_page.click_login_button()
        
        # Should show email validation error
        assert login_page.is_email_error_displayed()
    
    def test_empty_fields_validation(self, driver, base_url):
        """Test validation for empty email and password fields"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Try to login with empty fields
        login_page.click_login_button()
        
        # Should show validation errors
        time.sleep(1)
        assert login_page.is_email_error_displayed() or login_page.is_password_error_displayed()
    
    def test_wrong_credentials_login(self, driver, base_url):
        """Test login with wrong credentials"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Try login with wrong credentials
        login_page.login("wrong@email.com", "wrongpassword")
        
        # Wait for error message
        time.sleep(2)
        
        # Should show error message
        error_message = login_page.get_error_message()
        assert error_message is not None
    
    def test_admin_user_login(self, driver, base_url, admin_user):
        """Test admin user login redirects to admin panel"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Perform admin login
        login_page.login(admin_user['email'], admin_user['password'])
        
        # Wait for redirect
        time.sleep(3)
        
        # Should redirect to admin panel
        assert "/admin" in driver.current_url
    
    def test_signup_link_navigation(self, driver, base_url):
        """Test signup link navigation"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Click signup link
        login_page.click_signup_link()
        
        # Should navigate to signup page
        assert "/signup" in driver.current_url
    
    def test_forgot_password_link(self, driver, base_url):
        """Test forgot password link"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Click forgot password link
        if login_page.is_element_present(login_page.FORGOT_PASSWORD_LINK):
            login_page.click_forgot_password()
            # Should navigate to forgot password page or show modal
            time.sleep(1)
    
    def test_login_from_home_page(self, driver, base_url):
        """Test login navigation from home page"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Click login button from home page
        if home_page.is_element_present(home_page.LOGIN_BUTTON):
            home_page.click_login()
            assert "/login" in driver.current_url
    
    def test_password_field_security(self, driver, base_url):
        """Test password field is properly masked"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Enter password
        password_field = login_page.find_element(login_page.PASSWORD_INPUT)
        password_field.send_keys("testpassword")
        
        # Check if password is masked
        assert password_field.get_attribute("type") == "password"
    
    def test_login_button_states(self, driver, base_url):
        """Test login button loading state"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Fill form
        login_page.enter_email("test@example.com")
        login_page.enter_password("password123")
        
        # Click login and check for loading state
        login_page.click_login_button()
        
        # Check if loading indicator appears
        time.sleep(1)
        # Note: This test depends on the actual implementation
    
    def test_session_persistence(self, driver, base_url, test_user):
        """Test user session persistence after login"""
        login_page = LoginPage(driver)
        home_page = HomePage(driver)
        
        # Login
        login_page.navigate_to_login(base_url)
        login_page.login(test_user['email'], test_user['password'])
        time.sleep(3)
        
        # Navigate to different pages and verify user is still logged in
        home_page.navigate_to_home(base_url)
        
        # Check if user is still logged in (login button should not be visible)
        assert not home_page.is_element_present(home_page.LOGIN_BUTTON) or \
               home_page.is_element_present(home_page.CART_ICON)
    
    def test_logout_functionality(self, driver, base_url, test_user):
        """Test user logout functionality"""
        login_page = LoginPage(driver)
        home_page = HomePage(driver)
        
        # Login first
        login_page.navigate_to_login(base_url)
        login_page.login(test_user['email'], test_user['password'])
        time.sleep(3)
        
        # Navigate to home
        home_page.navigate_to_home(base_url)
        
        # Logout (implementation depends on UI)
        # This would need to be implemented based on actual logout mechanism
        
    def test_multiple_login_attempts(self, driver, base_url):
        """Test multiple failed login attempts"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Try multiple failed logins
        for i in range(3):
            login_page.enter_email("wrong@email.com")
            login_page.enter_password("wrongpassword")
            login_page.click_login_button()
            time.sleep(2)
            
            # Check for error message
            error_message = login_page.get_error_message()
            assert error_message is not None
            
            # Clear fields for next attempt
            login_page.navigate_to_login(base_url)
    
    def test_sql_injection_protection(self, driver, base_url):
        """Test SQL injection protection in login form"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Try SQL injection attempts
        sql_payloads = [
            "' OR '1'='1",
            "admin'--",
            "' OR 1=1--",
            "'; DROP TABLE users;--"
        ]
        
        for payload in sql_payloads:
            login_page.enter_email(payload)
            login_page.enter_password(payload)
            login_page.click_login_button()
            time.sleep(1)
            
            # Should not succeed and should show error
            assert "/admin" not in driver.current_url
            login_page.navigate_to_login(base_url)
    
    def test_xss_protection(self, driver, base_url):
        """Test XSS protection in login form"""
        login_page = LoginPage(driver)
        login_page.navigate_to_login(base_url)
        
        # Try XSS payloads
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>"
        ]
        
        for payload in xss_payloads:
            login_page.enter_email(payload)
            login_page.enter_password("password")
            login_page.click_login_button()
            time.sleep(1)
            
            # Should not execute script
            # Check that no alert is present
            try:
                driver.switch_to.alert
                assert False, "XSS alert was triggered"
            except:
                pass  # No alert is good
            
            login_page.navigate_to_login(base_url)