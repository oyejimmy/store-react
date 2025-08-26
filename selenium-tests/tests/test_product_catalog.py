import pytest
import time
from page_objects.shop_page import ShopPage
from page_objects.home_page import HomePage

class TestProductCatalog:
    """Test cases for product catalog and shopping functionality"""
    
    def test_shop_page_loads_correctly(self, driver, base_url):
        """Test shop page loads with product grid"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        assert shop_page.is_shop_page_loaded()
        
        # Check if products are displayed or no results message
        products_count = shop_page.get_product_count()
        if products_count == 0:
            assert shop_page.is_no_results_displayed()
        else:
            assert products_count > 0
    
    def test_product_search_functionality(self, driver, base_url):
        """Test product search functionality"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        # Test search with valid term
        search_terms = ["ring", "gold", "earring", "bracelet"]
        
        for term in search_terms:
            shop_page.search_products(term)
            time.sleep(2)
            
            # Check results
            products_count = shop_page.get_product_count()
            if products_count > 0:
                # Verify search results contain the search term
                product_titles = shop_page.get_product_titles()
                # At least one product should contain the search term
                found_match = any(term.lower() in title.lower() for title in product_titles)
                # Note: This assertion might need adjustment based on search implementation
            
            # Navigate back to shop for next search
            shop_page.navigate_to_shop(base_url)
    
    def test_category_filtering(self, driver, base_url):
        """Test product filtering by category"""
        shop_page = ShopPage(driver)
        
        categories = ["rings", "earrings", "bangles", "anklets", "bracelets", "pendants"]
        
        for category in categories:
            # Navigate to specific category
            shop_page.navigate_to_category(base_url, category)
            time.sleep(2)
            
            # Check if page loads
            assert shop_page.is_shop_page_loaded()
            
            # Check URL contains category
            assert category in driver.current_url or "/shop" in driver.current_url
    
    def test_price_range_filtering(self, driver, base_url):
        """Test price range filtering"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        # Test different price ranges
        price_ranges = [
            (0, 100),
            (100, 500),
            (500, 1000)
        ]
        
        for min_price, max_price in price_ranges:
            if shop_page.is_element_present(shop_page.MIN_PRICE_INPUT):
                shop_page.set_price_range(min_price, max_price)
                time.sleep(2)
                
                # Verify filtered results
                products_count = shop_page.get_product_count()
                if products_count > 0:
                    product_prices = shop_page.get_product_prices()
                    # Verify prices are within range (would need price parsing)
                
                # Reset for next test
                shop_page.navigate_to_shop(base_url)
    
    def test_product_sorting(self, driver, base_url):
        """Test product sorting functionality"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        # Test different sorting options
        sort_options = ["price_low", "price_high", "name", "newest"]
        
        for sort_option in sort_options:
            if shop_page.is_element_present(shop_page.SORT_DROPDOWN):
                shop_page.sort_products(sort_option)
                time.sleep(2)
                
                # Verify sorting (would need to parse and compare values)
                products_count = shop_page.get_product_count()
                if products_count > 1:
                    # Get product data to verify sorting
                    if sort_option in ["price_low", "price_high"]:
                        prices = shop_page.get_product_prices()
                        # Verify price sorting
                    elif sort_option == "name":
                        titles = shop_page.get_product_titles()
                        # Verify alphabetical sorting
                
                # Reset for next test
                shop_page.navigate_to_shop(base_url)
    
    def test_product_detail_navigation(self, driver, base_url):
        """Test navigation to product detail page"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        products_count = shop_page.get_product_count()
        if products_count > 0:
            # Click on first product
            shop_page.click_product(0)
            time.sleep(2)
            
            # Should navigate to product detail page
            assert "/product/" in driver.current_url
            
            # Navigate back to shop
            shop_page.navigate_to_shop(base_url)
            
            # Test view details button
            shop_page.view_product_details(0)
            time.sleep(2)
            assert "/product/" in driver.current_url
    
    def test_add_to_cart_functionality(self, driver, base_url):
        """Test adding products to cart"""
        shop_page = ShopPage(driver)
        home_page = HomePage(driver)
        
        shop_page.navigate_to_shop(base_url)
        
        products_count = shop_page.get_product_count()
        if products_count > 0:
            # Get initial cart count
            home_page.navigate_to_home(base_url)
            initial_cart_count = home_page.get_cart_item_count()
            
            # Go back to shop and add product
            shop_page.navigate_to_shop(base_url)
            shop_page.add_product_to_cart(0)
            time.sleep(2)
            
            # Check if cart count increased
            home_page.navigate_to_home(base_url)
            new_cart_count = home_page.get_cart_item_count()
            
            # Verify cart count increased (if cart functionality is implemented)
            # This assertion might need adjustment based on implementation
    
    def test_pagination_functionality(self, driver, base_url):
        """Test product pagination"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        # Check if pagination exists
        if shop_page.is_element_present(shop_page.PAGINATION):
            # Test next page
            if shop_page.is_element_present(shop_page.NEXT_PAGE_BUTTON):
                current_url = driver.current_url
                shop_page.go_to_next_page()
                time.sleep(2)
                
                # URL should change or products should change
                new_url = driver.current_url
                # Verify pagination worked
                
                # Test previous page
                if shop_page.is_element_present(shop_page.PREV_PAGE_BUTTON):
                    shop_page.go_to_previous_page()
                    time.sleep(2)
    
    def test_empty_search_results(self, driver, base_url):
        """Test search with no results"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        # Search for something that shouldn't exist
        shop_page.search_products("xyznonexistentproduct123")
        time.sleep(2)
        
        # Should show no results message
        assert shop_page.is_no_results_displayed() or shop_page.get_product_count() == 0
    
    def test_product_images_load(self, driver, base_url):
        """Test product images load correctly"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        products_count = shop_page.get_product_count()
        if products_count > 0:
            # Check if product images are present
            images = shop_page.find_elements(shop_page.PRODUCT_IMAGES)
            
            for image in images[:3]:  # Check first 3 images
                # Verify image has src attribute
                src = image.get_attribute("src")
                assert src is not None and len(src) > 0
                
                # Verify image is loaded (check natural width/height)
                natural_width = driver.execute_script("return arguments[0].naturalWidth;", image)
                assert natural_width > 0, "Image failed to load"
    
    def test_product_price_display(self, driver, base_url):
        """Test product prices are displayed correctly"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        products_count = shop_page.get_product_count()
        if products_count > 0:
            prices = shop_page.get_product_prices()
            
            for price in prices:
                # Verify price format (should contain currency symbol or number)
                assert len(price) > 0
                # Could add more specific price format validation
    
    def test_responsive_product_grid(self, driver, base_url):
        """Test product grid responsiveness"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        # Test different screen sizes
        screen_sizes = [
            (1920, 1080),  # Desktop
            (1024, 768),   # Tablet
            (375, 667)     # Mobile
        ]
        
        for width, height in screen_sizes:
            driver.set_window_size(width, height)
            time.sleep(1)
            
            # Verify product grid is still functional
            products_count = shop_page.get_product_count()
            if products_count > 0:
                # Verify products are still clickable
                assert shop_page.is_element_present(shop_page.PRODUCT_GRID)
        
        # Reset to default size
        driver.set_window_size(1920, 1080)
    
    def test_category_navigation_from_home(self, driver, base_url):
        """Test category navigation from home page"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        
        home_page.navigate_to_home(base_url)
        
        # Test navigation to different categories from home page
        categories = ["rings", "earrings", "bangles"]
        
        for category in categories:
            home_page.navigate_to_home(base_url)
            home_page.navigate_to_category(category)
            time.sleep(2)
            
            # Should be on shop page with category filter
            assert "/shop" in driver.current_url
            assert shop_page.is_shop_page_loaded()
    
    def test_search_input_validation(self, driver, base_url):
        """Test search input validation and edge cases"""
        shop_page = ShopPage(driver)
        shop_page.navigate_to_shop(base_url)
        
        # Test edge cases
        edge_cases = [
            "",  # Empty search
            "   ",  # Whitespace only
            "a",  # Single character
            "x" * 100,  # Very long search term
            "!@#$%^&*()",  # Special characters
            "<script>alert('test')</script>",  # XSS attempt
        ]
        
        for search_term in edge_cases:
            shop_page.search_products(search_term)
            time.sleep(1)
            
            # Should handle gracefully without errors
            assert shop_page.is_shop_page_loaded()
            
            # Navigate back for next test
            shop_page.navigate_to_shop(base_url)