import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { getCurrentUser } from "./store/slices/authSlice";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/common/WhatsAppButton";
import AdminLayout from "./components/layout/AdminLayout";

// Customer Pages
import HomePage from "./pages/customer/HomePage";
import ShopPage from "./pages/customer/ShopPage";
import CategoriesPage from "./pages/customer/CategoriesPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OffersPage from "./pages/customer/OffersPage";
import ContactPage from "./pages/customer/ContactPage";
import AboutPage from "./pages/customer/AboutPage";
import LoginPage from "./pages/customer/LoginPage";
import SignupPage from "./pages/customer/SignupPage";
import OrderConfirmationPage from "./pages/customer/OrderConfirmationPage";
import UserOrdersPage from "./pages/customer/UserOrdersPage";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminOffers from "./pages/admin/AdminOffers";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSalesChannels from "./pages/admin/AdminSalesChannels";
import AdminReports from "./pages/admin/AdminReports";
import NotFound from "./pages/NotFound";

// Protected Route Component
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Styled Components
import styled from "styled-components";

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 64px; // Header height
`;

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (token && isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="sales-channels" element={<AdminSalesChannels />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
      
      {/* Customer Routes */}
      <Route path="/*" element={
        <AppContainer>
          <Header />
          <MainContent>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:category" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/offers/:type" element={<OffersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              
              {/* Protected Customer Routes */}
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <UserOrdersPage />
                  </ProtectedRoute>
                }
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainContent>
          <Footer />
          <WhatsAppButton />
        </AppContainer>
      } />
    </Routes>
  );
}

export default App;