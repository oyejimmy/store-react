from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from app.database import get_db
from app.models import Product, Order, User, OrderItem
from app.schemas import ProductCreate, ProductUpdate, Product as ProductSchema, Order as OrderSchema, OrderUpdate, User as UserSchema
from app.auth import get_current_admin_user

router = APIRouter()

# Product Management
@router.post("/products", response_model=ProductSchema)
def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
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
    
    update_data = product_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
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

@router.get("/products", response_model=List[ProductSchema])
def get_all_products(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    return db.query(Product).all()

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
