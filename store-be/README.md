# Gem-Heart Jewelry Store - Backend

![GitHub](https://img.shields.io/github/license/yourusername/gem-heart-backend)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)

A high-performance, scalable FastAPI-based backend for the Gem-Heart jewelry e-commerce platform.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Social login (Google, Facebook)
  - Email verification

- 🛍️ **Product Management**
  - CRUD operations for products
  - Product categories and filtering
  - Product search and filtering
  - Image upload and management

- 🛒 **Order System**
  - Guest checkout
  - User order history
  - Order status tracking
  - Payment integration (Stripe/PayPal)

- 📊 **Inventory & Analytics**
  - Real-time stock management
  - Sales analytics
  - Low stock alerts

- 🎁 **Offers & Promotions**
  - Discount codes
  - Seasonal sales
  - Flash deals

- 👨‍💼 **Admin Dashboard**
  - User management
  - Order processing
  - Sales reports
  - System configuration

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite (Development), PostgreSQL (Production)
- **ORM**: SQLAlchemy
- **Authentication**: JWT
- **API Documentation**: Swagger UI, ReDoc
- **Testing**: Pytest
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## Prerequisites

- Python 3.8+
- pip (Python package manager)
- SQLite (included in Python)
- PostgreSQL (for production)
- Redis (for caching and rate limiting, optional)

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gem-heart-backend.git
   cd gem-heart-backend
   ```

2. **Create and activate virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Run the application**
   ```bash
   # Development
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Production (with Gunicorn)
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# App
APP_NAME="Gem-Heart Backend"
APP_ENV=development
DEBUG=True
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///./gem_heart.db
# For PostgreSQL: postgresql://user:password@localhost:5432/dbname

# Email (for password reset, etc.)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@gemheart.com

# Storage
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16 * 1024 * 1024  # 16MB

# CORS
FRONTEND_URL=http://localhost:3000

# Redis (optional)
REDIS_URL=redis://localhost:6379

# External APIs
STRIPE_SECRET_KEY=your-stripe-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
FACEBOOK_APP_ID=your-facebook-app-id
```

## API Documentation

Once the server is running, explore the API documentation:

- **Interactive API Docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative Documentation (ReDoc)**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

The API documentation includes:
- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Try-it-out functionality (in Swagger UI)

## Database

The application uses SQLite by default for development and PostgreSQL for production.

### Database Migrations

We use Alembic for database migrations. To create a new migration:

```bash
alembic revision --autogenerate -m "Your migration message"
alembic upgrade head
```

### Seeding Data

To seed the database with initial data (admin user, categories, sample products):

```bash
python -m app.db.seed
```

### Production Database

For production, configure PostgreSQL in the `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/gem_heart_prod
```

### Backup and Restore

```bash
# Backup
pg_dump -U username -d dbname > backup.sql

# Restore
psql -U username -d dbname < backup.sql
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/auth/signup` | Register a new user | None |
| `POST` | `/api/auth/login` | Login and get access token | None |
| `GET` | `/api/auth/me` | Get current user info | JWT Required |
| `POST` | `/api/auth/refresh` | Refresh access token | JWT Required |
| `POST` | `/api/auth/forgot-password` | Request password reset | None |
| `POST` | `/api/auth/reset-password` | Reset password | None |

### Products

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/products` | Get all products (with pagination) | None |
| `GET` | `/api/products/{id}` | Get product details | None |
| `GET` | `/api/products/search` | Search products | None |
| `GET` | `/api/products/categories` | Get all categories | None |
| `GET` | `/api/products/category/{slug}` | Get products by category | None |

### Orders

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/orders/guest` | Create guest order | None |
| `POST` | `/api/orders` | Create user order | JWT Required |
| `GET` | `/api/orders/my-orders` | Get user's orders | JWT Required |
| `GET` | `/api/orders/{id}` | Get order details | JWT Required |
| `POST` | `/api/orders/{id}/cancel` | Cancel order | JWT Required |

### Admin Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/admin/dashboard` | Dashboard statistics | Admin |
| `GET` | `/api/admin/products` | Get all products (admin) | Admin |
| `POST` | `/api/admin/products` | Create product | Admin |
| `PUT` | `/api/admin/products/{id}` | Update product | Admin |
| `DELETE` | `/api/admin/products/{id}` | Delete product | Admin |
| `GET` | `/api/admin/orders` | Get all orders | Admin |
| `PUT` | `/api/admin/orders/{id}` | Update order status | Admin |
| `GET` | `/api/admin/inventory` | Get inventory status | Admin |
| `PUT` | `/api/admin/inventory/{id}` | Update stock | Admin |
| `GET` | `/api/admin/users` | Get all users | Admin |
| `PUT` | `/api/admin/users/{id}/role` | Update user role | Admin |

### Offers & Promotions

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/offers` | Get all active offers | None |
| `GET` | `/api/offers/{type}` | Get offers by type | None |
| `POST` | `/api/offers/validate` | Validate discount code | None |
| `GET` | `/api/admin/offers` | Get all offers | Admin |
| `POST` | `/api/admin/offers` | Create offer | Admin |
| `PUT` | `/api/admin/offers/{id}` | Update offer | Admin |
| `DELETE` | `/api/admin/offers/{id}` | Delete offer | Admin |

## Testing

Run tests using pytest:

```bash
# Install test dependencies
pip install -r requirements-test.txt

# Run all tests
pytest

# Run tests with coverage report
pytest --cov=app --cov-report=html
```

### Test Coverage

After running tests with coverage, open `htmlcov/index.html` in your browser to view the coverage report.

## Deployment

### Docker

Build and run with Docker:

```bash
# Build the image
docker build -t gem-heart-backend .

# Run the container
docker run -d --name gem-heart-backend -p 8000:80 gem-heart-backend
```

### Kubernetes

Deploy to Kubernetes:

```bash
kubectl apply -f k8s/
```

### Cloud Deployment

#### AWS ECS

```bash
# Build and push to ECR
aws ecr get-login-password --region region | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.region.amazonaws.com
docker build -t gem-heart-backend .
docker tag gem-heart-backend:latest aws_account_id.dkr.ecr.region.amazonaws.com/gem-heart-backend:latest
docker push aws_account_id.dkr.ecr.region.amazonaws.com/gem-heart-backend:latest

# Update ECS service
aws ecs update-service --cluster gem-heart-cluster --service gem-heart-service --force-new-deployment
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

We use `black` for code formatting and `flake8` for linting:

```bash
# Format code
black .

# Lint code
flake8
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue or email support@gemheart.com
