import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./productSlice";

export interface CartItem {
  id: number;
  product: Product;
  category: string;
  quantity: number;
  price: number;
  name: string;
  image_url: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const price = product.offer_price || product.price || product.retail_price;
        state.items.push({
          id: Date.now(),
          product,
          quantity,
          price,
          name: product.name,
          image_url: product.images[0] || '',
          category: ""
        });
      }

      // Update totals
      state.itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      // Update totals
      state.itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ itemId: number; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === itemId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== itemId);
        } else {
          item.quantity = quantity;
        }

        // Update totals
        state.itemCount = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.total = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },

    loadCartFromStorage: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.itemCount = action.payload.itemCount;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCartFromStorage,
} = cartSlice.actions;
export default cartSlice.reducer;
