package com.turf.repository;

import com.turf.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Repository for Booking entity.
 *
 * @author Saravanamuthukumar S
 */
public interface BookingRepository extends JpaRepository<Booking, UUID> {
} 