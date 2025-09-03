import sqlite3
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
import os

# Database URL
DATABASE_URL = "sqlite:///./saiyaara.db"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Check if tables exist
inspector = inspect(engine)
tables = inspector.get_table_names()
print("\n=== Database Tables ===")
for table in tables:
    print(f"- {table}")

# Check products table
if 'products' in tables:
    print("\n=== Products Table Structure ===")
    columns = inspector.get_columns('products')
    for column in columns:
        print(f"{column['name']}: {column['type']}")
    
    # Count products
    result = db.execute("SELECT COUNT(*) FROM products").scalar()
    print(f"\nTotal products: {result}")
    
    # Show first 5 products
    if result > 0:
        print("\nFirst 5 products:")
        products = db.execute("SELECT id, name, retail_price, stock_quantity FROM products LIMIT 5").fetchall()
        for product in products:
            print(f"ID: {product[0]}, Name: {product[1]}, Price: {product[2]}, Stock: {product[3]}")
else:
    print("\nProducts table does not exist")

db.close()
