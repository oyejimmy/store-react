from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Product
from app.schemas import Product as ProductSchema

router = APIRouter()

@router.get("/", response_model=List[ProductSchema])
def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    subcategory: Optional[str] = Query(None, description="Filter by subcategory"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    
    if category:
        query = query.filter(Product.category == category)
    
    if subcategory:
        query = query.filter(Product.subcategory == subcategory)
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_term)) | 
            (Product.description.ilike(search_term))
        )
    
    return query.all()

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Product.category).distinct().filter(Product.is_active == True).all()
    return [cat[0] for cat in categories]

@router.get("/subcategories")
def get_subcategories(
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    query = db.query(Product.subcategory).distinct().filter(Product.is_active == True)
    if category:
        query = query.filter(Product.category == category)
    
    subcategories = query.all()
    return [subcat[0] for subcat in subcategories]

@router.get("/{product_id}", response_model=ProductSchema)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/category/{category}")
def get_products_by_category(
    category: str,
    subcategory: Optional[str] = Query(None, description="Filter by subcategory"),
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(
        Product.category == category,
        Product.is_active == True
    )
    
    if subcategory:
        query = query.filter(Product.subcategory == subcategory)
    
    return query.all()
