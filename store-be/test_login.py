from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.auth import verify_password

def test_admin_login():
    db = SessionLocal()
    
    try:
        # Find admin user
        admin_user = db.query(User).filter(User.email == "admin@saiyaara.com").first()
        
        if not admin_user:
            print("Admin user not found!")
            return
        
        print(f"Admin user found:")
        print(f"Email: {admin_user.email}")
        print(f"Username: {admin_user.username}")
        print(f"Is Admin: {admin_user.is_admin}")
        print(f"Is Active: {admin_user.is_active}")
        print(f"Hashed Password: {admin_user.hashed_password}")
        
        # Test password verification
        test_password = "admin123"
        is_valid = verify_password(test_password, admin_user.hashed_password)
        print(f"Password '{test_password}' is valid: {is_valid}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_admin_login()