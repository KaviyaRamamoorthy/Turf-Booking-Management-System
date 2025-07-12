import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AdminState, AdminStats } from '../../types';

// Async thunks
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock admin statistics
      const stats: AdminStats = {
        totalUsers: 150,
        totalTurfs: 25,
        totalBookings: 450,
        totalRevenue: 22500,
        monthlyStats: [
          { month: 'Jan', bookings: 45, revenue: 2250 },
          { month: 'Feb', bookings: 52, revenue: 2600 },
          { month: 'Mar', bookings: 48, revenue: 2400 },
          { month: 'Apr', bookings: 55, revenue: 2750 },
          { month: 'May', bookings: 60, revenue: 3000 },
          { month: 'Jun', bookings: 65, revenue: 3250 },
        ],
      };
      return stats;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch admin stats');
    }
  }
);

const initialState: AdminState = {
  stats: null,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer; 