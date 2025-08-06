package com.turf.dto;

import java.util.UUID;

/**
 * Data Transfer Object for User entity.
 *
 * @author Kaviya Ramamoorthy
 */
public class UserDto {
    private UUID id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String role;
    private boolean isVerified;
    private boolean isActive;
    private String vendorApprovalStatus;
    private String passwordHash;
    // Getters and setters omitted for brevity

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean isVerified) { this.isVerified = isVerified; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getVendorApprovalStatus() { return vendorApprovalStatus; }
    public void setVendorApprovalStatus(String vendorApprovalStatus) { this.vendorApprovalStatus = vendorApprovalStatus; }
}