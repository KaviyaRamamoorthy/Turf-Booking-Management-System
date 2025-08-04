package com.turf.repository;

import com.turf.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Repository for Category entity.
 *
 * @author Kaviya Ramamoorthy
 */
public interface CategoryRepository extends JpaRepository<Category, UUID> {
} 