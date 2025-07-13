package com.turf.util;

/**
 * Standard API response wrapper for Turf Booking Platform.
 *
 * @author Saravanamuthukumar S
 */
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public ApiResponse() {}

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Getters and setters omitted for brevity
} 