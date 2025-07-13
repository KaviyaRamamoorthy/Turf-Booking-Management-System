package com.turf.service;

import com.turf.dto.CategoryDto;
import java.util.UUID;
import java.util.List;

/**
 * Service interface for category-related operations.
 *
 * @author Saravanamuthukumar S
 */
public interface CategoryService {
    CategoryDto getCategoryById(UUID id);
    List<CategoryDto> getAllCategories();
    CategoryDto createCategory(CategoryDto categoryDto);
    CategoryDto updateCategory(UUID id, CategoryDto categoryDto);
    void deleteCategory(UUID id);
} 