📝 Project Update & Improvement Plan
1. Backend (BE) Fixes

Issue: Backend not running.

Action:

Ensure FastAPI/Express server is running properly.

Fix database connection errors.

Confirm API routes for products, categories, cart, and orders are working.

Update Product Schema (Database + API)
Add the following fields to the product model:

name: str
full_name: Optional[str] = None
type: Optional[str] = None
retail_price: float
offer_price: Optional[float] = None
currency: str = "PKR"
description: Optional[str] = None
delivery_charges: float = 0.0
stock: int = 0
status: str = "available"
images: Optional[str] = None   # store multiple images as comma-separated or JSON
available: int = 0
sold: int = 0
category_id: int


Ensure API Endpoints

/products → List products

/products/{id} → Product details (with multiple images)

/categories → Categories

/cart/add → Add to cart

/cart/remove → Remove from cart

/checkout → Checkout

2. Frontend (UI) Changes
🏠 Home Page

Replace logos with images under “Shop by Category”:

💍 Rings

👂 Earrings

💫 Bangles

🦶 Anklets

💎 Bracelets

✨ Pendants

Add a “View All” button → navigates to /products (all products page).

Improve carousel:

Make it full-width and larger height.

Add smooth auto-slide animation.

Add animations (Framer Motion / CSS transitions).

Apply multi-color themes for attractiveness (gradient buttons, hover effects).

📦 Product Page

Show at least 5 images per product (image gallery / slider).

Display all columns:

Name, Full Name, Type, Retail Price, Offer Price, Currency, Description, Delivery Charges, Stock, Status, Available, Sold.

Make “View Details” button functional → goes to product detail page.

Make “Add to Cart” button functional → updates cart state.

🛒 Cart & Checkout

Ensure “Add to Cart” → updates backend & frontend.

Cart should show product name, price, quantity, total.

Checkout button → triggers order API.

3. UI/UX Enhancements

Use modern, elegant design:

Rounded buttons.

Shadow effects.

Hover animations.

Consistent typography.

Color scheme: gradient primary buttons (e.g., from-pink-500 to-purple-500).

Animations on hover for products, categories, and buttons.

4. Testing Checklist

✅ Home page loads with big carousel.
✅ Categories display images with icons + "View All".
✅ Product detail page shows 5+ images.
✅ Add to cart works (updates backend & frontend).
✅ Cart page shows correct totals.
✅ Checkout works.
✅ All product fields displayed correctly.