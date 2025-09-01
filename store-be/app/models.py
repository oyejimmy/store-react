from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    phone = Column(String)
    profile_image = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    orders = relationship("Order", back_populates="user")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    icon = Column(String)
    image = Column(String, nullable=True)  # New field for collection image
    total_products = Column(Integer, default=0)  # New field for total products count
    conditions = Column(String, nullable=True)  # New field for product conditions
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    full_name = Column(String)
    type = Column(String)
    retail_price = Column(Float)
    offer_price = Column(Float)
    buy_price = Column(Float, nullable=True)  # Cost price
    sell_price = Column(Float, nullable=True)  # Selling price
    currency = Column(String, default="PKR")
    description = Column(Text)
    delivery_charges = Column(Float, default=0.0)
    stock = Column(Integer, default=0)
    total_qty = Column(Integer, default=0)  # Total quantity
    location = Column(String, default="Store")  # Storage location
    status = Column(String, default="available")
    images = Column(JSON)  # List of image URLs
    available = Column(Integer, default=0)
    sold = Column(Integer, default=0)
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    # Legacy fields for backward compatibility
    price = Column(Float)
    original_price = Column(Float)
    subcategory = Column(String, index=True)
    stock_quantity = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for guest orders
    order_number = Column(String, unique=True, index=True)
    customer_name = Column(String)
    customer_email = Column(String)
    customer_phone = Column(String)
    shipping_address = Column(Text)
    total_amount = Column(Float)
    status = Column(String, default="pending")  # pending, processing, shipped, delivered, cancelled
    payment_method = Column(String)
    payment_status = Column(String, default="pending")
    transaction_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    payments = relationship("Payment", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price = Column(Float)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

class Offer(Base):
    __tablename__ = "offers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    offer_type = Column(String)  # under_299, special_deals, deal_of_month
    discount_percentage = Column(Float, nullable=True)
    discount_amount = Column(Float, nullable=True)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProductOffer(Base):
    __tablename__ = "product_offers"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    offer_id = Column(Integer, ForeignKey("offers.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class HairAccessory(Base):
    __tablename__ = "hair_accessories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    original_price = Column(Float, nullable=True)
    currency = Column(String, default="PKR")
    stock = Column(Integer, default=0)
    status = Column(String, default="available")  # available, out_of_stock, discontinued
    images = Column(JSON)  # List of image URLs
    category = Column(String)  # hair_clips, headbands, hair_claws, hairpins, etc.
    material = Column(String)  # pearl, rhinestone, gold, silver, etc.
    color = Column(String)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    payment_method = Column(String)  # cod, card, bank_transfer, etc.
    payment_gateway = Column(String, nullable=True)  # stripe, paypal, etc.
    transaction_id = Column(String, nullable=True)
    amount = Column(Float)
    currency = Column(String, default="PKR")
    status = Column(String, default="pending")  # pending, completed, failed, refunded
    payment_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    order = relationship("Order", back_populates="payments")
