package com.turf.service;

import com.turf.dto.ModuleDto;
import java.util.List;
import java.util.UUID;

/**
 * Service interface for Module operations.
 * @author Kaviya Ramamoorthy
 */
public interface ModuleService {
    ModuleDto createModule(ModuleDto moduleDto);
    ModuleDto updateModule(UUID id, ModuleDto moduleDto);
    void deleteModule(UUID id);
    ModuleDto getModuleById(UUID id);
    List<ModuleDto> getAllModules();
    List<ModuleDto> getModulesByRoleNames(List<String> roleNames);
} 