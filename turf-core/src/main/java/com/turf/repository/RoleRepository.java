package com.turf.repository;

import com.turf.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

/**
 * Repository for Role entity.
 *
 * @author Saravanamuthukumar S
 */
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(String name);
    List<Role> findByNameIn(List<String> names);
}