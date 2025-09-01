#!/usr/bin/env python3
"""
Script to create test products with low stock for testing Low Stock Alerts functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import sessionmaker
from app.database import engine
from app.models import Product, Category

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def create_test_products():
    """Create test products with low stock levels"""
    
    # First, ensure we have at least one category
    category = db.query(Category).first()
    if not category:
        category = Category(
            name="Test Category",
            description="Test category for low stock products"
        )
        db.add(category)
        db.commit()
        db.refresh(category)
    
    # Test products with low stock
    test_products = [
        {
            "name": "Low Stock Ring",
            "type": "Ring",
            "stock": 3,
            "stock_quantity": 3,
            "retail_price": 299.0,
            "offer_price": 249.0,
            "price": 249.0,
            "description": "Test ring with low stock",
            "category_id": category.id,
            "status": "available",
            "is_active": True
        },
        {
            "name": "Almost Out Necklace",
            "type": "Necklace", 
            "stock": 1,
            "stock_quantity": 1,
            "retail_price": 599.0,
            "offer_price": 499.0,
            "price": 499.0,
            "description": "Test necklace with very low stock",
            "category_id": category.id,
            "status": "available",
            "is_active": True
        },
        {
            "name": "Low Stock Earrings",
            "type": "Earrings",
            "stock": 5,
            "stock_quantity": 5,
            "retail_price": 199.0,
            "offer_price": 149.0,
            "price": 149.0,
            "description": "Test earrings with low stock",
            "category_id": category.id,
            "status": "available",
            "is_active": True
        },
        {
            "name": "Normal Stock Bracelet",
            "type": "Bracelet",
            "stock": 25,
            "stock_quantity": 25,
            "retail_price": 399.0,
            "offer_price": 349.0,
            "price": 349.0,
            "description": "Test bracelet with normal stock",
            "category_id": category.id,
            "status": "available",
            "is_active": True
        }
    ]
    
    created_products = []
    for product_data in test_products:
        # Check if product already exists
        existing = db.query(Product).filter(Product.name == product_data["name"]).first()
        if not existing:
            product = Product(**product_data)
            db.add(product)
            created_products.append(product_data["name"])
    
    try:
        db.commit()
        print(f"Successfully created {len(created_products)} test products:")
        for name in created_products:
            print(f"  - {name}")
        
        # Show current low stock products
        low_stock = db.query(Product).filter(Product.stock < 10).all()
        print(f"\nCurrent products with stock < 10:")
        for product in low_stock:
            print(f"  - {product.name}: {product.stock} units")
            
    except Exception as e:
        db.rollback()
        print(f"Error creating products: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_products()
