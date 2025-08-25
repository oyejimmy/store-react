import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderAPI } from "../../services/api";

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id?: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const createGuestOrder = createAsyncThunk(
  "orders/createGuestOrder",
  async (
    orderData: {
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      shipping_address: string;
      payment_method: string;
      items: { product_id: number; quantity: number; price: number }[];
    },
    { rejectWithValue }: any
  ) => {
    try {
      const response = await orderAPI.createGuestOrder(orderData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to create order"
      );
    }
  }
);

export const createUserOrder = createAsyncThunk(
  "orders/createUserOrder",
  async (
    orderData: {
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      shipping_address: string;
      payment_method: string;
      items: { product_id: number; quantity: number; price: number }[];
    },
    { rejectWithValue }: any
  ) => {
    try {
      const response = await orderAPI.createUserOrder(orderData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to create order"
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }: any) => {
    try {
      const response = await orderAPI.getUserOrders();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch orders"
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId: number, { rejectWithValue }: any) => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Guest Order
      .addCase(createGuestOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGuestOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createGuestOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create User Order
      .addCase(createUserOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createUserOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
