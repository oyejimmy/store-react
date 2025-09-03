import requests
import json

# Test the products endpoint
try:
    url = "http://localhost:8000/api/products"
    print(f"Testing GET {url}")
    
    # First, test with OPTIONS to check allowed methods
    print("\nTesting OPTIONS request:")
    response = requests.options(url)
    print(f"Status Code: {response.status_code}")
    print("Headers:", json.dumps(dict(response.headers), indent=2))
    
    # Then test with GET
    print("\nTesting GET request:")
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print("Response:", response.text)
    
    # Print request details that were sent
    print("\nRequest Details:")
    print(f"URL: {response.request.url}")
    print(f"Method: {response.request.method}")
    print("Headers:", json.dumps(dict(response.request.headers), indent=2))
    
except Exception as e:
    print(f"Error: {e}")
