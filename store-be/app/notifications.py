import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import requests
import asyncio
from typing import Optional

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
EMAIL_USER = os.getenv("EMAIL_USER", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")

async def send_payment_notification(email: str, order_number: str, amount: float, status: str):
    """Send payment notification email"""
    if not EMAIL_USER or not EMAIL_PASSWORD:
        return False
    
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = email
        msg['Subject'] = f"Payment {status.title()} - Order {order_number}"
        
        body = f"""
        Dear Customer,
        
        Your payment for Order #{order_number} has been {status}.
        Amount: PKR {amount}
        
        Thank you for shopping with Saiyaara Jewelry!
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except:
        return False

async def send_whatsapp_notification(phone: str, message: str):
    """Send WhatsApp notification (placeholder for WhatsApp API)"""
    # Implement WhatsApp API integration here
    return True