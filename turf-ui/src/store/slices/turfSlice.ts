import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TurfState, Turf, TurfFilters, TurfCategory } from "../../types";

// Mock turf data - expanded with more categories and turfs
const mockTurfs: Turf[] = [
  {
    id: "1",
    name: "Premium Football Ground",
    description:
      "High-quality football turf with professional facilities and floodlights for evening matches",
    category: "football",
    location: {
      address: "123 Sports Complex",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    pricing: {
      hourlyRate: 50,
      currency: "USD",
      discounts: [{ type: "percentage", value: 10, minHours: 2 }],
    },
    amenities: [
      {
        id: "1",
        name: "Parking",
        description: "Free parking available",
        icon: "car",
      },
      {
        id: "2",
        name: "Shower",
        description: "Clean shower facilities",
        icon: "shower",
      },
      {
        id: "3",
        name: "Equipment",
        description: "Sports equipment rental",
        icon: "equipment",
      },
    ],
    images: [
      "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Football+Turf+1",
      "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Football+Turf+2",
    ],
    availability: [
      {
        dayOfWeek: 1, // Monday
        isOpen: true,
        slots: [
          {
            startTime: "06:00",
            endTime: "07:00",
            isAvailable: true,
            price: 50,
          },
          {
            startTime: "07:00",
            endTime: "08:00",
            isAvailable: true,
            price: 50,
          },
          {
            startTime: "08:00",
            endTime: "09:00",
            isAvailable: false,
            price: 50,
          },
        ],
      },
    ],
    rating: 4.5,
    reviewCount: 25,
    vendorId: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Cricket Stadium",
    description:
      "Professional cricket ground with proper pitch and covered pavilion",
    category: "cricket",
    location: {
      address: "456 Cricket Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      coordinates: { lat: 40.7589, lng: -73.9851 },
    },
    pricing: {
      hourlyRate: 75,
      currency: "USD",
    },
    amenities: [
      {
        id: "1",
        name: "Parking",
        description: "Free parking available",
        icon: "car",
      },
      {
        id: "4",
        name: "Pavilion",
        description: "Covered seating area",
        icon: "pavilion",
      },
    ],
    images: [
      "https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Cricket+Ground+1",
    ],
    availability: [
      {
        dayOfWeek: 1, // Monday
        isOpen: true,
        slots: [
          {
            startTime: "08:00",
            endTime: "10:00",
            isAvailable: true,
            price: 75,
          },
          {
            startTime: "10:00",
            endTime: "12:00",
            isAvailable: true,
            price: 75,
          },
        ],
      },
    ],
    rating: 4.8,
    reviewCount: 15,
    vendorId: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Elite Tennis Courts",
    description:
      "Premium tennis courts with professional surface and net systems",
    category: "tennis",
    location: {
      address: "789 Tennis Club Lane",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      coordinates: { lat: 40.6892, lng: -73.9442 },
    },
    pricing: {
      hourlyRate: 40,
      currency: "USD",
      discounts: [{ type: "percentage", value: 15, minHours: 3 }],
    },
    amenities: [
      {
        id: "1",
        name: "Parking",
        description: "Free parking available",
        icon: "car",
      },
      {
        id: "2",
        name: "Shower",
        description: "Clean shower facilities",
        icon: "shower",
      },
      {
        id: "5",
        name: "Pro Shop",
        description: "Equipment and accessories",
        icon: "shop",
      },
    ],
    images: [
      "https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Tennis+Court+1",
      "https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Tennis+Court+2",
    ],
    availability: [
      {
        dayOfWeek: 1,
        isOpen: true,
        slots: [
          {
            startTime: "06:00",
            endTime: "07:00",
            isAvailable: true,
            price: 40,
          },
          {
            startTime: "07:00",
            endTime: "08:00",
            isAvailable: true,
            price: 40,
          },
          {
            startTime: "08:00",
            endTime: "09:00",
            isAvailable: true,
            price: 40,
          },
        ],
      },
    ],
    rating: 4.7,
    reviewCount: 32,
    vendorId: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Urban Basketball Court",
    description:
      "Modern indoor basketball court with air conditioning and professional hoops",
    category: "basketball",
    location: {
      address: "321 Hoops Street",
      city: "Queens",
      state: "NY",
      zipCode: "11374",
      coordinates: { lat: 40.7505, lng: -73.837 },
    },
    pricing: {
      hourlyRate: 35,
      currency: "USD",
    },
    amenities: [
      {
        id: "1",
        name: "Parking",
        description: "Free parking available",
        icon: "car",
      },
      {
        id: "2",
        name: "Shower",
        description: "Clean shower facilities",
        icon: "shower",
      },
      {
        id: "6",
        name: "Air Conditioning",
        description: "Climate controlled",
        icon: "air",
      },
    ],
    images: [
      "https://via.placeholder.com/400x300/F44336/FFFFFF?text=Basketball+Court+1",
    ],
    availability: [
      {
        dayOfWeek: 1,
        isOpen: true,
        slots: [
          {
            startTime: "09:00",
            endTime: "10:00",
            isAvailable: true,
            price: 35,
          },
          {
            startTime: "10:00",
            endTime: "11:00",
            isAvailable: true,
            price: 35,
          },
        ],
      },
    ],
    rating: 4.3,
    reviewCount: 18,
    vendorId: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Champions Football Arena",
    description:
      "State-of-the-art football facility with synthetic grass and stadium seating",
    category: "football",
    location: {
      address: "555 Champions Way",
      city: "Manhattan",
      state: "NY",
      zipCode: "10019",
      coordinates: { lat: 40.7614, lng: -73.9776 },
    },
    pricing: {
      hourlyRate: 80,
      currency: "USD",
      discounts: [{ type: "percentage", value: 20, minHours: 3 }],
    },
    amenities: [
      {
        id: "1",
        name: "Parking",
        description: "Free parking available",
        icon: "car",
      },
      {
        id: "2",
        name: "Shower",
        description: "Clean shower facilities",
        icon: "shower",
      },
      {
        id: "7",
        name: "Stadium Seating",
        description: "Spectator seating",
        icon: "stadium",
      },
      {
        id: "8",
        name: "Floodlights",
        description: "Night games available",
        icon: "light",
      },
    ],
    images: [
      "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Champions+Arena+1",
      "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Champions+Arena+2",
    ],
    availability: [
      {
        dayOfWeek: 1,
        isOpen: true,
        slots: [
          {
            startTime: "06:00",
            endTime: "07:00",
            isAvailable: true,
            price: 80,
          },
          {
            startTime: "07:00",
            endTime: "08:00",
            isAvailable: true,
            price: 80,
          },
          {
            startTime: "18:00",
            endTime: "19:00",
            isAvailable: true,
            price: 80,
          },
        ],
      },
    ],
    rating: 4.9,
    reviewCount: 47,
    vendorId: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Volleyball Paradise",
    description:
      "Professional volleyball court with sand surface and net regulation height",
    category: "volleyball",
    location: {
      address: "888 Beach View Drive",
      city: "Staten Island",
      state: "NY",
      zipCode: "10301",
      coordinates: { lat: 40.6118, lng: -74.1558 },
    },
    pricing: {
      hourlyRate: 30,
      currency: "USD",
    },
    amenities: [
      {
        id: "1",
        name: "Parking",
        description: "Free parking available",
        icon: "car",
      },
      {
        id: "9",
        name: "Sand Court",
        description: "Professional sand surface",
        icon: "sand",
      },
      {
        id: "10",
        name: "Beach Setting",
        description: "Scenic beach location",
        icon: "beach",
      },
    ],
    images: [
      "https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Volleyball+Court+1",
    ],
    availability: [
      {
        dayOfWeek: 1,
        isOpen: true,
        slots: [
          {
            startTime: "08:00",
            endTime: "09:00",
            isAvailable: true,
            price: 30,
          },
          {
            startTime: "09:00",
            endTime: "10:00",
            isAvailable: true,
            price: 30,
          },
          {
            startTime: "10:00",
            endTime: "11:00",
            isAvailable: true,
            price: 30,
          },
        ],
      },
    ],
    rating: 4.4,
    reviewCount: 22,
    vendorId: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Async thunks
export const fetchTurfs = createAsyncThunk(
  "turf/fetchTurfs",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockTurfs;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch turfs"
      );
    }
  }
);

export const fetchTurfById = createAsyncThunk(
  "turf/fetchTurfById",
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const turf = mockTurfs.find((t) => t.id === id);
      if (!turf) {
        throw new Error("Turf not found");
      }
      return turf;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch turf"
      );
    }
  }
);

// Create new turf
export const createTurf = createAsyncThunk(
  "turf/createTurf",
  async (turfData: any, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Create new turf with generated ID
      const newTurf = {
        id: Date.now().toString(),
        ...turfData,
        rating: 0,
        reviewCount: 0,
        vendorId: "1", // Mock vendor ID
        createdAt: new Date(),
        updatedAt: new Date(),
        images: ["https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=New+Turf"],
        amenities: [],
        availability: []
      };
      
      return newTurf;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create turf"
      );
    }
  }
);

// Update existing turf
export const updateTurf = createAsyncThunk(
  "turf/updateTurf",
  async ({ id, turfData }: { id: string; turfData: any }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find existing turf and update it
      const existingTurf = mockTurfs.find((t) => t.id === id);
      if (!existingTurf) {
        throw new Error("Turf not found");
      }
      
      const updatedTurf = {
        ...existingTurf,
        ...turfData,
        updatedAt: new Date()
      };
      
      return updatedTurf;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update turf"
      );
    }
  }
);

// Delete turf
export const deleteTurf = createAsyncThunk(
  "turf/deleteTurf",
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Check if turf exists
      const existingTurf = mockTurfs.find((t) => t.id === id);
      if (!existingTurf) {
        throw new Error("Turf not found");
      }
      
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete turf"
      );
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
  name: "turf",
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
      })

      // Create turf
      .addCase(createTurf.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTurf.fulfilled, (state, action) => {
        state.isLoading = false;
        state.turfs.push(action.payload);
        state.error = null;
      })
      .addCase(createTurf.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update turf
      .addCase(updateTurf.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTurf.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.turfs.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.turfs[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTurf.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete turf
      .addCase(deleteTurf.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTurf.fulfilled, (state, action) => {
        state.isLoading = false;
        state.turfs = state.turfs.filter(t => t.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTurf.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTurf, setFilters, clearFilters, clearError } =
  turfSlice.actions;
export default turfSlice.reducer;
