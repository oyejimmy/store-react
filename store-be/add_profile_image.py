#!/usr/bin/env python3

import sqlite3
import os

def add_profile_image_column():
    # Get the database path
    db_path = "gem-heart.db"
    
    if not os.path.exists(db_path):
        print(f"Database {db_path} not found!")
        return
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'profile_image' not in columns:
            # Add the profile_image column
            cursor.execute("ALTER TABLE users ADD COLUMN profile_image TEXT")
            conn.commit()
            print("Successfully added profile_image column to users table")
        else:
            print("profile_image column already exists")
        
        conn.close()
        
    except Exception as e:
        print(f"Error adding profile_image column: {e}")

if __name__ == "__main__":
    add_profile_image_column()