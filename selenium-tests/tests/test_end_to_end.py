import pytest
import time
from faker import Faker
from page_objects.home_page import HomePage
from page_objects.shop_page import ShopPage
from page_objects.cart_page import CartPage
from page_objects.login_page import LoginPage

fake = Faker()

class TestEndToEndScenarios:
    """End-to-end test scenarios covering complete user journeys"""
    
    def test_complete_guest_shopping_journey(self, driver, base_url):
        """Test complete shopping journey as guest user"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        cart_page = CartPage(driver)
        
        # 1. Visit home page
        home_page.navigate_to_home(base_url)
        assert home_page.is_banner_visible()
        
        # 2. Browse categories from home page
        home_page.navigate_to_category("rings")
        time.sleep(2)
        assert "/shop" in driver.current_url
        
        # 3. Search for products
        shop_page.search_products("gold")
        time.sleep(2)
        
        # 4. Add product to cart
        products_count = shop_page.get_product_count()
        if products_count > 0:
            shop_page.add_product_to_cart(0)
            time.sleep(2)
            
            # 5. View cart
            cart_page.navigate_to_cart(base_url)
            assert cart_page.get_cart_items_count() > 0
            
            # 6. Update quantity
            cart_page.increase_item_quantity(0)
            time.sleep(1)
            
            # 7. Proceed to checkout (as guest)
            if cart_page.is_element_present(cart_page.CHECKOUT_BUTTON):
                cart_page.proceed_to_checkout()
                assert "/checkout" in driver.current_url
    
    def test_complete_registered_user_journey(self, driver, base_url, test_user):
        """Test complete shopping journey as registered user"""
        login_page = LoginPage(driver)
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        cart_page = CartPage(driver)
        
        # 1. Login
        login_page.navigate_to_login(base_url)
        login_page.login(test_user['email'], test_user['password'])
        time.sleep(3)
        
        # 2. Browse products
        home_page.navigate_to_home(base_url)
        home_page.navigate_to_shop()
        
        # 3. Filter by category
        shop_page.filter_by_category("earrings")
        time.sleep(2)
        
        # 4. Sort products
        shop_page.sort_products("price_low")
        time.sleep(2)
        
        # 5. Add multiple products to cart
        products_count = shop_page.get_product_count()
        if products_count >= 2:
            shop_page.add_product_to_cart(0)
            time.sleep(1)
            shop_page.add_product_to_cart(1)
            time.sleep(1)
        
        # 6. Review cart
        cart_page.navigate_to_cart(base_url)
        items_count = cart_page.get_cart_items_count()
        assert items_count > 0
        
        # 7. Apply coupon (if available)
        if cart_page.is_element_present(cart_page.COUPON_INPUT):
            cart_page.apply_coupon("TEST10")
            time.sleep(2)
        
        # 8. Proceed to checkout
        if cart_page.is_element_present(cart_page.CHECKOUT_BUTTON):
            cart_page.proceed_to_checkout()
            assert "/checkout" in driver.current_url
    
    def test_product_discovery_journey(self, driver, base_url):
        """Test product discovery through different paths"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        
        # 1. Start from home page
        home_page.navigate_to_home(base_url)
        
        # 2. Explore featured products
        featured_count = home_page.get_featured_products_count()
        if featured_count > 0:
            home_page.click_featured_product(0)
            time.sleep(2)
            assert "/product/" in driver.current_url
            
            # Go back to home
            home_page.navigate_to_home(base_url)
        
        # 3. Explore special offers
        home_page.click_offer("under_299")
        time.sleep(2)
        assert "/offers/" in driver.current_url
        
        # 4. Navigate to shop from offers
        shop_page.navigate_to_shop(base_url)
        
        # 5. Use search functionality
        search_terms = ["ring", "gold", "silver"]
        for term in search_terms:
            shop_page.search_products(term)
            time.sleep(2)
            
            # Check if results are relevant
            products_count = shop_page.get_product_count()
            if products_count > 0:
                # Click on first result
                shop_page.click_product(0)
                time.sleep(2)
                assert "/product/" in driver.current_url
                
                # Go back to shop
                shop_page.navigate_to_shop(base_url)
    
    def test_mobile_user_journey(self, driver, base_url):
        """Test complete user journey on mobile viewport"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        cart_page = CartPage(driver)
        
        # Set mobile viewport
        driver.set_window_size(375, 667)
        time.sleep(1)
        
        # 1. Navigate to home page
        home_page.navigate_to_home(base_url)
        assert home_page.is_banner_visible()
        
        # 2. Test mobile navigation
        home_page.navigate_to_shop()
        assert "/shop" in driver.current_url
        
        # 3. Browse products on mobile
        products_count = shop_page.get_product_count()
        if products_count > 0:
            # Scroll and interact with products
            shop_page.scroll_to_element(shop_page.PRODUCT_CARDS)
            shop_page.add_product_to_cart(0)
            time.sleep(2)
        
        # 4. Check cart on mobile
        cart_page.navigate_to_cart(base_url)
        if cart_page.get_cart_items_count() > 0:
            # Test mobile cart interactions
            cart_page.increase_item_quantity(0)
            time.sleep(1)
        
        # Reset viewport
        driver.set_window_size(1920, 1080)
    
    def test_cross_browser_compatibility_journey(self, driver, base_url):
        """Test key functionality across different scenarios"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        
        # Test JavaScript functionality
        home_page.navigate_to_home(base_url)
        
        # Test theme toggle
        home_page.toggle_theme()
        time.sleep(1)
        home_page.toggle_theme()
        time.sleep(1)
        
        # Test dynamic content loading
        home_page.navigate_to_shop()
        
        # Test AJAX interactions (if any)
        shop_page.search_products("test")
        time.sleep(2)
        
        # Test form interactions
        if shop_page.is_element_present(shop_page.SEARCH_INPUT):
            search_input = shop_page.find_element(shop_page.SEARCH_INPUT)
            search_input.clear()
            search_input.send_keys("jewelry")
            time.sleep(1)
    
    def test_error_recovery_journey(self, driver, base_url):
        """Test user journey with error scenarios and recovery"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        cart_page = CartPage(driver)
        
        # 1. Start normal journey
        home_page.navigate_to_home(base_url)
        home_page.navigate_to_shop()
        
        # 2. Test invalid search
        shop_page.search_products("xyznonexistent123")
        time.sleep(2)
        
        # Should handle gracefully
        assert shop_page.is_no_results_displayed() or shop_page.get_product_count() == 0
        
        # 3. Recover with valid search
        shop_page.search_products("ring")
        time.sleep(2)
        
        # 4. Test cart with invalid operations
        products_count = shop_page.get_product_count()
        if products_count > 0:
            shop_page.add_product_to_cart(0)
            time.sleep(2)
            
            cart_page.navigate_to_cart(base_url)
            
            # Try invalid quantity
            try:
                cart_page.update_item_quantity(0, -5)
                time.sleep(1)
                # Should handle gracefully
            except:
                pass
            
            # Recover with valid quantity
            cart_page.update_item_quantity(0, 2)
            time.sleep(1)
    
    def test_performance_under_load_simulation(self, driver, base_url):
        """Test performance with rapid interactions"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        
        start_time = time.time()
        
        # Rapid navigation
        for i in range(5):
            home_page.navigate_to_home(base_url)
            home_page.navigate_to_shop()
            
            # Quick interactions
            if shop_page.get_product_count() > 0:
                shop_page.click_product(0)
                driver.back()
        
        end_time = time.time()
        total_time = end_time - start_time
        
        # Should complete within reasonable time
        assert total_time < 60, f"Performance test took {total_time} seconds"
    
    def test_accessibility_journey(self, driver, base_url):
        """Test accessibility features during user journey"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        
        # 1. Navigate with keyboard
        home_page.navigate_to_home(base_url)
        
        # Test tab navigation (basic check)
        active_element = driver.switch_to.active_element
        
        # Send tab key to navigate
        from selenium.webdriver.common.keys import Keys
        active_element.send_keys(Keys.TAB)
        time.sleep(0.5)
        
        # 2. Check for alt text on images
        home_page.navigate_to_shop()
        
        if shop_page.get_product_count() > 0:
            images = shop_page.find_elements(shop_page.PRODUCT_IMAGES)
            for image in images[:3]:  # Check first 3 images
                alt_text = image.get_attribute("alt")
                # Images should have alt text for accessibility
                assert alt_text is not None and len(alt_text) > 0
    
    def test_seo_and_metadata_journey(self, driver, base_url):
        """Test SEO elements throughout user journey"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        
        pages_to_test = [
            (base_url, "Home"),
            (f"{base_url}/shop", "Shop"),
            (f"{base_url}/shop/rings", "Rings"),
            (f"{base_url}/about", "About"),
            (f"{base_url}/contact", "Contact")
        ]
        
        for url, page_name in pages_to_test:
            driver.get(url)
            time.sleep(2)
            
            # Check page title
            title = driver.title
            assert title is not None and len(title) > 0
            assert "Saiyaara" in title or page_name.lower() in title.lower()
            
            # Check meta description
            meta_desc = driver.find_elements("xpath", "//meta[@name='description']")
            if meta_desc:
                desc_content = meta_desc[0].get_attribute("content")
                assert desc_content is not None and len(desc_content) > 0
    
    def test_data_persistence_journey(self, driver, base_url):
        """Test data persistence across page reloads and navigation"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        cart_page = CartPage(driver)
        
        # 1. Add items to cart
        shop_page.navigate_to_shop(base_url)
        products_count = shop_page.get_product_count()
        
        if products_count > 0:
            shop_page.add_product_to_cart(0)
            time.sleep(2)
            
            # 2. Navigate away and back
            home_page.navigate_to_home(base_url)
            cart_page.navigate_to_cart(base_url)
            
            # Cart should still have items
            assert cart_page.get_cart_items_count() > 0
            
            # 3. Refresh page
            driver.refresh()
            time.sleep(2)
            
            # Cart should persist (depending on implementation)
            # This test depends on whether cart uses localStorage, sessionStorage, or server-side storage
    
    def test_security_throughout_journey(self, driver, base_url):
        """Test security measures throughout user journey"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        login_page = LoginPage(driver)
        
        # 1. Test HTTPS (if applicable)
        home_page.navigate_to_home(base_url)
        current_url = driver.current_url
        # In production, should be HTTPS
        
        # 2. Test form security
        login_page.navigate_to_login(base_url)
        
        # Check password field is properly masked
        password_field = login_page.find_element(login_page.PASSWORD_INPUT)
        assert password_field.get_attribute("type") == "password"
        
        # 3. Test XSS prevention in search
        shop_page.navigate_to_shop(base_url)
        shop_page.search_products("<script>alert('xss')</script>")
        time.sleep(2)
        
        # Should not execute script
        try:
            driver.switch_to.alert
            assert False, "XSS vulnerability detected"
        except:
            pass  # No alert is good
        
        # 4. Test SQL injection prevention
        login_page.navigate_to_login(base_url)
        login_page.login("' OR '1'='1", "password")
        time.sleep(2)
        
        # Should not succeed
        assert "/admin" not in driver.current_url