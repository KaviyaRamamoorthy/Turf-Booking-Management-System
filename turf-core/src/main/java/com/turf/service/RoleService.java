package com.turf.service;

import com.turf.dto.RoleDto;
import java.util.UUID;
import java.util.List;

/**
 * Service interface for role-related operations.
 *
 * @author Kaviya Ramamoorthy
 */
public interface RoleService {
    RoleDto getRoleById(UUID id);
    RoleDto getRoleByName(String name);
    List<RoleDto> getAllRoles();
    RoleDto createRole(RoleDto roleDto);
    RoleDto updateRole(UUID id, RoleDto roleDto);
    void deleteRole(UUID id);
} 