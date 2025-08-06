package com.turf.service;

/**
 * Service interface for OTP operations (generation, validation, removal).
 *
 * @author Kaviya Ramamoorthy
 */
public interface OtpService {
    void generateOtp(String email, String purpose);
    boolean validateOtp(String email, String otp, String purpose);
    void removeOtp(String email, String purpose);
} 