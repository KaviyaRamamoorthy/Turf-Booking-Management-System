import type { ApiResponse } from "../types";
import { apiPost, apiGet, apiPut, apiDelete } from "../utils/apiInterceptor";

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

  // Create booking
  async createBooking(
    bookingData: BookingRequest
  ): Promise<ApiResponse<BookingResponse>> {
    try {
      const response: ApiResponse<BookingResponse> = await apiPost<ApiResponse<BookingResponse>>('/bookings', bookingData);
      return response;
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

      const url = `/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response: ApiResponse<BookingListResponse> = await apiGet<ApiResponse<BookingListResponse>>(url);
      return response;
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
      const response: ApiResponse<BookingResponse> = await apiGet<ApiResponse<BookingResponse>>(`/bookings/${bookingId}`);
      return response;
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
      const response: ApiResponse<BookingResponse> = await apiPut<ApiResponse<BookingResponse>>(`/bookings/${bookingId}/cancel`);
      return response;
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
