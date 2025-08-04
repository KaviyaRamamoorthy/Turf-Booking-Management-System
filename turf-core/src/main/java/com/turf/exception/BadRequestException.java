package com.turf.exception;

/**
 * Exception thrown for bad requests.
 *
 * @author Kaviya Ramamoorthy
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
} 