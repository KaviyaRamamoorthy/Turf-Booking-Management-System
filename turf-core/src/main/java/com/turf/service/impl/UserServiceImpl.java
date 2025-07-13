package com.turf.service.impl;

import com.turf.service.UserService;
import com.turf.dto.UserDto;
import com.turf.dto.RoleDto;
import com.turf.entity.User;
import com.turf.entity.Role;
import com.turf.repository.UserRepository;
import com.turf.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
        // Implementation goes here
        return null;
    }

    @Override
    public UserDto getUserByEmail(String email) {
        // Implementation goes here
        return null;
    }

    @Override
    public List<UserDto> getAllUsers() {
        // Implementation goes here
        return null;
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
            }
        }
        user = userRepository.save(user);
        userDto.setId(user.getId());
        return userDto;
    }

    @Override
    public UserDto updateUser(UUID id, UserDto userDto) {
        // Implementation goes here
        return null;
    }

    @Override
    public void deleteUser(UUID id) {
        // Implementation goes here
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
}