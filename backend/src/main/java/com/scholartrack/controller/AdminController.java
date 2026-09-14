package com.scholartrack.controller;

import com.scholartrack.dto.ApiResponse;
import com.scholartrack.dto.ApplicationDtos.*;
import com.scholartrack.dto.DashboardStatsDto.AdminDashboardStats;
import com.scholartrack.dto.StudentProfileDto;
import com.scholartrack.entity.AuditLog;
import com.scholartrack.entity.DuplicateMatch;
import com.scholartrack.entity.FraudRiskScore;
import com.scholartrack.repository.DuplicateMatchRepository;
import com.scholartrack.repository.FraudRiskScoreRepository;
import com.scholartrack.repository.StudentRepository;
import com.scholartrack.security.CustomUserDetails;
import com.scholartrack.service.AnalyticsService;
import com.scholartrack.service.ApplicationService;
import com.scholartrack.service.AuditLogService;
import com.scholartrack.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ApplicationService applicationService;
    private final AnalyticsService analyticsService;
    private final AuditLogService auditLogService;
    private final StudentService studentService;
    private final StudentRepository studentRepository;
    private final DuplicateMatchRepository duplicateRepository;
    private final FraudRiskScoreRepository fraudRepository;

    public AdminController(ApplicationService applicationService,
                           AnalyticsService analyticsService,
                           AuditLogService auditLogService,
                           StudentService studentService,
                           StudentRepository studentRepository,
                           DuplicateMatchRepository duplicateRepository,
                           FraudRiskScoreRepository fraudRepository) {
        this.applicationService = applicationService;
        this.analyticsService = analyticsService;
        this.auditLogService = auditLogService;
        this.studentService = studentService;
        this.studentRepository = studentRepository;
        this.duplicateRepository = duplicateRepository;
        this.fraudRepository = fraudRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getDashboard() {
        AdminDashboardStats stats = analyticsService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<ApplicationSummaryDto>>> getApplications(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "riskLevel", required = false) String riskLevel,
            @RequestParam(value = "search", required = false) String search) {
        List<ApplicationSummaryDto> list = applicationService.getAllApplicationsAdmin(status, riskLevel, search);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<ApiResponse<ApplicationDetailDto>> getApplication(@PathVariable("id") Long id) {
        ApplicationDetailDto detail = applicationService.getApplicationDetail(id);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    @PostMapping("/applications/{id}/review")
    public ResponseEntity<ApiResponse<ApplicationDetailDto>> reviewApplication(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable("id") Long id,
            @RequestBody ReviewDecisionRequest request) {
        ApplicationDetailDto updated = applicationService.processReviewDecision(id, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Review decision saved successfully", updated));
    }

    @GetMapping("/duplicates")
    public ResponseEntity<ApiResponse<List<DuplicateMatch>>> getDuplicateAlerts() {
        List<DuplicateMatch> matches = duplicateRepository.findAllByOrderBySimilarityScoreDesc();
        return ResponseEntity.ok(ApiResponse.success(matches));
    }

    @GetMapping("/fraud-alerts")
    public ResponseEntity<ApiResponse<List<FraudRiskScore>>> getFraudAlerts() {
        List<FraudRiskScore> scores = fraudRepository.findAllByOrderByRiskScoreDesc();
        return ResponseEntity.ok(ApiResponse.success(scores));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentProfileDto>>> getAllStudents() {
        List<StudentProfileDto> students = studentRepository.findAll().stream()
                .map(studentService::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        List<AuditLog> logs = auditLogService.getAllLogs();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
