import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productAPI } from "../../services/api";

export interface Product {
  id: number;
  name: string;
  full_name?: string;
  type?: string;
  retail_price: number;
  offer_price?: number;
  currency: string;
  description?: string;
  delivery_charges: number;
  stock: number;
  status: string;
  images: string[];
  available: number;
  sold: number;
  category_id: number;
  
  // Legacy fields for backward compatibility
  price?: number;
  original_price?: number;
  category?: string;
  subcategory?: string;
  stock_quantity?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  categories: string[];
  subcategories: string[];
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    subcategory?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  };
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  subcategories: [],
  loading: false,
  error: null,
  filters: {},
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters: any = {}, { rejectWithValue }: any) => {
    try {
      const response = await productAPI.getProducts(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: number, { rejectWithValue }: any) => {
    try {
      const response = await productAPI.getProductById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch product"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }: any) => {
    try {
      const response = await productAPI.getCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch categories"
      );
    }
  }
);

export const fetchSubcategories = createAsyncThunk(
  "products/fetchSubcategories",
  async (category: string = "", { rejectWithValue }: any) => {
    try {
      const response = await productAPI.getSubcategories(category);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch subcategories"
      );
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (
    { category, subcategory }: { category: string; subcategory?: string },
    { rejectWithValue }: any
  ) => {
    try {
      const response = await productAPI.getProductsByCategory(
        category,
        subcategory
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch products by category"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch Subcategories
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload;
      })
      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearCurrentProduct,
  setFeaturedProducts,
} = productSlice.actions;
export default productSlice.reducer;
