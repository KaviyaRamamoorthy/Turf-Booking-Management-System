package com.turf.service;

import com.turf.dto.TurfDto;
import com.turf.dto.SearchFilter;
import java.util.UUID;
import java.util.List;

/**
 * Service interface for turf-related operations.
 *
 * @author Saravanamuthukumar S
 */
public interface TurfService {
    TurfDto getTurfById(UUID id);
    List<TurfDto> getAllTurfs(SearchFilter filter);
    TurfDto createTurf(TurfDto turfDto);
    TurfDto updateTurf(UUID id, TurfDto turfDto);
    void deleteTurf(UUID id);
} 