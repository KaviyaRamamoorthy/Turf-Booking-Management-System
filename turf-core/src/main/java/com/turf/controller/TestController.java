package com.turf.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Test controller for debugging CORS and basic connectivity.
 *
 * @author Kaviya Ramamoorthy
 */
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"})
public class TestController {

    @GetMapping("/cors")
    public String testCors() {
        return "CORS is working!";
    }

    @GetMapping("/health")
    public String health() {
        return "Backend is running!";
    }
} 