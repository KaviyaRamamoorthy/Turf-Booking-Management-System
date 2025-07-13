package com.turf.service;

import com.turf.dto.UserDto;
import com.turf.dto.RoleDto;
import java.util.UUID;
import java.util.List;

/**
 * Service interface for user-related operations.
 *
 * @author Saravanamuthukumar S
 */
public interface UserService {
    UserDto getUserById(UUID id);
    UserDto getUserByEmail(String email);
    List<RoleDto> getUserRolesByEmail(String email);
    List<UserDto> getAllUsers();
    UserDto createUser(UserDto userDto);
    UserDto updateUser(UUID id, UserDto userDto);
    void deleteUser(UUID id);
} 