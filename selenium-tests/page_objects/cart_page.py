from selenium.webdriver.common.by import By
from .base_page import BasePage

class CartPage(BasePage):
    # Locators
    PAGE_TITLE = (By.XPATH, "//h1[contains(text(), 'Shopping Cart')]")
    CART_ITEMS = (By.CSS_SELECTOR, ".cart-item")
    ITEM_NAMES = (By.CSS_SELECTOR, ".item-name")
    ITEM_PRICES = (By.CSS_SELECTOR, ".item-price")
    ITEM_QUANTITIES = (By.CSS_SELECTOR, ".quantity-input")
    ITEM_IMAGES = (By.CSS_SELECTOR, ".item-image")
    
    # Quantity Controls
    INCREASE_QUANTITY_BUTTONS = (By.CSS_SELECTOR, ".quantity-increase")
    DECREASE_QUANTITY_BUTTONS = (By.CSS_SELECTOR, ".quantity-decrease")
    REMOVE_ITEM_BUTTONS = (By.CSS_SELECTOR, ".remove-item")
    
    # Cart Summary
    CART_SUMMARY = (By.CSS_SELECTOR, ".cart-summary")
    SUBTOTAL = (By.CSS_SELECTOR, ".subtotal")
    TAX_AMOUNT = (By.CSS_SELECTOR, ".tax-amount")
    SHIPPING_COST = (By.CSS_SELECTOR, ".shipping-cost")
    TOTAL_AMOUNT = (By.CSS_SELECTOR, ".total-amount")
    
    # Action Buttons
    CONTINUE_SHOPPING_BUTTON = (By.XPATH, "//button[contains(text(), 'Continue Shopping')]")
    CLEAR_CART_BUTTON = (By.XPATH, "//button[contains(text(), 'Clear Cart')]")
    CHECKOUT_BUTTON = (By.XPATH, "//button[contains(text(), 'Proceed to Checkout')]")
    
    # Empty Cart
    EMPTY_CART_MESSAGE = (By.XPATH, "//p[contains(text(), 'Your cart is empty')]")
    SHOP_NOW_BUTTON = (By.XPATH, "//button[contains(text(), 'Shop Now')]")
    
    # Coupon Section
    COUPON_INPUT = (By.CSS_SELECTOR, "input[placeholder*='coupon']")
    APPLY_COUPON_BUTTON = (By.XPATH, "//button[contains(text(), 'Apply Coupon')]")
    COUPON_SUCCESS_MESSAGE = (By.CSS_SELECTOR, ".coupon-success")
    COUPON_ERROR_MESSAGE = (By.CSS_SELECTOR, ".coupon-error")
    
    def __init__(self, driver):
        super().__init__(driver)
    
    def navigate_to_cart(self, base_url):
        """Navigate to cart page"""
        self.navigate_to(f"{base_url}/cart")
    
    def get_cart_items_count(self):
        """Get number of items in cart"""
        return len(self.find_elements(self.CART_ITEMS))
    
    def get_item_names(self):
        """Get all item names in cart"""
        name_elements = self.find_elements(self.ITEM_NAMES)
        return [element.text for element in name_elements]
    
    def get_item_prices(self):
        """Get all item prices in cart"""
        price_elements = self.find_elements(self.ITEM_PRICES)
        return [element.text for element in price_elements]
    
    def get_item_quantities(self):
        """Get all item quantities in cart"""
        quantity_elements = self.find_elements(self.ITEM_QUANTITIES)
        return [element.get_attribute('value') for element in quantity_elements]
    
    def increase_item_quantity(self, index=0):
        """Increase quantity of item by index"""
        increase_buttons = self.find_elements(self.INCREASE_QUANTITY_BUTTONS)
        if index < len(increase_buttons):
            increase_buttons[index].click()
    
    def decrease_item_quantity(self, index=0):
        """Decrease quantity of item by index"""
        decrease_buttons = self.find_elements(self.DECREASE_QUANTITY_BUTTONS)
        if index < len(decrease_buttons):
            decrease_buttons[index].click()
    
    def update_item_quantity(self, index, quantity):
        """Update item quantity directly"""
        quantity_inputs = self.find_elements(self.ITEM_QUANTITIES)
        if index < len(quantity_inputs):
            quantity_inputs[index].clear()
            quantity_inputs[index].send_keys(str(quantity))
    
    def remove_item(self, index=0):
        """Remove item from cart by index"""
        remove_buttons = self.find_elements(self.REMOVE_ITEM_BUTTONS)
        if index < len(remove_buttons):
            remove_buttons[index].click()
    
    def get_subtotal(self):
        """Get cart subtotal"""
        if self.is_element_present(self.SUBTOTAL):
            return self.get_text(self.SUBTOTAL)
        return "0"
    
    def get_tax_amount(self):
        """Get tax amount"""
        if self.is_element_present(self.TAX_AMOUNT):
            return self.get_text(self.TAX_AMOUNT)
        return "0"
    
    def get_shipping_cost(self):
        """Get shipping cost"""
        if self.is_element_present(self.SHIPPING_COST):
            return self.get_text(self.SHIPPING_COST)
        return "0"
    
    def get_total_amount(self):
        """Get total amount"""
        if self.is_element_present(self.TOTAL_AMOUNT):
            return self.get_text(self.TOTAL_AMOUNT)
        return "0"
    
    def continue_shopping(self):
        """Click continue shopping button"""
        self.click_element(self.CONTINUE_SHOPPING_BUTTON)
    
    def clear_cart(self):
        """Clear all items from cart"""
        self.click_element(self.CLEAR_CART_BUTTON)
    
    def proceed_to_checkout(self):
        """Proceed to checkout"""
        self.click_element(self.CHECKOUT_BUTTON)
    
    def apply_coupon(self, coupon_code):
        """Apply coupon code"""
        self.send_keys(self.COUPON_INPUT, coupon_code)
        self.click_element(self.APPLY_COUPON_BUTTON)
    
    def is_cart_empty(self):
        """Check if cart is empty"""
        return self.is_element_present(self.EMPTY_CART_MESSAGE)
    
    def is_coupon_applied_successfully(self):
        """Check if coupon was applied successfully"""
        return self.is_element_present(self.COUPON_SUCCESS_MESSAGE)
    
    def is_coupon_error_displayed(self):
        """Check if coupon error is displayed"""
        return self.is_element_present(self.COUPON_ERROR_MESSAGE)
    
    def shop_now_from_empty_cart(self):
        """Click shop now button from empty cart"""
        self.click_element(self.SHOP_NOW_BUTTON)