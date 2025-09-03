import uvicorn
import inspect
from fastapi import FastAPI
from fastapi.routing import APIRoute
from main import app

def list_routes(app: FastAPI):
    print("\n=== Registered Routes ===")
    for route in app.routes:
        if isinstance(route, APIRoute):
            methods = ", ".join(route.methods)
            print(f"{methods.ljust(10)} {route.path}")
            # Print handler function details if available
            if hasattr(route.endpoint, "__name__"):
                print(f"  Handler: {route.endpoint.__name__}")
            if hasattr(route, "endpoint") and hasattr(route.endpoint, "__module__"):
                print(f"  Module: {route.endpoint.__module__}")
            print()

if __name__ == "__main__":
    list_routes(app)
