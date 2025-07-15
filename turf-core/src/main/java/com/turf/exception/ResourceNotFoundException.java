package com.turf.exception;

/**
 * Exception thrown when a requested resource is not found.
 *
 * @author Saravanamuthukumar S
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
} 