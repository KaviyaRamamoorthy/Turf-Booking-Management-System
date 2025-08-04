package com.turf.exception;

/**
 * Exception thrown for unauthorized access.
 *
 * @author Kaviya Ramamoorthy
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
} 