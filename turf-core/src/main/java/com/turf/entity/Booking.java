package com.turf.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing a booking in the Turf Booking Platform.
 *
 * @author Saravanamuthukumar S
 */
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turf_id", nullable = false)
    private Turf turf;

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;

    // Getters and setters omitted for brevity
} 