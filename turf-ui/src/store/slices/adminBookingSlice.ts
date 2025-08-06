import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import adminBookingService, {
  type AdminBookingResponse,
  type AdminBookingFilters,
  type StatusCounts,
} from "../../services/adminBookingService";

// State interface
export interface AdminBookingState {
  bookings: AdminBookingResponse[];
  selectedBooking: AdminBookingResponse | null;
  statusCounts: StatusCounts | null;
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  filters: AdminBookingFilters;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Async thunks
export const fetchAllBookings = createAsyncThunk(
  "adminBooking/fetchAllBookings",
  async (filters: AdminBookingFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await adminBookingService.getAllBookings(filters);
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to fetch bookings");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch bookings"
      );
    }
  }
);

export const fetchBookingDetails = createAsyncThunk(
  "adminBooking/fetchBookingDetails",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await adminBookingService.getBookingById(bookingId);
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to fetch booking details");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch booking details"
      );
    }
  }
);

export const confirmBooking = createAsyncThunk(
  "adminBooking/confirmBooking",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await adminBookingService.confirmBooking(bookingId);
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to confirm booking");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to confirm booking"
      );
    }
  }
);

export const rejectBooking = createAsyncThunk(
  "adminBooking/rejectBooking",
  async ({ bookingId, reason }: { bookingId: string; reason?: string }, { rejectWithValue }) => {
    try {
      const response = await adminBookingService.rejectBooking(bookingId, reason);
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to reject booking");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to reject booking"
      );
    }
  }
);

export const fetchStatusCounts = createAsyncThunk(
  "adminBooking/fetchStatusCounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminBookingService.getStatusCounts();
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to fetch status counts");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch status counts"
      );
    }
  }
);

const initialState: AdminBookingState = {
  bookings: [],
  selectedBooking: null,
  statusCounts: null,
  isLoading: false,
  error: null,
  isError: false,
  filters: {},
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

const adminBookingSlice = createSlice({
  name: "adminBooking",
  initialState,
  reducers: {
    setSelectedBooking: (state, action: PayloadAction<AdminBookingResponse | null>) => {
      state.selectedBooking = action.payload;
    },
    setFilters: (state, action: PayloadAction<AdminBookingFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page when filters change
      state.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.bookings;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isError = true;
      })
      // Fetch booking details
      .addCase(fetchBookingDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookingDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBooking = action.payload;
        state.error = null;
      })
      .addCase(fetchBookingDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Confirm booking
      .addCase(confirmBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the selected booking
        if (state.selectedBooking && state.selectedBooking.id === action.payload.id) {
          state.selectedBooking = action.payload;
        }
        // Update the booking in the list
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reject booking
      .addCase(rejectBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the selected booking
        if (state.selectedBooking && state.selectedBooking.id === action.payload.id) {
          state.selectedBooking = action.payload;
        }
        // Update the booking in the list
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(rejectBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch status counts
      .addCase(fetchStatusCounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatusCounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statusCounts = action.payload;
        state.error = null;
      })
      .addCase(fetchStatusCounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedBooking,
  setFilters,
  clearFilters,
  setPage,
  clearError,
} = adminBookingSlice.actions;

export default adminBookingSlice.reducer; 