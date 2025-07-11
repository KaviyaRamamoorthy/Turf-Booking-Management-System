import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  BookingState,
  Booking,
  BookingForm,
  BookingFilters,
  BookingStatus,
} from "../../types";

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: "1",
    turfId: "Premium Football Ground",
    userId: "2",
    date: new Date("2024-01-15"),
    timeSlot: {
      startTime: "06:00",
      endTime: "07:00",
      isAvailable: false,
      price: 1500,
    },
    status: "confirmed",
    payment: {
      id: "pay_1",
      amount: 1500,
      currency: "INR",
      method: "card",
      status: "completed",
      transactionId: "txn_123",
      paidAt: new Date("2024-01-14"),
    },
    totalAmount: 1500,
    notes: "Early morning game",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    turfId: "Elite Cricket Ground",
    userId: "2",
    date: new Date("2024-01-22"),
    timeSlot: {
      startTime: "16:00",
      endTime: "17:00",
      isAvailable: false,
      price: 2000,
    },
    status: "pending",
    payment: {
      id: "pay_2",
      amount: 2000,
      currency: "INR",
      method: "online",
      status: "pending",
      transactionId: "txn_456",
    },
    totalAmount: 2000,
    notes: "Evening cricket session",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    turfId: "City Basketball Court",
    userId: "2",
    date: new Date("2024-01-05"),
    timeSlot: {
      startTime: "18:00",
      endTime: "19:00",
      isAvailable: false,
      price: 800,
    },
    status: "completed",
    payment: {
      id: "pay_3",
      amount: 800,
      currency: "INR",
      method: "card",
      status: "completed",
      transactionId: "txn_789",
      paidAt: new Date("2024-01-04"),
    },
    totalAmount: 800,
    notes: "Weekend basketball",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    turfId: "Tennis Academy Court",
    userId: "2",
    date: new Date("2024-01-25"),
    timeSlot: {
      startTime: "10:00",
      endTime: "11:00",
      isAvailable: false,
      price: 1200,
    },
    status: "confirmed",
    payment: {
      id: "pay_4",
      amount: 1200,
      currency: "INR",
      method: "cash",
      status: "completed",
      transactionId: "txn_101",
      paidAt: new Date("2024-01-20"),
    },
    totalAmount: 1200,
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "5",
    turfId: "Volleyball Arena",
    userId: "2",
    date: new Date("2023-12-20"),
    timeSlot: {
      startTime: "14:00",
      endTime: "15:00",
      isAvailable: false,
      price: 600,
    },
    status: "cancelled",
    payment: {
      id: "pay_5",
      amount: 600,
      currency: "INR",
      method: "online",
      status: "refunded",
      transactionId: "txn_202",
    },
    totalAmount: 600,
    notes: "Cancelled due to weather",
    createdAt: new Date("2023-12-18"),
    updatedAt: new Date("2023-12-19"),
  },
];

// Async thunks
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockBookings;
    } catch (error) {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newBooking: Booking = {
        id: (mockBookings.length + 1).toString(),
        turfId: bookingData.turfId,
        userId: "2", // Mock user ID
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        status: "pending",
        payment: {
          id: `pay_${Date.now()}`,
          amount: bookingData.timeSlot.price,
          currency: "INR",
          method: "card",
          status: "pending",
        },
        totalAmount: bookingData.timeSlot.price,
        notes: bookingData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return newBooking;
    } catch (error) {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return bookingId;
    } catch (error) {
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
          state.bookings[bookingIndex].status = "cancelled";
          state.bookings[bookingIndex].updatedAt = new Date();
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
