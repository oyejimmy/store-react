import os
import sqlite3

def check_database():
    # Check current directory
    print(f"Current working directory: {os.getcwd()}")
    
    # Look for database file
    db_path = os.path.join('store-be', 'saiyaara.db')
    print(f"\nLooking for database at: {os.path.abspath(db_path)}")
    
    if os.path.exists(db_path):
        print("Database file exists!")
        
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # List all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("\nTables in database:")
        for table in tables:
            print(f"- {table[0]}")
            
        # Check products table
        if ('products',) in tables:
            # Count products
            cursor.execute("SELECT COUNT(*) FROM products")
            count = cursor.fetchone()[0]
            print(f"\nFound {count} products in the database")
            
            # Show first 5 products if they exist
            if count > 0:
                print("\nSample products:")
                cursor.execute("SELECT id, name, retail_price, stock_quantity FROM products LIMIT 5")
                for row in cursor.fetchall():
                    print(f"ID: {row[0]}, Name: {row[1]}, Price: {row[2]}, Stock: {row[3]}")
        else:
            print("\nNo products table found in the database")
            
        conn.close()
    else:
        print("\nDatabase file not found!")

if __name__ == "__main__":
    check_database()
