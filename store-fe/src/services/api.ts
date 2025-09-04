import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Expires": "0"
  },
  withCredentials: true, // This is crucial for sending cookies
  timeout: 30000, // 30 seconds
  validateStatus: (status) => status < 500, // Reject only if status is 500 or higher
});

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
      params: config.params
    });
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and logging
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error('[API Error] Response:', {
        url: error.config.url,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('[API Error] No response received:', {
        url: error.config.url,
        message: error.message,
        code: error.code
      });
    } else {
      // Something happened in setting up the request
      console.error('[API Error] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);
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
    api.post("/api/auth/login", credentials).then((res) => res.data),

  signup: (userData: {
    email: string;
    username: string;
    password: string;
    full_name: string;
    phone: string;
  }) => api.post("/api/auth/signup", userData).then((res) => res.data),

  getCurrentUser: () => api.get(`/api/auth/me`).then((res) => res.data),

  checkUserRole: () => api.get("/api/auth/me/role").then((res) => res.data),
};

// Product API
export const productAPI = {
  getProducts: (filters?: any) =>
    api.get("/api/products/", { params: filters }).then((res) => res.data),
  getProductById: (id: number) =>
    api.get(`/api/products/${id}/`).then((res) => res.data),
  getCategories: () => api.get("/api/categories/").then((res) => res.data),
  getSubcategories: (category?: string) =>
    api
      .get("/api/products/subcategories/", { params: { category } })
      .then((res) => res.data),
  getProductsByCategory: (category: string, subcategory?: string, signal?: AbortSignal) =>
    api
      .get(`/api/products`, { 
        params: { category, subcategory },
        signal
      })
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

// Helper function to get config with params
const getConfig = (params?: any) => ({
  params,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/api/admin/dashboard").then((res) => res.data),

  // Products
  getAllProducts: (params?: any) => 
    api.get("/api/admin/products", getConfig({
      ...params,
      limit: 1000 // Get more items by default for admin
    })).then((res) => res.data),
  createProduct: (productData: any) =>
    api.post("/api/admin/products", productData).then((res) => res.data),
  updateProduct: (id: number, productData: any) =>
    api.put(`/api/admin/products/${id}`, productData).then((res) => res.data),
  deleteProduct: (id: number) =>
    api.delete(`/api/admin/products/${id}`).then((res) => res.data),
  getProductAnalytics: () => 
    api.get("/api/admin/analytics/products").then((res) => res.data),
  getProductsByCategory: (category: string, subcategory?: string) =>
    api.get("/api/admin/products", getConfig({ category, subcategory }))
      .then((res) => res.data),

  // Categories
  getAllCategories: () => api.get("/api/admin/categories").then((res) => res.data),

  // Orders
  getAllOrders: () => api.get("/api/admin/orders").then((res) => res.data),
  getOrderDetails: (id: number) =>
    api.get(`/api/admin/orders/${id}`).then((res) => res.data),
  updateOrderStatus: (id: number, statusData: any) =>
    api.put(`/api/admin/orders/${id}`, statusData).then((res) => res.data),
  deleteOrder: (id: number) =>
    api.delete(`/api/admin/orders/${id}`).then((res) => res.data),

  // Inventory
  getInventoryStatus: () => api.get("/api/admin/inventory").then((res) => res.data),
  updateStock: (id: number, stockQuantity: number) =>
    api.put(`/api/admin/inventory/${id}`, { stock_quantity: stockQuantity })
      .then((res) => res.data),

  // Users
  getAllUsers: () => api.get("/api/admin/users").then((res) => res.data),
  updateUser: (id: number, userData: any) =>
    api.put(`/api/admin/users/${id}`, userData).then((res) => res.data),
  toggleUserStatus: (id: number) =>
    api.patch(`/api/admin/users/${id}/toggle-status`, {}).then((res) => res.data),

  // Offers
  createOffer: (offerData: any) =>
    api.post("/api/offers", offerData).then((res) => res.data),
  updateOffer: (id: number, offerData: any) =>
    api.put(`/api/offers/${id}`, offerData).then((res) => res.data),
  deleteOffer: (id: number) =>
    api.delete(`/api/offers/${id}`).then((res) => res.data),
  addProductToOffer: (offerId: number, productId: number) =>
    api.post(`/api/offers/${offerId}/products/${productId}`, {})
      .then((res) => res.data),
  removeProductFromOffer: (offerId: number, productId: number) =>
    api.delete(`/api/offers/${offerId}/products/${productId}`)
      .then((res) => res.data),

  // Collections
  getAllCollections: () =>
    api.get("/api/admin/collections").then((res) => res.data),
  createCollection: (collectionData: any) =>
    api.post("/api/admin/collections", collectionData).then((res) => res.data),
  updateCollection: (id: number, collectionData: any) =>
    api.put(`/api/admin/collections/${id}`, collectionData).then((res) => res.data),
  deleteCollection: (id: number) =>
    api.delete(`/api/admin/collections/${id}`).then((res) => res.data),
  getCollection: (id: number) =>
    api.get(`/api/admin/collections/${id}`).then((res) => res.data),
  uploadCollectionImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(
      `/api/admin/collections/${id}/upload-image`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then((res) => res.data);
  },

  // Product Image Upload
  uploadProductImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(
      `/api/admin/products/${id}/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then((res) => res.data);
  },
};

export default api;
