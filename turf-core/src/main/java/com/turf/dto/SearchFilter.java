package com.turf.dto;

/**
 * DTO for search and filter parameters in API requests.
 *
 * @author Kaviya Ramamoorthy
 */
public class SearchFilter {
    private String keyword;
    private String startDate;
    private String endDate;
    private String status;
    private Integer page;
    private Integer size;

    // Default constructor
    public SearchFilter() {}

    // Getters and setters
    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
} 