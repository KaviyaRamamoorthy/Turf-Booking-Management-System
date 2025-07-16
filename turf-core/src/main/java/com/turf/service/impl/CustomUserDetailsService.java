package com.turf.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.turf.entity.User;
import com.turf.repository.UserRepository;

/**
 * CustomUserDetailsService loads users from the database for Spring Security authentication.
 *
 * @author Saravanamuthukumar S
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        logger.info("Loaded user for authentication: {}", email);
        
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // Load user roles and convert to authorities
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());
            logger.info("Loaded {} roles for user {}", authorities.size(), email);
        } else {
            // Default role if no roles assigned
            authorities.add(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
            logger.info("No roles found for user {}, assigned default ROLE_CUSTOMER", email);
        }
        
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), 
                user.getPasswordHash(), 
                user.isActive(), 
                true, 
                true, 
                true, 
                authorities);
    }
} 