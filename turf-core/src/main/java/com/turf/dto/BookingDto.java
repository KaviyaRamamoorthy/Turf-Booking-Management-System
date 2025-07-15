package com.turf.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

/**
 * Data Transfer Object for Booking entity.
 *
 * @author Saravanamuthukumar S
 */
public class BookingDto {
    private UUID id;
    private UUID customerId;
    private UUID turfId;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal totalAmount;
    private String status;
    // Getters and setters omitted for brevity
} 