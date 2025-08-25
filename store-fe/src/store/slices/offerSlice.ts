import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { offerAPI } from "../../services/api";
import { Product } from "./productSlice";

export interface Offer {
  id: number;
  name: string;
  description: string;
  offer_type: string;
  discount_percentage?: number;
  discount_amount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface OfferState {
  offers: Offer[];
  offerProducts: {
    under_299: Product[];
    special_deals: Product[];
    deal_of_month: Product[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: OfferState = {
  offers: [],
  offerProducts: {
    under_299: [],
    special_deals: [],
    deal_of_month: [],
  },
  loading: false,
  error: null,
};

export const fetchOffersByType = createAsyncThunk(
  "offers/fetchOffersByType",
  async (offerType: string, { rejectWithValue }: any) => {
    try {
      const response = await offerAPI.getOffersByType(offerType);
      return { type: offerType, products: response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch offers"
      );
    }
  }
);

export const fetchAllOffers = createAsyncThunk(
  "offers/fetchAllOffers",
  async (_, { rejectWithValue }: any) => {
    try {
      const response = await offerAPI.getAllOffers();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch offers"
      );
    }
  }
);

const offerSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Offers by Type
      .addCase(fetchOffersByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffersByType.fulfilled, (state, action) => {
        state.loading = false;
        const { type, products } = action.payload;
        state.offerProducts[type as keyof typeof state.offerProducts] =
          products;
      })
      .addCase(fetchOffersByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All Offers
      .addCase(fetchAllOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchAllOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = offerSlice.actions;
export default offerSlice.reducer;
