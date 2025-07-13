package com.turf.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Set;

/**
 * Entity representing a user in the Turf Booking Platform.
 *
 * @author Saravanamuthukumar S
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String phoneNumber;

    private LocalDate dob;
    private String doorNo;
    private String street;
    private String locality;
    private String location;

    private boolean isVerified;
    private boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String vendorApprovalStatus; // PENDING, APPROVED, REJECTED

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    // Getters and setters omitted for brevity

    public String getEmail() {
        return email;
    }
    public String getPasswordHash() {
        return passwordHash;
    }
    public boolean isActive() {
        return isActive;
    }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }

    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setVerified(boolean isVerified) { this.isVerified = isVerified; }
    public void setActive(boolean isActive) { this.isActive = isActive; }

    public String getVendorApprovalStatus() { return vendorApprovalStatus; }
    public void setVendorApprovalStatus(String vendorApprovalStatus) { this.vendorApprovalStatus = vendorApprovalStatus; }
}