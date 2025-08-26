from selenium.webdriver.common.by import By
from .base_page import BasePage

class LoginPage(BasePage):
    # Locators
    PAGE_TITLE = (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
    EMAIL_INPUT = (By.CSS_SELECTOR, "input[type='email']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[type='password']")
    LOGIN_BUTTON = (By.XPATH, "//button[contains(text(), 'Sign In')]")
    SIGNUP_LINK = (By.XPATH, "//a[contains(text(), 'Sign up here')]")
    FORGOT_PASSWORD_LINK = (By.XPATH, "//a[contains(text(), 'Forgot your password')]")
    ERROR_MESSAGE = (By.CSS_SELECTOR, ".MuiAlert-message")
    LOADING_INDICATOR = (By.XPATH, "//button[contains(text(), 'Signing In...')]")
    
    # Form validation messages
    EMAIL_ERROR = (By.XPATH, "//p[contains(text(), 'Please enter a valid email')]")
    PASSWORD_ERROR = (By.XPATH, "//p[contains(text(), 'Please enter your password')]")
    
    def __init__(self, driver):
        super().__init__(driver)
    
    def navigate_to_login(self, base_url):
        """Navigate to login page"""
        self.navigate_to(f"{base_url}/login")
    
    def enter_email(self, email):
        """Enter email address"""
        self.send_keys(self.EMAIL_INPUT, email)
    
    def enter_password(self, password):
        """Enter password"""
        self.send_keys(self.PASSWORD_INPUT, password)
    
    def click_login_button(self):
        """Click login button"""
        self.click_element(self.LOGIN_BUTTON)
    
    def click_signup_link(self):
        """Click signup link"""
        self.click_element(self.SIGNUP_LINK)
    
    def click_forgot_password(self):
        """Click forgot password link"""
        self.click_element(self.FORGOT_PASSWORD_LINK)
    
    def login(self, email, password):
        """Complete login process"""
        self.enter_email(email)
        self.enter_password(password)
        self.click_login_button()
    
    def is_login_page_loaded(self):
        """Check if login page is loaded"""
        return self.is_element_present(self.PAGE_TITLE)
    
    def get_error_message(self):
        """Get error message text"""
        if self.is_element_present(self.ERROR_MESSAGE):
            return self.get_text(self.ERROR_MESSAGE)
        return None
    
    def is_email_error_displayed(self):
        """Check if email validation error is displayed"""
        return self.is_element_present(self.EMAIL_ERROR)
    
    def is_password_error_displayed(self):
        """Check if password validation error is displayed"""
        return self.is_element_present(self.PASSWORD_ERROR)
    
    def is_loading(self):
        """Check if login is in progress"""
        return self.is_element_present(self.LOADING_INDICATOR)
    
    def wait_for_login_completion(self):
        """Wait for login to complete"""
        self.wait_for_element_visible(self.LOADING_INDICATOR, timeout=2)
        # Wait for loading to disappear
        import time
        time.sleep(2)