package com.turf.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing a sports turf in the Turf Booking Platform.
 *
 * @author Saravanamuthukumar S
 */
@Entity
@Table(name = "turfs")
public class Turf {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private User vendor;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private String location;
    private String description;
    private BigDecimal pricePerHour;
    private LocalTime openTime;
    private LocalTime closeTime;
    private LocalDateTime createdAt;

    // Getters and setters omitted for brevity
} 