from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import uuid
import time
import hashlib
import hmac
import json
import os
import requests
from datetime import datetime, timedelta
import asyncio
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Order
from app.notifications import send_payment_notification, send_whatsapp_notification

router = APIRouter()

class MobileWalletPayment(BaseModel):
    amount: float
    mobile_number: str
    cnic: str
    order_id: str
    gateway: str  # 'jazzcash' or 'easypaisa'

class PaymentResponse(BaseModel):
    success: bool
    transaction_id: str
    message: str
    payment_url: Optional[str] = None

# JazzCash Configuration
JAZZCASH_CONFIG = {
    "merchant_id": os.getenv("JAZZCASH_MERCHANT_ID", "MC40381"),
    "password": os.getenv("JAZZCASH_PASSWORD", "e9ye4yze40"),
    "integrity_salt": os.getenv("JAZZCASH_INTEGRITY_SALT", "hbubj6ue40"),
    "base_url": "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction",
    "return_url": "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction"
}

# EasyPaisa Configuration
EASYPAISA_CONFIG = {
    "store_id": os.getenv("EASYPAISA_STORE_ID", "26969"),
    "hash_key": os.getenv("EASYPAISA_HASH_KEY", "nz9pk8m3fn"),
    "base_url": "https://easypay.easypaisa.com.pk/easypay/Index.jsf"
}

def generate_jazzcash_hash(data_string: str, integrity_salt: str) -> str:
    """Generate HMAC SHA256 hash for JazzCash"""
    key = integrity_salt.encode('utf-8')
    message = data_string.encode('utf-8')
    return hmac.new(key, message, hashlib.sha256).hexdigest()

def generate_easypaisa_hash(data_string: str, hash_key: str) -> str:
    """Generate MD5 hash for EasyPaisa"""
    return hashlib.md5((data_string + hash_key).encode('utf-8')).hexdigest()

@router.post("/jazzcash", response_model=PaymentResponse)
async def process_jazzcash_payment(payment: MobileWalletPayment, db: Session = Depends(get_db)):
    try:
        # Validate inputs
        if not payment.mobile_number.startswith('03') or len(payment.mobile_number) != 11:
            raise HTTPException(status_code=400, detail="Invalid mobile number format")
        
        if len(payment.cnic) != 4 or not payment.cnic.isdigit():
            raise HTTPException(status_code=400, detail="Invalid CNIC (last 4 digits)")
        
        # Generate timestamps
        now = datetime.now()
        expire_time = now + timedelta(days=1)
        
        date_time = now.strftime("%Y%m%d%H%M%S")
        expire_date = expire_time.strftime("%Y%m%d%H%M%S")
        transaction_ref = f"T{date_time}"
        
        # Convert amount to paisa (multiply by 100)
        amount_paisa = str(int(payment.amount * 100))
        
        # Prepare JazzCash parameters
        params = {
            "pp_Version": "1.1",
            "pp_TxnType": "MWALLET",
            "pp_Language": "EN",
            "pp_MerchantID": JAZZCASH_CONFIG["merchant_id"],
            "pp_Password": JAZZCASH_CONFIG["password"],
            "pp_TxnRefNo": transaction_ref,
            "pp_Amount": amount_paisa,
            "pp_TxnCurrency": "PKR",
            "pp_TxnDateTime": date_time,
            "pp_BillReference": payment.order_id,
            "pp_Description": f"Payment for Order {payment.order_id}",
            "pp_TxnExpiryDateTime": expire_date,
            "pp_ReturnURL": JAZZCASH_CONFIG["return_url"],
            "ppmpf_1": payment.cnic
        }
        
        # Generate secure hash
        hash_string = "&".join([
            JAZZCASH_CONFIG["integrity_salt"],
            params["pp_Amount"],
            params["pp_BillReference"],
            params["pp_Description"],
            params["pp_Language"],
            params["pp_MerchantID"],
            params["pp_Password"],
            params["pp_ReturnURL"],
            params["pp_TxnCurrency"],
            params["pp_TxnDateTime"],
            params["pp_TxnExpiryDateTime"],
            params["pp_TxnRefNo"],
            params["pp_TxnType"],
            params["pp_Version"],
            params["ppmpf_1"]
        ])
        
        params["pp_SecureHash"] = generate_jazzcash_hash(hash_string, JAZZCASH_CONFIG["integrity_salt"])
        
        # Make API call to JazzCash
        response = requests.post(JAZZCASH_CONFIG["base_url"], data=params)
        
        if response.status_code == 200:
            result = response.text
            # Update order with transaction details
            order = db.query(Order).filter(Order.order_number == payment.order_id).first()
            if order:
                order.transaction_id = transaction_ref
                order.payment_status = "pending"
                db.commit()
            
            return PaymentResponse(
                success=True,
                transaction_id=transaction_ref,
                message="JazzCash payment initiated successfully",
                payment_url=None
            )
        else:
            raise HTTPException(status_code=400, detail="JazzCash API error")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JazzCash payment failed: {str(e)}")

@router.post("/easypaisa", response_model=PaymentResponse)
async def process_easypaisa_payment(payment: MobileWalletPayment, db: Session = Depends(get_db)):
    try:
        # Validate inputs
        if not payment.mobile_number.startswith('03') or len(payment.mobile_number) != 11:
            raise HTTPException(status_code=400, detail="Invalid mobile number format")
        
        # Generate transaction ID
        transaction_id = f"EP{int(time.time())}{uuid.uuid4().hex[:6].upper()}"
        
        # EasyPaisa parameters
        amount_str = f"{payment.amount:.2f}"
        
        # Generate hash for EasyPaisa
        hash_string = f"{EASYPAISA_CONFIG['store_id']}{amount_str}{payment.order_id}{EASYPAISA_CONFIG['hash_key']}"
        secure_hash = generate_easypaisa_hash(hash_string, "")
        
        # Update order
        order = db.query(Order).filter(Order.order_number == payment.order_id).first()
        if order:
            order.transaction_id = transaction_id
            order.payment_status = "pending"
            db.commit()
        
        return PaymentResponse(
            success=True,
            transaction_id=transaction_id,
            message="EasyPaisa payment initiated successfully",
            payment_url=f"{EASYPAISA_CONFIG['base_url']}?storeId={EASYPAISA_CONFIG['store_id']}&amount={amount_str}&postBackURL=your_callback_url&orderRefNum={payment.order_id}&expiryDate=&merchantHashedReq={secure_hash}&autoRedirect=1&paymentMethod=MA_PAYMENT_METHOD"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"EasyPaisa payment failed: {str(e)}")

@router.get("/status/{transaction_id}")
async def get_payment_status(transaction_id: str, db: Session = Depends(get_db)):
    try:
        order = db.query(Order).filter(Order.transaction_id == transaction_id).first()
        
        if not order:
            return {
                "transaction_id": transaction_id,
                "status": "not_found",
                "message": "Transaction not found"
            }
        
        return {
            "transaction_id": transaction_id,
            "status": order.payment_status,
            "message": f"Payment is {order.payment_status}",
            "order_number": order.order_number,
            "amount": order.total_amount
        }
        
    except Exception as e:
        return {
            "transaction_id": transaction_id,
            "status": "error",
            "message": str(e)
        }

@router.post("/jazzcash/callback")
async def jazzcash_callback(request_data: dict, db: Session = Depends(get_db)):
    try:
        # JazzCash callback parameters
        pp_ResponseCode = request_data.get("pp_ResponseCode")
        pp_TxnRefNo = request_data.get("pp_TxnRefNo")
        pp_ResponseMessage = request_data.get("pp_ResponseMessage")
        
        status = "success" if pp_ResponseCode == "000" else "failed"
        
        if pp_TxnRefNo:
            order = db.query(Order).filter(Order.transaction_id == pp_TxnRefNo).first()
            if order:
                order.payment_status = status
                db.commit()
                
                await send_payment_notification(
                    order.customer_email,
                    order.order_number,
                    order.total_amount,
                    status
                )
        
        return {"status": status, "transaction_id": pp_TxnRefNo, "message": pp_ResponseMessage}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JazzCash callback failed: {str(e)}")

@router.post("/easypaisa/callback")
async def easypaisa_callback(request_data: dict, db: Session = Depends(get_db)):
    try:
        # EasyPaisa callback parameters
        order_ref = request_data.get("orderRefNum")
        status_code = request_data.get("status")
        
        status = "success" if status_code == "0000" else "failed"
        
        if order_ref:
            order = db.query(Order).filter(Order.order_number == order_ref).first()
            if order:
                order.payment_status = status
                db.commit()
                
                await send_payment_notification(
                    order.customer_email,
                    order.order_number,
                    order.total_amount,
                    status
                )
        
        return {"status": status, "order_ref": order_ref}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"EasyPaisa callback failed: {str(e)}")