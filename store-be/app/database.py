from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL - use PostgreSQL in production, SQLite for development
import pathlib
BASE_DIR = pathlib.Path(__file__).parent.parent
# Convert to absolute path and normalize for Windows
DB_PATH = (BASE_DIR / "saiyaara.db").resolve().as_posix()
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
print(f"Using database at: {DB_PATH}")  # Debug print

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
