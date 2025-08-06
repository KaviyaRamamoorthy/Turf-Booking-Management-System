package com.turf.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

/**
 * Data Transfer Object for Booking entity.
 *
 * @author Kaviya Ramamoorthy
 */
public class BookingDto {
    private UUID id;
    private UUID customerId;
    private UUID turfId;
    private String turfName;
    private String turfLocation;
    private String categoryName;
    private String customerName;
    private String customerEmail;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal totalAmount;
    private String status;

    // Constructors
    public BookingDto() {}

    public BookingDto(UUID customerId, UUID turfId, LocalDate bookingDate, 
                      LocalTime startTime, LocalTime endTime, BigDecimal totalAmount, String status) {
        this.customerId = customerId;
        this.turfId = turfId;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalAmount = totalAmount;
        this.status = status;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }

    public UUID getTurfId() { return turfId; }
    public void setTurfId(UUID turfId) { this.turfId = turfId; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTurfName() { return turfName; }
    public void setTurfName(String turfName) { this.turfName = turfName; }

    public String getTurfLocation() { return turfLocation; }
    public void setTurfLocation(String turfLocation) { this.turfLocation = turfLocation; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
} 