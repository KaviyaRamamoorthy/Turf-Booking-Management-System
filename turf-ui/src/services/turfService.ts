import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiInterceptor";
import type { ApiResponse, Turf, SearchFilter, Category } from "../types";

// Helper function to parse location string into location object
const parseLocationString = (locationString: string) => {
  const parts = locationString.split(", ");
  return {
    address: parts[0] || "",
    city: parts[1] || "",
    state: parts[2] || "",
    zipCode: parts[3] || "",
    coordinates: undefined, // Backend doesn't provide coordinates
  };
};

// Backend-aligned request interfaces based on TurfDto
export interface CreateTurfRequest {
  name: string;
  categoryId: string; // UUID
  location: string; // Simple string in backend
  description?: string;
  pricePerHour: number; // BigDecimal as number
  openTime: string; // LocalTime as HH:MM:SS
  closeTime: string; // LocalTime as HH:MM:SS
  // vendorId is set by backend from authenticated user
}

export interface UpdateTurfRequest extends Partial<CreateTurfRequest> {
  // All fields optional for updates
}

// Backend response interfaces
export interface TurfResponse extends Turf {
  // Same structure as Turf since backend uses TurfDto directly
}

export const turfService = {
  // Get all turfs with optional filters - matches backend /api/turfs
  async getTurfs(filters?: SearchFilter): Promise<Turf[]> {
    try {
      // Build query parameters from filters matching backend SearchFilter
      const params = new URLSearchParams();

      if (filters?.keyword) {
        params.append("keyword", filters.keyword);
      }
      if (filters?.startDate) {
        params.append("startDate", filters.startDate);
      }
      if (filters?.endDate) {
        params.append("endDate", filters.endDate);
      }
      if (filters?.status) {
        params.append("status", filters.status);
      }
      if (filters?.page) {
        params.append("page", filters.page.toString());
      }
      if (filters?.size) {
        params.append("size", filters.size.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `/turfs?${queryString}` : "/turfs";

      console.log("Fetching turfs from:", url);

      const response = await apiGet<ApiResponse<Turf[]>>(url);

      console.log("Get turfs response:", response);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch turfs");
      }

      // Add computed fields for UI compatibility but don't force category mapping
      const turfs = response.data.map((turf) => ({
        ...turf,
        // Keep original categoryId and let TurfCard handle category name mapping
        locationData: parseLocationString(turf.location), // Parse location string into object for display
        pricing: {
          hourlyRate: turf.pricePerHour,
          currency: "INR",
        },
        images: [], // Frontend-only field, empty for now
        rating: 0, // Frontend-only field, default to 0
        reviewCount: 0, // Frontend-only field, default to 0
        amenities: [], // Frontend-only field, empty for now
      }));

      return turfs;
    } catch (error) {
      console.error("Error fetching turfs:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch turfs");
    }
  },

  // Get turf by ID - matches backend /api/turfs/{id}
  async getTurfById(id: string): Promise<Turf> {
    try {
      console.log("Fetching turf by ID:", id);

      const response = await apiGet<ApiResponse<Turf>>(`/turfs/${id}`);

      console.log("Get turf by ID response:", response);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Turf not found");
      }

      // Add computed fields for UI compatibility but don't force category mapping
      const turf = {
        ...response.data,
        // Keep original categoryId and let TurfCard handle category name mapping
        locationData: parseLocationString(response.data.location), // Parse location string into object for display
        pricing: {
          hourlyRate: response.data.pricePerHour,
          currency: "INR",
        },
        images: [], // Frontend-only field
        rating: 0, // Frontend-only field
        reviewCount: 0, // Frontend-only field
        amenities: [], // Frontend-only field
      };

      return turf;
    } catch (error) {
      console.error("Error fetching turf by ID:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch turf details");
    }
  },

  // Create new turf - matches backend /api/turfs (POST)
  async createTurf(turfData: CreateTurfRequest): Promise<Turf> {
    try {
      console.log("Creating turf with data:", turfData);

      const response = await apiPost<ApiResponse<Turf>>("/turfs", turfData);

      console.log("Create turf response:", response);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create turf");
      }

      // Add computed fields for UI compatibility but don't force category mapping
      const turf = {
        ...response.data,
        // Keep original categoryId and let TurfCard handle category name mapping
        locationData: parseLocationString(response.data.location), // Parse location string into object for display
        pricing: {
          hourlyRate: response.data.pricePerHour,
          currency: "INR",
        },
        images: [], // Frontend-only field
        rating: 0, // Frontend-only field
        reviewCount: 0, // Frontend-only field
        amenities: [], // Frontend-only field
      };

      return turf;
    } catch (error) {
      console.error("Error creating turf:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to create turf");
    }
  },

  // Update turf - matches backend /api/turfs/{id} (PUT)
  async updateTurf(id: string, turfData: UpdateTurfRequest): Promise<Turf> {
    try {
      console.log("Updating turf:", id, "with data:", turfData);

      const response = await apiPut<ApiResponse<Turf>>(
        `/turfs/${id}`,
        turfData
      );

      console.log("Update turf response:", response);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update turf");
      }

      // Add computed fields for UI compatibility but don't force category mapping
      const turf = {
        ...response.data,
        // Keep original categoryId and let TurfCard handle category name mapping
        locationData: parseLocationString(response.data.location), // Parse location string into object for display
        pricing: {
          hourlyRate: response.data.pricePerHour,
          currency: "INR",
        },
        images: [], // Frontend-only field
        rating: 0, // Frontend-only field
        reviewCount: 0, // Frontend-only field
        amenities: [], // Frontend-only field
      };

      return turf;
    } catch (error) {
      console.error("Error updating turf:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update turf");
    }
  },

  // Delete turf - matches backend /api/turfs/{id} (DELETE)
  async deleteTurf(id: string): Promise<void> {
    try {
      console.log("Deleting turf:", id);

      const response = await apiDelete<ApiResponse<string>>(`/turfs/${id}`);

      console.log("Delete turf response:", response);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete turf");
      }
    } catch (error) {
      console.error("Error deleting turf:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to delete turf");
    }
  },

  // Helper method to convert frontend form data to backend format
  convertFormDataToBackend(formData: any): CreateTurfRequest {
    return {
      name: formData.name,
      categoryId:
        formData.categoryId || formData.category || formData.sportType,
      location: formData.location || "", // Location is now a single string
      description: formData.description,
      pricePerHour: Number(
        formData.pricePerHour ||
          formData.pricePerSlot ||
          formData.pricing?.hourlyRate ||
          0
      ),
      openTime: formData.openTime || formData.startTime || "06:00:00",
      closeTime: formData.closeTime || formData.endTime || "22:00:00",
    };
  },

  // Helper method to get available time slots based on turf open/close times
  getAvailableTimeSlots(
    turf: Turf
  ): Array<{ startTime: string; endTime: string; price: number }> {
    const slots = [];
    const openHour = parseInt(turf.openTime.split(":")[0]);
    const closeHour = parseInt(turf.closeTime.split(":")[0]);

    for (let hour = openHour; hour < closeHour; hour++) {
      slots.push({
        startTime: `${hour.toString().padStart(2, "0")}:00:00`,
        endTime: `${(hour + 1).toString().padStart(2, "0")}:00:00`,
        price: turf.pricePerHour,
      });
    }

    return slots;
  },
};
