import { apiPost, apiGet } from '../utils/apiInterceptor';

// Interface for the backend create turf request
interface CreateTurfBackendRequest {
  name: string;
  categoryId: string;
  location: string;
  description: string;
  pricePerHour: number;
  openTime: string;
  closeTime: string;
}

// Interface for the backend response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Interface for backend TurfDto
interface BackendTurfDto {
  id: string;
  name: string;
  vendorId: string;
  categoryId: string;
  location: string;
  description: string;
  pricePerHour: number;
  openTime: string;
  closeTime: string;
}

// Interface for SearchFilter
interface SearchFilter {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  size?: number;
}

export const turfService = {
  // Get all turfs with optional filters
  async getTurfs(filters?: any): Promise<any[]> {
    try {
      // Build query parameters from filters
      const params = new URLSearchParams();

      if (filters?.keyword) {
        params.append('keyword', filters.keyword);
      }
      if (filters?.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.page) {
        params.append('page', filters.page.toString());
      }
      if (filters?.size) {
        params.append('size', filters.size.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `/turfs?${queryString}` : '/turfs';

      console.log('Fetching turfs from:', url);

      const response = await apiGet<ApiResponse<BackendTurfDto[]>>(url);

      console.log('Get turfs response:', response);

      // Map backend response to frontend format
      const mappedTurfs = response.data.map((backendTurf: BackendTurfDto) => ({
        id: backendTurf.id,
        name: backendTurf.name,
        description: backendTurf.description,
        category: this.mapCategoryIdToCategory(backendTurf.categoryId), // Map UUID to string
        location: {
          address: backendTurf.location,
          city: "", // Backend doesn't provide this separately
          state: "",
          zipCode: "",
        },
        pricing: {
          hourlyRate: backendTurf.pricePerHour,
          currency: "INR",
        },
        rating: 4, // Backend doesn't provide this
        reviewCount: 0, // Backend doesn't provide this
        vendorId: backendTurf.vendorId,
        createdAt: new Date().toISOString(), // Backend doesn't provide this
        updatedAt: new Date().toISOString(), // Backend doesn't provide this
        images: ["https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Turf"], // Default image
        amenities: [], // Backend doesn't provide this
        availability: [] // Backend doesn't provide this
      }));

      return mappedTurfs;
    } catch (error) {
      console.error('Error fetching turfs:', error);
      throw new Error('Failed to fetch turfs');
    }
  },

  // Helper function to map category ID to category string
  // Note: This will be updated to use Redux state in the slice
  mapCategoryIdToCategory(categoryId: string): string {
    // This is a simple mapping - in a real app, you might want to fetch categories from API
    // For now, using the static category ID you provided
    if (categoryId === "6469abef-f8fe-45a4-bc28-351e042362de") {
      return "football";
    }
    // Add more mappings as needed
    return "football"; // Default fallback
  },

  // Get turf by ID
  async getTurfById(id: string): Promise<any> {
    try {
      console.log('Fetching turf by ID:', id);

      const response = await apiGet<ApiResponse<BackendTurfDto>>(`/turfs/${id}`);

      console.log('Get turf by ID response:', response);

      const backendTurf = response.data;

      // Map backend response to frontend format
      const mappedTurf = {
        id: backendTurf.id,
        name: backendTurf.name,
        description: backendTurf.description,
        category: this.mapCategoryIdToCategory(backendTurf.categoryId),
        location: {
          address: backendTurf.location,
          city: "",
          state: "",
          zipCode: "",
        },
        pricing: {
          hourlyRate: backendTurf.pricePerHour,
          currency: "INR",
        },
        rating: 0,
        reviewCount: 0,
        vendorId: backendTurf.vendorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: ["https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Turf"],
        amenities: [],
        availability: []
      };

      return mappedTurf;
    } catch (error) {
      console.error('Error fetching turf by ID:', error);
      throw new Error('Failed to fetch turf details');
    }
  },

  // Create new turf - only this function for now
  async createTurf(turfData: any): Promise<any> {
    try {
      // Map frontend form data to backend API format
      console.log(turfData)
      const backendPayload: CreateTurfBackendRequest = {
        name: turfData.name,
        categoryId: turfData.sportType || turfData.categoryId || "6469abef-f8fe-45a4-bc28-351e042362de", // Use real category ID from form
        location:  turfData.city + ", " + turfData.state + ", " + turfData.postalCode,
        description: turfData.description,
        pricePerHour: turfData.pricePerSlot || turfData.pricing?.hourlyRate || 0,
        openTime: turfData.startTime || "06:00:00",
        closeTime: turfData.endTime || "22:00:00"
      };

      console.log('Sending create turf request:', backendPayload);

      const response = await apiPost<ApiResponse<any>>('/turfs', backendPayload);

      console.log('Create turf response:', response);

      return response.data;
    } catch (error) {
      console.error('Error creating turf:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create turf');
    }
  },
};

export default turfService; 