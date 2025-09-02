import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { AppDispatch, RootState } from "./store";
import { getCurrentUser } from "./store/slices/authSlice";
import { lightTheme, darkTheme } from "./theme/globalTheme";

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
import ProfilePage from "./pages/customer/ProfilePage";
import ForgotPasswordPage from "./pages/customer/ForgotPasswordPage";
import TermsPage from "./pages/customer/TermsPage";
import PrivacyPage from "./pages/customer/PrivacyPage";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCollections from "./pages/admin/collections/AdminCollections";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminOffers from "./pages/admin/AdminOffers";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSalesChannels from "./pages/admin/AdminSalesChannels";
import AdminReports from "./pages/admin/AdminReports";
import AdminLogin from "./pages/admin/AdminLogin";
import TestPdf from "./pages/admin/TestPdf";
import NotFound from "./pages/NotFound";

// Protected Route Component
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (token && isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, isAuthenticated]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Routes>
        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="sales-channels" element={<AdminSalesChannels />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="test-pdf" element={<TestPdf />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Auth Routes without footer */}
        <Route
          path="/login"
          element={
            <Box
              sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#ffffff",
              }}
            >
              <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} showBanner={false} />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  pt: "70px",
                  backgroundColor: "#ffffff",
                }}
              >
                <LoginPage />
              </Box>
            </Box>
          }
        />
        <Route
          path="/signup"
          element={
            <Box
              sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#ffffff",
              }}
            >
              <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} showBanner={false} />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  pt: "70px",
                  backgroundColor: "#ffffff",
                }}
              >
                <SignupPage />
              </Box>
            </Box>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Box
              sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                backgroundColor: "#ffffff",
              }}
            >
              <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} showBanner={false} />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  pt: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                }}
              >
                <ForgotPasswordPage />
              </Box>
            </Box>
          }
        />
        <Route
          path="/terms"
          element={
            <Box
              sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                backgroundColor: "#ffffff",
              }}
            >
              <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} showBanner={false} />
              <Box component="main" sx={{ flex: 1, pt: "70px", backgroundColor: "#ffffff" }}>
                <TermsPage />
              </Box>
            </Box>
          }
        />
        <Route
          path="/privacy"
          element={
            <Box
              sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                backgroundColor: "#ffffff",
              }}
            >
              <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} showBanner={false} />
              <Box component="main" sx={{ flex: 1, pt: "70px", backgroundColor: "#ffffff" }}>
                <PrivacyPage />
              </Box>
            </Box>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/*"
          element={
            <Box
              sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#ffffff",
              }}
            >
              <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <Box component="main" sx={{ flex: 1, pt: "70px", backgroundColor: "#ffffff" }}>
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

                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route
                    path="/order-confirmation"
                    element={<OrderConfirmationPage />}
                  />

                  {/* Protected Customer Routes */}
                  <Route
                    path="my-orders"
                    element={
                      <ProtectedRoute>
                        <UserOrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
              <Footer />
              <WhatsAppButton />
            </Box>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
