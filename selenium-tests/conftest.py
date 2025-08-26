import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import os
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture(scope="session")
def driver():
    """Setup Chrome driver for testing"""
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    # Uncomment for headless mode
    # chrome_options.add_argument("--headless")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.implicitly_wait(10)
    
    yield driver
    
    driver.quit()

@pytest.fixture
def base_url():
    """Base URL for the application"""
    return os.getenv("BASE_URL", "http://localhost:3000")

@pytest.fixture
def api_url():
    """API URL for backend testing"""
    return os.getenv("API_URL", "http://localhost:8000/api")

@pytest.fixture
def test_user():
    """Test user credentials"""
    return {
        "email": "testuser@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }

@pytest.fixture
def admin_user():
    """Admin user credentials"""
    return {
        "email": "admin@saiyaara.com",
        "password": "admin123",
        "full_name": "Admin User"
    }

@pytest.fixture
def test_product():
    """Test product data"""
    return {
        "name": "Test Gold Ring",
        "category": "rings",
        "price": 299,
        "description": "Beautiful test gold ring",
        "stock": 10
    }