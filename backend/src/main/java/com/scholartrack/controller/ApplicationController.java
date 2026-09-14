package com.scholartrack.controller;

import com.scholartrack.dto.ApiResponse;
import com.scholartrack.dto.ApplicationDtos.*;
import com.scholartrack.dto.StudentProfileDto;
import com.scholartrack.security.CustomUserDetails;
import com.scholartrack.service.ApplicationService;
import com.scholartrack.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final StudentService studentService;

    public ApplicationController(ApplicationService applicationService, StudentService studentService) {
        this.applicationService = applicationService;
        this.studentService = studentService;
    }

    @PostMapping("/draft")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ApplicationDetailDto>> createDraft(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody CreateApplicationRequest request) {
        StudentProfileDto profile = studentService.getProfileByUserId(user.getId());
        ApplicationDetailDto detail = applicationService.createDraft(profile.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Draft application created", detail));
    }

    @PostMapping("/{id}/attach-document")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ApplicationDetailDto>> attachDocument(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Object> payload) {
        Long documentId = Long.valueOf(payload.get("documentId").toString());
        String requiredDocType = (String) payload.get("requiredDocType");
        ApplicationDetailDto detail = applicationService.attachDocument(id, documentId, requiredDocType);
        return ResponseEntity.ok(ApiResponse.success("Document attached", detail));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ApplicationDetailDto>> submitApplication(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable("id") Long id) {
        StudentProfileDto profile = studentService.getProfileByUserId(user.getId());
        ApplicationDetailDto detail = applicationService.submitApplication(id, profile.getId());
        return ResponseEntity.ok(ApiResponse.success("Application submitted successfully with automated AI checks", detail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDetailDto>> getApplication(@PathVariable("id") Long id) {
        ApplicationDetailDto detail = applicationService.getApplicationDetail(id);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }
}
