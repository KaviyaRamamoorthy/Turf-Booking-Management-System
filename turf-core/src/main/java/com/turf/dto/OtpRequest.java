package com.turf.dto;

/**
 * DTO for OTP verification and password reset requests.
 *
 * @author Kaviya Ramamoorthy
 */
public class OtpRequest {
    private String email;
    private String otp;
    private String newPassword; // For reset-password
    private String purpose;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
} 