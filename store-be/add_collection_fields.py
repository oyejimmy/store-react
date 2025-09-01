import sqlite3
from datetime import datetime

def add_collection_fields():
    conn = sqlite3.connect('saiyaara.db')
    cursor = conn.cursor()
    
    # Add new columns to categories table
    try:
        cursor.execute('ALTER TABLE categories ADD COLUMN image TEXT')
        print("Added image column to categories table")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("Image column already exists")
        else:
            print(f"Error adding image column: {e}")
    
    try:
        cursor.execute('ALTER TABLE categories ADD COLUMN total_products INTEGER DEFAULT 0')
        print("Added total_products column to categories table")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("Total_products column already exists")
        else:
            print(f"Error adding total_products column: {e}")
    
    try:
        cursor.execute('ALTER TABLE categories ADD COLUMN conditions TEXT')
        print("Added conditions column to categories table")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("Conditions column already exists")
        else:
            print(f"Error adding conditions column: {e}")
    
    try:
        cursor.execute('ALTER TABLE categories ADD COLUMN updated_at TIMESTAMP')
        print("Added updated_at column to categories table")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("Updated_at column already exists")
        else:
            print(f"Error adding updated_at column: {e}")
    
    # Update total_products count for existing categories
    cursor.execute('''
        UPDATE categories 
        SET total_products = (
            SELECT COUNT(*) 
            FROM products 
            WHERE products.category_id = categories.id AND products.is_active = 1
        )
    ''')
    print("Updated total_products count for existing categories")
    
    conn.commit()
    conn.close()
    print("Database migration completed successfully!")

if __name__ == "__main__":
    add_collection_fields()
