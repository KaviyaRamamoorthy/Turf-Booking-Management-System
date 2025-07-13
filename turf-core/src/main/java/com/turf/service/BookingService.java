package com.turf.service;

import com.turf.dto.BookingDto;
import com.turf.dto.SearchFilter;
import java.util.UUID;
import java.util.List;

/**
 * Service interface for booking-related operations.
 *
 * @author Saravanamuthukumar S
 */
public interface BookingService {
    BookingDto getBookingById(UUID id);
    List<BookingDto> getBookingsByCustomer(UUID customerId, SearchFilter filter);
    List<BookingDto> getBookingsByTurf(UUID turfId, SearchFilter filter);
    BookingDto createBooking(BookingDto bookingDto);
    BookingDto updateBookingStatus(UUID id, String status);
    void deleteBooking(UUID id);
} 