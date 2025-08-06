package com.turf.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.turf.dto.UserDto;
import com.turf.entity.User;
import com.turf.repository.UserRepository;
import com.turf.service.UserService;

/**
 * Implementation of UserService for user-related operations.
 *
 * @author Kaviya Ramamoorthy
 */
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
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
        user.setRole(userDto.getRole() != null ? userDto.getRole() : "CUSTOMER");
        user.setVerified(userDto.isVerified());
        user.setActive(userDto.isActive());
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        
        // Vendor approval logic
        if ("VENDOR".equalsIgnoreCase(user.getRole())) {
            user.setVendorApprovalStatus("PENDING");
            user.setActive(false); // Vendor not active until approved
        } else {
            user.setVendorApprovalStatus(null);
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
        if (userDto.getRole() != null) existingUser.setRole(userDto.getRole());
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
    public String getUserRoleByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return "CUSTOMER";
        return user.getRole();
    }

    @Override
    public boolean isUserVerified(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        return user != null && user.isVerified();
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
        dto.setRole(user.getRole());
        dto.setVerified(user.isVerified());
        dto.setActive(user.isActive());
        dto.setVendorApprovalStatus(user.getVendorApprovalStatus());
        
        return dto;
    }
}