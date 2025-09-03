import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Expires": "0"
  },
  withCredentials: true,
  timeout: 15000, // Increased timeout to 15 seconds
  validateStatus: (status) => status < 500, // Reject only if status is 500 or higher
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
      .get(`/api/products/category/${category}`, { 
        params: { subcategory },
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

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/admin/dashboard").then((res) => res.data),

  // Products - temporarily use debug endpoint
  getAllProducts: (params?: any) => api.get("/admin/products/temp", { params }).then((res) => res.data),
  createProduct: (productData: any) =>
    api.post("/admin/products", productData).then((res) => res.data),
  updateProduct: (id: number, productData: any) =>
    api.put(`/admin/products/${id}`, productData).then((res) => res.data),
  deleteProduct: (id: number) =>
    api.delete(`/admin/products/${id}`).then((res) => res.data),
  getProductAnalytics: () => api.get("/admin/products/analytics").then((res) => res.data),
  getProductsByCategory: (category: string, subcategory?: string) =>
    api
      .get(`/admin/products/category/${category}`, { params: { subcategory } })
      .then((res) => res.data),

  // Categories
  getAllCategories: () => api.get("/admin/categories").then((res) => res.data),

  // Orders
  getAllOrders: () => api.get("/admin/orders").then((res) => res.data),
  getOrderDetails: (id: number) =>
    api.get(`/admin/orders/${id}`).then((res) => res.data),
  updateOrderStatus: (id: number, statusData: any) =>
    api.put(`/admin/orders/${id}`, statusData).then((res) => res.data),
  deleteOrder: (id: number) =>
    api.delete(`/admin/orders/${id}`).then((res) => res.data),

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

  // Collections
  getAllCollections: () =>
    api.get("/admin/collections").then((res) => res.data),
  createCollection: (collectionData: any) =>
    api.post("/admin/collections", collectionData).then((res) => res.data),
  updateCollection: (id: number, collectionData: any) =>
    api.put(`/admin/collections/${id}`, collectionData).then((res) => res.data),
  deleteCollection: (id: number) =>
    api.delete(`/admin/collections/${id}`).then((res) => res.data),
  getCollection: (id: number) =>
    api.get(`/admin/collections/${id}`).then((res) => res.data),
  uploadCollectionImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api
      .post(`/admin/collections/${id}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  },
  
  // Product Image Upload
  uploadProductImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api
      .post(`/admin/products/${id}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  },
};

export default api;
