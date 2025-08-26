from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime
from app.database import get_db
from app.models import Order, OrderItem, Product, User
from app.schemas import OrderCreate, Order as OrderSchema, OrderUpdate
from app.auth import get_current_user

router = APIRouter()

def generate_order_number():
    return f"SAI-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"

@router.post("/guest", response_model=OrderSchema)
def create_guest_order(order: OrderCreate, db: Session = Depends(get_db)):
    # Validate products and calculate total
    total_amount = 0
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id, Product.is_active == True).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        # Check stock using available fields
        stock_qty = product.stock_quantity or product.stock or 0
        if stock_qty < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for product {product.name}")
        
        # Use the best available price
        product_price = product.offer_price or product.price or product.retail_price
        total_amount += product_price * item.quantity
    
    # Create order
    db_order = Order(
        order_number=generate_order_number(),
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        shipping_address=order.shipping_address,
        total_amount=total_amount,
        payment_method=order.payment_method
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items and update stock
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        product_price = product.offer_price or product.price or product.retail_price
        order_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=product_price
        )
        db.add(order_item)
        
        # Update stock using available fields
        if product.stock_quantity is not None:
            product.stock_quantity -= item.quantity
        elif product.stock is not None:
            product.stock -= item.quantity
    
    db.commit()
    return db_order

@router.post("/", response_model=OrderSchema)
def create_user_order(order: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Similar to guest order but with user_id
    total_amount = 0
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id, Product.is_active == True).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        # Check stock using available fields
        stock_qty = product.stock_quantity or product.stock or 0
        if stock_qty < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for product {product.name}")
        
        # Use the best available price
        product_price = product.offer_price or product.price or product.retail_price
        total_amount += product_price * item.quantity
    
    db_order = Order(
        user_id=current_user.id,
        order_number=generate_order_number(),
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        shipping_address=order.shipping_address,
        total_amount=total_amount,
        payment_method=order.payment_method
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        product_price = product.offer_price or product.price or product.retail_price
        order_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=product_price
        )
        db.add(order_item)
        
        # Update stock using available fields
        if product.stock_quantity is not None:
            product.stock_quantity -= item.quantity
        elif product.stock is not None:
            product.stock -= item.quantity
    
    db.commit()
    return db_order

@router.get("/my-orders", response_model=List[OrderSchema])
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/{order_id}", response_model=OrderSchema)
def get_order(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
