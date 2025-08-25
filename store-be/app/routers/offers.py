from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models import Offer, Product, ProductOffer
from app.schemas import OfferCreate, OfferUpdate, Offer as OfferSchema
from app.auth import get_current_admin_user

router = APIRouter()

@router.get("/{offer_type}")
def get_offers_by_type(
    offer_type: str,
    db: Session = Depends(get_db)
):
    """Get products under specific offer types: under_299, special_deals, deal_of_month"""
    if offer_type == "under_299":
        # Get products under 299
        products = db.query(Product).filter(
            Product.price <= 299,
            Product.is_active == True
        ).all()
    elif offer_type == "special_deals":
        # Get products with active special deals
        products = db.query(Product).join(ProductOffer).join(Offer).filter(
            Offer.offer_type == "special_deals",
            Offer.is_active == True,
            Offer.start_date <= datetime.now(),
            Offer.end_date >= datetime.now(),
            Product.is_active == True
        ).all()
    elif offer_type == "deal_of_month":
        # Get products with deal of the month
        products = db.query(Product).join(ProductOffer).join(Offer).filter(
            Offer.offer_type == "deal_of_month",
            Offer.is_active == True,
            Offer.start_date <= datetime.now(),
            Offer.end_date >= datetime.now(),
            Product.is_active == True
        ).all()
    else:
        raise HTTPException(status_code=400, detail="Invalid offer type")
    
    return products

@router.get("/", response_model=List[OfferSchema])
def get_all_offers(
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    return db.query(Offer).all()

@router.post("/", response_model=OfferSchema)
def create_offer(
    offer: OfferCreate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    db_offer = Offer(**offer.dict())
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return db_offer

@router.put("/{offer_id}", response_model=OfferSchema)
def update_offer(
    offer_id: int,
    offer_update: OfferUpdate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    db_offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    update_data = offer_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_offer, field, value)
    
    db.commit()
    db.refresh(db_offer)
    return db_offer

@router.delete("/{offer_id}")
def delete_offer(
    offer_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    db_offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    db_offer.is_active = False
    db.commit()
    return {"message": "Offer deactivated successfully"}

@router.post("/{offer_id}/products/{product_id}")
def add_product_to_offer(
    offer_id: int,
    product_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if product is already in this offer
    existing = db.query(ProductOffer).filter(
        ProductOffer.offer_id == offer_id,
        ProductOffer.product_id == product_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Product already in this offer")
    
    product_offer = ProductOffer(offer_id=offer_id, product_id=product_id)
    db.add(product_offer)
    db.commit()
    
    return {"message": "Product added to offer successfully"}

@router.delete("/{offer_id}/products/{product_id}")
def remove_product_from_offer(
    offer_id: int,
    product_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    product_offer = db.query(ProductOffer).filter(
        ProductOffer.offer_id == offer_id,
        ProductOffer.product_id == product_id
    ).first()
    
    if not product_offer:
        raise HTTPException(status_code=404, detail="Product not found in this offer")
    
    db.delete(product_offer)
    db.commit()
    
    return {"message": "Product removed from offer successfully"}
