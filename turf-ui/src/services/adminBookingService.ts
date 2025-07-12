import type { ApiResponse } from "../types";

// Base API URL
const API_BASE_URL = "/api/v1";

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
      const queryParams = new URLSearchParams();
      if (filters?.turfId) queryParams.append("turfId", filters.turfId);
      if (filters?.bookingDate) queryParams.append("bookingDate", filters.bookingDate);
      if (filters?.status) queryParams.append("status", filters.status);
      if (filters?.page) queryParams.append("page", filters.page.toString());
      if (filters?.limit) queryParams.append("limit", filters.limit.toString());

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Sample response based on api-implementation.md
      const sampleResponse: ApiResponse<AdminBookingListResponse> = {
        success: true,
        message: "Bookings retrieved successfully",
        data: {
          bookings: [
            {
              id: "booking_001",
              turfId: "turf_001",
              customerId: "user_123",
              bookingDate: "2024-01-25",
              startTime: "18:00",
              endTime: "19:00",
              totalAmount: 1500,
              status: "pending",
              turf: {
                id: "turf_001",
                name: "Elite Football Arena",
                category: "football",
                location: {
                  address: "123 Sports Complex, Koramangala 4th Block",
                  city: "Bangalore",
                  state: "Karnataka",
                  zipCode: "560034",
                },
              },
              customer: {
                id: "user_123",
                firstName: "Rajesh",
                lastName: "Kumar",
                email: "rajesh.kumar@example.com",
                phone: "+91 9876543210",
              },
              bookingReference: "TBA001250124001",
              createdAt: "2024-01-20T10:30:00Z",
              updatedAt: "2024-01-20T10:30:00Z",
            },
            {
              id: "booking_002",
              turfId: "turf_002",
              customerId: "user_124",
              bookingDate: "2024-01-25",
              startTime: "19:00",
              endTime: "20:00",
              totalAmount: 1200,
              status: "pending",
              turf: {
                id: "turf_002",
                name: "Green Valley Football Club",
                category: "football",
                location: {
                  address: "456 Garden Road, Whitefield",
                  city: "Bangalore",
                  state: "Karnataka",
                  zipCode: "560066",
                },
              },
              customer: {
                id: "user_124",
                firstName: "Priya",
                lastName: "Sharma",
                email: "priya.sharma@example.com",
                phone: "+91 9876543211",
              },
              bookingReference: "TBA002250124002",
              createdAt: "2024-01-21T14:15:00Z",
              updatedAt: "2024-01-21T14:15:00Z",
            },
            {
              id: "booking_003",
              turfId: "turf_003",
              customerId: "user_125",
              bookingDate: "2024-01-26",
              startTime: "16:00",
              endTime: "19:00",
              totalAmount: 6000,
              status: "pending",
              turf: {
                id: "turf_003",
                name: "Champions Cricket Ground",
                category: "cricket",
                location: {
                  address: "789 Stadium Road, Indiranagar",
                  city: "Bangalore",
                  state: "Karnataka",
                  zipCode: "560038",
                },
              },
              customer: {
                id: "user_125",
                firstName: "Amit",
                lastName: "Patel",
                email: "amit.patel@example.com",
                phone: "+91 9876543212",
              },
              bookingReference: "TBA003260124003",
              createdAt: "2024-01-22T09:45:00Z",
              updatedAt: "2024-01-22T09:45:00Z",
            },
            {
              id: "booking_004",
              turfId: "turf_001",
              customerId: "user_126",
              bookingDate: "2024-01-24",
              startTime: "20:00",
              endTime: "21:00",
              totalAmount: 1500,
              status: "pending",
              turf: {
                id: "turf_001",
                name: "Elite Football Arena",
                category: "football",
                location: {
                  address: "123 Sports Complex, Koramangala 4th Block",
                  city: "Bangalore",
                  state: "Karnataka",
                  zipCode: "560034",
                },
              },
              customer: {
                id: "user_126",
                firstName: "Sneha",
                lastName: "Reddy",
                email: "sneha.reddy@example.com",
                phone: "+91 9876543213",
              },
              bookingReference: "TBA004240124004",
              createdAt: "2024-01-19T16:20:00Z",
              updatedAt: "2024-01-24T21:00:00Z",
            },
            {
              id: "booking_005",
              turfId: "turf_002",
              customerId: "user_127",
              bookingDate: "2024-01-23",
              startTime: "17:00",
              endTime: "18:00",
              totalAmount: 1200,
              status: "cancelled",
              turf: {
                id: "turf_002",
                name: "Green Valley Football Club",
                category: "football",
                location: {
                  address: "456 Garden Road, Whitefield",
                  city: "Bangalore",
                  state: "Karnataka",
                  zipCode: "560066",
                },
              },
              customer: {
                id: "user_127",
                firstName: "Vikram",
                lastName: "Singh",
                email: "vikram.singh@example.com",
                phone: "+91 9876543214",
              },
              bookingReference: "TBA005230124005",
              createdAt: "2024-01-18T11:30:00Z",
              updatedAt: "2024-01-22T15:45:00Z",
            },
            {
              id: "booking_006",
              turfId: "turf_003",
              customerId: "user_128",
              bookingDate: "2024-01-27",
              startTime: "14:00",
              endTime: "15:00",
              totalAmount: 2000,
              status: "pending",
              turf: {
                id: "turf_003",
                name: "Champions Cricket Ground",
                category: "cricket",
                location: {
                  address: "789 Stadium Road, Indiranagar",
                  city: "Bangalore",
                  state: "Karnataka",
                  zipCode: "560038",
                },
              },
              customer: {
                id: "user_128",
                firstName: "Meera",
                lastName: "Joshi",
                email: "meera.joshi@example.com",
                phone: "+91 9876543215",
              },
              bookingReference: "TBA006270124006",
              createdAt: "2024-01-23T12:00:00Z",
              updatedAt: "2024-01-23T12:00:00Z",
            },
          ],
          total: 6,
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

      const result: ApiResponse<AdminBookingListResponse> = await response.json();
      return result;
      */
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Sample response
      const sampleResponse: ApiResponse<AdminBookingResponse> = {
        success: true,
        message: "Booking details retrieved successfully",
        data: {
          id: bookingId,
          turfId: "turf_001",
          customerId: "user_123",
          bookingDate: "2024-01-25",
          startTime: "18:00",
          endTime: "19:00",
          totalAmount: 1500,
          status: "pending", // Changed to pending by default
          turf: {
            id: "turf_001",
            name: "Elite Football Arena",
            category: "football",
            location: {
              address: "123 Sports Complex, Koramangala 4th Block",
              city: "Bangalore",
              state: "Karnataka",
              zipCode: "560034",
            },
          },
          customer: {
            id: "user_123",
            firstName: "Rajesh",
            lastName: "Kumar",
            email: "rajesh.kumar@example.com",
            phone: "+91 9876543210",
          },
          bookingReference: "TBA001250124001",
          createdAt: "2024-01-20T10:30:00Z",
          updatedAt: "2024-01-20T10:30:00Z",
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

      const result: ApiResponse<AdminBookingResponse> = await response.json();
      return result;
      */
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Sample response
      const sampleResponse: ApiResponse<AdminBookingResponse> = {
        success: true,
        message: "Booking confirmed successfully",
        data: {
          id: bookingId,
          turfId: "turf_001",
          customerId: "user_123",
          bookingDate: "2024-01-25",
          startTime: "18:00",
          endTime: "19:00",
          totalAmount: 1500,
          status: "confirmed",
          turf: {
            id: "turf_001",
            name: "Elite Football Arena",
            category: "football",
            location: {
              address: "123 Sports Complex, Koramangala 4th Block",
              city: "Bangalore",
              state: "Karnataka",
              zipCode: "560034",
            },
          },
          customer: {
            id: "user_123",
            firstName: "Rajesh",
            lastName: "Kumar",
            email: "rajesh.kumar@example.com",
            phone: "+91 9876543210",
          },
          bookingReference: "TBA001250124001",
          createdAt: "2024-01-20T10:30:00Z",
          updatedAt: new Date().toISOString(),
        },
      };

      return sampleResponse;

      /* 
      // Actual API call (uncomment when backend is ready)
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/confirm`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<AdminBookingResponse> = await response.json();
      return result;
      */
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Sample response
      const sampleResponse: ApiResponse<AdminBookingResponse> = {
        success: true,
        message: "Booking rejected successfully",
        data: {
          id: bookingId,
          turfId: "turf_001",
          customerId: "user_123",
          bookingDate: "2024-01-25",
          startTime: "18:00",
          endTime: "19:00",
          totalAmount: 1500,
          status: "cancelled",
          turf: {
            id: "turf_001",
            name: "Elite Football Arena",
            category: "football",
            location: {
              address: "123 Sports Complex, Koramangala 4th Block",
              city: "Bangalore",
              state: "Karnataka",
              zipCode: "560034",
            },
          },
          customer: {
            id: "user_123",
            firstName: "Rajesh",
            lastName: "Kumar",
            email: "rajesh.kumar@example.com",
            phone: "+91 9876543210",
          },
          bookingReference: "TBA001250124001",
          createdAt: "2024-01-20T10:30:00Z",
          updatedAt: new Date().toISOString(),
        },
      };

      return sampleResponse;

      /* 
      // Actual API call (uncomment when backend is ready)
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/reject`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<AdminBookingResponse> = await response.json();
      return result;
      */
    } catch (error) {
      console.error("Reject booking error:", error);
      return {
        success: false,
        message: "Failed to reject booking. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<AdminBookingResponse>;
    }
  }
}

export const adminBookingService = new AdminBookingService();
export default adminBookingService; 