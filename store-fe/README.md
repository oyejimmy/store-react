# Saiyaara Jewelry Store - Frontend

A React-based frontend for the Saiyaara jewelry e-commerce platform built with TypeScript, Redux Toolkit, Ant Design, and styled-components.

## Features

- **Modern UI/UX**: Beautiful jewelry-themed design with Ant Design components
- **Responsive Design**: Mobile-first approach with responsive layouts
- **State Management**: Redux Toolkit for global state management
- **Authentication**: User login/signup with JWT tokens
- **Product Browsing**: Category-based product browsing with filters
- **Shopping Cart**: Add/remove items with quantity management
- **Guest Checkout**: Order placement without account creation
- **Special Offers**: Dedicated pages for promotional offers
- **Admin Panel**: Complete admin interface for store management
- **WhatsApp Integration**: Floating WhatsApp button for customer support

## Tech Stack

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Ant Design** for UI components
- **styled-components** for custom styling
- **React Router** for navigation
- **Axios** for API communication

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:

```
REACT_APP_API_URL=http://localhost:8000/api
```

4. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   ├── layout/         # Layout components
│   └── product/        # Product-related components
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── auth/           # Authentication pages
│   └── customer/       # Customer pages
├── store/              # Redux store
│   └── slices/         # Redux slices
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Features

### Customer Features

- **Homepage**: Banner carousel, featured products, categories
- **Shop**: Product browsing with filters and search
- **Product Details**: Detailed product view with images
- **Cart**: Shopping cart management
- **Checkout**: Guest and user checkout process
- **Special Offers**: Dedicated offer pages
- **Order Tracking**: View order history and status

### Admin Features

- **Dashboard**: Overview statistics and recent orders
- **Product Management**: Add, edit, delete products
- **Order Management**: View and update order status
- **Inventory Management**: Track stock levels
- **User Management**: Manage customer accounts
- **Offer Management**: Create and manage promotions

## Design System

The application uses a jewelry-themed design system with:

- **Primary Color**: Gold (#D4AF37)
- **Secondary Color**: Dark Gold (#B8860B)
- **Background**: Clean white with subtle shadows
- **Typography**: Modern, readable fonts
- **Icons**: Ant Design icon set

## API Integration

The frontend communicates with the FastAPI backend through:

- **Authentication**: JWT token-based auth
- **Products**: CRUD operations for products
- **Orders**: Order creation and management
- **Offers**: Special offer management
- **Admin**: Administrative functions

## Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Styled-components for CSS-in-JS

### State Management

- Redux Toolkit for global state
- Local state for component-specific data
- Async thunks for API calls

### Performance

- Code splitting with React.lazy
- Image optimization
- Bundle size optimization
- Memoization for expensive operations
