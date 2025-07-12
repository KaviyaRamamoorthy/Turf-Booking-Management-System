import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  User,
  LoginForm,
  RegisterForm,
  UserRole,
} from "../../types";

// Mock authentication service
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@turf.com",
    name: "Admin User",
    phone: "+1234567890",
    role: "admin",
    preferences: {
      theme: "light",
      language: "en",
      notifications: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "customer@turf.com",
    name: "John Customer",
    phone: "+1234567891",
    role: "customer",
    preferences: {
      theme: "light",
      language: "en",
      notifications: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "vendor@turf.com",
    name: "Sarah Vendor",
    phone: "+1234567892",
    role: "vendor",
    preferences: {
      theme: "light",
      language: "en",
      notifications: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginForm & { role?: UserRole }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For development: any email/password combination works
      // Create a user with the provided email and default admin role
      const user: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.email.split("@")[0], // Use email prefix as name
        phone: "+1234567890",
        role: "admin", // Default to admin role
        preferences: {
          theme: "light",
          language: "en",
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock token generation
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;

      return { user, token };
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === userData.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        address: userData.address,
        preferences: {
          theme: "light",
          language: "en",
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock token generation
      const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

      return { user: newUser, token };
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, you would call the logout API endpoint
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, you would validate the token and get user data
      // For now, return the first admin user as default
      const user = mockUsers[0];
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;

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
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateUser, setUserRole } = authSlice.actions;
export default authSlice.reducer;
