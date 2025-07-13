package com.turf.repository;

import com.turf.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Repository for UserRole entity.
 *
 * @author Saravanamuthukumar S
 */
public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {
} 