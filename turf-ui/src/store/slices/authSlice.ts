import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  User,
  LoginForm,
  RegisterForm,
  UserRole,
} from "../../types";
import { authService } from "../../services/authService";
import { localStorageUtil } from "../../utils/localStorage";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginForm & { role?: UserRole }, { rejectWithValue }) => {
    try {
      const response = await authService.login({
        email: credentials.email,
        password: credentials.password,
      });

      // Convert API response to User type
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        phone: response.user.phone || "",
        role: response.user.role as UserRole,
        preferences: {
          theme: "light",
          language: "en",
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { user, token: response.token };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: RegisterForm & {
      address?: { pincode: string; state: string; city: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role,
      });

      // For registration, we might need to handle OTP verification
      // For now, return a success message
      return {
        user: null,
        token: null,
        message: response.message
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Logout failed"
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        throw new Error("User not authenticated");
      }

      const userData = await authService.getCurrentUser();

      // Convert API response to User type
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone || "+1234567890",
        role: userData.role as UserRole,
        preferences: {
          theme: "light",
          language: "en",
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = authService.getToken();

      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to get current user"
      );
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUserRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store token and user data in localStorage
        localStorageUtil.setToken(action.payload.token);
        localStorageUtil.setUserData({
          id: action.payload.user.id,
          email: action.payload.user.email,
          name: action.payload.user.name,
          role: action.payload.user.role,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // Store token and user data in localStorage if available
        if (action.payload.token && action.payload.user) {
          localStorageUtil.setToken(action.payload.token);
          localStorageUtil.setUserData({
            id: action.payload.user.id,
            email: action.payload.user.email,
            name: action.payload.user.name,
            role: action.payload.user.role,
          });
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        // Clear localStorage
        localStorageUtil.clearAuthData();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Clear localStorage even on error
        localStorageUtil.clearAuthData();
      })

      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // Store token and user data in localStorage
        localStorageUtil.setToken(action.payload.token);
        localStorageUtil.setUserData({
          id: action.payload.user.id,
          email: action.payload.user.email,
          name: action.payload.user.name,
          role: action.payload.user.role,
        });
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateUser, setUserRole } = authSlice.actions;
export default authSlice.reducer;
