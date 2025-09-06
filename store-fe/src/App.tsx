import { useEffect, useState, useMemo, useCallback } from "react";
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
import HomePage from "./containers/customer/HomePage";
import ShopPage from "./containers/customer/ShopPage";
import CategoriesPage from "./containers/customer/CategoriesPage";
import ProductDetailPage from "./containers/customer/ProductDetailPage";
import CartPage from "./containers/customer/CartPage";
import CheckoutPage from "./containers/customer/CheckoutPage";
import OffersPage from "./containers/customer/OffersPage";
import ContactPage from "./containers/customer/ContactPage";
import AboutPage from "./containers/customer/About";
import LoginPage from "./containers/authentication/LogIn";
import SignupPage from "./containers/authentication/SignUp";
import OrderConfirmationPage from "./containers/customer/OrderConfirmationPage";
import UserOrdersPage from "./containers/customer/UserOrdersPage";
import ProfilePage from "./containers/customer/ProfilePage";
import ForgotPasswordPage from "./containers/authentication/ForgotPassword";
import PrivacyPage from "./containers/customer/components/Privacy/index";
import TermsPage from "./containers/customer/components/Terms/index";

// Admin Pages
import AdminDashboard from "./containers/admin/Dashboard/Dashboard";
import AdminProducts from "./containers/admin/Products/AdminProducts";
import AdminCollections from "./containers/admin/Collections/AdminCollections";
import AdminOrders from "./containers/admin/Orders/AdminOrders";
import AdminInventory from "./containers/admin/Inventory/AdminInventory";
import AdminOffers from "./containers/admin/Offers/AdminOffers";
import AdminUsers from "./containers/admin/Users/AdminUsers";
import AdminPayments from "./containers/admin/Payments/AdminPayments";
import AdminSalesChannels from "./containers/admin/SalesChannels/AdminSalesChannels";
import AdminReports from "./containers/admin/Reports/AdminReports";
import AdminLogin from "./containers/admin/AdminLogin";
import TestPdf from "./containers/admin/TestPdf";

// Protected Route Component
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import NotFound from "./containers/Error/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

// Layout Components
const CustomerLayout = ({
  children,
  isDarkMode,
  toggleTheme,
}: {
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
}) => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff",
    }}
  >
    <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    <Box
      component="main"
      sx={{
        flex: 1,
        pt: "70px",
        backgroundColor: "#ffffff",
      }}
    >
      {children}
    </Box>
    <Footer />
    <WhatsAppButton />
  </Box>
);

const AuthLayout = ({
  children,
  isDarkMode,
  toggleTheme,
}: {
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
}) => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff",
    }}
  >
    <Header
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      showBanner={false}
    />
    <Box
      component="main"
      sx={{
        flex: 1,
        pt: "70px",
        backgroundColor: "#ffffff",
      }}
    >
      {children}
    </Box>
  </Box>
);

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  // Initialize theme from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.error("Failed to load user data:", error);
          // Clear invalid token if user data can't be loaded
          localStorage.removeItem("token");
        }
      }
    };

    loadUser();
  }, [dispatch, token]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  }, []);

  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <HomePage />
              </CustomerLayout>
            }
          />

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
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

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <LoginPage />
              </AuthLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <SignupPage />
              </AuthLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <ForgotPasswordPage />
              </AuthLayout>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/shop"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <ShopPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/shop/:category"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <ShopPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/categories"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <CategoriesPage
                  isDarkMode={false}
                  toggleTheme={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </CustomerLayout>
            }
          />
          <Route
            path="/terms"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <TermsPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/privacy"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <PrivacyPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <ProductDetailPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <CartPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              </CustomerLayout>
            }
          />
          <Route
            path="/offers"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <OffersPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/offers/:type"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <OffersPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <ContactPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/about"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <AboutPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <ProtectedRoute>
                  <UserOrdersPage />
                </ProtectedRoute>
              </CustomerLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </CustomerLayout>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <ProtectedRoute>
                  <OrderConfirmationPage />
                </ProtectedRoute>
              </CustomerLayout>
            }
          />

          {/* 404 Route for all other unmatched routes */}
          <Route
            path="*"
            element={
              <CustomerLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <NotFound />
              </CustomerLayout>
            }
          />
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
