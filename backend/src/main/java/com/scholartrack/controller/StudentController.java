package com.scholartrack.controller;

import com.scholartrack.dto.ApiResponse;
import com.scholartrack.dto.ApplicationDtos.ApplicationSummaryDto;
import com.scholartrack.dto.ApplicationDtos.DocumentDto;
import com.scholartrack.dto.DashboardStatsDto.StudentDashboardStats;
import com.scholartrack.dto.StudentProfileDto;
import com.scholartrack.entity.Document;
import com.scholartrack.security.CustomUserDetails;
import com.scholartrack.service.AnalyticsService;
import com.scholartrack.service.ApplicationService;
import com.scholartrack.service.DocumentService;
import com.scholartrack.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
public class StudentController {

    private final StudentService studentService;
    private final DocumentService documentService;
    private final ApplicationService applicationService;
    private final AnalyticsService analyticsService;

    public StudentController(StudentService studentService,
                             DocumentService documentService,
                             ApplicationService applicationService,
                             AnalyticsService analyticsService) {
        this.studentService = studentService;
        this.documentService = documentService;
        this.applicationService = applicationService;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        StudentProfileDto profile = studentService.getProfileByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateProfile(@AuthenticationPrincipal CustomUserDetails user,
                                                                       @RequestBody StudentProfileDto dto) {
        StudentProfileDto updated = studentService.updateProfile(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<StudentDashboardStats>> getDashboardStats(@AuthenticationPrincipal CustomUserDetails user) {
        StudentProfileDto profile = studentService.getProfileByUserId(user.getId());
        StudentDashboardStats stats = analyticsService.getStudentStats(profile.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/documents")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getDocuments(@AuthenticationPrincipal CustomUserDetails user) {
        StudentProfileDto profile = studentService.getProfileByUserId(user.getId());
        List<DocumentDto> docs = documentService.getStudentDocuments(profile.getId());
        return ResponseEntity.ok(ApiResponse.success(docs));
    }

    @PostMapping("/documents/upload")
    public ResponseEntity<ApiResponse<DocumentDto>> uploadDocument(@AuthenticationPrincipal CustomUserDetails user,
                                                                   @RequestParam("file") MultipartFile file,
                                                                   @RequestParam(value = "documentType", required = false) String documentType) throws IOException {
        StudentProfileDto profile = studentService.getProfileByUserId(user.getId());
        Document doc = documentService.uploadDocument(profile.getId(), file, documentType);

        DocumentDto dto = new DocumentDto();
        dto.setDocumentId(doc.getId());
        dto.setFileName(doc.getFileName());
        dto.setDocumentType(doc.getDocumentType());
        dto.setDetectedType(doc.getDetectedType());
        dto.setClassificationConfidence(doc.getClassificationConfidence());
        dto.setFileUrl(doc.getFileUrl());

        return ResponseEntity.ok(ApiResponse.success("Document uploaded and processed successfully", dto));
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@AuthenticationPrincipal CustomUserDetails user,
                                                            @PathVariable("id") Long id) {
        StudentProfileDto profile = studentService.getProfileByUserId(user.getId());
        documentService.deleteDocument(id, profile.getId());
        return ResponseEntity.ok(ApiResponse.success("Document removed successfully", null));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<ApplicationSummaryDto>>> getApplications(@AuthenticationPrincipal CustomUserDetails user) {
        StudentProfileDto profile = studentService.getProfileByUserId(user.getId());
        List<ApplicationSummaryDto> apps = applicationService.getStudentApplications(profile.getId());
        return ResponseEntity.ok(ApiResponse.success(apps));
    }
}
