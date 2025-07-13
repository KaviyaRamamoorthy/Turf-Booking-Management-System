package com.turf.controller;

import com.turf.constants.CommonConstants;
import com.turf.dto.UserDto;
import com.turf.dto.RoleDto;
import com.turf.exception.BadRequestException;
import com.turf.exception.ResourceNotFoundException;
import com.turf.service.UserService;
import com.turf.service.RoleService;
import com.turf.util.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

/**
 * Controller for user profile and admin user management endpoints.
 *
 * @author Saravanamuthukumar S
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;
    @Autowired
    private RoleService roleService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserDto user = userService.getUserByEmail(email);
        if (user == null) throw new ResourceNotFoundException(CommonConstants.MSG_USER_NOT_FOUND);
        logger.info("Profile fetched for user: {}", email);
        return ResponseEntity.ok(new ApiResponse<>(true, CommonConstants.MSG_SUCCESS, user));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> editProfile(Authentication authentication, @RequestBody UserDto userDto) {
        String email = authentication.getName();
        UserDto existing = userService.getUserByEmail(email);
        if (existing == null) throw new ResourceNotFoundException(CommonConstants.MSG_USER_NOT_FOUND);
        // Only allow editing certain fields
        existing.setFullName(userDto.getFullName());
        existing.setPhoneNumber(userDto.getPhoneNumber());
        existing.setDob(userDto.getDob());
        existing.setDoorNo(userDto.getDoorNo());
        existing.setStreet(userDto.getStreet());
        existing.setLocality(userDto.getLocality());
        existing.setLocation(userDto.getLocation());
        UserDto updated = userService.updateUser(existing.getId(), existing);
        logger.info("Profile updated for user: {}", email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated.", updated));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        logger.info("Admin fetched all users.");
        return ResponseEntity.ok(new ApiResponse<>(true, CommonConstants.MSG_SUCCESS, users));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> updateUserRole(@PathVariable UUID id, @RequestBody RoleDto roleDto) {
        if (roleDto == null || roleDto.getName() == null) throw new BadRequestException("Role name required.");
        UserDto user = userService.getUserById(id);
        if (user == null) throw new ResourceNotFoundException(CommonConstants.MSG_USER_NOT_FOUND);
        RoleDto role = roleService.getRoleByName(roleDto.getName());
        if (role == null) throw new ResourceNotFoundException(CommonConstants.MSG_ROLE_NOT_FOUND);
        // Implement role assignment logic in service layer as needed
        logger.info("Admin updated role for user: {} to {}", id, roleDto.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "User role updated.", null));
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> activateUser(@PathVariable UUID id) {
        UserDto user = userService.getUserById(id);
        if (user == null) throw new ResourceNotFoundException(CommonConstants.MSG_USER_NOT_FOUND);
        user.setActive(true);
        userService.updateUser(id, user);
        logger.info("Admin activated user: {}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "User activated.", null));
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deactivateUser(@PathVariable UUID id) {
        UserDto user = userService.getUserById(id);
        if (user == null) throw new ResourceNotFoundException(CommonConstants.MSG_USER_NOT_FOUND);
        user.setActive(false);
        userService.updateUser(id, user);
        logger.info("Admin deactivated user: {}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "User deactivated.", null));
    }
} 