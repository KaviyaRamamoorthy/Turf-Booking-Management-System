package com.turf.dto;

import java.util.UUID;

/**
 * Data Transfer Object for Category entity.
 *
 * @author Kaviya Ramamoorthy
 */
public class CategoryDto {
    private UUID id;
    private String name;
    private String description;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
} 