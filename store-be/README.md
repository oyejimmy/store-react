# Gem-Heart Jewelry Store - Backend

A FastAPI-based backend for the Gem-Heart jewelry e-commerce platform.

## Features

- User authentication and authorization
- Product management with categories
- Order management (guest and user orders)
- Inventory tracking
- Special offers and promotions
- Admin dashboard
- RESTful API endpoints

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
cp env.example .env
# Edit .env with your configuration
```

4. Run the application:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database

The application uses SQLite by default for development. For production, configure PostgreSQL in the `.env` file.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product details
- `GET /api/products/categories` - Get all categories
- `GET /api/products/category/{category}` - Get products by category

### Orders

- `POST /api/orders/guest` - Create guest order
- `POST /api/orders` - Create user order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/{id}` - Get order details

### Admin (requires admin privileges)

- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/{id}` - Update order status
- `GET /api/admin/inventory` - Get inventory status
- `PUT /api/admin/inventory/{id}` - Update stock
- `GET /api/admin/users` - Get all users

### Offers

- `GET /api/offers/{type}` - Get offers by type
- `GET /api/offers` - Get all offers (admin)
- `POST /api/offers` - Create offer (admin)
- `PUT /api/offers/{id}` - Update offer (admin)
- `DELETE /api/offers/{id}` - Delete offer (admin)
