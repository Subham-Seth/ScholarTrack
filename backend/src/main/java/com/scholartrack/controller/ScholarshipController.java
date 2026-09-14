package com.scholartrack.controller;

import com.scholartrack.dto.ApiResponse;
import com.scholartrack.dto.ScholarshipDto;
import com.scholartrack.security.CustomUserDetails;
import com.scholartrack.service.ScholarshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    public ScholarshipController(ScholarshipService scholarshipService) {
        this.scholarshipService = scholarshipService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScholarshipDto>>> getAllScholarships(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "category", required = false) String category) {
        List<ScholarshipDto> list = scholarshipService.getAllActiveScholarships(search, category);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScholarshipDto>> getScholarshipById(@PathVariable("id") Long id) {
        ScholarshipDto dto = scholarshipService.getScholarshipById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScholarshipDto>> createScholarship(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody ScholarshipDto dto) {
        ScholarshipDto created = scholarshipService.createScholarship(dto, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Scholarship created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScholarshipDto>> updateScholarship(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable("id") Long id,
            @RequestBody ScholarshipDto dto) {
        ScholarshipDto updated = scholarshipService.updateScholarship(id, dto, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Scholarship updated successfully", updated));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable("id") Long id) {
        scholarshipService.toggleActiveStatus(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Status updated", null));
    }
}
