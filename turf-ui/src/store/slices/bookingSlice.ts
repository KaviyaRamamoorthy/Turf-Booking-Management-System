import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BookingState, Booking, BookingForm, BookingFilters, BookingStatus } from '../../types';

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: '1',
    turfId: '1',
    userId: '2',
    date: new Date('2024-01-15'),
    timeSlot: {
      startTime: '06:00',
      endTime: '07:00',
      isAvailable: false,
      price: 50,
    },
    status: 'confirmed',
    payment: {
      id: 'pay_1',
      amount: 50,
      currency: 'USD',
      method: 'card',
      status: 'completed',
      transactionId: 'txn_123',
      paidAt: new Date('2024-01-14'),
    },
    totalAmount: 50,
    notes: 'Early morning game',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

// Async thunks
export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockBookings;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch bookings');
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData: BookingForm, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newBooking: Booking = {
        id: (mockBookings.length + 1).toString(),
        turfId: bookingData.turfId,
        userId: '2', // Mock user ID
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        status: 'pending',
        payment: {
          id: `pay_${Date.now()}`,
          amount: bookingData.timeSlot.price,
          currency: 'USD',
          method: 'card',
          status: 'pending',
        },
        totalAmount: bookingData.timeSlot.price,
        notes: bookingData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return newBooking;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create booking');
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
  name: 'booking',
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
      });
  },
});

export const { setSelectedBooking, setFilters, clearFilters, clearError } = bookingSlice.actions;
export default bookingSlice.reducer; 