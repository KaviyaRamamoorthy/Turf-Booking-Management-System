package com.turf.controller;

import com.turf.dto.ModuleDto;
import com.turf.dto.RoleDto;
import com.turf.service.ModuleService;
import com.turf.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

/**
 * Controller for Module CRUD and user-accessible modules.
 * @author Kaviya Ramamoorthy
 */
@RestController
@RequestMapping("/api/modules")
public class ModuleController {
    @Autowired
    private ModuleService moduleService;

    @PostMapping
    public ResponseEntity<ApiResponse<ModuleDto>> createModule(@RequestBody ModuleDto moduleDto) {
        ModuleDto created = moduleService.createModule(moduleDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Module created.", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ModuleDto>> updateModule(@PathVariable UUID id, @RequestBody ModuleDto moduleDto) {
        ModuleDto updated = moduleService.updateModule(id, moduleDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Module updated.", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteModule(@PathVariable UUID id) {
        moduleService.deleteModule(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Module deleted.", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ModuleDto>>> getAllModules() {
        List<ModuleDto> modules = moduleService.getAllModules();
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", modules));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ModuleDto>> getModuleById(@PathVariable UUID id) {
        ModuleDto module = moduleService.getModuleById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", module));
    }

    @GetMapping("/my-access")
    public ResponseEntity<ApiResponse<List<String>>> getAccessibleModules(Authentication authentication) {
        List<String> roleNames = authentication.getAuthorities().stream()
            .map(auth -> auth.getAuthority().replace("ROLE_", ""))
            .collect(Collectors.toList());
        List<ModuleDto> modules = moduleService.getModulesByRoleNames(roleNames);
        List<String> moduleNames = modules.stream().map(ModuleDto::getName).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessible modules", moduleNames));
    }
} 