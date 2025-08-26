from selenium.webdriver.common.by import By
from .base_page import BasePage

class ShopPage(BasePage):
    # Locators
    PAGE_TITLE = (By.XPATH, "//h1[contains(text(), 'Shop')]")
    SEARCH_INPUT = (By.CSS_SELECTOR, "input[placeholder*='Search']")
    SEARCH_BUTTON = (By.CSS_SELECTOR, "button[type='submit']")
    
    # Filters
    CATEGORY_FILTER = (By.CSS_SELECTOR, ".category-filter")
    PRICE_FILTER = (By.CSS_SELECTOR, ".price-filter")
    SORT_DROPDOWN = (By.CSS_SELECTOR, ".sort-dropdown")
    
    # Product Grid
    PRODUCT_GRID = (By.CSS_SELECTOR, ".product-grid")
    PRODUCT_CARDS = (By.CSS_SELECTOR, ".product-card")
    PRODUCT_IMAGES = (By.CSS_SELECTOR, ".product-image")
    PRODUCT_TITLES = (By.CSS_SELECTOR, ".product-title")
    PRODUCT_PRICES = (By.CSS_SELECTOR, ".product-price")
    ADD_TO_CART_BUTTONS = (By.XPATH, "//button[contains(text(), 'Add to Cart')]")
    VIEW_DETAILS_BUTTONS = (By.XPATH, "//button[contains(text(), 'View Details')]")
    
    # Pagination
    PAGINATION = (By.CSS_SELECTOR, ".pagination")
    NEXT_PAGE_BUTTON = (By.XPATH, "//button[contains(text(), 'Next')]")
    PREV_PAGE_BUTTON = (By.XPATH, "//button[contains(text(), 'Previous')]")
    PAGE_NUMBERS = (By.CSS_SELECTOR, ".page-number")
    
    # Category Filters
    RINGS_FILTER = (By.XPATH, "//input[@value='rings']")
    EARRINGS_FILTER = (By.XPATH, "//input[@value='earrings']")
    BANGLES_FILTER = (By.XPATH, "//input[@value='bangles']")
    ANKLETS_FILTER = (By.XPATH, "//input[@value='anklets']")
    BRACELETS_FILTER = (By.XPATH, "//input[@value='bracelets']")
    PENDANTS_FILTER = (By.XPATH, "//input[@value='pendants']")
    
    # Price Range
    MIN_PRICE_INPUT = (By.CSS_SELECTOR, "input[name='minPrice']")
    MAX_PRICE_INPUT = (By.CSS_SELECTOR, "input[name='maxPrice']")
    APPLY_PRICE_FILTER = (By.XPATH, "//button[contains(text(), 'Apply')]")
    
    # Sort Options
    SORT_BY_PRICE_LOW = (By.XPATH, "//option[contains(text(), 'Price: Low to High')]")
    SORT_BY_PRICE_HIGH = (By.XPATH, "//option[contains(text(), 'Price: High to Low')]")
    SORT_BY_NAME = (By.XPATH, "//option[contains(text(), 'Name')]")
    SORT_BY_NEWEST = (By.XPATH, "//option[contains(text(), 'Newest')]")
    
    # No Results
    NO_RESULTS_MESSAGE = (By.XPATH, "//p[contains(text(), 'No products found')]")
    
    def __init__(self, driver):
        super().__init__(driver)
    
    def navigate_to_shop(self, base_url):
        """Navigate to shop page"""
        self.navigate_to(f"{base_url}/shop")
    
    def navigate_to_category(self, base_url, category):
        """Navigate to specific category"""
        self.navigate_to(f"{base_url}/shop/{category}")
    
    def search_products(self, search_term):
        """Search for products"""
        self.send_keys(self.SEARCH_INPUT, search_term)
        self.click_element(self.SEARCH_BUTTON)
    
    def filter_by_category(self, category):
        """Filter products by category"""
        category_filters = {
            "rings": self.RINGS_FILTER,
            "earrings": self.EARRINGS_FILTER,
            "bangles": self.BANGLES_FILTER,
            "anklets": self.ANKLETS_FILTER,
            "bracelets": self.BRACELETS_FILTER,
            "pendants": self.PENDANTS_FILTER
        }
        if category in category_filters:
            self.click_element(category_filters[category])
    
    def set_price_range(self, min_price, max_price):
        """Set price range filter"""
        self.send_keys(self.MIN_PRICE_INPUT, str(min_price))
        self.send_keys(self.MAX_PRICE_INPUT, str(max_price))
        self.click_element(self.APPLY_PRICE_FILTER)
    
    def sort_products(self, sort_option):
        """Sort products"""
        self.click_element(self.SORT_DROPDOWN)
        sort_options = {
            "price_low": self.SORT_BY_PRICE_LOW,
            "price_high": self.SORT_BY_PRICE_HIGH,
            "name": self.SORT_BY_NAME,
            "newest": self.SORT_BY_NEWEST
        }
        if sort_option in sort_options:
            self.click_element(sort_options[sort_option])
    
    def get_product_count(self):
        """Get number of products displayed"""
        return len(self.find_elements(self.PRODUCT_CARDS))
    
    def click_product(self, index=0):
        """Click on product by index"""
        products = self.find_elements(self.PRODUCT_CARDS)
        if index < len(products):
            products[index].click()
    
    def add_product_to_cart(self, index=0):
        """Add product to cart by index"""
        add_buttons = self.find_elements(self.ADD_TO_CART_BUTTONS)
        if index < len(add_buttons):
            add_buttons[index].click()
    
    def view_product_details(self, index=0):
        """View product details by index"""
        detail_buttons = self.find_elements(self.VIEW_DETAILS_BUTTONS)
        if index < len(detail_buttons):
            detail_buttons[index].click()
    
    def get_product_titles(self):
        """Get all product titles"""
        title_elements = self.find_elements(self.PRODUCT_TITLES)
        return [element.text for element in title_elements]
    
    def get_product_prices(self):
        """Get all product prices"""
        price_elements = self.find_elements(self.PRODUCT_PRICES)
        return [element.text for element in price_elements]
    
    def go_to_next_page(self):
        """Go to next page"""
        if self.is_element_present(self.NEXT_PAGE_BUTTON):
            self.click_element(self.NEXT_PAGE_BUTTON)
    
    def go_to_previous_page(self):
        """Go to previous page"""
        if self.is_element_present(self.PREV_PAGE_BUTTON):
            self.click_element(self.PREV_PAGE_BUTTON)
    
    def is_no_results_displayed(self):
        """Check if no results message is displayed"""
        return self.is_element_present(self.NO_RESULTS_MESSAGE)
    
    def is_shop_page_loaded(self):
        """Check if shop page is loaded"""
        return self.is_element_present(self.PRODUCT_GRID) or self.is_element_present(self.NO_RESULTS_MESSAGE)