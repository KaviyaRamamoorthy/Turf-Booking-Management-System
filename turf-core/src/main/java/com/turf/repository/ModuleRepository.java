package com.turf.repository;

import com.turf.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Repository for Module entity.
 * @author Saravanamuthukumar S
 */
public interface ModuleRepository extends JpaRepository<Module, UUID> {
    boolean existsByName(String name);
} 