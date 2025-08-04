import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  TurfState,
  Turf,
  TurfFilters,
  TurfCategory,
  RootState,
} from "../../types";
import { turfService } from "../../services/turfService";

// Mock turf data - updated to match API implementation structure
const mockTurfs: Turf[] = [
  {
    id: "1",
    name: "Green Valley Cricket Ground",
    vendorId: "3",
    categoryId: "cricket-1",
    location: {
      address: "Block A, Sports Complex, Sector 18",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400703",
      coordinates: { lat: 19.076, lng: 72.8777 },
    },
    description:
      "Professional cricket ground with excellent drainage system and natural grass surface. Perfect for tournaments and practice sessions.",
    pricePerHour: 2500,
    openTime: "06:00:00",
    closeTime: "22:00:00",
    // Legacy/computed fields for UI compatibility
    category: "cricket",
    pricing: {
      hourlyRate: 2500,
      currency: "INR",
      discounts: [{ type: "percentage", value: 10, minHours: 3 }],
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
        name: "Changing Room",
        description: "Clean changing facilities",
        icon: "shower",
      },
      {
        id: "3",
        name: "Equipment",
        description: "Cricket equipment rental",
        icon: "equipment",
      },
      {
        id: "4",
        name: "Pavilion",
        description: "Covered seating area",
        icon: "pavilion",
      },
    ],
    images: [
      "https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Cricket+Ground",
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
            price: 2200,
          },
          {
            startTime: "07:00",
            endTime: "08:00",
            isAvailable: true,
            price: 2200,
          },
          {
            startTime: "17:00",
            endTime: "18:00",
            isAvailable: true,
            price: 2200,
          },
        ],
      },
    ],
    rating: 4.9,
    reviewCount: 42,
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-05T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Champions Football Arena",
    vendorId: "3",
    categoryId: "football-1",
    location: {
      address: "45, Stadium Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      coordinates: { lat: 19.0596, lng: 72.8295 },
    },
    description:
      "FIFA standard football field with artificial turf and professional floodlights for evening matches and training.",
    pricePerHour: 1800,
    openTime: "06:00:00",
    closeTime: "22:00:00",
    // Legacy/computed fields for UI compatibility
    category: "football",
    pricing: {
      hourlyRate: 1800,
      currency: "INR",
      discounts: [{ type: "percentage", value: 15, minHours: 2 }],
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
        name: "Changing Room",
        description: "Clean changing facilities",
        icon: "shower",
      },
      {
        id: "5",
        name: "Floodlights",
        description: "Professional lighting",
        icon: "light",
      },
      {
        id: "6",
        name: "Seating",
        description: "Spectator seating",
        icon: "stadium",
      },
    ],
    images: [
      "https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Football+Arena",
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
            price: 1800,
          },
          {
            startTime: "07:00",
            endTime: "08:00",
            isAvailable: true,
            price: 1800,
          },
          {
            startTime: "18:00",
            endTime: "19:00",
            isAvailable: true,
            price: 1800,
          },
        ],
      },
    ],
    rating: 4.4,
    reviewCount: 32,
    createdAt: new Date("2024-01-10").toISOString(),
    updatedAt: new Date("2024-01-10").toISOString(),
  },
  {
    id: "3",
    name: "SportsPlex Multi-Ground",
    vendorId: "4",
    categoryId: "volleyball-1",
    description:
      "Versatile sports facility supporting multiple games including cricket, football, and badminton with modern facilities.",
    pricePerHour: 1500,
    openTime: "06:00:00",
    closeTime: "22:00:00",
    // Legacy/computed fields for UI compatibility
    category: "volleyball",
    location: {
      address: "Plot 12, Industrial Estate, Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400069",
      coordinates: { lat: 19.1136, lng: 72.8697 },
    },
    pricing: {
      hourlyRate: 2000,
      currency: "INR",
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
        name: "Changing Room",
        description: "Clean changing facilities",
        icon: "shower",
      },
      {
        id: "7",
        name: "Cafeteria",
        description: "Food and beverages",
        icon: "food",
      },
      {
        id: "8",
        name: "Equipment Rental",
        description: "Sports equipment available",
        icon: "equipment",
      },
    ],
    images: [
      "https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Multi+Ground",
    ],
    availability: [
      {
        dayOfWeek: 1,
        isOpen: true,
        slots: [
          {
            startTime: "07:00",
            endTime: "08:00",
            isAvailable: true,
            price: 2000,
          },
          {
            startTime: "08:00",
            endTime: "09:00",
            isAvailable: true,
            price: 2000,
          },
          {
            startTime: "17:00",
            endTime: "18:00",
            isAvailable: true,
            price: 2000,
          },
        ],
      },
    ],
    rating: 4.7,
    reviewCount: 18,
    createdAt: new Date("2024-01-20").toISOString(),
    updatedAt: new Date("2024-01-20").toISOString(),
  },
  {
    id: "4",
    name: "Elite Tennis Courts",
    vendorId: "5",
    categoryId: "tennis-1",
    description:
      "Premium tennis courts with synthetic grass surface and professional net systems. Ideal for coaching and tournaments.",
    pricePerHour: 2000,
    openTime: "06:00:00",
    closeTime: "22:00:00",
    // Legacy/computed fields for UI compatibility
    category: "tennis",
    location: {
      address: "23, Club Road, Juhu",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400049",
      coordinates: { lat: 19.1075, lng: 72.8263 },
    },
    pricing: {
      hourlyRate: 1500,
      currency: "INR",
      discounts: [{ type: "percentage", value: 20, minHours: 2 }],
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
        name: "Changing Room",
        description: "Clean changing facilities",
        icon: "shower",
      },
      {
        id: "9",
        name: "Pro Shop",
        description: "Tennis equipment store",
        icon: "shop",
      },
      {
        id: "10",
        name: "Coaching",
        description: "Professional coaching available",
        icon: "coach",
      },
    ],
    images: [
      "https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Tennis+Courts",
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
            price: 1500,
          },
          {
            startTime: "07:00",
            endTime: "08:00",
            isAvailable: true,
            price: 1500,
          },
          {
            startTime: "16:00",
            endTime: "17:00",
            isAvailable: true,
            price: 1500,
          },
        ],
      },
    ],
    rating: 4.6,
    reviewCount: 28,
    createdAt: new Date("2024-01-12").toISOString(),
    updatedAt: new Date("2024-01-12").toISOString(),
  },
  {
    id: "5",
    name: "Urban Basketball Court",
    vendorId: "6",
    categoryId: "basketball-1",
    description:
      "Modern indoor basketball court with wooden flooring, air conditioning, and professional hoops. Perfect for leagues and practice.",
    pricePerHour: 1200,
    openTime: "08:00:00",
    closeTime: "22:00:00",
    // Legacy/computed fields for UI compatibility
    category: "basketball",
    location: {
      address: "Building 7, Phoenix Mall, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400013",
      coordinates: { lat: 19.0176, lng: 72.8318 },
    },
    pricing: {
      hourlyRate: 1200,
      currency: "INR",
    },
    amenities: [
      {
        id: "1",
        name: "Parking",
        description: "Mall parking available",
        icon: "car",
      },
      {
        id: "2",
        name: "Changing Room",
        description: "Clean changing facilities",
        icon: "shower",
      },
      {
        id: "11",
        name: "Air Conditioning",
        description: "Climate controlled",
        icon: "air",
      },
      {
        id: "12",
        name: "Scoreboard",
        description: "Electronic scoreboard",
        icon: "score",
      },
    ],
    images: [
      "https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Basketball+Court",
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
            price: 1200,
          },
          {
            startTime: "10:00",
            endTime: "11:00",
            isAvailable: true,
            price: 1200,
          },
          {
            startTime: "18:00",
            endTime: "19:00",
            isAvailable: true,
            price: 1200,
          },
        ],
      },
    ],
    rating: 4.3,
    reviewCount: 15,
    createdAt: new Date("2024-01-08").toISOString(),
    updatedAt: new Date("2024-01-08").toISOString(),
  },
  {
    id: "6",
    name: "Premier Football Ground",
    vendorId: "7",
    categoryId: "football-2",
    description:
      "Top-notch football facility with natural grass, professional drainage, and stadium-style seating for matches.",
    pricePerHour: 3000,
    openTime: "06:00:00",
    closeTime: "22:00:00",
    // Legacy/computed fields for UI compatibility
    category: "football",
    location: {
      address: "78, Eastern Express Highway, Thane",
      city: "Thane",
      state: "Maharashtra",
      zipCode: "400601",
      coordinates: { lat: 19.2183, lng: 72.9781 },
    },
    pricing: {
      hourlyRate: 2200,
      currency: "INR",
      discounts: [{ type: "percentage", value: 12, minHours: 2 }],
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
        name: "Changing Room",
        description: "Clean changing facilities",
        icon: "shower",
      },
      {
        id: "5",
        name: "Floodlights",
        description: "Professional lighting",
        icon: "light",
      },
      {
        id: "13",
        name: "Stadium Seating",
        description: "Spectator stands",
        icon: "stadium",
      },
    ],
    images: [
      "https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Football+Ground",
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
            price: 2200,
          },
          {
            startTime: "07:00",
            endTime: "08:00",
            isAvailable: true,
            price: 2200,
          },
          {
            startTime: "17:00",
            endTime: "18:00",
            isAvailable: true,
            price: 2200,
          },
        ],
      },
    ],
    rating: 4.9,
    reviewCount: 42,
    createdAt: new Date("2024-01-05").toISOString(),
    updatedAt: new Date("2024-01-05").toISOString(),
  },
];

// Async thunks
export const fetchTurfs = createAsyncThunk(
  "turf/fetchTurfs",
  async (filters: any = undefined, { rejectWithValue }) => {
    try {
      // Call the real API service
      const turfs = await turfService.getTurfs(filters);
      return turfs;
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
      // Call the real API service
      const turf = await turfService.getTurfById(id);
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
      // Call the real API service
      const response = await turfService.createTurf(turfData);

      // Map the backend response to our frontend Turf structure
      const newTurf: Turf = {
        id: response.id || Date.now().toString(),
        name: response.name,
        vendorId: response.vendorId || "1",
        categoryId: response.categoryId || "default-1",
        location: {
          address: response.location || "",
          city: "", // Backend doesn't provide this separately
          state: "",
          zipCode: "",
        },
        description: response.description,
        pricePerHour: response.pricePerHour || 0,
        openTime: response.openTime || "06:00:00",
        closeTime: response.closeTime || "22:00:00",
        // Legacy/computed fields for UI compatibility
        category: response.category || "football", // Default fallback
        pricing: {
          hourlyRate: response.pricePerHour || 0,
          currency: "INR",
        },
        rating: 0,
        reviewCount: 0,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
        images: [
          "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=New+Turf",
        ],
        amenities: [],
        availability: [],
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
  async (
    { id, turfData }: { id: string; turfData: any },
    { rejectWithValue }
  ) => {
    try {
      // Convert frontend form data to backend format
      const backendData = turfService.convertFormDataToBackend(turfData);

      // Call the actual API
      const updatedTurf = await turfService.updateTurf(id, backendData);

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
      // Call the actual API
      await turfService.deleteTurf(id);

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
  isError: false,
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
        state.isError = false;
      })
      .addCase(fetchTurfs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.turfs = action.payload;
        state.error = null;
      })
      .addCase(fetchTurfs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isError = true;
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
        const index = state.turfs.findIndex((t) => t.id === action.payload.id);
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
        state.turfs = state.turfs.filter((t) => t.id !== action.payload);
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
