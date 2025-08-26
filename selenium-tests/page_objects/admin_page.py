from selenium.webdriver.common.by import By
from .base_page import BasePage

class AdminPage(BasePage):
    # Locators
    ADMIN_LOGO = (By.XPATH, "//h1[contains(text(), 'Saiyaara')]")
    SIDEBAR_TOGGLE = (By.CSS_SELECTOR, ".sidebar-toggle")
    
    # Sidebar Menu Items
    DASHBOARD_MENU = (By.XPATH, "//a[contains(@href, '/admin')]//span[contains(text(), 'Dashboard')]")
    PRODUCTS_MENU = (By.XPATH, "//a[contains(@href, '/admin/products')]")
    INVENTORY_MENU = (By.XPATH, "//a[contains(@href, '/admin/inventory')]")
    ORDERS_MENU = (By.XPATH, "//a[contains(@href, '/admin/orders')]")
    USERS_MENU = (By.XPATH, "//a[contains(@href, '/admin/users')]")
    OFFERS_MENU = (By.XPATH, "//a[contains(@href, '/admin/offers')]")
    PAYMENTS_MENU = (By.XPATH, "//a[contains(@href, '/admin/payments')]")
    SALES_CHANNELS_MENU = (By.XPATH, "//a[contains(@href, '/admin/sales-channels')]")
    REPORTS_MENU = (By.XPATH, "//a[contains(@href, '/admin/reports')]")
    
    # Header
    ADMIN_TITLE = (By.XPATH, "//h1[contains(text(), 'Admin Dashboard')]")
    USER_AVATAR = (By.CSS_SELECTOR, ".user-avatar")
    USER_DROPDOWN = (By.CSS_SELECTOR, ".user-dropdown")
    LOGOUT_BUTTON = (By.XPATH, "//button[contains(text(), 'Logout')]")
    
    # Breadcrumbs
    BREADCRUMBS = (By.CSS_SELECTOR, ".breadcrumbs")
    
    def __init__(self, driver):
        super().__init__(driver)
    
    def navigate_to_admin(self, base_url):
        """Navigate to admin dashboard"""
        self.navigate_to(f"{base_url}/admin")
    
    def click_dashboard(self):
        """Click dashboard menu"""
        self.click_element(self.DASHBOARD_MENU)
    
    def click_products(self):
        """Click products menu"""
        self.click_element(self.PRODUCTS_MENU)
    
    def click_inventory(self):
        """Click inventory menu"""
        self.click_element(self.INVENTORY_MENU)
    
    def click_orders(self):
        """Click orders menu"""
        self.click_element(self.ORDERS_MENU)
    
    def click_users(self):
        """Click users menu"""
        self.click_element(self.USERS_MENU)
    
    def click_offers(self):
        """Click offers menu"""
        self.click_element(self.OFFERS_MENU)
    
    def click_payments(self):
        """Click payments menu"""
        self.click_element(self.PAYMENTS_MENU)
    
    def click_sales_channels(self):
        """Click sales channels menu"""
        self.click_element(self.SALES_CHANNELS_MENU)
    
    def click_reports(self):
        """Click reports menu"""
        self.click_element(self.REPORTS_MENU)
    
    def toggle_sidebar(self):
        """Toggle sidebar collapse/expand"""
        self.click_element(self.SIDEBAR_TOGGLE)
    
    def logout(self):
        """Logout from admin panel"""
        self.click_element(self.USER_AVATAR)
        self.click_element(self.LOGOUT_BUTTON)
    
    def is_admin_page_loaded(self):
        """Check if admin page is loaded"""
        return self.is_element_present(self.ADMIN_TITLE)

class AdminProductsPage(AdminPage):
    # Product Management Locators
    ADD_PRODUCT_BUTTON = (By.XPATH, "//button[contains(text(), 'Add Product')]")
    PRODUCT_TABLE = (By.CSS_SELECTOR, ".products-table")
    PRODUCT_ROWS = (By.CSS_SELECTOR, ".product-row")
    EDIT_BUTTONS = (By.CSS_SELECTOR, ".edit-product")
    DELETE_BUTTONS = (By.CSS_SELECTOR, ".delete-product")
    
    # Add/Edit Product Form
    PRODUCT_NAME_INPUT = (By.CSS_SELECTOR, "input[name='name']")
    PRODUCT_CATEGORY_SELECT = (By.CSS_SELECTOR, "select[name='category']")
    PRODUCT_PRICE_INPUT = (By.CSS_SELECTOR, "input[name='price']")
    PRODUCT_DESCRIPTION_INPUT = (By.CSS_SELECTOR, "textarea[name='description']")
    PRODUCT_STOCK_INPUT = (By.CSS_SELECTOR, "input[name='stock']")
    PRODUCT_IMAGE_INPUT = (By.CSS_SELECTOR, "input[type='file']")
    SAVE_PRODUCT_BUTTON = (By.XPATH, "//button[contains(text(), 'Save Product')]")
    CANCEL_BUTTON = (By.XPATH, "//button[contains(text(), 'Cancel')]")
    
    def add_new_product(self):
        """Click add new product button"""
        self.click_element(self.ADD_PRODUCT_BUTTON)
    
    def fill_product_form(self, product_data):
        """Fill product form with data"""
        self.send_keys(self.PRODUCT_NAME_INPUT, product_data['name'])
        self.send_keys(self.PRODUCT_PRICE_INPUT, str(product_data['price']))
        self.send_keys(self.PRODUCT_DESCRIPTION_INPUT, product_data['description'])
        self.send_keys(self.PRODUCT_STOCK_INPUT, str(product_data['stock']))
    
    def save_product(self):
        """Save product"""
        self.click_element(self.SAVE_PRODUCT_BUTTON)
    
    def edit_product(self, index=0):
        """Edit product by index"""
        edit_buttons = self.find_elements(self.EDIT_BUTTONS)
        if index < len(edit_buttons):
            edit_buttons[index].click()
    
    def delete_product(self, index=0):
        """Delete product by index"""
        delete_buttons = self.find_elements(self.DELETE_BUTTONS)
        if index < len(delete_buttons):
            delete_buttons[index].click()
    
    def get_products_count(self):
        """Get number of products in table"""
        return len(self.find_elements(self.PRODUCT_ROWS))

class AdminOrdersPage(AdminPage):
    # Order Management Locators
    ORDERS_TABLE = (By.CSS_SELECTOR, ".orders-table")
    ORDER_ROWS = (By.CSS_SELECTOR, ".order-row")
    ORDER_STATUS_SELECTS = (By.CSS_SELECTOR, ".order-status-select")
    UPDATE_STATUS_BUTTONS = (By.CSS_SELECTOR, ".update-status")
    VIEW_ORDER_BUTTONS = (By.CSS_SELECTOR, ".view-order")
    
    # Order Filters
    STATUS_FILTER = (By.CSS_SELECTOR, "select[name='status']")
    DATE_FROM_INPUT = (By.CSS_SELECTOR, "input[name='dateFrom']")
    DATE_TO_INPUT = (By.CSS_SELECTOR, "input[name='dateTo']")
    APPLY_FILTER_BUTTON = (By.XPATH, "//button[contains(text(), 'Apply Filter')]")
    
    def get_orders_count(self):
        """Get number of orders in table"""
        return len(self.find_elements(self.ORDER_ROWS))
    
    def update_order_status(self, index, status):
        """Update order status by index"""
        status_selects = self.find_elements(self.ORDER_STATUS_SELECTS)
        if index < len(status_selects):
            # Select status from dropdown
            status_selects[index].click()
            # Click update button
            update_buttons = self.find_elements(self.UPDATE_STATUS_BUTTONS)
            if index < len(update_buttons):
                update_buttons[index].click()
    
    def view_order_details(self, index=0):
        """View order details by index"""
        view_buttons = self.find_elements(self.VIEW_ORDER_BUTTONS)
        if index < len(view_buttons):
            view_buttons[index].click()
    
    def filter_orders_by_status(self, status):
        """Filter orders by status"""
        self.click_element(self.STATUS_FILTER)
        # Select status option
        self.click_element(self.APPLY_FILTER_BUTTON)