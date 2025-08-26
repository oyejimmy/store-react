import sqlite3

# Connect to the database
conn = sqlite3.connect('saiyaara.db')
cursor = conn.cursor()

try:
    # Add missing columns to products table
    cursor.execute('ALTER TABLE products ADD COLUMN buy_price REAL')
    print("Added buy_price column")
except sqlite3.OperationalError as e:
    print(f"buy_price column might already exist: {e}")

try:
    cursor.execute('ALTER TABLE products ADD COLUMN sell_price REAL')
    print("Added sell_price column")
except sqlite3.OperationalError as e:
    print(f"sell_price column might already exist: {e}")

try:
    cursor.execute('ALTER TABLE products ADD COLUMN total_qty INTEGER DEFAULT 0')
    print("Added total_qty column")
except sqlite3.OperationalError as e:
    print(f"total_qty column might already exist: {e}")

try:
    cursor.execute('ALTER TABLE products ADD COLUMN location TEXT DEFAULT "Store"')
    print("Added location column")
except sqlite3.OperationalError as e:
    print(f"location column might already exist: {e}")

# Commit changes and close
conn.commit()
conn.close()
print("Database updated successfully!")