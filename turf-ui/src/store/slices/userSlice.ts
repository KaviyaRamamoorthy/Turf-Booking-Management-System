import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserState, User, ProfileForm } from "../../types";

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Mock user profile
      const user: User = {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData: ProfileForm, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Mock updated user
      const updatedUser: User = {
        id: "2",
        email: "customer@turf.com",
        name: profileData.name,
        phone: profileData.phone,
        role: "customer",
        preferences: profileData.preferences,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  }
);

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
