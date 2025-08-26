from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from typing import List, Optional
from app.database import get_db
from app.models import Product, Category
from app.schemas import Product as ProductSchema, Category as CategorySchema

router = APIRouter()

@router.get("/", response_model=List[ProductSchema])
def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    subcategory: Optional[str] = Query(None, description="Filter by subcategory"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    limit: Optional[int] = Query(None, description="Limit number of results"),
    db: Session = Depends(get_db)
):
    query = db.query(Product).options(joinedload(Product.category)).filter(Product.is_active == True)
    
    if category:
        # Handle both category name and category_id
        if category.isdigit():
            query = query.filter(Product.category_id == int(category))
        else:
            # Try to match by category name or subcategory
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
    
    products = query.all()
    
    # Set legacy fields for backward compatibility
    for product in products:
        if not product.price:
            product.price = product.offer_price or product.retail_price
        if not product.original_price:
            product.original_price = product.retail_price
        if not product.stock_quantity:
            product.stock_quantity = product.stock
    
    return products

@router.get("/categories", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.is_active == True).all()
    return categories

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
    product = db.query(Product).options(joinedload(Product.category)).filter(
        Product.id == product_id, Product.is_active == True
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Set legacy fields for backward compatibility
    if not product.price:
        product.price = product.offer_price or product.retail_price
    if not product.original_price:
        product.original_price = product.retail_price
    if not product.stock_quantity:
        product.stock_quantity = product.stock
    
    return product

@router.get("/category/{category}")
def get_products_by_category(
    category: str,
    subcategory: Optional[str] = Query(None, description="Filter by subcategory"),
    db: Session = Depends(get_db)
):
    # Try exact match first, then with space conversion
    category_filter = category.lower()
    category_filter_spaces = category.replace('-', ' ').lower()
    
    query = db.query(Product).filter(
        or_(
            func.lower(Product.subcategory) == category_filter,
            func.lower(Product.subcategory) == category_filter_spaces,
            Product.subcategory.ilike(f"%{category_filter}%"),
            Product.subcategory.ilike(f"%{category_filter_spaces}%")
        ),
        Product.is_active == True
    )
    
    if subcategory:
        query = query.filter(Product.subcategory == subcategory)
    
    products = query.all()
    
    # Set legacy fields for backward compatibility
    for product in products:
        if not product.price:
            product.price = product.offer_price or product.retail_price
        if not product.original_price:
            product.original_price = product.retail_price
        if not product.stock_quantity:
            product.stock_quantity = product.stock
    
    return products
