package com.turf.constants;

/**
 * Common constants used across the Turf Booking Platform.
 *
 * @author Kaviya Ramamoorthy
 */
public class CommonConstants {
    private CommonConstants() {}

    // User roles
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_VENDOR = "VENDOR";
    public static final String ROLE_CUSTOMER = "CUSTOMER";

    // Booking statuses
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_CONFIRMED = "CONFIRMED";
    public static final String STATUS_CANCELLED = "CANCELLED";

    // JWT
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";

    // OTP
    public static final int OTP_EXPIRY_MINUTES = 5;
    public static final String OTP_PURPOSE_SIGNUP = "SIGNUP";
    public static final String OTP_PURPOSE_FORGOT_PASSWORD = "FORGOT_PASSWORD";

    // Messages
    public static final String MSG_USER_NOT_FOUND = "User not found.";
    public static final String MSG_INVALID_CREDENTIALS = "Invalid credentials.";
    public static final String MSG_OTP_EXPIRED = "OTP has expired.";
    public static final String MSG_OTP_INVALID = "Invalid OTP.";
    public static final String MSG_BOOKING_NOT_FOUND = "Booking not found.";
    public static final String MSG_TURF_NOT_FOUND = "Turf not found.";
    public static final String MSG_CATEGORY_NOT_FOUND = "Category not found.";
    public static final String MSG_ROLE_NOT_FOUND = "Role not found.";
    public static final String MSG_ACCESS_DENIED = "Access denied.";
    public static final String MSG_SUCCESS = "Success.";
    public static final String MSG_ERROR = "An error occurred.";
} 