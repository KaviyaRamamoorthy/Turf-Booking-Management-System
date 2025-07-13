package com.turf.service.impl;

import com.turf.entity.User;
import com.turf.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

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
        // For now, no roles loaded. Add role loading logic if needed.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPasswordHash(), user.isActive(), true, true, true, authorities);
    }
} 