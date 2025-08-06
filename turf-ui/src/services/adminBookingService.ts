import type { ApiResponse } from "../types";
import { apiGet, apiPut } from "../utils/apiInterceptor";

// Admin Booking interfaces
export interface AdminBookingResponse {
  id: string;
  turfId: string;
  customerId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  turf: {
    id: string;
    name: string;
    category: string;
    location: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBookingListResponse {
  bookings: AdminBookingResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminBookingFilters {
  turfId?: string;
  bookingDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface StatusCounts {
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  total: number;
}

class AdminBookingService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  // Get all bookings (admin view)
  async getAllBookings(
    filters?: AdminBookingFilters
  ): Promise<ApiResponse<AdminBookingListResponse>> {
    try {
      console.log("Fetching all bookings (admin) with filters:", filters);

      // Build query parameters for the real API
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append("status", filters.status);
      if (filters?.bookingDate) {
        // For single date filter, use both startDate and endDate as the same date
        queryParams.append("startDate", filters.bookingDate);
        queryParams.append("endDate", filters.bookingDate);
      }
      if (filters?.page) queryParams.append("page", filters.page.toString());
      if (filters?.limit) queryParams.append("size", filters.limit.toString());

      const queryString = queryParams.toString();
      const url = queryString ? `/bookings/admin/all?${queryString}` : "/bookings/admin/all";

      // Call the real backend API
      const response = await apiGet<ApiResponse<any[]>>(url);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch bookings");
      }

      // Transform backend response to match admin interface
      const transformedBookings: AdminBookingResponse[] = (response.data || []).map((booking: any) => ({
        id: booking.id,
        turfId: booking.turfId,
        customerId: booking.customerId,
        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalAmount: booking.totalAmount || 0,
        status: booking.status,
        turf: {
          id: booking.turfId,
          name: booking.turfName || "Turf Name",
          category: booking.categoryName || "football",
          location: {
            address: booking.turfLocation || "Address",
            city: "City",
            state: "State",
            zipCode: "000000",
          },
        },
        customer: {
          id: booking.customerId,
          firstName: booking.customerName?.split(' ')[0] || "Customer",
          lastName: booking.customerName?.split(' ').slice(1).join(' ') || "Name",
          email: booking.customerEmail || "customer@example.com",
          phone: "+91 0000000000",
        },
        bookingReference: `TBA${booking.id?.slice(0, 6) || '000000'}`,
        createdAt: booking.createdAt || new Date().toISOString(),
        updatedAt: booking.updatedAt || new Date().toISOString(),
      }));

      const adminResponse: ApiResponse<AdminBookingListResponse> = {
        success: true,
        message: "Bookings retrieved successfully",
        data: {
          bookings: transformedBookings,
          total: transformedBookings.length,
          page: filters?.page || 1,
          limit: filters?.limit || 20,
          totalPages: Math.ceil(transformedBookings.length / (filters?.limit || 20)),
        },
      };

      console.log("📊 Admin bookings fetched:", transformedBookings.length);
      return adminResponse;
    } catch (error) {
      console.error("Get all bookings error:", error);
      return {
        success: false,
        message: "Failed to retrieve bookings. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<AdminBookingListResponse>;
    }
  }

  // Get booking details by ID
  async getBookingById(
    bookingId: string
  ): Promise<ApiResponse<AdminBookingResponse>> {
    try {
      console.log("Fetching booking details for ID:", bookingId);

      // Call the real backend API
      const response = await apiGet<ApiResponse<any>>(`/bookings/${bookingId}`);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch booking details");
      }

      // Transform the response to match admin interface
      const transformedBooking: AdminBookingResponse = {
        id: response.data.id,
        turfId: response.data.turfId,
        customerId: response.data.customerId,
        bookingDate: response.data.bookingDate,
        startTime: response.data.startTime,
        endTime: response.data.endTime,
        totalAmount: response.data.totalAmount || 0,
        status: response.data.status,
        turf: {
          id: response.data.turfId,
          name: response.data.turfName || "Turf Name",
          category: response.data.categoryName || "football",
          location: {
            address: response.data.turfLocation || "Address",
            city: "City",
            state: "State",
            zipCode: "000000",
          },
        },
        customer: {
          id: response.data.customerId,
          firstName: response.data.customerName?.split(' ')[0] || "Customer",
          lastName: response.data.customerName?.split(' ')[1] || "Name",
          email: response.data.customerEmail || "customer@example.com",
          phone: "+91 0000000000",
        },
        bookingReference: `TBA${response.data.id?.slice(0, 6) || '000000'}`,
        createdAt: response.data.createdAt || new Date().toISOString(),
        updatedAt: response.data.updatedAt || new Date().toISOString(),
      };

      return {
        success: true,
        message: "Booking details retrieved successfully",
        data: transformedBooking,
      };
    } catch (error) {
      console.error("Get booking details error:", error);
      return {
        success: false,
        message: "Failed to retrieve booking details. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<AdminBookingResponse>;
    }
  }

  // Confirm booking
  async confirmBooking(
    bookingId: string
  ): Promise<ApiResponse<AdminBookingResponse>> {
    try {
      console.log("Confirming booking:", bookingId);

      // Call the real backend API to update booking status
      const response = await apiPut<ApiResponse<any>>(
        `/bookings/${bookingId}/status?status=CONFIRMED`
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to confirm booking");
      }

      // Transform the response to match admin interface
      const transformedBooking: AdminBookingResponse = {
        id: response.data.id,
        turfId: response.data.turfId,
        customerId: response.data.customerId,
        bookingDate: response.data.bookingDate,
        startTime: response.data.startTime,
        endTime: response.data.endTime,
        totalAmount: response.data.totalAmount || 0,
        status: "confirmed",
        turf: {
          id: response.data.turfId,
          name: response.data.turfName || "Turf Name",
          category: response.data.categoryName || "football",
          location: {
            address: response.data.turfLocation || "Address",
            city: "City",
            state: "State",
            zipCode: "000000",
          },
        },
        customer: {
          id: response.data.customerId,
          firstName: response.data.customerName?.split(' ')[0] || "Customer",
          lastName: response.data.customerName?.split(' ')[1] || "Name",
          email: response.data.customerEmail || "customer@example.com",
          phone: "+91 0000000000",
        },
        bookingReference: `TBA${response.data.id?.slice(0, 6) || '000000'}`,
        createdAt: response.data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        message: "Booking confirmed successfully",
        data: transformedBooking,
      };
    } catch (error) {
      console.error("Confirm booking error:", error);
      return {
        success: false,
        message: "Failed to confirm booking. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<AdminBookingResponse>;
    }
  }

  // Reject booking
  async rejectBooking(
    bookingId: string,
    reason?: string
  ): Promise<ApiResponse<AdminBookingResponse>> {
    try {
      console.log("Rejecting booking:", bookingId, "Reason:", reason);

      // Call the real backend API to update booking status to cancelled
      const response = await apiPut<ApiResponse<any>>(
        `/bookings/${bookingId}/status?status=CANCELLED`
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to reject booking");
      }

      // Transform the response to match admin interface
      const transformedBooking: AdminBookingResponse = {
        id: response.data.id,
        turfId: response.data.turfId,
        customerId: response.data.customerId,
        bookingDate: response.data.bookingDate,
        startTime: response.data.startTime,
        endTime: response.data.endTime,
        totalAmount: response.data.totalAmount || 0,
        status: "cancelled",
        turf: {
          id: response.data.turfId,
          name: response.data.turfName || "Turf Name",
          category: response.data.categoryName || "football",
          location: {
            address: response.data.turfLocation || "Address",
            city: "City",
            state: "State",
            zipCode: "000000",
          },
        },
        customer: {
          id: response.data.customerId,
          firstName: response.data.customerName?.split(' ')[0] || "Customer",
          lastName: response.data.customerName?.split(' ')[1] || "Name",
          email: response.data.customerEmail || "customer@example.com",
          phone: "+91 0000000000",
        },
        bookingReference: `TBA${response.data.id?.slice(0, 6) || '000000'}`,
        createdAt: response.data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        message: "Booking rejected successfully",
        data: transformedBooking,
      };
    } catch (error) {
      console.error("Reject booking error:", error);
      return {
        success: false,
        message: "Failed to reject booking. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<AdminBookingResponse>;
    }
  }

  // Complete booking
  async completeBooking(
    bookingId: string
  ): Promise<ApiResponse<AdminBookingResponse>> {
    try {
      console.log("Completing booking:", bookingId);

      // Call the real backend API to complete booking
      const response = await apiPut<ApiResponse<any>>(
        `/bookings/${bookingId}/complete`
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to complete booking");
      }

      // Transform the response to match admin interface
      const transformedBooking: AdminBookingResponse = {
        id: response.data.id,
        turfId: response.data.turfId,
        customerId: response.data.customerId,
        bookingDate: response.data.bookingDate,
        startTime: response.data.startTime,
        endTime: response.data.endTime,
        totalAmount: response.data.totalAmount || 0,
        status: "completed",
        turf: {
          id: response.data.turfId,
          name: response.data.turfName || "Turf Name",
          category: response.data.categoryName || "football",
          location: {
            address: response.data.turfLocation || "Address",
            city: "City",
            state: "State",
            zipCode: "000000",
          },
        },
        customer: {
          id: response.data.customerId,
          firstName: response.data.customerName?.split(' ')[0] || "Customer",
          lastName: response.data.customerName?.split(' ')[1] || "Name",
          email: response.data.customerEmail || "customer@example.com",
          phone: "+91 0000000000",
        },
        bookingReference: `TBA${response.data.id?.slice(0, 6) || '000000'}`,
        createdAt: response.data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        message: "Booking completed successfully",
        data: transformedBooking,
      };
    } catch (error) {
      console.error("Complete booking error:", error);
      return {
        success: false,
        message: "Failed to complete booking. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<AdminBookingResponse>;
    }
  }

  async getStatusCounts(): Promise<ApiResponse<StatusCounts>> {
    try {
      const response = await fetch(`/api/bookings/status-counts`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to get status counts");
      }

      return {
        success: true,
        message: "Status counts retrieved successfully",
        data: apiResponse.data,
      };
    } catch (error) {
      console.error("Get status counts error:", error);
      return {
        success: false,
        message: "Failed to get status counts. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<StatusCounts>;
    }
  }
}

export const adminBookingService = new AdminBookingService();
export default adminBookingService; 