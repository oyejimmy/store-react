import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { authAPI } from "../../services/api";

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue, dispatch }: any
  ) => {
    try {
      // First, perform the login
      const loginResponse = await authAPI.login(credentials);
      
      // Store the token
      const { access_token, user } = loginResponse;
      if (access_token) {
        localStorage.setItem("token", access_token);
      }
      
      // Store user data in local storage
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      // Check user role
      try {
        const roleResponse = await authAPI.checkUserRole();
        return { ...loginResponse, redirectUrl: roleResponse.redirect_url };
      } catch (roleError) {
        console.error("Role check failed:", roleError);
        // If role check fails, still return the login success but with default redirect
        return { ...loginResponse, redirectUrl: "/" };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
        error.message ||
        "Login failed. Please check your credentials and try again."
      );
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    userData: {
      email: string;
      username: string;
      password: string;
      full_name: string;
      phone: string;
    },
    { rejectWithValue }: any
  ) => {
    try {
      const response = await authAPI.signup(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || "Signup failed");
    }
  }
);

// Helper function to decode JWT token
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log('Current token from localStorage:', token);
      
      if (!token) {
        console.log('No token found in localStorage');
        throw new Error("No token found");
      }
      
      try {
        console.log('Attempting to fetch current user...');
        const response = await authAPI.getCurrentUser();
        console.log('Current user response:', response);
        return response;
      } catch (apiError: any) {
        console.error('API Error in getCurrentUser:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
        });
        
        // Clear invalid token
        if (apiError.response?.status === 401) {
          console.log('Clearing invalid token due to 401 response');
          localStorage.removeItem('token');
        }
        
        throw apiError; // Re-throw to be caught by outer catch
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || "Failed to get user";
      console.error('Error in getCurrentUser:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
