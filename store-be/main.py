from fastapi import FastAPI, Request, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, RedirectResponse, Response
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from typing import Optional
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import models after database is initialized
from app.database import get_db, engine
from app.models import Product, Base

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

class CustomFastAPI(FastAPI):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
    def openapi(self):
        if self.openapi_schema:
            return self.openapi_schema
            
        openapi_schema = super().openapi()
        
        # Add support for both /path and /path/ in the OpenAPI schema
        paths = openapi_schema.get("paths", {})
        new_paths = {}
        
        for path, methods in paths.items():
            # Add both versions of the path
            if not path.endswith('/'):
                new_paths[path] = methods
                new_paths[f"{path}/"] = methods
            else:
                new_paths[path] = methods
                new_paths[path.rstrip('/')] = methods
        
        openapi_schema["paths"] = new_paths
        self.openapi_schema = openapi_schema
        return self.openapi_schema

app = CustomFastAPI(
    title="Gem-Heart Jewelry API",
    description="E-commerce API for Gem-Heart Jewelry Store",
    version="1.0.0",
    redirect_slashes=True  # Enable automatic redirect from /path to /path/
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600  # Cache preflight requests for 10 minutes
)

# Mount static files for product images
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Add middleware to log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# Include routers with proper ordering
routers = [
    (auth.router, "/api/auth", ["Authentication"]),
    (products.router, "", ["Products"]),  # No prefix needed as prefix is set in the router
    (orders.router, "/api/orders", ["Orders"]),
    (admin.router, "/api/admin", ["Admin"]),
    (offers.router, "/api/offers", ["Offers"]),
    (payments.router, "/api/payments", ["Payments"]),
    (collections.router, "/api/collections", ["Collections"])
]

# Log and include all routers
for router, prefix, tags in routers:
    logger.info(f"Including router at {prefix} with tags {tags}")
    app.include_router(router, prefix=prefix, tags=tags)

# Handle both /api/products and /api/products/ directly in main.py
@app.get("/api/products")
@app.get("/api/products/")
async def get_products(
    request: Request,
    category: Optional[str] = Query(None, description="Filter by category"),
    subcategory: Optional[str] = Query(None, description="Filter by subcategory"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    limit: Optional[int] = Query(None, description="Limit number of results"),
    db: Session = Depends(get_db)
):
    logger.info("GET /api/products endpoint called from main.py")
    logger.info(f"Query parameters - category: {category}, subcategory: {subcategory}, "
               f"min_price: {min_price}, max_price: {max_price}, search: {search}, limit: {limit}")
    
    try:
        # Start building the query
        query = db.query(Product).options(joinedload(Product.category)).filter(Product.is_active == True)
        logger.debug(f"Initial query: {query.statement}")
        
        # Apply filters if provided
        if category:
            if category.isdigit():
                query = query.filter(Product.category_id == int(category))
            else:
                category_filter = category.replace('-', ' ').lower()
                query = query.filter(
                    or_(
                        Product.subcategory.ilike(f"%{category_filter}%"),
                        func.lower(Product.subcategory) == category_filter
                    )
                )
        
        if subcategory:
            query = query.filter(Product.subcategory == subcategory)
        
        if min_price is not None:
            query = query.filter(
                (Product.offer_price >= min_price) | 
                ((Product.offer_price == None) & (Product.retail_price >= min_price))
            )
        
        if max_price is not None:
            query = query.filter(
                (Product.offer_price <= max_price) | 
                ((Product.offer_price == None) & (Product.retail_price <= max_price))
            )
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Product.name.ilike(search_term)) | 
                (Product.description.ilike(search_term)) |
                (Product.full_name.ilike(search_term))
            )
        
        if limit:
            query = query.limit(limit)
        
        # Execute the query
        products = query.all()
        logger.info(f"Found {len(products)} products")
        
        # Set legacy fields for backward compatibility
        for product in products:
            if not hasattr(product, 'price') or product.price is None:
                product.price = getattr(product, 'offer_price', None) or getattr(product, 'retail_price', 0)
            if not hasattr(product, 'original_price') or product.original_price is None:
                product.original_price = getattr(product, 'retail_price', 0)
            if not hasattr(product, 'stock_quantity') or product.stock_quantity is None:
                product.stock_quantity = getattr(product, 'stock', 0)
        
        return products
        
    except Exception as e:
        logger.error(f"Error in get_products: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving products: {str(e)}"
        )

@app.get("/")
async def root():
    return {"message": "Welcome to Gem-Heart Jewelry API"}

# Test endpoint to check if basic routing works
@app.get("/test")
async def test_endpoint():
    return {"status": "success", "message": "Test endpoint is working"}

# Test products endpoint directly in main.py
@app.get("/api/test-products")
async def test_products():
    return [{"id": 1, "name": "Test Product", "price": 9.99}]

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
