package com.scholartrack.service;

import com.scholartrack.dto.ApplicationDtos.ApplicationSummaryDto;
import com.scholartrack.dto.DashboardStatsDto.AdminDashboardStats;
import com.scholartrack.dto.DashboardStatsDto.StudentDashboardStats;
import com.scholartrack.dto.ScholarshipDto;
import com.scholartrack.entity.Application;
import com.scholartrack.entity.Scholarship;
import com.scholartrack.entity.Student;
import com.scholartrack.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ApplicationRepository applicationRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final StudentRepository studentRepository;
    private final NotificationRepository notificationRepository;
    private final DuplicateMatchRepository duplicateRepository;
    private final FraudRiskScoreRepository fraudRepository;
    private final DocumentRepository documentRepository;
    private final ScholarshipService scholarshipService;
    private final ApplicationService applicationService;
    private final NotificationService notificationService;
    private final EligibilityService eligibilityService;

    public AnalyticsService(ApplicationRepository applicationRepository,
                            ScholarshipRepository scholarshipRepository,
                            StudentRepository studentRepository,
                            NotificationRepository notificationRepository,
                            DuplicateMatchRepository duplicateRepository,
                            FraudRiskScoreRepository fraudRepository,
                            DocumentRepository documentRepository,
                            ScholarshipService scholarshipService,
                            ApplicationService applicationService,
                            NotificationService notificationService,
                            EligibilityService eligibilityService) {
        this.applicationRepository = applicationRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.studentRepository = studentRepository;
        this.notificationRepository = notificationRepository;
        this.duplicateRepository = duplicateRepository;
        this.fraudRepository = fraudRepository;
        this.documentRepository = documentRepository;
        this.scholarshipService = scholarshipService;
        this.applicationService = applicationService;
        this.notificationService = notificationService;
        this.eligibilityService = eligibilityService;
    }

    public StudentDashboardStats getStudentStats(Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        StudentDashboardStats stats = new StudentDashboardStats();

        if (student == null) return stats;

        stats.setStudentName(student.getFullName());
        stats.setProfileCompletionPct(student.getProfileCompletionPct() != null ? student.getProfileCompletionPct() : 50);

        List<Scholarship> allActive = scholarshipRepository.findByIsActiveTrue();
        long eligibleCount = 0;
        List<ScholarshipDto> recommended = new ArrayList<>();

        for (Scholarship s : allActive) {
            int score = eligibilityService.estimateMatchScore(student, s);
            ScholarshipDto dto = scholarshipService.mapToDto(s);
            dto.setMatchPercentage(score);
            if (score >= 70) {
                recommended.add(dto);
            }
            if (score >= 85) {
                eligibleCount++;
            }
        }
        recommended.sort((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()));

        stats.setTotalRecommended(recommended.size());
        stats.setTotalEligible(eligibleCount);
        stats.setRecommendedScholarships(recommended.stream().limit(4).collect(Collectors.toList()));

        List<ApplicationSummaryDto> studentApps = applicationService.getStudentApplications(studentId);
        stats.setActiveApplications(studentApps.stream().filter(a -> !"REJECTED".equalsIgnoreCase(a.getStatus())).count());
        stats.setRecentApplications(studentApps.stream().limit(5).collect(Collectors.toList()));

        long totalDocs = documentRepository.findByStudentId(studentId).size();
        stats.setPendingDocuments(Math.max(0, 4 - totalDocs));

        stats.setUnreadNotifications(notificationService.getUnreadCount(student.getUser().getId()));
        stats.setRecentAlerts(notificationService.getUserNotifications(student.getUser().getId()).stream().limit(4).collect(Collectors.toList()));

        return stats;
    }

    public AdminDashboardStats getAdminStats() {
        AdminDashboardStats stats = new AdminDashboardStats();

        List<Application> allApps = applicationRepository.findAll();
        stats.setTotalApplications(allApps.size());

        long pending = allApps.stream().filter(a -> "UNDER_REVIEW".equalsIgnoreCase(a.getStatus()) || "SUBMITTED".equalsIgnoreCase(a.getStatus())).count();
        long approved = allApps.stream().filter(a -> "APPROVED".equalsIgnoreCase(a.getStatus())).count();
        long rejected = allApps.stream().filter(a -> "REJECTED".equalsIgnoreCase(a.getStatus())).count();
        long docVerif = allApps.stream().filter(a -> "DOCUMENT_VERIFICATION".equalsIgnoreCase(a.getStatus())).count();

        stats.setPendingReview(pending);
        stats.setApprovedApplications(approved);
        stats.setRejectedApplications(rejected);
        stats.setVerifiedApplications(approved + docVerif);

        stats.setPotentialDuplicates(duplicateRepository.count());
        stats.setHighRiskAlerts(fraudRepository.findByRiskLevel("HIGH").size());

        // Status Distribution Map
        Map<String, Long> statusMap = new LinkedHashMap<>();
        statusMap.put("Approved", approved);
        statusMap.put("Under Review", pending);
        statusMap.put("Doc Verification", docVerif);
        statusMap.put("Rejected", rejected);
        stats.setStatusDistribution(statusMap);

        // Risk Distribution Map
        Map<String, Long> riskMap = new LinkedHashMap<>();
        riskMap.put("Low Risk (0-39)", (long) fraudRepository.findByRiskLevel("LOW").size());
        riskMap.put("Medium Risk (40-69)", (long) fraudRepository.findByRiskLevel("MEDIUM").size());
        riskMap.put("High Risk (70-100)", (long) fraudRepository.findByRiskLevel("HIGH").size());
        stats.setRiskDistribution(riskMap);

        // Scholarship Popularity Map
        Map<String, Long> popMap = new LinkedHashMap<>();
        for (Application a : allApps) {
            String title = a.getScholarship().getTitle();
            popMap.put(title, popMap.getOrDefault(title, 0L) + 1);
        }
        stats.setScholarshipPopularity(popMap);

        // High Priority Review Queue (Sorted by fraud risk score descending)
        List<ApplicationSummaryDto> highPriority = applicationService.getAllApplicationsAdmin(null, null, null).stream()
                .sorted((a, b) -> Integer.compare(b.getFraudRiskScore() != null ? b.getFraudRiskScore() : 0,
                                                  a.getFraudRiskScore() != null ? a.getFraudRiskScore() : 0))
                .limit(6)
                .collect(Collectors.toList());
        stats.setHighPriorityQueue(highPriority);

        return stats;
    }
}
