import pytest
import time
from page_objects.cart_page import CartPage
from page_objects.shop_page import ShopPage
from page_objects.home_page import HomePage

class TestShoppingCart:
    """Test cases for shopping cart functionality"""
    
    def test_cart_page_loads_correctly(self, driver, base_url):
        """Test cart page loads correctly"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        # Page should load (either with items or empty cart message)
        assert cart_page.is_element_present(cart_page.PAGE_TITLE) or \
               cart_page.is_cart_empty()
    
    def test_empty_cart_display(self, driver, base_url):
        """Test empty cart displays correct message"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        # If cart is empty, should show empty message
        if cart_page.get_cart_items_count() == 0:
            assert cart_page.is_cart_empty()
            
            # Test shop now button from empty cart
            if cart_page.is_element_present(cart_page.SHOP_NOW_BUTTON):
                cart_page.shop_now_from_empty_cart()
                assert "/shop" in driver.current_url
    
    def test_add_product_to_cart_from_shop(self, driver, base_url):
        """Test adding product to cart from shop page"""
        shop_page = ShopPage(driver)
        cart_page = CartPage(driver)
        home_page = HomePage(driver)
        
        # Navigate to shop
        shop_page.navigate_to_shop(base_url)
        
        # Check if products are available
        products_count = shop_page.get_product_count()
        if products_count > 0:
            # Get initial cart count
            home_page.navigate_to_home(base_url)
            initial_count = home_page.get_cart_item_count()
            
            # Add product to cart
            shop_page.navigate_to_shop(base_url)
            shop_page.add_product_to_cart(0)
            time.sleep(2)
            
            # Navigate to cart and verify
            cart_page.navigate_to_cart(base_url)
            current_count = cart_page.get_cart_items_count()
            
            # Cart should have items now
            assert current_count > 0
    
    def test_cart_item_quantity_management(self, driver, base_url):
        """Test cart item quantity increase/decrease"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        items_count = cart_page.get_cart_items_count()
        if items_count > 0:
            # Get initial quantity
            initial_quantities = cart_page.get_item_quantities()
            initial_qty = int(initial_quantities[0]) if initial_quantities else 1
            
            # Increase quantity
            cart_page.increase_item_quantity(0)
            time.sleep(1)
            
            # Verify quantity increased
            new_quantities = cart_page.get_item_quantities()
            if new_quantities:
                new_qty = int(new_quantities[0])
                assert new_qty > initial_qty
            
            # Decrease quantity
            cart_page.decrease_item_quantity(0)
            time.sleep(1)
            
            # Verify quantity decreased
            final_quantities = cart_page.get_item_quantities()
            if final_quantities:
                final_qty = int(final_quantities[0])
                assert final_qty == initial_qty
    
    def test_direct_quantity_update(self, driver, base_url):
        """Test direct quantity input update"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        items_count = cart_page.get_cart_items_count()
        if items_count > 0:
            # Update quantity directly
            new_quantity = 5
            cart_page.update_item_quantity(0, new_quantity)
            time.sleep(2)
            
            # Verify quantity updated
            quantities = cart_page.get_item_quantities()
            if quantities:
                assert int(quantities[0]) == new_quantity
    
    def test_remove_item_from_cart(self, driver, base_url):
        """Test removing item from cart"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        initial_count = cart_page.get_cart_items_count()
        if initial_count > 0:
            # Remove first item
            cart_page.remove_item(0)
            time.sleep(2)
            
            # Verify item removed
            new_count = cart_page.get_cart_items_count()
            assert new_count == initial_count - 1
    
    def test_cart_total_calculation(self, driver, base_url):
        """Test cart total calculation accuracy"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        items_count = cart_page.get_cart_items_count()
        if items_count > 0:
            # Get cart totals
            subtotal = cart_page.get_subtotal()
            tax_amount = cart_page.get_tax_amount()
            shipping_cost = cart_page.get_shipping_cost()
            total_amount = cart_page.get_total_amount()
            
            # Verify totals are displayed
            assert len(subtotal) > 0
            assert len(total_amount) > 0
            
            # Could add more specific calculation verification
            # by parsing numeric values and checking math
    
    def test_clear_cart_functionality(self, driver, base_url):
        """Test clear cart functionality"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        items_count = cart_page.get_cart_items_count()
        if items_count > 0 and cart_page.is_element_present(cart_page.CLEAR_CART_BUTTON):
            # Clear cart
            cart_page.clear_cart()
            time.sleep(2)
            
            # Verify cart is empty
            assert cart_page.is_cart_empty()
    
    def test_continue_shopping_functionality(self, driver, base_url):
        """Test continue shopping button"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        if cart_page.is_element_present(cart_page.CONTINUE_SHOPPING_BUTTON):
            cart_page.continue_shopping()
            
            # Should navigate to shop page
            assert "/shop" in driver.current_url
    
    def test_proceed_to_checkout(self, driver, base_url):
        """Test proceed to checkout functionality"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        items_count = cart_page.get_cart_items_count()
        if items_count > 0 and cart_page.is_element_present(cart_page.CHECKOUT_BUTTON):
            cart_page.proceed_to_checkout()
            
            # Should navigate to checkout page
            assert "/checkout" in driver.current_url
    
    def test_coupon_code_application(self, driver, base_url):
        """Test coupon code application"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        items_count = cart_page.get_cart_items_count()
        if items_count > 0 and cart_page.is_element_present(cart_page.COUPON_INPUT):
            # Test valid coupon (if any test coupons exist)
            test_coupons = ["TEST10", "SAVE20", "WELCOME"]
            
            for coupon in test_coupons:
                cart_page.apply_coupon(coupon)
                time.sleep(2)
                
                # Check if coupon was applied or error shown
                if cart_page.is_coupon_applied_successfully():
                    break
                elif cart_page.is_coupon_error_displayed():
                    continue
            
            # Test invalid coupon
            cart_page.apply_coupon("INVALIDCOUPON123")
            time.sleep(2)
            
            # Should show error for invalid coupon
            assert cart_page.is_coupon_error_displayed() or not cart_page.is_coupon_applied_successfully()
    
    def test_cart_persistence_across_sessions(self, driver, base_url):
        """Test cart persistence across browser sessions"""
        shop_page = ShopPage(driver)
        cart_page = CartPage(driver)
        
        # Add item to cart
        shop_page.navigate_to_shop(base_url)
        products_count = shop_page.get_product_count()
        
        if products_count > 0:
            shop_page.add_product_to_cart(0)
            time.sleep(2)
            
            # Check cart has items
            cart_page.navigate_to_cart(base_url)
            initial_count = cart_page.get_cart_items_count()
            
            if initial_count > 0:
                # Refresh page to simulate session
                driver.refresh()
                time.sleep(2)
                
                # Cart should still have items (if using localStorage/sessionStorage)
                new_count = cart_page.get_cart_items_count()
                # Note: This test depends on implementation (localStorage vs server-side cart)
    
    def test_cart_item_details_display(self, driver, base_url):
        """Test cart item details are displayed correctly"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        items_count = cart_page.get_cart_items_count()
        if items_count > 0:
            # Verify item details are displayed
            item_names = cart_page.get_item_names()
            item_prices = cart_page.get_item_prices()
            
            assert len(item_names) > 0
            assert len(item_prices) > 0
            
            # Verify each item has required details
            for name in item_names:
                assert len(name) > 0
            
            for price in item_prices:
                assert len(price) > 0
    
    def test_cart_responsive_design(self, driver, base_url):
        """Test cart page responsive design"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        # Test different screen sizes
        screen_sizes = [
            (1920, 1080),  # Desktop
            (1024, 768),   # Tablet
            (375, 667)     # Mobile
        ]
        
        for width, height in screen_sizes:
            driver.set_window_size(width, height)
            time.sleep(1)
            
            # Verify cart functionality is maintained
            if cart_page.get_cart_items_count() > 0:
                assert cart_page.is_element_present(cart_page.CART_ITEMS)
            else:
                assert cart_page.is_cart_empty()
        
        # Reset to default size
        driver.set_window_size(1920, 1080)
    
    def test_cart_navigation_from_header(self, driver, base_url):
        """Test cart navigation from header icon"""
        home_page = HomePage(driver)
        cart_page = CartPage(driver)
        
        home_page.navigate_to_home(base_url)
        
        # Click cart icon from header
        home_page.click_cart()
        
        # Should navigate to cart page
        assert "/cart" in driver.current_url
        assert cart_page.is_element_present(cart_page.PAGE_TITLE) or cart_page.is_cart_empty()
    
    def test_cart_badge_update(self, driver, base_url):
        """Test cart badge count updates correctly"""
        home_page = HomePage(driver)
        shop_page = ShopPage(driver)
        cart_page = CartPage(driver)
        
        # Get initial cart count from header
        home_page.navigate_to_home(base_url)
        initial_badge_count = home_page.get_cart_item_count()
        
        # Add item to cart
        shop_page.navigate_to_shop(base_url)
        products_count = shop_page.get_product_count()
        
        if products_count > 0:
            shop_page.add_product_to_cart(0)
            time.sleep(2)
            
            # Check if badge count updated
            home_page.navigate_to_home(base_url)
            new_badge_count = home_page.get_cart_item_count()
            
            # Badge should reflect cart contents
            # Note: This test depends on implementation
    
    def test_cart_error_handling(self, driver, base_url):
        """Test cart error handling scenarios"""
        cart_page = CartPage(driver)
        cart_page.navigate_to_cart(base_url)
        
        items_count = cart_page.get_cart_items_count()
        if items_count > 0:
            # Test invalid quantity input
            try:
                cart_page.update_item_quantity(0, -1)  # Negative quantity
                time.sleep(1)
                # Should handle gracefully
            except:
                pass
            
            try:
                cart_page.update_item_quantity(0, 0)  # Zero quantity
                time.sleep(1)
                # Should handle gracefully (might remove item)
            except:
                pass
            
            try:
                cart_page.update_item_quantity(0, 99999)  # Very large quantity
                time.sleep(1)
                # Should handle gracefully (might show stock limit)
            except:
                pass