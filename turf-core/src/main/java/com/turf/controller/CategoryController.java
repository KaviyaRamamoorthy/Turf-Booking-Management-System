package com.turf.controller;

import com.turf.constants.CommonConstants;
import com.turf.dto.CategoryDto;
import com.turf.exception.BadRequestException;
import com.turf.exception.ResourceNotFoundException;
import com.turf.service.CategoryService;
import com.turf.util.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

/**
 * Controller for category management endpoints (admin only).
 *
 * @author Kaviya Ramamoorthy
 */
@RestController
@RequestMapping("/api/categories")
@PreAuthorize("hasRole('ADMIN')")
public class CategoryController {
    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@RequestBody CategoryDto categoryDto) {
        if (categoryDto == null || categoryDto.getName() == null) throw new BadRequestException("Category name required.");
        CategoryDto created = categoryService.createCategory(categoryDto);
        logger.info("Admin created category: {}", categoryDto.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Category created.", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        List<CategoryDto> categories = categoryService.getAllCategories();
        logger.info("Admin fetched all categories.");
        return ResponseEntity.ok(new ApiResponse<>(true, CommonConstants.MSG_SUCCESS, categories));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(@PathVariable UUID id, @RequestBody CategoryDto categoryDto) {
        if (categoryDto == null || categoryDto.getName() == null) throw new BadRequestException("Category name required.");
        CategoryDto updated = categoryService.updateCategory(id, categoryDto);
        logger.info("Admin updated category: {}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Category updated.", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        logger.info("Admin deleted category: {}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Category deleted.", null));
    }
} 