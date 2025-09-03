import sqlite3

def check_database():
    conn = sqlite3.connect('store-be/saiyaara.db')
    cursor = conn.cursor()
    
    # List all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables in database:")
    for table in tables:
        print(f"- {table[0]}")
    
    # Check if products table exists and count rows
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='products';")
    if cursor.fetchone():
        cursor.execute("SELECT COUNT(*) FROM products")
        count = cursor.fetchone()[0]
        print(f"\nFound {count} products in the database")
        
        # Show first few products if they exist
        if count > 0:
            print("\nSample products:")
            cursor.execute("SELECT id, name, price FROM products LIMIT 5")
            for row in cursor.fetchall():
                print(f"ID: {row[0]}, Name: {row[1]}, Price: {row[2]}")
    else:
        print("\nNo products table found in the database")
    
    conn.close()

if __name__ == "__main__":
    check_database()
