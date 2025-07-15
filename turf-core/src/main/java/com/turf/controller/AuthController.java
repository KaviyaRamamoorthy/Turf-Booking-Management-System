package com.turf.controller;

import com.turf.constants.CommonConstants;
import com.turf.dto.AuthRequest;
import com.turf.dto.OtpRequest;
import com.turf.dto.UserDto;
import com.turf.exception.BadRequestException;
import com.turf.exception.ResourceNotFoundException;
import com.turf.exception.UnauthorizedException;
import com.turf.service.OtpService;
import com.turf.service.UserService;
import com.turf.util.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.turf.config.JwtUtil;

/**
 * Controller for authentication-related endpoints (register, login, OTP, password reset).
 *
 * @author Saravanamuthukumar S
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;
    @Autowired
    private OtpService otpService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody UserDto userDto) {
        if (userDto == null || userDto.getEmail() == null || userDto.getPasswordHash() == null) {
            throw new BadRequestException("Email and password are required.");
        }
        userDto.setPasswordHash(passwordEncoder.encode(userDto.getPasswordHash()));
        userDto.setVerified(false);
        userDto.setActive(false);
        userService.createUser(userDto);
        otpService.generateOtp(userDto.getEmail(), CommonConstants.OTP_PURPOSE_SIGNUP);
        logger.info("User registered: {}. OTP sent.", userDto.getEmail());
        return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful. OTP sent to email.", null));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@RequestBody OtpRequest otpRequest) {
        if (otpRequest == null || otpRequest.getEmail() == null || otpRequest.getOtp() == null) {
            throw new BadRequestException("Email and OTP are required.");
        }
        boolean valid = otpService.validateOtp(otpRequest.getEmail(), otpRequest.getOtp(), CommonConstants.OTP_PURPOSE_SIGNUP);
        if (!valid) {
            throw new BadRequestException(CommonConstants.MSG_OTP_INVALID);
        }
        UserDto user = userService.getUserByEmail(otpRequest.getEmail());
        if (user == null) throw new ResourceNotFoundException(CommonConstants.MSG_USER_NOT_FOUND);
        user.setVerified(true);
        user.setActive(true);
        userService.updateUser(user.getId(), user);
        logger.info("User verified and activated: {}", user.getEmail());
        return ResponseEntity.ok(new ApiResponse<>(true, "OTP verified. Account activated.", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody AuthRequest authRequest) {
        if (authRequest == null || authRequest.getEmail() == null || authRequest.getPassword() == null) {
            throw new BadRequestException("Email and password are required.");
        }
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        } catch (Exception ex) {
            logger.warn("Login failed for {}: {}", authRequest.getEmail(), ex.getMessage());
            throw new UnauthorizedException(CommonConstants.MSG_INVALID_CREDENTIALS);
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authRequest.getEmail());
        logger.info("User logged in: {}", authRequest.getEmail());
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful.", jwt));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody AuthRequest authRequest) {
        if (authRequest == null || authRequest.getEmail() == null) {
            throw new BadRequestException("Email is required.");
        }
        UserDto user = userService.getUserByEmail(authRequest.getEmail());
        if (user == null) throw new ResourceNotFoundException(CommonConstants.MSG_USER_NOT_FOUND);
        otpService.generateOtp(authRequest.getEmail(), CommonConstants.OTP_PURPOSE_FORGOT_PASSWORD);
        logger.info("Forgot password OTP sent to {}", authRequest.getEmail());
        return ResponseEntity.ok(new ApiResponse<>(true, "OTP sent to email for password reset.", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody OtpRequest otpRequest) {
        if (otpRequest == null || otpRequest.getEmail() == null || otpRequest.getOtp() == null || otpRequest.getNewPassword() == null) {
            throw new BadRequestException("Email, OTP, and new password are required.");
        }
        boolean valid = otpService.validateOtp(otpRequest.getEmail(), otpRequest.getOtp(), CommonConstants.OTP_PURPOSE_FORGOT_PASSWORD);
        if (!valid) {
            throw new BadRequestException(CommonConstants.MSG_OTP_INVALID);
        }
        UserDto user = userService.getUserByEmail(otpRequest.getEmail());
        if (user == null) throw new ResourceNotFoundException(CommonConstants.MSG_USER_NOT_FOUND);
        user.setPasswordHash(passwordEncoder.encode(otpRequest.getNewPassword()));
        userService.updateUser(user.getId(), user);
        logger.info("Password reset for user: {}", otpRequest.getEmail());
        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset successful.", null));
    }
} 