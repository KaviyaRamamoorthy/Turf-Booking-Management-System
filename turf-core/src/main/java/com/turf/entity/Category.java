package com.turf.entity;

import jakarta.persistence.*;
import java.util.UUID;

/**
 * Entity representing a category (e.g., Football, Cricket) in the Turf Booking Platform.
 *
 * @author Saravanamuthukumar S
 */
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    // Getters and setters omitted for brevity
} 