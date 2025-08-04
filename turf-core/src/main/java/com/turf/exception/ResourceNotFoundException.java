package com.turf.exception;

/**
 * Exception thrown when a requested resource is not found.
 *
 * @author Kaviya Ramamoorthy
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
} 