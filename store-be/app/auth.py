from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

# Configuration
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None, username: str = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire, "username": username})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        print(f"Verifying token: {token[:20]}...")  # Log first 20 chars of token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Decoded payload: {payload}")
        
        email: str = payload.get("sub")
        if email is None:
            print("No email in token payload")
            return None
            
        # Check token expiration
        exp = payload.get("exp")
        if exp and datetime.utcnow() > datetime.utcfromtimestamp(exp):
            print(f"Token expired at {datetime.utcfromtimestamp(exp)}")
            return None
            
        print(f"Token verified for email: {email}")
        return email
        
    except JWTError as e:
        print(f"JWT Error: {str(e)}")
        return None

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    print(f"Received credentials: {credentials.scheme} {credentials.credentials[:10]}...")
    
    if not credentials or not credentials.credentials:
        print("No credentials provided")
        raise credentials_exception
        
    email = verify_token(credentials.credentials)
    if email is None:
        print(f"Token verification failed for token: {credentials.credentials[:20]}...")
        raise credentials_exception
    
    print(f"Looking up user with email: {email}")
    user = db.query(User).filter(User.email == email).first()
    
    if user is None:
        print(f"No user found with email: {email}")
        raise credentials_exception
    
    print(f"Authenticated user: {user.email}, is_admin: {getattr(user, 'is_admin', False)}")
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user
