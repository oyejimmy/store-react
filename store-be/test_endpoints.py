#!/usr/bin/env python3
"""
Test script to verify API endpoints are working
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(url, description):
    try:
        response = requests.get(url)
        print(f"\n{description}")
        print(f"URL: {url}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("SUCCESS")
            data = response.json()
            if isinstance(data, list):
                print(f"Response: List with {len(data)} items")
            else:
                print(f"Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print("FAILED")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"\n{description}")
        print(f"URL: {url}")
        print(f"ERROR: {e}")

def main():
    print("Testing Backend API Endpoints...")
    
    # Test basic endpoints
    test_endpoint(f"{BASE_URL}/", "Root endpoint")
    test_endpoint(f"{BASE_URL}/health", "Health check")
    
    # Test debug endpoints (no auth required)
    test_endpoint(f"{BASE_URL}/api/admin/products/debug", "Products debug endpoint")
    test_endpoint(f"{BASE_URL}/api/admin/products/temp", "Products temp endpoint")
    
    # Test collections endpoint (working one)
    test_endpoint(f"{BASE_URL}/api/admin/collections", "Collections endpoint (requires auth)")
    
    # Test original products endpoint (requires auth)
    test_endpoint(f"{BASE_URL}/api/admin/products", "Products endpoint (requires auth)")

if __name__ == "__main__":
    main()
