package com.turf.dto;

import java.time.LocalDate;

/**
 * DTO for search and filter parameters in API requests.
 *
 * @author Saravanamuthukumar S
 */
public class SearchFilter {
    private String keyword;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Integer page;
    private Integer size;
    // Getters and setters omitted for brevity
} 