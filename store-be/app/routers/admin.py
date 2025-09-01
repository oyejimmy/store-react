from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import os
import uuid
from app.database import get_db
from app.models import Product, Order, User, OrderItem, Category
from app.schemas import ProductCreate, ProductUpdate, Product as ProductSchema, Order as OrderSchema, OrderUpdate, User as UserSchema, Category as CategorySchema, CategoryCreate, CategoryUpdate
from app.auth import get_current_admin_user

router = APIRouter()

# Helper function for optional admin authentication
def get_optional_admin_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Optional admin authentication - returns None if no auth provided"""
    if not authorization:
        return None
    
    try:
        from app.auth import verify_token
        if authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
            email = verify_token(token)
            if email:
                user = db.query(User).filter(User.email == email).first()
                if user and user.is_admin:
                    return user
    except Exception:
        pass
    return None

# Product Management
@router.post("/products", response_model=ProductSchema)
def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    product_data = product.dict()
    # Ensure stock and stock_quantity are synchronized
    if 'stock_quantity' in product_data:
        product_data['stock'] = product_data['stock_quantity']
    elif 'stock' in product_data:
        product_data['stock_quantity'] = product_data['stock']
    
    db_product = Product(**product_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Update category product count
    if db_product.category_id:
        category = db.query(Category).filter(Category.id == db_product.category_id).first()
        if category:
            category.total_products = db.query(Product).filter(
                Product.category_id == db_product.category_id,
                Product.is_active == True
            ).count()
            db.commit()
    
    return db_product

@router.put("/products/{product_id}", response_model=ProductSchema)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Store old category for updating counts
    old_category_id = db_product.category_id
    
    update_data = product_update.dict(exclude_unset=True)
    # Ensure stock and stock_quantity are synchronized
    if 'stock_quantity' in update_data:
        update_data['stock'] = update_data['stock_quantity']
    elif 'stock' in update_data:
        update_data['stock_quantity'] = update_data['stock']
    
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    
    # Update category product counts if category changed
    if 'category_id' in update_data and old_category_id != db_product.category_id:
        # Update old category count
        if old_category_id:
            old_category = db.query(Category).filter(Category.id == old_category_id).first()
            if old_category:
                old_category.total_products = db.query(Product).filter(
                    Product.category_id == old_category_id,
                    Product.is_active == True
                ).count()
        
        # Update new category count
        if db_product.category_id:
            new_category = db.query(Category).filter(Category.id == db_product.category_id).first()
            if new_category:
                new_category.total_products = db.query(Product).filter(
                    Product.category_id == db_product.category_id,
                    Product.is_active == True
                ).count()
        
        db.commit()
    
    return db_product

@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db_product.is_active = False
    db.commit()
    return {"message": "Product deactivated successfully"}

# Temporary debug endpoint without authentication
@router.get("/products/debug")
def debug_products(db: Session = Depends(get_db)):
    try:
        products = db.query(Product).all()
        return {
            "status": "success",
            "count": len(products),
            "products": [{
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "is_active": p.is_active
            } for p in products[:5]]  # Return first 5 for debugging
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "error_type": type(e).__name__
        }

# Temporary products endpoint without strict authentication for debugging
@router.get("/products/temp")
def get_products_temp(db: Session = Depends(get_db)):
    try:
        products = db.query(Product).all()
        return [{
            "id": p.id,
            "name": p.name,
            "full_name": p.full_name,
            "type": p.type,
            "retail_price": p.retail_price,
            "offer_price": p.offer_price,
            "price": p.price,
            "original_price": p.original_price,
            "description": p.description,
            "stock_quantity": p.stock_quantity,
            "is_active": p.is_active,
            "category_id": p.category_id,
            "images": p.images
        } for p in products]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/products", response_model=List[ProductSchema])
def get_all_products(
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 50,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Product)
        
        # Apply filters
        if category_id:
            query = query.filter(Product.category_id == category_id)
        
        if search:
            query = query.filter(
                Product.name.contains(search) | 
                Product.full_name.contains(search) |
                Product.description.contains(search)
            )
        
        # Apply pagination
        offset = (page - 1) * limit
        products = query.offset(offset).limit(limit).all()
        
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Order Management
@router.get("/orders", response_model=List[OrderSchema])
def get_all_orders(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.get("/orders/{order_id}", response_model=OrderSchema)
def get_order_details(
    order_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/orders/{order_id}", response_model=OrderSchema)
def update_order_status(
    order_id: int,
    order_update: OrderUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = order_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)
    
    db.commit()
    db.refresh(order)
    return order

@router.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Delete associated order items first
    db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
    
    # Delete the order
    db.delete(order)
    db.commit()
    
    return {"message": "Order deleted successfully"}

# Inventory Management
@router.get("/inventory")
def get_inventory_status(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    products = db.query(Product).all()
    inventory_data = []
    
    for product in products:
        status = "In Stock"
        if product.stock_quantity == 0:
            status = "Out of Stock"
        elif product.stock_quantity <= 5:
            status = "Low Stock"
        
        inventory_data.append({
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "stock_quantity": product.stock_quantity,
            "status": status
        })
    
    return inventory_data

@router.put("/inventory/{product_id}")
def update_stock(
    product_id: int,
    stock_quantity: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.stock_quantity = stock_quantity
    db.commit()
    return {"message": "Stock updated successfully"}

# User Management
@router.get("/users", response_model=List[UserSchema])
def get_all_users(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    return db.query(User).all()

@router.put("/users/{user_id}/toggle")
def toggle_user_status(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'activated' if user.is_active else 'deactivated'} successfully"}

# Product Analytics
@router.get("/products/analytics")
def get_product_analytics(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    try:
        # Total products
        total_products = db.query(Product).filter(Product.is_active == True).count()
        
        # Active vs Inactive products
        active_products = db.query(Product).filter(Product.is_active == True).count()
        inactive_products = db.query(Product).filter(Product.is_active == False).count()
        
        # Low stock products (stock <= 5)
        low_stock_products = db.query(Product).filter(
            Product.stock_quantity <= 5,
            Product.is_active == True
        ).count()
        
        # Out of stock products
        out_of_stock_products = db.query(Product).filter(
            Product.stock_quantity == 0,
            Product.is_active == True
        ).count()
        
        # Products by category
        category_stats = db.query(
            Category.name,
            func.count(Product.id).label('product_count')
        ).join(Product, Category.id == Product.category_id, isouter=True).group_by(Category.id, Category.name).all()
        
        # Total inventory value
        total_inventory_value = db.query(
            func.sum(Product.retail_price * Product.stock_quantity)
        ).filter(Product.is_active == True).scalar() or 0
        
        return {
            "total_products": total_products,
            "active_products": active_products,
            "inactive_products": inactive_products,
            "low_stock_products": low_stock_products,
            "out_of_stock_products": out_of_stock_products,
            "total_inventory_value": round(total_inventory_value, 2),
            "category_stats": [{
                "category": stat[0] or "Uncategorized",
                "count": stat[1]
            } for stat in category_stats]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics error: {str(e)}")

# Dashboard Statistics
@router.get("/dashboard")
def get_dashboard_stats(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    total_products = db.query(Product).filter(Product.is_active == True).count()
    total_orders = db.query(Order).count()
    total_users = db.query(User).filter(User.is_admin == False).count()
    
    # Low stock products
    low_stock_products = db.query(Product).filter(
        Product.stock_quantity <= 5,
        Product.is_active == True
    ).count()
    
    # Recent orders
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_users": total_users,
        "low_stock_products": low_stock_products,
        "recent_orders": recent_orders
    }

# Categories/Collection Management
@router.get("/categories", response_model=List[CategorySchema])
def get_all_categories(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all categories for admin"""
    categories = db.query(Category).all()
    
    # Update total_products count for each category
    for category in categories:
        product_count = db.query(func.count(Product.id)).filter(
            Product.category_id == category.id,
            Product.is_active == True
        ).scalar()
        category.total_products = product_count
    
    return categories

@router.get("/collections", response_model=List[CategorySchema])
def get_all_collections(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all collections for admin"""
    collections = db.query(Category).all()
    
    # Update total_products count for each collection
    for collection in collections:
        product_count = db.query(func.count(Product.id)).filter(
            Product.category_id == collection.id,
            Product.is_active == True
        ).scalar()
        collection.total_products = product_count
    
    return collections

@router.post("/collections", response_model=CategorySchema)
def create_collection(
    collection: CategoryCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
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
        total_products=0,
        conditions=collection.conditions,
        is_active=True
    )
    
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection

@router.put("/collections/{collection_id}", response_model=CategorySchema)
def update_collection(
    collection_id: int,
    collection_update: CategoryUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a collection"""
    db_collection = db.query(Category).filter(Category.id == collection_id).first()
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Check for name uniqueness if name is being updated
    if collection_update.name and collection_update.name != db_collection.name:
        existing_collection = db.query(Category).filter(Category.name == collection_update.name).first()
        if existing_collection:
            raise HTTPException(status_code=400, detail="Collection with this name already exists")
    
    # Update fields
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

@router.delete("/collections/{collection_id}")
def delete_collection(
    collection_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a collection"""
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
            detail=f"Cannot delete collection. It contains {product_count} active products."
        )
    
    # Soft delete
    db_collection.is_active = False
    db.commit()
    
    return {"message": "Collection deleted successfully"}

@router.post("/products/{product_id}/upload-image")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Upload an image for a product"""
    # Verify product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
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
    upload_dir = "static/uploads/products"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    unique_filename = f"product_{product_id}_{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)
    
    # Update product with image path
    current_images = product.images or []
    if len(current_images) >= 5:
        raise HTTPException(status_code=400, detail="Maximum 5 images allowed per product")
    
    new_image_url = f"uploads/products/{unique_filename}"
    current_images.append(new_image_url)
    product.images = current_images
    db.commit()
    db.refresh(product)
    
    return {
        "message": "Image uploaded successfully",
        "image_url": f"/static/uploads/products/{unique_filename}",
        "total_images": len(current_images),
        "product": product
    }

@router.post("/collections/{collection_id}/upload-image")
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
