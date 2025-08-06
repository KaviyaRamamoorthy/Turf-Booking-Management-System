import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  BookingState,
  Booking,
  BookingForm,
  BookingFilters,
  BookingStatus,
} from "../../types";
import { bookingService } from "../../services/bookingService";

// Async thunks
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (filters: BookingFilters | undefined, { rejectWithValue }) => {
    try {
      console.log("🔄 Fetching user bookings from API...");
      const bookings = await bookingService.getUserBookings(filters);
      console.log("✅ User bookings fetched:", bookings.length);
      return bookings;
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch bookings"
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData: BookingForm, { rejectWithValue }) => {
    try {
      console.log("🔄 Creating booking...", bookingData);
      
      // Transform frontend form data to backend format
      const backendBookingData = bookingService.convertFormDataToBackend(bookingData);
      
      const response = await bookingService.createBooking(backendBookingData);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      console.log("✅ Booking created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create booking"
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      console.log("🔄 Cancelling booking:", bookingId);
      
      const success = await bookingService.cancelBooking(bookingId);
      
      if (!success) {
        throw new Error("Failed to cancel booking");
      }
      
      console.log("✅ Booking cancelled successfully");
      return bookingId;
    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to cancel booking"
      );
    }
  }
);

const initialState: BookingState = {
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  filters: {},
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selectedBooking = action.payload;
    },
    setFilters: (state, action: PayloadAction<BookingFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.push(action.payload);
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const bookingId = action.payload;
        const bookingIndex = state.bookings.findIndex(
          (booking) => booking.id === bookingId
        );
        if (bookingIndex !== -1) {
          state.bookings[bookingIndex].status = "CANCELLED";
        }
        state.error = null;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedBooking, setFilters, clearFilters, clearError } =
  bookingSlice.actions;
export default bookingSlice.reducer;
