import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000/api"

def print_response(response: requests.Response):
    """Helper function to print response details."""
    print(f"Status Code: {response.status_code}")
    print("Headers:")
    for key, value in response.headers.items():
        print(f"  {key}: {value}")
    
    try:
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
    except ValueError:
        print("\nResponse (not JSON):")
        print(response.text)
    
    print("\n" + "="*80 + "\n")

def test_signup():
    """Test user signup endpoint."""
    url = f"{BASE_URL}/auth/signup"
    print(f"Testing POST {url}")
    
    test_user = {
        "email": "testuser@example.com",
        "username": "testuser",
        "password": "testpassword123",
        "full_name": "Test User",
        "phone": "+1234567890"
    }
    
    try:
        # First try to sign up
        response = requests.post(url, json=test_user, timeout=10)
        print_response(response)
        
        if response.status_code == 200:
            return response.json()
        return None
        
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

def test_login():
    """Test user login endpoint."""
    url = f"{BASE_URL}/auth/login"
    print(f"Testing POST {url}")
    
    credentials = {
        "email": "testuser@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(url, json=credentials, timeout=10)
        print_response(response)
        
        if response.status_code == 200:
            token = response.json().get("access_token")
            print(f"Auth Token: {token}")
            return token
        return None
        
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

def test_get_current_user(token: str):
    """Test getting current user info with authentication."""
    url = f"{BASE_URL}/auth/me"
    print(f"Testing GET {url}")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print_response(response)
        return response.status_code == 200
        
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return False

def test_get_user_by_username(username: str, token: str):
    """Test getting user by username."""
    url = f"{BASE_URL}/auth/user"
    print(f"Testing GET {url}?username={username}")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    params = {"username": username}
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        print_response(response)
        return response.status_code == 200
        
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return False

def run_tests():
    print("=== Starting API Tests ===\n")
    
    # Test signup
    print("1. Testing Signup")
    user_data = test_signup()
    
    # Test login
    print("\n2. Testing Login")
    token = test_login()
    
    if token:
        # Test getting current user
        print("\n3. Testing Get Current User")
        test_get_current_user(token)
        
        # Test getting user by username
        if user_data and 'username' in user_data:
            print("\n4. Testing Get User by Username")
            test_get_user_by_username(user_data['username'], token)
    
    print("=== Tests Completed ===")

if __name__ == "__main__":
    run_tests()
