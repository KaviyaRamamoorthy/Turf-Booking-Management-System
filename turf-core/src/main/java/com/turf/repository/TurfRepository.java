package com.turf.repository;

import com.turf.entity.Turf;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Repository for Turf entity.
 *
 * @author Kaviya Ramamoorthy
 */
public interface TurfRepository extends JpaRepository<Turf, UUID> {
} 