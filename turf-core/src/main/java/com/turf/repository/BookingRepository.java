package com.turf.repository;

import com.turf.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Booking entity.
 *
 * @author Kaviya Ramamoorthy
 */
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    
    // Find booking by ID with joins
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE b.id = :id")
    Optional<Booking> findByIdWithDetails(@Param("id") UUID id);
    
    // Find bookings by customer ID with joins
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE c.id = :customerId")
    List<Booking> findByCustomerId(@Param("customerId") UUID customerId);
    
    // Find bookings by turf ID with joins
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE t.id = :turfId")
    List<Booking> findByTurfId(@Param("turfId") UUID turfId);
    
    // Find bookings by turf and date with joins
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE t.id = :turfId AND b.bookingDate = :bookingDate")
    List<Booking> findByTurfIdAndBookingDate(@Param("turfId") UUID turfId, @Param("bookingDate") LocalDate bookingDate);
    
    // Find bookings by customer with status filter
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE c.id = :customerId AND b.status = :status")
    List<Booking> findByCustomerIdAndStatus(@Param("customerId") UUID customerId, @Param("status") String status);
    
    // Check for overlapping bookings for the same turf on the same date
    @Query("SELECT b FROM Booking b WHERE b.turf.id = :turfId AND b.bookingDate = :bookingDate " +
           "AND ((b.startTime <= :startTime AND b.endTime > :startTime) OR " +
           "(b.startTime < :endTime AND b.endTime >= :endTime) OR " +
           "(b.startTime >= :startTime AND b.endTime <= :endTime)) " +
           "AND b.status != 'CANCELLED'")
    List<Booking> findOverlappingBookings(@Param("turfId") UUID turfId, 
                                        @Param("bookingDate") LocalDate bookingDate,
                                        @Param("startTime") LocalTime startTime, 
                                        @Param("endTime") LocalTime endTime);
    
    // Find bookings by date range
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE c.id = :customerId AND b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByCustomerIdAndDateRange(@Param("customerId") UUID customerId,
                                             @Param("startDate") LocalDate startDate,
                                             @Param("endDate") LocalDate endDate);

    // Find turf bookings by status
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE t.id = :turfId AND b.status = :status")
    List<Booking> findByTurfIdAndStatus(@Param("turfId") UUID turfId, @Param("status") String status);

    // Find turf bookings by date range
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE t.id = :turfId AND b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByTurfIdAndDateRange(@Param("turfId") UUID turfId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);

    // Find turf bookings by status and date range
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE t.id = :turfId AND b.status = :status " +
           "AND b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByTurfIdAndStatusAndDateRange(@Param("turfId") UUID turfId,
                                                   @Param("status") String status,
                                                   @Param("startDate") LocalDate startDate,
                                                   @Param("endDate") LocalDate endDate);

    // Find all bookings by status
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE b.status = :status")
    List<Booking> findByStatus(@Param("status") String status);

    // Find all bookings by date range
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByDateRange(@Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate);

    // Find all bookings by status and date range
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "WHERE b.status = :status AND b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByStatusAndDateRange(@Param("status") String status,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);

    // Get all bookings ordered by booking date
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer c " +
           "JOIN FETCH b.turf t " +
           "LEFT JOIN FETCH t.category " +
           "ORDER BY b.bookingDate DESC, b.startTime DESC")
    List<Booking> findAllOrderedByDate();

    // Count bookings by status
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countByStatus(@Param("status") String status);

    // Count all bookings
    @Query("SELECT COUNT(b) FROM Booking b")
    long countAllBookings();
} 