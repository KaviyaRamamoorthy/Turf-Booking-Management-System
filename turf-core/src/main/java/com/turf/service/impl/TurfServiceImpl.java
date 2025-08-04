package com.turf.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.turf.dto.SearchFilter;
import com.turf.dto.TurfDto;
import com.turf.entity.Category;
import com.turf.entity.Turf;
import com.turf.entity.User;
import com.turf.exception.ResourceNotFoundException;
import com.turf.repository.CategoryRepository;
import com.turf.repository.TurfRepository;
import com.turf.repository.UserRepository;
import com.turf.service.TurfService;

/**
 * Implementation of TurfService for turf-related operations.
 *
 * @author Kaviya Ramamoorthy
 */
@Service
public class TurfServiceImpl implements TurfService {
    
    @Autowired
    private TurfRepository turfRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Override
    public TurfDto getTurfById(UUID id) {
        Turf turf = turfRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Turf not found with id: " + id));
        return convertToDto(turf);
    }

    @Override
    public List<TurfDto> getAllTurfs(SearchFilter filter) {
        List<Turf> turfs = turfRepository.findAll();
        return turfs.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Override
    public TurfDto createTurf(TurfDto turfDto) {
        Turf turf = new Turf();
        turf.setName(turfDto.getName());
        turf.setDescription(turfDto.getDescription());
        turf.setLocation(turfDto.getLocation());
        turf.setPricePerHour(turfDto.getPricePerHour());
        turf.setOpenTime(turfDto.getOpenTime());
        turf.setCloseTime(turfDto.getCloseTime());
        turf.setCreatedAt(LocalDateTime.now());
        
        // Set vendor (assuming admin user for now)
        if (turfDto.getVendorId() != null) {
            User vendor = userRepository.findById(turfDto.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + turfDto.getVendorId()));
            turf.setVendor(vendor);
        } else {
            // Set default admin as vendor (you might want to get this from authentication)
            User defaultVendor = userRepository.findByEmail("admin@turf.com")
                .orElseThrow(() -> new ResourceNotFoundException("Default vendor not found"));
            turf.setVendor(defaultVendor);
        }
        
        // Set category
        if (turfDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(turfDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + turfDto.getCategoryId()));
            turf.setCategory(category);
        } else {
            // Set default category (you might want to handle this differently)
            List<Category> categories = categoryRepository.findAll();
            if (!categories.isEmpty()) {
                turf.setCategory(categories.get(0));
            } else {
                throw new ResourceNotFoundException("No categories available");
            }
        }
        
        Turf savedTurf = turfRepository.save(turf);
        return convertToDto(savedTurf);
    }

    @Override
    public TurfDto updateTurf(UUID id, TurfDto turfDto) {
        Turf turf = turfRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Turf not found with id: " + id));
        
        turf.setName(turfDto.getName());
        turf.setDescription(turfDto.getDescription());
        turf.setLocation(turfDto.getLocation());
        turf.setPricePerHour(turfDto.getPricePerHour());
        turf.setOpenTime(turfDto.getOpenTime());
        turf.setCloseTime(turfDto.getCloseTime());
        
        // Update category if provided
        if (turfDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(turfDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + turfDto.getCategoryId()));
            turf.setCategory(category);
        }
        
        Turf updatedTurf = turfRepository.save(turf);
        return convertToDto(updatedTurf);
    }

    @Override
    public void deleteTurf(UUID id) {
        if (!turfRepository.existsById(id)) {
            throw new ResourceNotFoundException("Turf not found with id: " + id);
        }
        turfRepository.deleteById(id);
    }
    
    private TurfDto convertToDto(Turf turf) {
        TurfDto dto = new TurfDto();
        dto.setId(turf.getId());
        dto.setName(turf.getName());
        dto.setDescription(turf.getDescription());
        dto.setLocation(turf.getLocation());
        dto.setPricePerHour(turf.getPricePerHour());
        dto.setOpenTime(turf.getOpenTime());
        dto.setCloseTime(turf.getCloseTime());
        
        if (turf.getVendor() != null) {
            dto.setVendorId(turf.getVendor().getId());
        }
        
        if (turf.getCategory() != null) {
            dto.setCategoryId(turf.getCategory().getId());
        }
        
        return dto;
    }
} 