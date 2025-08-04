package com.turf.service.impl;

import com.turf.dto.ModuleDto;
import com.turf.entity.Module;
import com.turf.entity.Role;
import com.turf.repository.ModuleRepository;
import com.turf.repository.RoleRepository;
import com.turf.service.ModuleService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of ModuleService.
 * @author Kaviya Ramamoorthy
 */
@Service
public class ModuleServiceImpl implements ModuleService {
    private final ModuleRepository moduleRepository;
    private final RoleRepository roleRepository;

    public ModuleServiceImpl(ModuleRepository moduleRepository, RoleRepository roleRepository) {
        this.moduleRepository = moduleRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public ModuleDto createModule(ModuleDto moduleDto) {
        Module module = new Module();
        module.setName(moduleDto.getName());
        module = moduleRepository.save(module);
        moduleDto.setId(module.getId());
        return moduleDto;
    }

    @Override
    public ModuleDto updateModule(UUID id, ModuleDto moduleDto) {
        Module module = moduleRepository.findById(id).orElseThrow();
        module.setName(moduleDto.getName());
        module = moduleRepository.save(module);
        moduleDto.setId(module.getId());
        return moduleDto;
    }

    @Override
    public void deleteModule(UUID id) {
        moduleRepository.deleteById(id);
    }

    @Override
    public ModuleDto getModuleById(UUID id) {
        Module module = moduleRepository.findById(id).orElseThrow();
        ModuleDto dto = new ModuleDto();
        dto.setId(module.getId());
        dto.setName(module.getName());
        return dto;
    }

    @Override
    public List<ModuleDto> getAllModules() {
        return moduleRepository.findAll().stream().map(module -> {
            ModuleDto dto = new ModuleDto();
            dto.setId(module.getId());
            dto.setName(module.getName());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ModuleDto> getModulesByRoleNames(List<String> roleNames) {
        return roleRepository.findByNameIn(roleNames).stream()
            .filter(role -> role.getModules() != null)
            .flatMap(role -> role.getModules().stream())
            .distinct()
            .map(module -> {
                ModuleDto dto = new ModuleDto();
                dto.setId(module.getId());
                dto.setName(module.getName());
                return dto;
            })
            .collect(Collectors.toList());
    }
} 