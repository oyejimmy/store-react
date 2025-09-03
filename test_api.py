import requests

def test_products_endpoint():
    url = "http://localhost:8000/api/products"
    print(f"Testing GET {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        print("Response Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
            
        if response.status_code == 200:
            print("\nResponse JSON:")
            print(response.json())
        else:
            print(f"\nError Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"\nRequest failed: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Also test with OPTIONS method
    print(f"Testing OPTIONS {url}")
    try:
        response = requests.options(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        print("Response Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
    except requests.exceptions.RequestException as e:
        print(f"\nOPTIONS request failed: {e}")

if __name__ == "__main__":
    test_products_endpoint()
