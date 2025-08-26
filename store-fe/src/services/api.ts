import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials).then((res) => res.data),

  signup: (userData: {
    email: string;
    username: string;
    password: string;
    full_name: string;
    phone: string;
  }) => api.post("/auth/signup", userData).then((res) => res.data),

  getCurrentUser: () => api.get("/auth/me").then((res) => res.data),
};

// Product API
export const productAPI = {
  getProducts: (filters?: any) =>
    api.get("/products", { params: filters }).then((res) => res.data),

  getProductById: (id: number) =>
    api.get(`/products/${id}`).then((res) => res.data),

  getCategories: () => api.get("/products/categories").then((res) => res.data),

  getSubcategories: (category?: string) =>
    api
      .get("/products/subcategories", { params: { category } })
      .then((res) => res.data),

  getProductsByCategory: (category: string, subcategory?: string) =>
    api
      .get(`/products/category/${category}`, { params: { subcategory } })
      .then((res) => res.data),
};

// Order API
export const orderAPI = {
  createGuestOrder: (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    payment_method: string;
    items: { product_id: number; quantity: number; price: number }[];
  }) => api.post("/orders/guest", orderData).then((res) => res.data),

  createUserOrder: (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    payment_method: string;
    items: { product_id: number; quantity: number; price: number }[];
  }) => api.post("/orders", orderData).then((res) => res.data),

  getUserOrders: () => api.get("/orders/my-orders").then((res) => res.data),

  getOrderById: (id: number) =>
    api.get(`/orders/${id}`).then((res) => res.data),
};

// Offer API
export const offerAPI = {
  getOffersByType: (offerType: string) =>
    api.get(`/offers/${offerType}`).then((res) => res.data),

  getAllOffers: () => api.get("/offers").then((res) => res.data),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/admin/dashboard").then((res) => res.data),

  // Products
  getAllProducts: () => api.get("/admin/products").then((res) => res.data),
  createProduct: (productData: any) =>
    api.post("/admin/products", productData).then((res) => res.data),
  updateProduct: (id: number, productData: any) =>
    api.put(`/admin/products/${id}`, productData).then((res) => res.data),
  deleteProduct: (id: number) =>
    api.delete(`/admin/products/${id}`).then((res) => res.data),

  // Orders
  getAllOrders: () => api.get("/admin/orders").then((res) => res.data),
  getOrderDetails: (id: number) =>
    api.get(`/admin/orders/${id}`).then((res) => res.data),
  updateOrderStatus: (id: number, statusData: any) =>
    api.put(`/admin/orders/${id}`, statusData).then((res) => res.data),

  // Inventory
  getInventoryStatus: () => api.get("/admin/inventory").then((res) => res.data),
  updateStock: (id: number, stockQuantity: number) =>
    api
      .put(`/admin/inventory/${id}`, { stock_quantity: stockQuantity })
      .then((res) => res.data),

  // Users
  getAllUsers: () => api.get("/admin/users").then((res) => res.data),
  updateUser: (id: number, userData: any) =>
    api.put(`/admin/users/${id}`, userData).then((res) => res.data),
  toggleUserStatus: (id: number) =>
    api.put(`/admin/users/${id}/toggle`).then((res) => res.data),

  // Offers
  createOffer: (offerData: any) =>
    api.post("/offers", offerData).then((res) => res.data),
  updateOffer: (id: number, offerData: any) =>
    api.put(`/offers/${id}`, offerData).then((res) => res.data),
  deleteOffer: (id: number) =>
    api.delete(`/offers/${id}`).then((res) => res.data),
  addProductToOffer: (offerId: number, productId: number) =>
    api
      .post(`/offers/${offerId}/products/${productId}`)
      .then((res) => res.data),
  removeProductFromOffer: (offerId: number, productId: number) =>
    api
      .delete(`/offers/${offerId}/products/${productId}`)
      .then((res) => res.data),
};

export default api;
