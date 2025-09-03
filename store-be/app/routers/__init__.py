# API Routers
from .auth import router as auth_router
from .products import router as products_router
from .admin import router as admin_router
from .collections import router as collections_router
from .offers import router as offers_router
from .orders import router as orders_router
from .payments import router as payments_router

__all__ = [
    'auth_router',
    'products_router',
    'admin_router',
    'collections_router',
    'offers_router',
    'orders_router',
    'payments_router'
]
