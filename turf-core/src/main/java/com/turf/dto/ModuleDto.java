package com.turf.dto;

import java.util.UUID;

/**
 * Data Transfer Object for Module entity.
 * @author Kaviya Ramamoorthy
 */
public class ModuleDto {
    private UUID id;
    private String name;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
} 