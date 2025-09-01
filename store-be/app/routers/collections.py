from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import os
import uuid
from app.database import get_db
from app.models import Category, Product
from app.schemas import Category as CategorySchema, CategoryCreate, CategoryUpdate
from app.auth import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[CategorySchema])
def get_collections(db: Session = Depends(get_db)):
    """Get all collections/categories with product counts"""
    collections = db.query(Category).filter(Category.is_active == True).all()
    
    # Update total_products count for each collection
    for collection in collections:
        product_count = db.query(func.count(Product.id)).filter(
            Product.category_id == collection.id,
            Product.is_active == True
        ).scalar()
        collection.total_products = product_count
    
    return collections

@router.get("/{collection_id}", response_model=CategorySchema)
def get_collection(collection_id: int, db: Session = Depends(get_db)):
    """Get a specific collection by ID"""
    collection = db.query(Category).filter(
        Category.id == collection_id,
        Category.is_active == True
    ).first()
    
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Update product count
    product_count = db.query(func.count(Product.id)).filter(
        Product.category_id == collection.id,
        Product.is_active == True
    ).scalar()
    collection.total_products = product_count
    
    return collection

@router.post("/", response_model=CategorySchema)
def create_collection(
    collection: CategoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create a new collection"""
    # Check if collection with same name already exists
    existing_collection = db.query(Category).filter(Category.name == collection.name).first()
    if existing_collection:
        raise HTTPException(status_code=400, detail="Collection with this name already exists")
    
    db_collection = Category(
        name=collection.name,
        description=collection.description,
        icon=collection.icon,
        image=collection.image,
        total_products=0,  # Start with 0 products
        conditions=collection.conditions,
        is_active=True
    )
    
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection

@router.put("/{collection_id}", response_model=CategorySchema)
def update_collection(
    collection_id: int,
    collection_update: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update an existing collection"""
    db_collection = db.query(Category).filter(Category.id == collection_id).first()
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Check for name uniqueness if name is being updated
    if collection_update.name and collection_update.name != db_collection.name:
        existing_collection = db.query(Category).filter(Category.name == collection_update.name).first()
        if existing_collection:
            raise HTTPException(status_code=400, detail="Collection with this name already exists")
    
    # Update fields that are provided
    update_data = collection_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(db_collection, field):
            setattr(db_collection, field, value)
    
    # Update product count if not manually set
    if 'total_products' not in update_data:
        product_count = db.query(func.count(Product.id)).filter(
            Product.category_id == collection_id,
            Product.is_active == True
        ).scalar()
        db_collection.total_products = product_count
    
    db.commit()
    db.refresh(db_collection)
    return db_collection

@router.delete("/{collection_id}")
def delete_collection(
    collection_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete a collection (soft delete)"""
    db_collection = db.query(Category).filter(Category.id == collection_id).first()
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Check if collection has active products
    product_count = db.query(func.count(Product.id)).filter(
        Product.category_id == collection_id,
        Product.is_active == True
    ).scalar()
    
    if product_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete collection. It contains {product_count} active products. Please move or delete the products first."
        )
    
    # Soft delete
    db_collection.is_active = False
    db.commit()
    
    return {"message": "Collection deleted successfully"}

@router.get("/{collection_id}/products")
def get_collection_products(
    collection_id: int,
    db: Session = Depends(get_db)
):
    """Get all products in a collection"""
    # Verify collection exists
    collection = db.query(Category).filter(
        Category.id == collection_id,
        Category.is_active == True
    ).first()
    
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Get products in this collection
    products = db.query(Product).filter(
        Product.category_id == collection_id,
        Product.is_active == True
    ).all()
    
    return {
        "collection": collection,
        "products": products,
        "total_products": len(products)
    }

@router.post("/{collection_id}/upload-image")
async def upload_collection_image(
    collection_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Upload an image for a collection"""
    # Verify collection exists
    collection = db.query(Category).filter(Category.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
        )
    
    # Validate file size (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(status_code=400, detail="File size too large. Maximum 5MB allowed.")
    
    # Create upload directory if it doesn't exist
    upload_dir = "static/uploads/collections"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    unique_filename = f"collection_{collection_id}_{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)
    
    # Update collection with image path
    collection.image = f"uploads/collections/{unique_filename}"
    db.commit()
    db.refresh(collection)
    
    return {
        "message": "Image uploaded successfully",
        "image_url": f"/static/uploads/collections/{unique_filename}",
        "collection": collection
    }

@router.get("/{collection_id}/image")
def get_collection_image(collection_id: int, db: Session = Depends(get_db)):
    """Get the image URL for a collection"""
    collection = db.query(Category).filter(Category.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    if not collection.image:
        raise HTTPException(status_code=404, detail="No image found for this collection")
    
    # Return full URL for the image
    image_url = f"/static/{collection.image}" if not collection.image.startswith('/static/') else collection.image
    
    return {
        "collection_id": collection_id,
        "collection_name": collection.name,
        "image_url": image_url
    }
