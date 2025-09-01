from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
import os

from app.routers import auth, products, orders, admin, offers, payments, collections
from app.database import engine
from app.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gem-Heart Jewelry API",
    description="E-commerce API for Gem-Heart Jewelry Store",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount static files for product images
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(offers.router, prefix="/api/offers", tags=["Offers"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(collections.router, prefix="/api/collections", tags=["Collections"])

@app.get("/")
async def root():
    return {"message": "Welcome to Gem-Heart Jewelry API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Global OPTIONS handler for all routes
@app.options("/{full_path:path}")
async def options_handler(request: Request):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin, User-Agent",
            "Access-Control-Max-Age": "86400",
        }
    )
