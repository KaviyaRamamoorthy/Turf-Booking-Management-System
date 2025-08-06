import type { ApiResponse, Booking, BookingFilters } from "../types";
import { apiPost, apiGet, apiPut, apiDelete } from "../utils/apiInterceptor";

// Backend-aligned booking interfaces based on BookingDto
export interface BookingRequest {
  turfId: string; // UUID
  bookingDate: string; // LocalDate as YYYY-MM-DD
  startTime: string; // LocalTime as HH:MM:SS
  endTime: string; // LocalTime as HH:MM:SS
}

export interface BookingResponse extends Booking {
  // Same structure as Booking since backend uses BookingDto directly
}

class BookingService {
  // Backend booking endpoints are now implemented and integrated

  // Create booking - calls /api/bookings endpoint
  async createBooking(
    bookingData: BookingRequest
  ): Promise<ApiResponse<Booking>> {
    try {
      console.log("Creating booking with data:", bookingData);

      // Call the backend BookingController
      const response = await apiPost<ApiResponse<Booking>>(
        "/bookings",
        bookingData
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to create booking");
      }

      console.log("📝 Booking created successfully:", response.data);
      return response;
      
    } catch (error: any) {
      console.error("Create booking error:", error);
      
      // Handle specific error cases
      if (error.message?.includes("Time slot is already booked")) {
        return {
          success: false,
          message: "This time slot is already booked. Please select a different time.",
          data: null as any,
        } as ApiResponse<Booking>;
      }
      
      if (error.message?.includes("Customer not found") || error.message?.includes("Turf not found")) {
        return {
          success: false,
          message: "Invalid booking data. Please refresh the page and try again.",
          data: null as any,
        } as ApiResponse<Booking>;
      }

      return {
        success: false,
        message: error.message || "Failed to create booking. Please try again later.",
        data: null as any,
      } as ApiResponse<Booking>;
    }
  }

  // Get user bookings - will call /api/bookings/my once implemented
  async getUserBookings(filters?: BookingFilters): Promise<Booking[]> {
    try {
      console.log("Fetching user bookings with filters:", filters);

      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.size) params.append("size", filters.size.toString());

      const queryString = params.toString();
      const url = queryString ? `/bookings/my?${queryString}` : "/bookings/my";

      const response = await apiGet<ApiResponse<Booking[]>>(url);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch bookings");
      }

      return response.data;
    } catch (error) {
      console.error("Get user bookings error:", error);
      // Return empty array for now since backend is not implemented
      return [];
    }
  }

  // Get booking by ID - will call /api/bookings/{id} once implemented
  async getBookingById(id: string): Promise<Booking | null> {
    try {
      console.log("Fetching booking by ID:", id);

      const response = await apiGet<ApiResponse<Booking>>(`/bookings/${id}`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Booking not found");
      }

      return response.data;
    } catch (error) {
      console.error("Get booking by ID error:", error);
      return null;
    }
  }

  // Update booking - will call /api/bookings/{id} once implemented
  async updateBooking(
    id: string,
    bookingData: Partial<BookingRequest>
  ): Promise<Booking | null> {
    try {
      console.log("Updating booking:", id, "with data:", bookingData);

      const response = await apiPut<ApiResponse<Booking>>(
        `/bookings/${id}`,
        bookingData
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update booking");
      }

      return response.data;
    } catch (error) {
      console.error("Update booking error:", error);
      return null;
    }
  }

  // Cancel booking - will call /api/bookings/{id}/cancel once implemented
  async cancelBooking(id: string): Promise<boolean> {
    try {
      console.log("Cancelling booking:", id);

      const response = await apiPut<ApiResponse<Booking>>(
        `/bookings/${id}/cancel`,
        {}
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to cancel booking");
      }

      return true;
    } catch (error) {
      console.error("Cancel booking error:", error);
      return false;
    }
  }

  // Get bookings for a specific turf and date to check availability
  async getBookingsForDate(turfId: string, date: string): Promise<Booking[]> {
    try {
      console.log("Fetching bookings for turf:", turfId, "date:", date);

      // Call the backend BookingController
      const response = await apiGet<ApiResponse<Booking[]>>(
        `/bookings/turf/${turfId}/date/${date}`
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch bookings for date");
      }

      console.log("📊 Bookings fetched for date:", date, "Count:", response.data?.length || 0);
      return response.data || [];

    } catch (error: any) {
      console.error("Get bookings for date error:", error);
      
      // Return empty array if API fails - better to show all slots as available than block everything
      console.warn("⚠️ Failed to fetch bookings, assuming all slots are available");
      return [];
    }
  }

  // Check availability for specific time slots on a date
  async checkAvailability(turfId: string, date: string): Promise<string[]> {
    try {
      console.log("Checking availability for turf:", turfId, "date:", date);

      const bookings = await this.getBookingsForDate(turfId, date);
      
      // Extract booked time slots
      const bookedSlots = bookings.map(booking => {
        const startTime = booking.startTime.substring(0, 5); // Remove seconds
        const endTime = booking.endTime.substring(0, 5); // Remove seconds
        return `${startTime}-${endTime}`;
      });

      console.log("📊 Actual booked slots from API:", bookedSlots);
      return bookedSlots;
    } catch (error) {
      console.error("Check availability error:", error);
      return [];
    }
  }

  // Get all bookings for a specific turf (Admin access)
  async getTurfBookings(
    turfId: string, 
    filters?: BookingFilters
  ): Promise<Booking[]> {
    try {
      console.log("Fetching turf bookings for turf:", turfId, "with filters:", filters);

      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);

      const queryString = params.toString();
      const url = queryString ? `/bookings/turf/${turfId}?${queryString}` : `/bookings/turf/${turfId}`;

      const response = await apiGet<ApiResponse<Booking[]>>(url);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch turf bookings");
      }

      console.log("📊 Turf bookings fetched:", response.data?.length || 0);
      return response.data || [];
    } catch (error) {
      console.error("Get turf bookings error:", error);
      return [];
    }
  }

  // Get all bookings across the system (Admin only)
  async getAllBookings(filters?: BookingFilters): Promise<Booking[]> {
    try {
      console.log("Fetching all bookings with filters:", filters);

      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.size) params.append("size", filters.size.toString());

      const queryString = params.toString();
      const url = queryString ? `/bookings/admin/all?${queryString}` : "/bookings/admin/all";

      const response = await apiGet<ApiResponse<Booking[]>>(url);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch all bookings");
      }

      console.log("📊 All bookings fetched:", response.data?.length || 0);
      return response.data || [];
    } catch (error) {
      console.error("Get all bookings error:", error);
      return [];
    }
  }

  // Helper method to convert frontend form data to backend format
  convertFormDataToBackend(formData: any): BookingRequest {
    return {
      turfId: formData.turfId,
      bookingDate: formData.bookingDate || formData.date,
      startTime: formData.startTime || "09:00:00",
      endTime: formData.endTime || "10:00:00",
    };
  }
}

export const bookingService = new BookingService();
