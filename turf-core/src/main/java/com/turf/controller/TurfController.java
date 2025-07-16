package com.turf.controller;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turf.constants.CommonConstants;
import com.turf.dto.BookingDto;
import com.turf.dto.SearchFilter;
import com.turf.dto.TurfDto;
import com.turf.exception.BadRequestException;
import com.turf.exception.ResourceNotFoundException;
import com.turf.service.TurfService;
import com.turf.util.ApiResponse;

/**
 * Controller for turf management endpoints (vendor only).
 *
 * @author Saravanamuthukumar S
 */
@RestController
@RequestMapping("/api/turfs")
@PreAuthorize("hasRole('ADMIN')")
public class TurfController {
    private static final Logger logger = LoggerFactory.getLogger(TurfController.class);

    @Autowired
    private TurfService turfService;

    @PostMapping
    public ResponseEntity<ApiResponse<TurfDto>> createTurf(@RequestBody TurfDto turfDto, Authentication authentication) {
        if (turfDto == null || turfDto.getName() == null) throw new BadRequestException("Turf name required.");
        // Set vendorId from authenticated user if needed
        TurfDto created = turfService.createTurf(turfDto);
        logger.info("Vendor created turf: {}", turfDto.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Turf created.", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TurfDto>>> getAllTurfs(@ModelAttribute SearchFilter filter) {
        List<TurfDto> turfs = turfService.getAllTurfs(filter);
        logger.info("Fetched all turfs with filter.");
        return ResponseEntity.ok(new ApiResponse<>(true, CommonConstants.MSG_SUCCESS, turfs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TurfDto>> getTurfById(@PathVariable UUID id) {
        TurfDto turf = turfService.getTurfById(id);
        if (turf == null) throw new ResourceNotFoundException(CommonConstants.MSG_TURF_NOT_FOUND);
        logger.info("Fetched turf: {}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, CommonConstants.MSG_SUCCESS, turf));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TurfDto>> updateTurf(@PathVariable UUID id, @RequestBody TurfDto turfDto) {
        if (turfDto == null || turfDto.getName() == null) throw new BadRequestException("Turf name required.");
        TurfDto updated = turfService.updateTurf(id, turfDto);
        logger.info("Vendor updated turf: {}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Turf updated.", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTurf(@PathVariable UUID id) {
        turfService.deleteTurf(id);
        logger.info("Vendor deleted turf: {}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Turf deleted.", null));
    }

    @GetMapping("/my/bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyTurfBookings(@ModelAttribute SearchFilter filter, Authentication authentication) {
        // Implement logic to get vendorId from authentication and filter bookings
        List<BookingDto> bookings = List.of(); // turfService.getBookingsForVendor(filter, vendorId)
        logger.info("Vendor fetched bookings for their turfs.");
        return ResponseEntity.ok(new ApiResponse<>(true, CommonConstants.MSG_SUCCESS, bookings));
    }
} 