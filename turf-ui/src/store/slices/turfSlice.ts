import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TurfState, Turf, TurfFilters, TurfCategory } from '../../types';

// Mock turf data
const mockTurfs: Turf[] = [
  {
    id: '1',
    name: 'Premium Football Ground',
    description: 'High-quality football turf with professional facilities',
    category: 'football',
    location: {
      address: '123 Sports Complex',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    pricing: {
      hourlyRate: 50,
      currency: 'USD',
      discounts: [
        { type: 'percentage', value: 10, minHours: 2 },
      ],
    },
    amenities: [
      { id: '1', name: 'Parking', description: 'Free parking available', icon: 'car' },
      { id: '2', name: 'Shower', description: 'Clean shower facilities', icon: 'shower' },
      { id: '3', name: 'Equipment', description: 'Sports equipment rental', icon: 'equipment' },
    ],
    images: [
      'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Football+Turf+1',
      'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Football+Turf+2',
    ],
    availability: [
      {
        dayOfWeek: 1, // Monday
        isOpen: true,
        slots: [
          { startTime: '06:00', endTime: '07:00', isAvailable: true, price: 50 },
          { startTime: '07:00', endTime: '08:00', isAvailable: true, price: 50 },
          { startTime: '08:00', endTime: '09:00', isAvailable: false, price: 50 },
        ],
      },
    ],
    rating: 4.5,
    reviewCount: 25,
    vendorId: '3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Cricket Stadium',
    description: 'Professional cricket ground with proper pitch',
    category: 'cricket',
    location: {
      address: '456 Cricket Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      coordinates: { lat: 40.7589, lng: -73.9851 },
    },
    pricing: {
      hourlyRate: 75,
      currency: 'USD',
    },
    amenities: [
      { id: '1', name: 'Parking', description: 'Free parking available', icon: 'car' },
      { id: '4', name: 'Pavilion', description: 'Covered seating area', icon: 'pavilion' },
    ],
    images: [
      'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Cricket+Ground+1',
    ],
    availability: [
      {
        dayOfWeek: 1, // Monday
        isOpen: true,
        slots: [
          { startTime: '08:00', endTime: '10:00', isAvailable: true, price: 75 },
          { startTime: '10:00', endTime: '12:00', isAvailable: true, price: 75 },
        ],
      },
    ],
    rating: 4.8,
    reviewCount: 15,
    vendorId: '3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Async thunks
export const fetchTurfs = createAsyncThunk(
  'turf/fetchTurfs',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockTurfs;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch turfs');
    }
  }
);

export const fetchTurfById = createAsyncThunk(
  'turf/fetchTurfById',
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const turf = mockTurfs.find(t => t.id === id);
      if (!turf) {
        throw new Error('Turf not found');
      }
      return turf;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch turf');
    }
  }
);

const initialState: TurfState = {
  turfs: [],
  selectedTurf: null,
  isLoading: false,
  error: null,
  filters: {},
};

const turfSlice = createSlice({
  name: 'turf',
  initialState,
  reducers: {
    setSelectedTurf: (state, action: PayloadAction<Turf | null>) => {
      state.selectedTurf = action.payload;
    },
    setFilters: (state, action: PayloadAction<TurfFilters>) => {
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
      // Fetch turfs
      .addCase(fetchTurfs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTurfs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.turfs = action.payload;
        state.error = null;
      })
      .addCase(fetchTurfs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch turf by ID
      .addCase(fetchTurfById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTurfById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTurf = action.payload;
        state.error = null;
      })
      .addCase(fetchTurfById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTurf, setFilters, clearFilters, clearError } = turfSlice.actions;
export default turfSlice.reducer; 