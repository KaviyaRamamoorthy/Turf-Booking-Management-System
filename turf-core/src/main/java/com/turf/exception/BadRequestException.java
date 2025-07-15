package com.turf.exception;

/**
 * Exception thrown for bad requests.
 *
 * @author Saravanamuthukumar S
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
} 