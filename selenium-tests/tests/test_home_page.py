import pytest
import time
from page_objects.home_page import HomePage

class TestHomePage:
    """Test cases for Home Page functionality"""
    
    def test_home_page_loads_successfully(self, driver, base_url):
        """Test that home page loads with all essential elements"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Verify page loads
        assert "Saiyaara" in driver.title
        assert home_page.is_banner_visible()
        assert home_page.is_categories_section_visible()
        assert home_page.is_featured_products_visible()
        assert home_page.is_offers_section_visible()
    
    def test_navigation_menu_functionality(self, driver, base_url):
        """Test navigation menu links work correctly"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Test Shop navigation
        home_page.navigate_to_shop()
        assert "/shop" in driver.current_url
        
        # Navigate back to home
        home_page.navigate_to_home(base_url)
        
        # Test category navigation
        categories = ["rings", "earrings", "bangles", "anklets", "bracelets", "pendants"]
        for category in categories:
            home_page.navigate_to_category(category)
            assert f"/shop/{category}" in driver.current_url or "/shop" in driver.current_url
            home_page.navigate_to_home(base_url)
    
    def test_featured_products_display(self, driver, base_url):
        """Test featured products are displayed correctly"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Check if products are displayed
        products_count = home_page.get_featured_products_count()
        assert products_count > 0, "No featured products displayed"
        
        # Test clicking on first product
        if products_count > 0:
            home_page.click_featured_product(0)
            assert "/product/" in driver.current_url
    
    def test_special_offers_navigation(self, driver, base_url):
        """Test special offers navigation"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Test different offer types
        offers = ["under_299", "special_deals", "deal_of_month"]
        for offer in offers:
            home_page.navigate_to_home(base_url)
            home_page.click_offer(offer)
            assert "/offers/" in driver.current_url
    
    def test_theme_toggle_functionality(self, driver, base_url):
        """Test light/dark theme toggle"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Toggle theme
        home_page.toggle_theme()
        time.sleep(1)  # Wait for theme change
        
        # Toggle back
        home_page.toggle_theme()
        time.sleep(1)
    
    def test_cart_icon_functionality(self, driver, base_url):
        """Test cart icon navigation"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Check initial cart count
        initial_count = home_page.get_cart_item_count()
        
        # Click cart icon
        home_page.click_cart()
        assert "/cart" in driver.current_url
    
    def test_whatsapp_button_presence(self, driver, base_url):
        """Test WhatsApp support button is present"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Scroll to make sure WhatsApp button is visible
        home_page.scroll_to_footer()
        
        # Check if WhatsApp button is present
        assert home_page.is_element_present(home_page.WHATSAPP_BUTTON)
    
    def test_responsive_design_elements(self, driver, base_url):
        """Test responsive design elements"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Test different screen sizes
        screen_sizes = [
            (1920, 1080),  # Desktop
            (1024, 768),   # Tablet
            (375, 667)     # Mobile
        ]
        
        for width, height in screen_sizes:
            driver.set_window_size(width, height)
            time.sleep(1)
            
            # Verify essential elements are still visible
            assert home_page.is_element_present(home_page.LOGO)
            assert home_page.is_banner_visible()
        
        # Reset to default size
        driver.set_window_size(1920, 1080)
    
    def test_footer_links_functionality(self, driver, base_url):
        """Test footer links work correctly"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Scroll to footer
        home_page.scroll_to_footer()
        
        # Check if footer is present
        assert home_page.is_element_present(home_page.FOOTER)
    
    def test_login_signup_buttons(self, driver, base_url):
        """Test login and signup button functionality"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Test login button
        if home_page.is_element_present(home_page.LOGIN_BUTTON):
            home_page.click_login()
            assert "/login" in driver.current_url
            
            # Navigate back
            home_page.navigate_to_home(base_url)
        
        # Test signup button
        if home_page.is_element_present(home_page.SIGNUP_BUTTON):
            home_page.click_signup()
            assert "/signup" in driver.current_url
    
    def test_page_performance(self, driver, base_url):
        """Test page load performance"""
        start_time = time.time()
        
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Wait for page to fully load
        home_page.wait_for_element_visible(home_page.BANNER_SECTION)
        
        load_time = time.time() - start_time
        
        # Page should load within 10 seconds
        assert load_time < 10, f"Page took {load_time} seconds to load"
    
    def test_seo_elements(self, driver, base_url):
        """Test SEO elements are present"""
        home_page = HomePage(driver)
        home_page.navigate_to_home(base_url)
        
        # Check page title
        title = home_page.get_page_title()
        assert title is not None and len(title) > 0
        assert "Saiyaara" in title
        
        # Check meta description (if accessible)
        meta_description = driver.find_elements("xpath", "//meta[@name='description']")
        if meta_description:
            assert len(meta_description[0].get_attribute("content")) > 0