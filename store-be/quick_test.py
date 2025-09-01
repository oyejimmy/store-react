import requests
import json

def test_products_endpoint():
    try:
        response = requests.get("http://localhost:8000/api/admin/products")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS - Found {len(data)} products")
            if data:
                print(f"First product: {json.dumps(data[0], indent=2)[:300]}...")
        else:
            print(f"FAILED - {response.text}")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_products_endpoint()
