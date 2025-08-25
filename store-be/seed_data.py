from sqlalchemy.orm import Session
from app.database import engine, get_db
from app.models import Product, User
from app.schemas import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_products():
    db = next(get_db())
    
    # Sample products data
    products_data = [
        {
            "name": "Gold Plated Ring",
            "description": "Elegant gold plated ring with intricate design",
            "price": 299.0,
            "original_price": 399.0,
            "images": ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400"],
            "stock_quantity": 50,
            "category": "rings",
            "subcategory": "gold",
            "is_active": True
        },
        {
            "name": "Silver Necklace",
            "description": "Beautiful silver necklace with pendant",
            "price": 450.0,
            "original_price": 600.0,
            "images": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"],
            "stock_quantity": 30,
            "category": "necklaces",
            "subcategory": "silver",
            "is_active": True
        },
        {
            "name": "Diamond Earrings",
            "description": "Stunning diamond stud earrings",
            "price": 1200.0,
            "original_price": 1500.0,
            "images": ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400"],
            "stock_quantity": 15,
            "category": "earrings",
            "subcategory": "diamond",
            "is_active": True
        },
        {
            "name": "Pearl Bracelet",
            "description": "Elegant pearl bracelet for special occasions",
            "price": 350.0,
            "original_price": 500.0,
            "images": ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400"],
            "stock_quantity": 25,
            "category": "bracelets",
            "subcategory": "pearl",
            "is_active": True
        },
        {
            "name": "Rose Gold Anklet",
            "description": "Delicate rose gold anklet with charm",
            "price": 280.0,
            "original_price": 400.0,
            "images": ["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400"],
            "stock_quantity": 40,
            "category": "anklets",
            "subcategory": "rose-gold",
            "is_active": True
        },
        {
            "name": "Crystal Pendant",
            "description": "Beautiful crystal pendant necklace",
            "price": 180.0,
            "original_price": 250.0,
            "images": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"],
            "stock_quantity": 35,
            "category": "pendants",
            "subcategory": "crystal",
            "is_active": True
        },
        {
            "name": "Gold Hoop Earrings",
            "description": "Classic gold hoop earrings",
            "price": 220.0,
            "original_price": 300.0,
            "images": ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400"],
            "stock_quantity": 45,
            "category": "earrings",
            "subcategory": "hoops",
            "is_active": True
        },
        {
            "name": "Silver Bangle Set",
            "description": "Set of 3 silver bangles",
            "price": 320.0,
            "original_price": 450.0,
            "images": ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400"],
            "stock_quantity": 20,
            "category": "bangles",
            "subcategory": "silver",
            "is_active": True
        }
    ]
    
    # Add products to database
    for product_data in products_data:
        product = Product(**product_data)
        db.add(product)
    
    db.commit()
    print("Sample products added successfully!")

def seed_admin_user():
    db = next(get_db())
    
    # Check if admin user already exists
    existing_admin = db.query(User).filter(User.email == "admin@saiyaara.com").first()
    if existing_admin:
        print("Admin user already exists!")
        return
    
    # Create admin user
    admin_data = {
        "email": "admin@saiyaara.com",
        "username": "admin",
        "full_name": "Admin User",
        "phone": "+91-9876543210",
        "is_admin": True,
        "is_active": True
    }
    
    # Hash password
    admin_data["hashed_password"] = pwd_context.hash("admin123")
    
    admin_user = User(**admin_data)
    db.add(admin_user)
    db.commit()
    print("Admin user created successfully!")
    print("Email: admin@saiyaara.com")
    print("Password: admin123")

if __name__ == "__main__":
    print("Seeding database...")
    seed_admin_user()
    seed_products()
    print("Database seeding completed!")
