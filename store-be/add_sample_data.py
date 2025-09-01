#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Category, Product, User
from app.auth import get_password_hash

def create_sample_data():
    db = SessionLocal()
    
    try:
        # Create admin user if not exists
        admin_user = db.query(User).filter(User.email == "admin@store.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@store.com",
                username="admin",
                full_name="Admin User",
                phone="1234567890",
                hashed_password=get_password_hash("admin123"),
                is_admin=True,
                is_active=True
            )
            db.add(admin_user)
            print("Created admin user: admin@store.com / admin123")

        # Create sample categories
        categories_data = [
            {"name": "Rings", "description": "Beautiful rings collection", "icon": ""},
            {"name": "Earrings", "description": "Elegant earrings", "icon": ""},
            {"name": "Necklaces", "description": "Stunning necklaces", "icon": ""},
            {"name": "Bracelets", "description": "Charming bracelets", "icon": ""},
            {"name": "Anklets", "description": "Delicate anklets", "icon": ""}
        ]
        
        for cat_data in categories_data:
            existing_cat = db.query(Category).filter(Category.name == cat_data["name"]).first()
            if not existing_cat:
                category = Category(
                    name=cat_data["name"],
                    description=cat_data["description"],
                    icon=cat_data["icon"],
                    total_products=0,
                    is_active=True
                )
                db.add(category)
                print(f"Created category: {cat_data['name']}")

        db.commit()

        # Create sample products
        categories = db.query(Category).all()
        
        products_data = [
            {
                "name": "Gold Diamond Ring",
                "full_name": "18K Gold Diamond Engagement Ring",
                "type": "Ring",
                "description": "Beautiful 18K gold ring with diamond",
                "retail_price": 25000.0,
                "offer_price": 22000.0,
                "buy_price": 15000.0,
                "sell_price": 20000.0,
                "stock_quantity": 10,
                "total_qty": 15,
                "location": "Store",
                "subcategory": "Engagement",
                "delivery_charges": 500.0
            },
            {
                "name": "Silver Earrings",
                "full_name": "Sterling Silver Drop Earrings",
                "type": "Earrings",
                "description": "Elegant sterling silver drop earrings",
                "retail_price": 5000.0,
                "offer_price": 4500.0,
                "buy_price": 2500.0,
                "sell_price": 4000.0,
                "stock_quantity": 25,
                "total_qty": 30,
                "location": "Store",
                "subcategory": "Drop",
                "delivery_charges": 200.0
            },
            {
                "name": "Pearl Necklace",
                "full_name": "Cultured Pearl Strand Necklace",
                "type": "Necklace",
                "description": "Classic cultured pearl necklace",
                "retail_price": 15000.0,
                "offer_price": 13500.0,
                "buy_price": 8000.0,
                "sell_price": 12000.0,
                "stock_quantity": 8,
                "total_qty": 12,
                "location": "Store",
                "subcategory": "Pearl",
                "delivery_charges": 300.0
            },
            {
                "name": "Gold Bracelet",
                "full_name": "22K Gold Chain Bracelet",
                "type": "Bracelet",
                "description": "Traditional 22K gold chain bracelet",
                "retail_price": 18000.0,
                "offer_price": 16500.0,
                "buy_price": 12000.0,
                "sell_price": 15500.0,
                "stock_quantity": 3,
                "total_qty": 8,
                "location": "Store",
                "subcategory": "Chain",
                "delivery_charges": 400.0
            },
            {
                "name": "Silver Anklet",
                "full_name": "Sterling Silver Charm Anklet",
                "type": "Anklet",
                "description": "Delicate silver anklet with charms",
                "retail_price": 3500.0,
                "offer_price": 3000.0,
                "buy_price": 1800.0,
                "sell_price": 2800.0,
                "stock_quantity": 0,
                "total_qty": 5,
                "location": "Store",
                "subcategory": "Charm",
                "delivery_charges": 150.0
            }
        ]

        for i, prod_data in enumerate(products_data):
            existing_prod = db.query(Product).filter(Product.name == prod_data["name"]).first()
            if not existing_prod:
                # Assign to category cyclically
                category = categories[i % len(categories)]
                
                product = Product(
                    name=prod_data["name"],
                    full_name=prod_data["full_name"],
                    type=prod_data["type"],
                    description=prod_data["description"],
                    retail_price=prod_data["retail_price"],
                    offer_price=prod_data["offer_price"],
                    buy_price=prod_data["buy_price"],
                    sell_price=prod_data["sell_price"],
                    stock_quantity=prod_data["stock_quantity"],
                    total_qty=prod_data["total_qty"],
                    location=prod_data["location"],
                    subcategory=prod_data["subcategory"],
                    delivery_charges=prod_data["delivery_charges"],
                    category_id=category.id,
                    is_active=True,
                    images=[]
                )
                db.add(product)
                print(f"Created product: {prod_data['name']} in {category.name}")

        db.commit()

        # Update category product counts
        for category in categories:
            product_count = db.query(Product).filter(
                Product.category_id == category.id,
                Product.is_active == True
            ).count()
            category.total_products = product_count
        
        db.commit()
        print("Updated category product counts")
        print("\nSample data created successfully!")
        print("Admin login: admin@store.com / admin123")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
