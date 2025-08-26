from selenium.webdriver.common.by import By
from .base_page import BasePage

class HomePage(BasePage):
    # Locators
    LOGO = (By.XPATH, "//a[contains(text(), 'Saiyaara')]")
    NAVIGATION_MENU = (By.CSS_SELECTOR, "nav")
    HOME_LINK = (By.XPATH, "//a[contains(text(), 'Home')]")
    SHOP_LINK = (By.XPATH, "//a[contains(text(), 'Shop')]")
    OFFERS_LINK = (By.XPATH, "//a[contains(text(), 'Offers')]")
    CONTACT_LINK = (By.XPATH, "//a[contains(text(), 'Contact')]")
    ABOUT_LINK = (By.XPATH, "//a[contains(text(), 'About')]")
    LOGIN_BUTTON = (By.XPATH, "//button[contains(text(), 'Login')]")
    SIGNUP_BUTTON = (By.XPATH, "//button[contains(text(), 'Sign Up')]")
    CART_ICON = (By.CSS_SELECTOR, "[data-testid='shopping-cart']")
    CART_BADGE = (By.CSS_SELECTOR, ".MuiBadge-badge")
    THEME_TOGGLE = (By.CSS_SELECTOR, "[data-testid='theme-toggle']")
    
    # Banner Section
    BANNER_SECTION = (By.CSS_SELECTOR, ".banner-section")
    BANNER_TITLE = (By.CSS_SELECTOR, ".banner-title")
    BANNER_SUBTITLE = (By.CSS_SELECTOR, ".banner-subtitle")
    BANNER_CTA_BUTTON = (By.CSS_SELECTOR, ".banner-cta")
    
    # Categories Section
    CATEGORIES_SECTION = (By.CSS_SELECTOR, ".categories-section")
    CATEGORY_CARDS = (By.CSS_SELECTOR, ".category-card")
    CATEGORY_RINGS = (By.XPATH, "//a[contains(@href, '/shop/rings')]")
    CATEGORY_EARRINGS = (By.XPATH, "//a[contains(@href, '/shop/earrings')]")
    CATEGORY_BANGLES = (By.XPATH, "//a[contains(@href, '/shop/bangles')]")
    CATEGORY_ANKLETS = (By.XPATH, "//a[contains(@href, '/shop/anklets')]")
    CATEGORY_BRACELETS = (By.XPATH, "//a[contains(@href, '/shop/bracelets')]")
    CATEGORY_PENDANTS = (By.XPATH, "//a[contains(@href, '/shop/pendants')]")
    
    # Featured Products Section
    FEATURED_PRODUCTS_SECTION = (By.CSS_SELECTOR, ".featured-products")
    PRODUCT_CARDS = (By.CSS_SELECTOR, ".product-card")
    PRODUCT_TITLES = (By.CSS_SELECTOR, ".product-title")
    PRODUCT_PRICES = (By.CSS_SELECTOR, ".product-price")
    PRODUCT_IMAGES = (By.CSS_SELECTOR, ".product-image")
    VIEW_DETAILS_BUTTONS = (By.XPATH, "//button[contains(text(), 'View Details')]")
    
    # Special Offers Section
    OFFERS_SECTION = (By.CSS_SELECTOR, ".offers-section")
    OFFER_CARDS = (By.CSS_SELECTOR, ".offer-card")
    UNDER_299_OFFER = (By.XPATH, "//a[contains(@href, '/offers/under-299')]")
    SPECIAL_DEALS_OFFER = (By.XPATH, "//a[contains(@href, '/offers/special-deals')]")
    DEAL_OF_MONTH_OFFER = (By.XPATH, "//a[contains(@href, '/offers/deal-of-month')]")
    
    # Footer Section
    FOOTER = (By.CSS_SELECTOR, "footer")
    FOOTER_LINKS = (By.CSS_SELECTOR, "footer a")
    SOCIAL_MEDIA_LINKS = (By.CSS_SELECTOR, ".social-links a")
    WHATSAPP_BUTTON = (By.CSS_SELECTOR, ".whatsapp-button")
    
    def __init__(self, driver):
        super().__init__(driver)
    
    def navigate_to_home(self, base_url):
        """Navigate to home page"""
        self.navigate_to(base_url)
    
    def click_logo(self):
        """Click on logo"""
        self.click_element(self.LOGO)
    
    def click_login(self):
        """Click login button"""
        self.click_element(self.LOGIN_BUTTON)
    
    def click_signup(self):
        """Click signup button"""
        self.click_element(self.SIGNUP_BUTTON)
    
    def click_cart(self):
        """Click cart icon"""
        self.click_element(self.CART_ICON)
    
    def get_cart_item_count(self):
        """Get cart item count from badge"""
        if self.is_element_present(self.CART_BADGE):
            return self.get_text(self.CART_BADGE)
        return "0"
    
    def navigate_to_shop(self):
        """Navigate to shop page"""
        self.click_element(self.SHOP_LINK)
    
    def navigate_to_category(self, category):
        """Navigate to specific category"""
        category_locators = {
            "rings": self.CATEGORY_RINGS,
            "earrings": self.CATEGORY_EARRINGS,
            "bangles": self.CATEGORY_BANGLES,
            "anklets": self.CATEGORY_ANKLETS,
            "bracelets": self.CATEGORY_BRACELETS,
            "pendants": self.CATEGORY_PENDANTS
        }
        if category in category_locators:
            self.click_element(category_locators[category])
    
    def click_featured_product(self, index=0):
        """Click on featured product by index"""
        products = self.find_elements(self.PRODUCT_CARDS)
        if index < len(products):
            products[index].click()
    
    def get_featured_products_count(self):
        """Get count of featured products"""
        return len(self.find_elements(self.PRODUCT_CARDS))
    
    def click_offer(self, offer_type):
        """Click on specific offer"""
        offer_locators = {
            "under_299": self.UNDER_299_OFFER,
            "special_deals": self.SPECIAL_DEALS_OFFER,
            "deal_of_month": self.DEAL_OF_MONTH_OFFER
        }
        if offer_type in offer_locators:
            self.click_element(offer_locators[offer_type])
    
    def toggle_theme(self):
        """Toggle between light and dark theme"""
        self.click_element(self.THEME_TOGGLE)
    
    def click_whatsapp_button(self):
        """Click WhatsApp support button"""
        self.click_element(self.WHATSAPP_BUTTON)
    
    def is_banner_visible(self):
        """Check if banner section is visible"""
        return self.is_element_present(self.BANNER_SECTION)
    
    def is_categories_section_visible(self):
        """Check if categories section is visible"""
        return self.is_element_present(self.CATEGORIES_SECTION)
    
    def is_featured_products_visible(self):
        """Check if featured products section is visible"""
        return self.is_element_present(self.FEATURED_PRODUCTS_SECTION)
    
    def is_offers_section_visible(self):
        """Check if offers section is visible"""
        return self.is_element_present(self.OFFERS_SECTION)
    
    def scroll_to_footer(self):
        """Scroll to footer"""
        self.scroll_to_element(self.FOOTER)