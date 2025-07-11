import type { ApiResponse } from "../types";

// Base API URL
const API_BASE_URL = "/api/v1";

// Booking interfaces
export interface BookingRequest {
  turfId: string;
  bookingDate: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

export interface BookingResponse {
  id: string;
  turfId: string;
  customerId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  turfName: string;
  turfLocation: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingListResponse {
  bookings: BookingResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class BookingService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  // Create booking
  async createBooking(
    bookingData: BookingRequest
  ): Promise<ApiResponse<BookingResponse>> {
    try {
      // For now, simulate API call with sample response
      // In production, uncomment the actual API call below

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Sample success response based on api-implementation.md
      const sampleResponse: ApiResponse<BookingResponse> = {
        success: true,
        message: "Booking created successfully",
        data: {
          id: `booking_${Date.now()}`,
          turfId: bookingData.turfId,
          customerId: "user_123",
          bookingDate: bookingData.bookingDate,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          totalAmount: 1500, // Sample amount
          status: "confirmed",
          turfName: "Premium Football Ground",
          turfLocation: "Bangalore, Karnataka",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      return sampleResponse;

      /* 
      // Actual API call (uncomment when backend is ready)
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<BookingResponse> = await response.json();
      return result;
      */
    } catch (error) {
      console.error("Create booking error:", error);
      return {
        success: false,
        message: "Failed to create booking. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<BookingResponse>;
    }
  }

  // Get user bookings
  async getUserBookings(params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<BookingListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append("status", params.status);
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      // Sample response for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      const sampleResponse: ApiResponse<BookingListResponse> = {
        success: true,
        message: "Bookings retrieved successfully",
        data: {
          bookings: [
            {
              id: "booking_1",
              turfId: "turf_1",
              customerId: "user_123",
              bookingDate: "2024-01-15",
              startTime: "14:00",
              endTime: "15:00",
              totalAmount: 1500,
              status: "confirmed",
              turfName: "Premium Football Ground",
              turfLocation: "Bangalore, Karnataka",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      };

      return sampleResponse;

      /* 
      // Actual API call (uncomment when backend is ready)
      const response = await fetch(`${API_BASE_URL}/bookings?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<BookingListResponse> = await response.json();
      return result;
      */
    } catch (error) {
      console.error("Get bookings error:", error);
      return {
        success: false,
        message: "Failed to retrieve bookings. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<BookingListResponse>;
    }
  }

  // Get booking details
  async getBookingById(
    bookingId: string
  ): Promise<ApiResponse<BookingResponse>> {
    try {
      // Sample response for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      const sampleResponse: ApiResponse<BookingResponse> = {
        success: true,
        message: "Booking details retrieved successfully",
        data: {
          id: bookingId,
          turfId: "turf_1",
          customerId: "user_123",
          bookingDate: "2024-01-15",
          startTime: "14:00",
          endTime: "15:00",
          totalAmount: 1500,
          status: "confirmed",
          turfName: "Premium Football Ground",
          turfLocation: "Bangalore, Karnataka",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      return sampleResponse;

      /* 
      // Actual API call (uncomment when backend is ready)
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<BookingResponse> = await response.json();
      return result;
      */
    } catch (error) {
      console.error("Get booking details error:", error);
      return {
        success: false,
        message: "Failed to retrieve booking details. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<BookingResponse>;
    }
  }

  // Cancel booking
  async cancelBooking(
    bookingId: string
  ): Promise<ApiResponse<BookingResponse>> {
    try {
      // Sample response for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      const sampleResponse: ApiResponse<BookingResponse> = {
        success: true,
        message: "Booking cancelled successfully",
        data: {
          id: bookingId,
          turfId: "turf_1",
          customerId: "user_123",
          bookingDate: "2024-01-15",
          startTime: "14:00",
          endTime: "15:00",
          totalAmount: 1500,
          status: "cancelled",
          turfName: "Premium Football Ground",
          turfLocation: "Bangalore, Karnataka",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      return sampleResponse;

      /* 
      // Actual API call (uncomment when backend is ready)
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<BookingResponse> = await response.json();
      return result;
      */
    } catch (error) {
      console.error("Cancel booking error:", error);
      return {
        success: false,
        message: "Failed to cancel booking. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<BookingResponse>;
    }
  }
}

export const bookingService = new BookingService();
export default bookingService;
