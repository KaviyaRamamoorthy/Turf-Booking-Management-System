package com.turf.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.turf.dto.RoleDto;
import com.turf.dto.UserDto;
import com.turf.entity.Role;
import com.turf.entity.User;
import com.turf.repository.RoleRepository;
import com.turf.repository.UserRepository;
import com.turf.service.UserService;

/**
 * Implementation of UserService for user-related operations.
 *
 * @author Saravanamuthukumar S
 */
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserDto getUserById(UUID id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;
        return convertToDto(user);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return null;
        return convertToDto(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Override
    public UserDto createUser(UserDto userDto) {
        User user = new User();
        user.setFullName(userDto.getFullName());
        user.setEmail(userDto.getEmail());
        user.setPasswordHash(userDto.getPasswordHash());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setDob(userDto.getDob());
        user.setDoorNo(userDto.getDoorNo());
        user.setStreet(userDto.getStreet());
        user.setLocality(userDto.getLocality());
        user.setLocation(userDto.getLocation());
        user.setVerified(userDto.isVerified());
        user.setActive(userDto.isActive());
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        
        // Role assignment
        if (userDto.getRole() != null) {
            Role role = roleRepository.findByName(userDto.getRole()).orElse(null);
            if (role != null) {
                java.util.HashSet<Role> roles = new java.util.HashSet<>();
                roles.add(role);
                user.setRoles(roles);
                // Vendor approval logic
                if ("VENDOR".equalsIgnoreCase(role.getName())) {
                    user.setVendorApprovalStatus("PENDING");
                    user.setActive(false); // Vendor not active until approved
                } else {
                    user.setVendorApprovalStatus(null);
                }
            } else {
                // If role not found, assign default CUSTOMER role
                Role defaultRole = roleRepository.findByName("CUSTOMER").orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("CUSTOMER");
                    return roleRepository.save(newRole);
                });
                java.util.HashSet<Role> roles = new java.util.HashSet<>();
                roles.add(defaultRole);
                user.setRoles(roles);
            }
        } else {
            // No role specified, assign default CUSTOMER role
            Role defaultRole = roleRepository.findByName("CUSTOMER").orElseGet(() -> {
                Role newRole = new Role();
                newRole.setName("CUSTOMER");
                return roleRepository.save(newRole);
            });
            java.util.HashSet<Role> roles = new java.util.HashSet<>();
            roles.add(defaultRole);
            user.setRoles(roles);
        }
        
        user = userRepository.save(user);
        return convertToDto(user);
    }

    @Override
    public UserDto updateUser(UUID id, UserDto userDto) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) return null;
        
        // Update fields
        if (userDto.getFullName() != null) existingUser.setFullName(userDto.getFullName());
        if (userDto.getPhoneNumber() != null) existingUser.setPhoneNumber(userDto.getPhoneNumber());
        if (userDto.getDob() != null) existingUser.setDob(userDto.getDob());
        if (userDto.getDoorNo() != null) existingUser.setDoorNo(userDto.getDoorNo());
        if (userDto.getStreet() != null) existingUser.setStreet(userDto.getStreet());
        if (userDto.getLocality() != null) existingUser.setLocality(userDto.getLocality());
        if (userDto.getLocation() != null) existingUser.setLocation(userDto.getLocation());
        if (userDto.getPasswordHash() != null) existingUser.setPasswordHash(userDto.getPasswordHash());
        
        existingUser.setVerified(userDto.isVerified());
        existingUser.setActive(userDto.isActive());
        existingUser.setUpdatedAt(java.time.LocalDateTime.now());
        
        // Update vendor approval status if provided
        if (userDto.getVendorApprovalStatus() != null) {
            existingUser.setVendorApprovalStatus(userDto.getVendorApprovalStatus());
        }
        
        existingUser = userRepository.save(existingUser);
        return convertToDto(existingUser);
    }

    @Override
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<RoleDto> getUserRolesByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getRoles() == null) return List.of();
        return user.getRoles().stream()
            .map(role -> {
                RoleDto dto = new RoleDto();
                dto.setId(role.getId());
                dto.setName(role.getName());
                return dto;
            })
            .collect(Collectors.toList());
    }

    /**
     * Convert User entity to UserDto
     */
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setDob(user.getDob());
        dto.setDoorNo(user.getDoorNo());
        dto.setStreet(user.getStreet());
        dto.setLocality(user.getLocality());
        dto.setLocation(user.getLocation());
        dto.setVerified(user.isVerified());
        dto.setActive(user.isActive());
        dto.setVendorApprovalStatus(user.getVendorApprovalStatus());
        
        // Convert roles
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            List<RoleDto> roleDtos = user.getRoles().stream()
                .map(role -> {
                    RoleDto roleDto = new RoleDto();
                    roleDto.setId(role.getId());
                    roleDto.setName(role.getName());
                    return roleDto;
                })
                .collect(Collectors.toList());
            dto.setRoles(roleDtos);
            
            // Set primary role (first role)
            if (!roleDtos.isEmpty()) {
                dto.setRole(roleDtos.get(0).getName());
            }
        }
        
        return dto;
    }
}