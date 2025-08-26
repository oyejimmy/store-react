import sqlite3

# Connect to the database
conn = sqlite3.connect('saiyaara.db')
cursor = conn.cursor()

# Add the transaction_id column
try:
    cursor.execute("ALTER TABLE orders ADD COLUMN transaction_id TEXT;")
    conn.commit()
    print("Successfully added transaction_id column to orders table")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("Column transaction_id already exists")
    else:
        print(f"Error: {e}")

conn.close()