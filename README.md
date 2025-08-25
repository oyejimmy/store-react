# Saiyaara Jewelry Store - Complete E-commerce Platform

A complete jewelry e-commerce website with both backend (FastAPI) and frontend (React) applications. This platform provides a full-featured online jewelry store with customer and admin interfaces.

## 🏗️ Architecture

- **Backend**: FastAPI (Python) with SQLAlchemy ORM
- **Frontend**: React 18 with TypeScript, Redux Toolkit, and Ant Design
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT-based authentication
- **Styling**: Ant Design + styled-components

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**

```bash
start-apps.bat
```

**Linux/Mac:**

```bash
chmod +x start-apps.sh
./start-apps.sh
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd store-be
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd store-fe
npm install
npm start
```

## 📁 Project Structure

```
my-store/
├── store-be/                 # Backend (FastAPI)
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # Authentication utilities
│   │   └── database.py      # Database configuration
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── README.md           # Backend documentation
├── store-fe/                 # Frontend (React)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main application
│   ├── package.json        # Node dependencies
│   └── README.md          # Frontend documentation
├── start-apps.bat          # Windows startup script
├── start-apps.sh           # Unix startup script
└── README.md              # This file
```

## 🌟 Features

### Customer Features

- **Homepage**: Banner carousel, featured products, categories
- **Shop**: Product browsing with filters and search
- **Product Details**: Detailed product view with images
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout**: Guest and user checkout process
- **Special Offers**: Dedicated pages for promotional offers
- **Order Tracking**: View order history and status
- **WhatsApp Support**: Floating WhatsApp button for customer support

### Admin Features

- **Dashboard**: Overview statistics and recent orders
- **Product Management**: Add, edit, delete products
- **Order Management**: View and update order status
- **Inventory Management**: Track stock levels
- **User Management**: Manage customer accounts
- **Offer Management**: Create and manage promotions

### Technical Features

- **Responsive Design**: Mobile-first approach
- **Authentication**: JWT-based user authentication
- **Guest Checkout**: Order placement without account creation
- **Real-time Updates**: Live inventory and order status
- **Image Management**: Product image upload and display
- **Search & Filters**: Advanced product search and filtering

## 🛠️ Technology Stack

### Backend

- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation
- **JWT**: Authentication
- **PostgreSQL/SQLite**: Database
- **Uvicorn**: ASGI server

### Frontend

- **React 18**: UI library
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **Ant Design**: UI components
- **styled-components**: CSS-in-JS
- **React Router**: Navigation
- **Axios**: HTTP client

## 📊 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product details
- `GET /api/products/categories` - Get categories
- `GET /api/products/category/{category}` - Get products by category

### Orders

- `POST /api/orders/guest` - Create guest order
- `POST /api/orders` - Create user order
- `GET /api/orders/my-orders` - Get user orders

### Admin

- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/inventory` - Get inventory status

### Offers

- `GET /api/offers/{type}` - Get offers by type
- `GET /api/offers` - Get all offers (admin)

## 🎨 Design System

The application uses a jewelry-themed design system:

- **Primary Color**: Gold (#D4AF37)
- **Secondary Color**: Dark Gold (#B8860B)
- **Background**: Clean white with subtle shadows
- **Typography**: Modern, readable fonts
- **Icons**: Ant Design icon set

## 🔧 Configuration

### Backend Environment Variables

Create `.env` file in `store-be/`:

```env
DATABASE_URL=sqlite:///./saiyaara.db
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Environment Variables

Create `.env` file in `store-fe/`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🚀 Deployment

### Backend Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Install dependencies: `pip install -r requirements.txt`
4. Run migrations: `alembic upgrade head`
5. Start server: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Frontend Deployment

1. Build the application: `npm run build`
2. Serve static files with nginx or similar
3. Configure API URL for production

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy

## 📈 Performance

- Database indexing for fast queries
- Image optimization
- Code splitting with React.lazy
- Bundle size optimization
- Memoization for expensive operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- 📧 Email: support@saiyaara.com
- 📱 WhatsApp: Use the floating WhatsApp button
- 📞 Phone: +91-XXXXXXXXXX

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced search with Elasticsearch
- [ ] Real-time chat support
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Social media integration
