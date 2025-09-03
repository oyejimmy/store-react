import requests
import json

def test_products_endpoint():
    url = "http://localhost:8000/api/products"
    
    # Test OPTIONS request
    print("\nTesting OPTIONS request:")
    response = requests.options(url)
    print(f"Status Code: {response.status_code}")
    print("Headers:", json.dumps(dict(response.headers), indent=2))
    
    # Test GET request
    print("\nTesting GET request:")
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print("Response:", response.text)
    
    # Print request details
    print("\nRequest Details:")
    print(f"URL: {response.request.url}")
    print(f"Method: {response.request.method}")
    print("Headers:", json.dumps(dict(response.request.headers), indent=2))

if __name__ == "__main__":
    test_products_endpoint()
