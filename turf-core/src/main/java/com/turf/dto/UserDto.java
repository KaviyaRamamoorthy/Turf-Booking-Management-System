package com.turf.dto;

import java.time.LocalDate;
import java.util.UUID;
import java.util.List;

/**
 * Data Transfer Object for User entity.
 *
 * @author Saravanamuthukumar S
 */
public class UserDto {
    private UUID id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate dob;
    private String doorNo;
    private String street;
    private String locality;
    private String location;
    private boolean isVerified;
    private boolean isActive;
    private List<RoleDto> roles;
    private String role;
    private String vendorApprovalStatus;
    // Getters and setters omitted for brevity

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public String getDoorNo() { return doorNo; }
    public void setDoorNo(String doorNo) { this.doorNo = doorNo; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean isVerified) { this.isVerified = isVerified; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }
    public List<RoleDto> getRoles() { return roles; }
    public void setRoles(List<RoleDto> roles) { this.roles = roles; }
    public String getPasswordHash() { return null; } // Add this if needed for password
    public void setPasswordHash(String passwordHash) { /* implement if needed */ }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getVendorApprovalStatus() { return vendorApprovalStatus; }
    public void setVendorApprovalStatus(String vendorApprovalStatus) { this.vendorApprovalStatus = vendorApprovalStatus; }
}