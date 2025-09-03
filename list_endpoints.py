from fastapi import FastAPI
from fastapi.routing import APIRoute
from main import app

def list_routes():
    print("\n=== Available Endpoints ===")
    for route in app.routes:
        if isinstance(route, APIRoute):
            methods = ", ".join(route.methods)
            print(f"{methods.ljust(10)} {route.path}")
            if hasattr(route, "endpoint") and hasattr(route.endpoint, "__name__"):
                print(f"  Handler: {route.endpoint.__name__}")
            print()

if __name__ == "__main__":
    list_routes()
