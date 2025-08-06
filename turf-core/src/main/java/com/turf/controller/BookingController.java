package com.turf.controller;

import com.turf.dto.BookingDto;
import com.turf.dto.SearchFilter;
import com.turf.dto.StatusCountDto;
import com.turf.dto.UserDto;
import com.turf.service.BookingService;
import com.turf.service.UserService;
import com.turf.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for booking operations.
 *
 * @author Kaviya Ramamoorthy
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    /**
     * Create a new booking (Customer and Admin)
     */
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @RequestBody BookingDto bookingDto,
            Authentication authentication) {
        try {
            // Extract user info from JWT token
            String email = authentication.getName();
            UserDto user = userService.getUserByEmail(email);
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            
            // Set the customer ID: use provided customerId or authenticated user's ID
            if (bookingDto.getCustomerId() == null) {
                bookingDto.setCustomerId(user.getId());
            }
            
            BookingDto createdBooking = bookingService.createBooking(bookingDto);
            
            ApiResponse<BookingDto> response = new ApiResponse<>(
                true, 
                "Booking created successfully", 
                createdBooking
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                "Invalid booking data: " + e.getMessage(), 
                null
            );
            return ResponseEntity.badRequest().body(response);
            
        } catch (RuntimeException e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                e.getMessage(), 
                null
            );
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                "Failed to create booking: " + e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get current user's bookings (Customer and Admin)
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getUserBookings(
            Authentication authentication,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            // Extract customer ID from JWT token
            String email = authentication.getName();
            UserDto user = userService.getUserByEmail(email);
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            
            SearchFilter filter = new SearchFilter();
            filter.setStatus(status);
            filter.setStartDate(startDate);
            filter.setEndDate(endDate);
            
            List<BookingDto> bookings = bookingService.getBookingsByCustomer(user.getId(), filter);
            
            ApiResponse<List<BookingDto>> response = new ApiResponse<>(
                true, 
                "User bookings retrieved successfully", 
                bookings
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            ApiResponse<List<BookingDto>> response = new ApiResponse<>(
                false, 
                "Failed to retrieve bookings: " + e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get bookings for a specific turf and date (for availability checking)
     */
    @GetMapping("/turf/{turfId}/date/{date}")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getBookingsForDate(
            @PathVariable String turfId,
            @PathVariable String date) {
        try {
            UUID turfUuid = UUID.fromString(turfId);
            
            SearchFilter filter = new SearchFilter();
            filter.setStartDate(date);
            
            List<BookingDto> bookings = bookingService.getBookingsByTurf(turfUuid, filter);
            
            ApiResponse<List<BookingDto>> response = new ApiResponse<>(
                true, 
                "Bookings for date retrieved successfully", 
                bookings
            );
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            ApiResponse<List<BookingDto>> response = new ApiResponse<>(
                false, 
                "Invalid turf ID format", 
                null
            );
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            ApiResponse<List<BookingDto>> response = new ApiResponse<>(
                false, 
                "Failed to retrieve bookings: " + e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get all bookings for a specific turf (Admin access for turf management)
     */
    @GetMapping("/turf/{turfId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getTurfBookings(
            @PathVariable String turfId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            UUID turfUuid = UUID.fromString(turfId);
            
            SearchFilter filter = new SearchFilter();
            filter.setStatus(status);
            filter.setStartDate(startDate);
            filter.setEndDate(endDate);
            
            List<BookingDto> bookings = bookingService.getBookingsByTurf(turfUuid, filter);
            
            ApiResponse<List<BookingDto>> response = new ApiResponse<>(
                true, 
                "Turf bookings retrieved successfully", 
                bookings
            );
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            ApiResponse<List<BookingDto>> response = new ApiResponse<>(
                false, 
                "Invalid turf ID format", 
                null
            );
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            ApiResponse<List<BookingDto>> response = new ApiResponse<>(
                false, 
                "Failed to retrieve turf bookings: " + e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get all bookings across the system (Admin only)
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        try {
            SearchFilter filter = new SearchFilter();
            filter.setStatus(status);
            filter.setStartDate(startDate);
            filter.setEndDate(endDate);
            filter.setPage(page);
            filter.setSize(size);
            
            List<BookingDto> bookings = bookingService.getAllBookings(filter);
            
            ApiResponse<List<BookingDto>> response = new ApiResponse<>(
                true, 
                "All bookings retrieved successfully", 
                bookings
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            ApiResponse<List<BookingDto>> response = new ApiResponse<>(
                false, 
                "Failed to retrieve all bookings: " + e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Complete a booking (Admin only)
     */
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> completeBooking(@PathVariable String id) {
        try {
            UUID bookingId = UUID.fromString(id);
            BookingDto updatedBooking = bookingService.updateBookingStatus(bookingId, "COMPLETED");
            
            ApiResponse<BookingDto> response = new ApiResponse<>(
                true, 
                "Booking completed successfully", 
                updatedBooking
            );
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                "Invalid booking ID format", 
                null
            );
            return ResponseEntity.badRequest().body(response);
            
        } catch (RuntimeException e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            
        } catch (Exception e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                "Failed to complete booking: " + e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get booking by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> getBookingById(@PathVariable String id) {
        try {
            UUID bookingId = UUID.fromString(id);
            BookingDto booking = bookingService.getBookingById(bookingId);
            
            ApiResponse<BookingDto> response = new ApiResponse<>(
                true, 
                "Booking retrieved successfully", 
                booking
            );
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                "Invalid booking ID format", 
                null
            );
            return ResponseEntity.badRequest().body(response);
            
        } catch (RuntimeException e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            
        } catch (Exception e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                "Failed to retrieve booking: " + e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Cancel a booking (Customer only)
     */
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @PathVariable String id,
            Authentication authentication) {
        try {
            UUID bookingId = UUID.fromString(id);
            BookingDto updatedBooking = bookingService.updateBookingStatus(bookingId, "CANCELLED");
            
            ApiResponse<BookingDto> response = new ApiResponse<>(
                true, 
                "Booking cancelled successfully", 
                updatedBooking
            );
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                "Invalid booking ID format", 
                null
            );
            return ResponseEntity.badRequest().body(response);
            
        } catch (RuntimeException e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            
        } catch (Exception e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                "Failed to cancel booking: " + e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Update booking status (Admin only)
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> updateBookingStatus(
            @PathVariable String id,
            @RequestParam String status) {
        try {
            UUID bookingId = UUID.fromString(id);
            BookingDto updatedBooking = bookingService.updateBookingStatus(bookingId, status);
            
            ApiResponse<BookingDto> response = new ApiResponse<>(
                true, 
                "Booking status updated successfully", 
                updatedBooking
            );
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                "Invalid booking ID format", 
                null
            );
            return ResponseEntity.badRequest().body(response);
            
        } catch (RuntimeException e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            
        } catch (Exception e) {
            ApiResponse<BookingDto> response = new ApiResponse<>(
                false, 
                "Failed to update booking status: " + e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get booking status counts (Admin only)
     */
    @GetMapping("/status-counts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StatusCountDto>> getStatusCounts() {
        try {
            StatusCountDto statusCounts = bookingService.getStatusCounts();
            
            ApiResponse<StatusCountDto> response = new ApiResponse<>(
                true, 
                "Status counts retrieved successfully", 
                statusCounts
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            ApiResponse<StatusCountDto> response = new ApiResponse<>(
                false, 
                "Failed to retrieve status counts: " + e.getMessage(), 
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}