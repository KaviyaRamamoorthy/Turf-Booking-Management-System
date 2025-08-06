package com.turf.service.impl;

import com.turf.service.BookingService;
import com.turf.dto.BookingDto;
import com.turf.dto.SearchFilter;
import com.turf.dto.StatusCountDto;
import com.turf.entity.Booking;
import com.turf.entity.User;
import com.turf.entity.Turf;
import com.turf.repository.BookingRepository;
import com.turf.repository.UserRepository;
import com.turf.repository.TurfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of BookingService for booking-related operations.
 *
 * @author Kaviya Ramamoorthy
 */
@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TurfRepository turfRepository;

    @Override
    public BookingDto getBookingById(UUID id) {
        Booking booking = bookingRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return convertToDto(booking);
    }

    @Override
    public List<BookingDto> getBookingsByCustomer(UUID customerId, SearchFilter filter) {
        List<Booking> bookings;
        
        if (filter != null && filter.getStatus() != null && !filter.getStatus().isEmpty()) {
            bookings = bookingRepository.findByCustomerIdAndStatus(customerId, filter.getStatus());
        } else if (filter != null && filter.getStartDate() != null && filter.getEndDate() != null) {
            LocalDate startDate = LocalDate.parse(filter.getStartDate());
            LocalDate endDate = LocalDate.parse(filter.getEndDate());
            bookings = bookingRepository.findByCustomerIdAndDateRange(customerId, startDate, endDate);
        } else {
            bookings = bookingRepository.findByCustomerId(customerId);
        }
        
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDto> getBookingsByTurf(UUID turfId, SearchFilter filter) {
        List<Booking> bookings;
        
        if (filter != null) {
            boolean hasStatus = filter.getStatus() != null && !filter.getStatus().isEmpty();
            boolean hasStartDate = filter.getStartDate() != null && !filter.getStartDate().isEmpty();
            boolean hasEndDate = filter.getEndDate() != null && !filter.getEndDate().isEmpty();
            
            if (hasStatus && hasStartDate && hasEndDate) {
                LocalDate startDate = LocalDate.parse(filter.getStartDate());
                LocalDate endDate = LocalDate.parse(filter.getEndDate());
                bookings = bookingRepository.findByTurfIdAndStatusAndDateRange(turfId, filter.getStatus(), startDate, endDate);
            } else if (hasStatus) {
                bookings = bookingRepository.findByTurfIdAndStatus(turfId, filter.getStatus());
            } else if (hasStartDate && hasEndDate) {
                LocalDate startDate = LocalDate.parse(filter.getStartDate());
                LocalDate endDate = LocalDate.parse(filter.getEndDate());
                bookings = bookingRepository.findByTurfIdAndDateRange(turfId, startDate, endDate);
            } else if (hasStartDate) {
                LocalDate date = LocalDate.parse(filter.getStartDate());
                bookings = bookingRepository.findByTurfIdAndBookingDate(turfId, date);
            } else {
                bookings = bookingRepository.findByTurfId(turfId);
            }
        } else {
            bookings = bookingRepository.findByTurfId(turfId);
        }
        
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDto> getAllBookings(SearchFilter filter) {
        List<Booking> bookings;
        
        if (filter != null) {
            boolean hasStatus = filter.getStatus() != null && !filter.getStatus().isEmpty();
            boolean hasStartDate = filter.getStartDate() != null && !filter.getStartDate().isEmpty();
            boolean hasEndDate = filter.getEndDate() != null && !filter.getEndDate().isEmpty();
            
            if (hasStatus && hasStartDate && hasEndDate) {
                LocalDate startDate = LocalDate.parse(filter.getStartDate());
                LocalDate endDate = LocalDate.parse(filter.getEndDate());
                bookings = bookingRepository.findByStatusAndDateRange(filter.getStatus(), startDate, endDate);
            } else if (hasStatus) {
                bookings = bookingRepository.findByStatus(filter.getStatus());
            } else if (hasStartDate && hasEndDate) {
                LocalDate startDate = LocalDate.parse(filter.getStartDate());
                LocalDate endDate = LocalDate.parse(filter.getEndDate());
                bookings = bookingRepository.findByDateRange(startDate, endDate);
            } else {
                bookings = bookingRepository.findAllOrderedByDate();
            }
        } else {
            bookings = bookingRepository.findAllOrderedByDate();
        }
        
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public BookingDto createBooking(BookingDto bookingDto) {
        // Validate input
        if (bookingDto.getTurfId() == null || bookingDto.getCustomerId() == null) {
            throw new IllegalArgumentException("Turf ID and Customer ID are required");
        }

        // Check for overlapping bookings
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
            bookingDto.getTurfId(), 
            bookingDto.getBookingDate(), 
            bookingDto.getStartTime(), 
            bookingDto.getEndTime()
        );

        if (!overlappingBookings.isEmpty()) {
            throw new RuntimeException("Time slot is already booked for this turf");
        }

        // Fetch customer and turf entities
        User customer = userRepository.findById(bookingDto.getCustomerId())
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Turf turf = turfRepository.findById(bookingDto.getTurfId())
            .orElseThrow(() -> new RuntimeException("Turf not found"));

        // Calculate total amount (hours * price per hour)
        long hours = java.time.Duration.between(bookingDto.getStartTime(), bookingDto.getEndTime()).toHours();
        BigDecimal totalAmount = turf.getPricePerHour().multiply(BigDecimal.valueOf(hours));

        // Create booking entity
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setTurf(turf);
        booking.setBookingDate(bookingDto.getBookingDate());
        booking.setStartTime(bookingDto.getStartTime());
        booking.setEndTime(bookingDto.getEndTime());
        booking.setTotalAmount(totalAmount);
        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());

        // Save booking
        Booking savedBooking = bookingRepository.save(booking);
        return convertToDto(savedBooking);
    }

    @Override
    public BookingDto updateBookingStatus(UUID id, String status) {
        Booking booking = bookingRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDto(updatedBooking);
    }

    @Override
    public void deleteBooking(UUID id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }

    // Helper method to convert Booking entity to BookingDto
    private BookingDto convertToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setCustomerId(booking.getCustomer().getId());
        dto.setTurfId(booking.getTurf().getId());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        
        // Set turf information
        if (booking.getTurf() != null) {
            dto.setTurfName(booking.getTurf().getName());
            dto.setTurfLocation(booking.getTurf().getLocation());
            if (booking.getTurf().getCategory() != null) {
                dto.setCategoryName(booking.getTurf().getCategory().getName());
            }
        }
        
        // Set customer information
        if (booking.getCustomer() != null) {
            dto.setCustomerName(booking.getCustomer().getFullName());
            dto.setCustomerEmail(booking.getCustomer().getEmail());
        }
        
        return dto;
    }

    @Override
    public StatusCountDto getStatusCounts() {
        long pending = bookingRepository.countByStatus("PENDING");
        long confirmed = bookingRepository.countByStatus("CONFIRMED");
        long cancelled = bookingRepository.countByStatus("CANCELLED");
        long completed = bookingRepository.countByStatus("COMPLETED");
        long total = bookingRepository.countAllBookings();
        
        return new StatusCountDto(pending, confirmed, cancelled, completed, total);
    }
} 