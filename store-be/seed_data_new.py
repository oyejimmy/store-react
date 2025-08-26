from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, Product, User, Category, Offer, HairAccessory
from app.auth import get_password_hash
from datetime import datetime
import random

# Create tables
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Product).delete()
        db.query(Category).delete()
        db.query(User).delete()
        db.query(Offer).delete()
        db.query(HairAccessory).delete()
        db.commit()
        
        # Create admin user
        admin_user = User(
            email="admin@saiyaara.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            phone="+92-3000000000",
            is_admin=True
        )
        db.add(admin_user)
        
        # Create categories
        categories_data = [
            {"name": "Rings", "description": "Beautiful rings for all occasions", "icon": "💍"},
            {"name": "Earrings", "description": "Elegant earrings collection", "icon": "👂"},
            {"name": "Bangles", "description": "Traditional and modern bangles", "icon": "💫"},
            {"name": "Anklets", "description": "Delicate anklets and chains", "icon": "🦶"},
            {"name": "Bracelets", "description": "Stylish bracelets collection", "icon": "💎"},
            {"name": "Pendants", "description": "Beautiful pendants and necklaces", "icon": "✨"},
            {"name": "Ear Studs", "description": "Trendy ear studs for daily wear", "icon": "📿"},
            {"name": "Hoops", "description": "Classic and modern hoops", "icon": "⭕"},
            {"name": "Wall Frame Design", "description": "Decorative wall frames", "icon": "🖼️"},
            {"name": "Combos", "description": "Best combos of jewelry", "icon": "🎁"},
            {"name": "Hair Accessories", "description": "Beautiful hair accessories and clips", "icon": "💇"},
        ]
        
        categories = []
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.add(category)
            categories.append(category)
        
        db.flush()  # Get category IDs

        # Sample jewelry images (5 images per product)
        jewelry_images_sets = [
            [
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
                "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
                "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400",
                "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400"
            ],
            [
                "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400",
                "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400",
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
                "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400"
            ]
        ]
        
        # Hair accessories specific products (28 items)
        hair_accessories_products = [
            {"name": "Mate flower Hair Catcher", "price": 150.0, "category": "hair_clips", "material": "fabric"},
            {"name": "Butterfly Hair Catcher", "price": 75.0, "category": "hair_clips", "material": "metal"},
            {"name": "Starry Night Headband", "price": 399.0, "status": "out_of_stock", "category": "headbands", "material": "rhinestone"},
            {"name": "Pearl and Gold Beaded Headband", "price": 399.0, "status": "out_of_stock", "category": "headbands", "material": "pearl"},
            {"name": "Pearl and Rhinestone Intertwined Headband", "price": 450.0, "category": "headbands", "material": "pearl"},
            {"name": "Pearl and Rhinestone Flower Hair Crown", "price": 450.0, "category": "headbands", "material": "pearl"},
            {"name": "Gold Cage Hair Clip", "price": 399.0, "category": "hair_clips", "material": "gold"},
            {"name": "Fancy Pearl Hair Claw", "price": 799.0, "category": "hair_claws", "material": "pearl"},
            {"name": "Gold and White Pearl Hair Claw", "price": 700.0, "category": "hair_claws", "material": "pearl"},
            {"name": "Minimal Rhinestone Hair Claw", "price": 750.0, "category": "hair_claws", "material": "rhinestone"},
            {"name": "Minimal Pearl Hair Claw", "price": 599.0, "category": "hair_claws", "material": "pearl"},
            {"name": "Pearl Hair Claw", "price": 599.0, "category": "hair_claws", "material": "pearl"},
            {"name": "Gold and Black Hair Claw Set", "price": 299.0, "category": "hair_claws", "material": "gold"},
            {"name": "Starburst Hair Clip", "price": 199.0, "category": "hair_clips", "material": "metal"},
            {"name": "Rhinestone Hair Claw", "price": 250.0, "category": "hair_claws", "material": "rhinestone"},
            {"name": "Minimalist Beaded Gold Hairpin", "price": 150.0, "category": "hairpins", "material": "gold"},
            {"name": "Beaded Hair Clips", "price": 299.0, "category": "hair_clips", "material": "beads"},
            {"name": "Rhinestone Star Hair Clips", "price": 350.0, "status": "out_of_stock", "category": "hair_clips", "material": "rhinestone"},
            {"name": "Rhinestone Star Hairpin Set", "price": 350.0, "category": "hairpins", "material": "rhinestone"},
            {"name": "Linear Hairpin Set", "price": 350.0, "original_price": 650.0, "category": "hairpins", "material": "metal"},
            {"name": "Minimalist Rhinestone Hairpins", "price": 350.0, "category": "hairpins", "material": "rhinestone"},
            {"name": "Love and Bow Hairpin Set", "price": 350.0, "category": "hairpins", "material": "metal"},
            {"name": "Pearl and Rhinestone Star Headband", "price": 450.0, "category": "headbands", "material": "pearl"},
            {"name": "Pearl Bow Hairpin", "price": 350.0, "status": "out_of_stock", "category": "hairpins", "material": "pearl"},
            {"name": "Pearl and Rhinestone Hairpin Set", "price": 350.0, "status": "out_of_stock", "category": "hairpins", "material": "pearl"},
            {"name": "Lucky Pearl Hairpin Set", "price": 350.0, "category": "hairpins", "material": "pearl"},
            {"name": "Pearl Hairpins Set", "price": 490.0, "category": "hairpins", "material": "pearl"},
            {"name": "Beaded Hairpins", "price": 150.0, "category": "hairpins", "material": "beads"}
        ]
        
        # Generate 10 products for each category
        products = []
        for idx, category in enumerate(categories):
            if category.name == "Hair Accessories":
                # Add specific hair accessories products
                for hair_product in hair_accessories_products:
                    product_data = {
                        "name": hair_product["name"],
                        "full_name": f"{hair_product['name']} - Premium Quality",
                        "type": "Hair Accessory",
                        "retail_price": float(hair_product.get("original_price", hair_product["price"])),
                        "offer_price": float(hair_product["price"]),
                        "currency": "PKR",
                        "description": f"Beautiful {hair_product['name'].lower()} for elegant hair styling.",
                        "delivery_charges": 40.0,
                        "stock": 0 if hair_product.get("status") == "out_of_stock" else random.randint(10, 30),
                        "status": hair_product.get("status", "available"),
                        "available": 0 if hair_product.get("status") == "out_of_stock" else random.randint(5, 25),
                        "sold": random.randint(5, 20),
                        "category_id": category.id,
                        "subcategory": "hair-accessories",
                        "images": random.choice(jewelry_images_sets),
                        "price": float(hair_product["price"]),
                        "original_price": float(hair_product.get("original_price", hair_product["price"])),
                        "stock_quantity": 0 if hair_product.get("status") == "out_of_stock" else random.randint(10, 30)
                    }
                    products.append(product_data)
            else:
                # Generate regular products for other categories
                for i in range(10):
                    retail_price = random.choice([199, 299, 399, 499, 599, 799])
                    discount = random.choice([0, 50, 100, 150])
                    offer_price = retail_price - discount if retail_price > discount else retail_price

                    product_data = {
                        "name": f"{category.name} Item {i+1}",
                        "full_name": f"Elegant {category.name} Item {i+1} with premium design",
                        "type": f"{category.name} Type",
                        "retail_price": float(retail_price),
                        "offer_price": float(offer_price),
                        "currency": "PKR",
                        "description": f"Beautiful handcrafted {category.name.lower()} with elegant polish and finish.",
                        "delivery_charges": random.choice([30.0, 40.0, 50.0, 60.0]),
                        "stock": random.randint(10, 50),
                        "status": "available",
                        "available": random.randint(5, 30),
                        "sold": random.randint(1, 15),
                        "category_id": category.id,
                        "subcategory": category.name.lower(),
                        "images": random.choice(jewelry_images_sets),
                        "price": float(offer_price),
                        "original_price": float(retail_price),
                        "stock_quantity": random.randint(10, 50)
                    }
                    products.append(product_data)
        
        for product_data in products:
            product = Product(**product_data)
            db.add(product)
        
        # Create hair accessories in separate table
        for hair_product in hair_accessories_products:
            hair_accessory = HairAccessory(
                name=hair_product["name"],
                description=f"Beautiful {hair_product['name'].lower()} for elegant hair styling.",
                price=float(hair_product["price"]),
                original_price=float(hair_product.get("original_price", hair_product["price"])),
                currency="PKR",
                stock=0 if hair_product.get("status") == "out_of_stock" else random.randint(10, 50),
                status=hair_product.get("status", "available"),
                images=random.choice(jewelry_images_sets),
                category=hair_product.get("category", "hair_accessories"),
                material=hair_product.get("material", "mixed"),
                color=random.choice(["Gold", "Silver", "Rose Gold", "Black", "White", "Multi"]),
                is_featured=random.choice([True, False])
            )
            db.add(hair_accessory)
        
        # Create sample offers
        offers = [
            {
                "name": "Under ₹299 Special",
                "description": "Amazing jewelry pieces under ₹299",
                "offer_type": "under_299",
                "discount_percentage": 25.0,
                "start_date": datetime(2024, 1, 1),
                "end_date": datetime(2024, 12, 31)
            },
            {
                "name": "Special Deals",
                "description": "Limited time special deals on selected items",
                "offer_type": "special_deals",
                "discount_percentage": 30.0,
                "start_date": datetime(2024, 1, 1),
                "end_date": datetime(2024, 6, 30)
            },
            {
                "name": "Deal of the Month",
                "description": "Best offer for this month only",
                "offer_type": "deal_of_the_month",
                "discount_percentage": 35.0,
                "start_date": datetime(2024, 3, 1),
                "end_date": datetime(2024, 3, 31)
            }
        ]
        
        for offer_data in offers:
            offer = Offer(**offer_data)
            db.add(offer)
        
        db.commit()
        print("Sample data (10 products per category) created successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
