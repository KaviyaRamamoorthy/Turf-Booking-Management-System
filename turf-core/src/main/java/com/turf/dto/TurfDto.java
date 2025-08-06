package com.turf.dto;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

/**
 * Data Transfer Object for Turf entity.
 *
 * @author Kaviya Ramamoorthy
 */
public class TurfDto {
    private UUID id;
    private String name;
    private UUID vendorId;
    private UUID categoryId;
    private String location;
    private String description;
    private BigDecimal pricePerHour;
    private LocalTime openTime;
    private LocalTime closeTime;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public UUID getVendorId() { return vendorId; }
    public void setVendorId(UUID vendorId) { this.vendorId = vendorId; }
    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(BigDecimal pricePerHour) { this.pricePerHour = pricePerHour; }
    public LocalTime getOpenTime() { return openTime; }
    public void setOpenTime(LocalTime openTime) { this.openTime = openTime; }
    public LocalTime getCloseTime() { return closeTime; }
    public void setCloseTime(LocalTime closeTime) { this.closeTime = closeTime; }
} 