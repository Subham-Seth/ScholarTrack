package com.scholartrack.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholartrack.dto.AiDtos.FraudRiskEvaluation;
import com.scholartrack.dto.AiDtos.VerificationFieldReport;
import com.scholartrack.dto.ApplicationDtos.*;
import com.scholartrack.dto.ScholarshipDto;
import com.scholartrack.dto.StudentProfileDto;
import com.scholartrack.entity.*;
import com.scholartrack.exception.BadRequestException;
import com.scholartrack.exception.ResourceNotFoundException;
import com.scholartrack.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final DocumentRepository documentRepository;
    private final ApplicationDocumentRepository appDocRepository;
    private final VerificationResultRepository verificationRepository;
    private final DuplicateMatchRepository duplicateRepository;
    private final FraudRiskScoreRepository fraudRepository;
    private final AdminRepository adminRepository;
    private final AiService aiService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;
    private final StudentService studentService;
    private final ScholarshipService scholarshipService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ApplicationService(ApplicationRepository applicationRepository,
                              StudentRepository studentRepository,
                              ScholarshipRepository scholarshipRepository,
                              DocumentRepository documentRepository,
                              ApplicationDocumentRepository appDocRepository,
                              VerificationResultRepository verificationRepository,
                              DuplicateMatchRepository duplicateRepository,
                              FraudRiskScoreRepository fraudRepository,
                              AdminRepository adminRepository,
                              AiService aiService,
                              NotificationService notificationService,
                              AuditLogService auditLogService,
                              StudentService studentService,
                              ScholarshipService scholarshipService) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.documentRepository = documentRepository;
        this.appDocRepository = appDocRepository;
        this.verificationRepository = verificationRepository;
        this.duplicateRepository = duplicateRepository;
        this.fraudRepository = fraudRepository;
        this.adminRepository = adminRepository;
        this.aiService = aiService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
        this.studentService = studentService;
        this.scholarshipService = scholarshipService;
    }

    @Transactional
    public ApplicationDetailDto createDraft(Long studentId, CreateApplicationRequest req) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        Scholarship scholarship = scholarshipRepository.findById(req.getScholarshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found: " + req.getScholarshipId()));

        String appNumber = "ST-" + LocalDateTime.now().getYear() + "-" + (1000 + (int)(Math.random() * 8999));

        Application app = new Application();
        app.setApplicationNumber(appNumber);
        app.setStudent(student);
        app.setScholarship(scholarship);
        app.setStatus("DRAFT");
        app.setDeclaredIncome(req.getDeclaredIncome() != null ? req.getDeclaredIncome() : student.getFamilyIncome());
        app.setDeclaredPercentage(req.getDeclaredPercentage() != null ? req.getDeclaredPercentage() : student.getCgpaPercentage());

        Application savedDraft = applicationRepository.save(app);

        // Auto-attach any pre-existing student documents matching requirements
        List<Document> existingDocs = documentRepository.findByStudentId(studentId);
        if (scholarship.getRequiredDocuments() != null) {
            String[] reqTypes = scholarship.getRequiredDocuments().split(",");
            for (String reqType : reqTypes) {
                String cleanType = reqType.trim();
                existingDocs.stream()
                        .filter(d -> d.getDocumentType().equalsIgnoreCase(cleanType) || d.getDetectedType() != null && d.getDetectedType().equalsIgnoreCase(cleanType))
                        .findFirst()
                        .ifPresent(doc -> {
                            ApplicationDocument ad = new ApplicationDocument(savedDraft, doc, cleanType);
                            appDocRepository.save(ad);
                            savedDraft.getApplicationDocuments().add(ad);
                        });
            }
        }

        auditLogService.log(student.getUser().getId(), student.getUser().getEmail(), "STUDENT",
                "CREATE_DRAFT", "APPLICATION", savedDraft.getApplicationNumber(), "Created draft application for " + scholarship.getTitle());

        return getApplicationDetail(savedDraft.getId());
    }

    @Transactional
    public ApplicationDetailDto attachDocument(Long applicationId, Long documentId, String requiredDocType) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + documentId));

        ApplicationDocument ad = new ApplicationDocument(app, doc, requiredDocType);
        appDocRepository.save(ad);
        app.getApplicationDocuments().add(ad);

        return getApplicationDetail(applicationId);
    }

    @Transactional
    public ApplicationDetailDto submitApplication(Long applicationId, Long studentId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        if (!app.getStudent().getId().equals(studentId)) {
            throw new BadRequestException("Unauthorized to submit this application.");
        }

        Student student = app.getStudent();
        Scholarship scholarship = app.getScholarship();

        app.setStatus("UNDER_REVIEW");
        app.setSubmissionDate(LocalDateTime.now());
        app = applicationRepository.save(app);

        // 1. Run Automated OCR Field Verification on attached documents
        Map<String, Object> combinedOcrFields = new HashMap<>();
        for (ApplicationDocument ad : app.getApplicationDocuments()) {
            Document doc = ad.getDocument();
            if (doc.getExtraction() != null && doc.getExtraction().getExtractedDataJson() != null) {
                try {
                    Map<String, Object> extracted = objectMapper.readValue(doc.getExtraction().getExtractedDataJson(), new TypeReference<>() {});
                    combinedOcrFields.putAll(extracted);
                } catch (Exception ignored) {}
            }
        }

        List<VerificationFieldReport> verifReports = aiService.verifyFields(app, combinedOcrFields);
        int mismatchCount = (int) verifReports.stream().filter(r -> "MISMATCH".equals(r.getStatus())).count();
        String verifStatus = mismatchCount > 0 ? "MISMATCH_DETECTED" : "MATCHED";

        VerificationResult verifResult = new VerificationResult();
        verifResult.setApplication(app);
        verifResult.setOverallStatus(verifStatus);
        verifResult.setMismatchCount(mismatchCount);
        try {
            verifResult.setFieldComparisonJson(objectMapper.writeValueAsString(verifReports));
        } catch (Exception e) {
            verifResult.setFieldComparisonJson("[]");
        }
        verifResult.setNotes(mismatchCount > 0 ? "Flagged: " + mismatchCount + " field mismatch detected during OCR comparison." : "All fields verified against uploaded documentation.");
        verificationRepository.save(verifResult);
        final Long currentAppId = app.getId();

        // 2. Run Duplicate Cross-Application Similarity Check
        List<Application> allOtherApps = applicationRepository.findAll().stream()
                .filter(a -> !a.getId().equals(currentAppId))
                .collect(Collectors.toList());

        double maxSimilarity = 0.0;
        Application highestMatchApp = null;
        for (Application other : allOtherApps) {
            double sim = aiService.calculateApplicationSimilarity(student, other.getStudent());
            if (sim > maxSimilarity) {
                maxSimilarity = sim;
                highestMatchApp = other;
            }
        }

        if (maxSimilarity >= 0.75 && highestMatchApp != null) {
            DuplicateMatch dup = new DuplicateMatch();
            dup.setApplication(app);
            dup.setMatchedApplication(highestMatchApp);
            dup.setSimilarityScore(BigDecimal.valueOf(Math.round(maxSimilarity * 1000.0) / 10.0));
            dup.setMatchedFieldsJson("{\"similarity\": " + (int)(maxSimilarity * 100) + ", \"matchedApp\": \"" + highestMatchApp.getApplicationNumber() + "\"}");
            duplicateRepository.save(dup);
        }

        // 3. Run Multi-Signal AI Fraud Risk Evaluation
        long otherActiveCount = applicationRepository.findByStudentId(student.getId()).stream()
                .filter(a -> !a.getId().equals(currentAppId) && !"REJECTED".equals(a.getStatus()))
                .count();

        FraudRiskEvaluation fraudEval = aiService.evaluateFraudRisk(app, maxSimilarity, mismatchCount, otherActiveCount);
        FraudRiskScore fraudScore = new FraudRiskScore();
        fraudScore.setApplication(app);
        fraudScore.setRiskScore(fraudEval.getRiskScore());
        fraudScore.setRiskLevel(fraudEval.getRiskLevel());
        try {
            fraudScore.setSignalsJson(objectMapper.writeValueAsString(fraudEval.getSignals()));
            fraudScore.setExplainableReasonsJson(objectMapper.writeValueAsString(fraudEval.getExplainableReasons()));
        } catch (Exception e) {
            fraudScore.setSignalsJson("{}");
            fraudScore.setExplainableReasonsJson("[]");
        }
        fraudRepository.save(fraudScore);
        app.setFraudRiskScore(fraudScore);

        // Update overall status if mismatch detected
        if (mismatchCount > 0) {
            app.setStatus("DOCUMENT_VERIFICATION");
            applicationRepository.save(app);
        }

        // Notifications
        notificationService.sendNotification(student.getUser(), "Application Submitted Successfully",
                "Your application " + app.getApplicationNumber() + " for " + scholarship.getTitle() + " has been received and queued for review.", "SUCCESS");

        if (fraudEval.getRiskScore() >= 70) {
            notificationService.sendNotification(student.getUser(), "Verification Notice",
                    "A data inconsistency was detected during automated verification. An administrator will review your application.", "WARNING");
        }

        auditLogService.log(student.getUser().getId(), student.getUser().getEmail(), "STUDENT",
                "SUBMIT_APPLICATION", "APPLICATION", app.getApplicationNumber(),
                "Submitted application. AI Risk Score: " + fraudEval.getRiskScore() + "/100, Verification: " + verifStatus);

        return getApplicationDetail(app.getId());
    }

    @Transactional
    public ApplicationDetailDto processReviewDecision(Long applicationId, Long adminUserId, ReviewDecisionRequest req) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));
        Admin admin = adminRepository.findByUserId(adminUserId).orElse(null);

        String newStatus;
        String actionLog;
        String notifMsg;

        switch (req.getDecision().toUpperCase()) {
            case "APPROVE":
                newStatus = "APPROVED";
                actionLog = "APPLICATION_APPROVED";
                notifMsg = "Congratulations! Your scholarship application " + app.getApplicationNumber() + " has been APPROVED.";
                break;
            case "REJECT":
                newStatus = "REJECTED";
                actionLog = "APPLICATION_REJECTED";
                notifMsg = "Your scholarship application " + app.getApplicationNumber() + " has been rejected after administrative review.";
                break;
            case "REQUEST_CORRECTION":
                newStatus = "CORRECTION_REQUIRED";
                actionLog = "CORRECTION_REQUESTED";
                notifMsg = "Correction Required on " + app.getApplicationNumber() + ": " + (req.getReviewNotes() != null ? req.getReviewNotes() : "Please update your submitted documents.");
                break;
            case "FLAG_REVIEW":
            default:
                newStatus = "UNDER_REVIEW";
                actionLog = "APPLICATION_FLAGGED";
                notifMsg = "Your application " + app.getApplicationNumber() + " has been flagged for higher-level review.";
                break;
        }

        app.setStatus(newStatus);
        app.setReviewNotes(req.getReviewNotes());
        app.setReviewedBy(admin);
        app.setReviewedAt(LocalDateTime.now());
        app = applicationRepository.save(app);

        notificationService.sendNotification(app.getStudent().getUser(), "Application Status Updated", notifMsg,
                newStatus.equals("APPROVED") ? "SUCCESS" : (newStatus.equals("REJECTED") ? "ALERT" : "WARNING"));

        auditLogService.log(adminUserId, admin != null ? admin.getUser().getEmail() : "admin", "ADMIN",
                actionLog, "APPLICATION", app.getApplicationNumber(),
                "Decision: " + newStatus + ". Review Note: " + req.getReviewNotes());

        return getApplicationDetail(applicationId);
    }

    public List<ApplicationSummaryDto> getStudentApplications(Long studentId) {
        return applicationRepository.findByStudentId(studentId).stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationSummaryDto> getAllApplicationsAdmin(String status, String riskLevel, String search) {
        List<Application> apps = applicationRepository.findAll();

        return apps.stream()
                .filter(a -> status == null || status.equalsIgnoreCase("ALL") || a.getStatus().equalsIgnoreCase(status))
                .filter(a -> {
                    if (riskLevel == null || riskLevel.equalsIgnoreCase("ALL")) return true;
                    FraudRiskScore frs = a.getFraudRiskScore();
                    return frs != null && frs.getRiskLevel().equalsIgnoreCase(riskLevel);
                })
                .filter(a -> {
                    if (search == null || search.isBlank()) return true;
                    String s = search.toLowerCase();
                    return a.getApplicationNumber().toLowerCase().contains(s)
                            || a.getStudent().getFullName().toLowerCase().contains(s)
                            || a.getScholarship().getTitle().toLowerCase().contains(s);
                })
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    public ApplicationDetailDto getApplicationDetail(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        ApplicationDetailDto dto = new ApplicationDetailDto();
        dto.setId(app.getId());
        dto.setApplicationNumber(app.getApplicationNumber());
        dto.setStatus(app.getStatus());
        dto.setSubmissionDate(app.getSubmissionDate());
        dto.setDeclaredIncome(app.getDeclaredIncome());
        dto.setDeclaredPercentage(app.getDeclaredPercentage());
        dto.setReviewNotes(app.getReviewNotes());
        dto.setReviewedByName(app.getReviewedBy() != null ? app.getReviewedBy().getFullName() : null);
        dto.setReviewedAt(app.getReviewedAt());
        dto.setCreatedAt(app.getCreatedAt());

        dto.setStudent(studentService.mapToDto(app.getStudent()));
        dto.setScholarship(scholarshipService.mapToDto(app.getScholarship()));

        // Documents
        dto.setDocuments(app.getApplicationDocuments().stream().map(ad -> {
            Document d = ad.getDocument();
            DocumentDto dd = new DocumentDto();
            dd.setId(ad.getId());
            dd.setDocumentId(d.getId());
            dd.setRequiredDocType(ad.getRequiredDocType());
            dd.setDocumentType(d.getDocumentType());
            dd.setFileName(d.getFileName());
            dd.setFileUrl(d.getFileUrl());
            dd.setFileType(d.getFileType());
            dd.setFileSize(d.getFileSize());
            dd.setDetectedType(d.getDetectedType());
            dd.setClassificationConfidence(d.getClassificationConfidence());
            dd.setStatus(ad.getStatus());
            if (d.getExtraction() != null) {
                dd.setRawOcrText(d.getExtraction().getRawOcrText());
                dd.setExtractedDataJson(d.getExtraction().getExtractedDataJson());
            }
            return dd;
        }).collect(Collectors.toList()));

        // Verification Result
        if (app.getVerificationResult() != null) {
            VerificationResult vr = app.getVerificationResult();
            VerificationDto vd = new VerificationDto();
            vd.setOverallStatus(vr.getOverallStatus());
            vd.setFieldComparisonJson(vr.getFieldComparisonJson());
            vd.setMismatchCount(vr.getMismatchCount());
            vd.setVerifiedAt(vr.getVerifiedAt());
            vd.setNotes(vr.getNotes());
            dto.setVerification(vd);
        }

        // Fraud Risk
        if (app.getFraudRiskScore() != null) {
            FraudRiskScore fr = app.getFraudRiskScore();
            FraudRiskDto fd = new FraudRiskDto();
            fd.setRiskScore(fr.getRiskScore());
            fd.setRiskLevel(fr.getRiskLevel());
            fd.setSignalsJson(fr.getSignalsJson());
            fd.setExplainableReasonsJson(fr.getExplainableReasonsJson());
            dto.setFraudRisk(fd);
        }

        // Duplicate Match
        List<DuplicateMatch> dups = duplicateRepository.findByApplicationId(app.getId());
        if (!dups.isEmpty()) {
            DuplicateMatch dm = dups.get(0);
            DuplicateDto dd = new DuplicateDto();
            dd.setMatchedApplicationId(dm.getMatchedApplication().getId());
            dd.setMatchedApplicationNumber(dm.getMatchedApplication().getApplicationNumber());
            dd.setMatchedStudentName(dm.getMatchedApplication().getStudent().getFullName());
            dd.setSimilarityScore(dm.getSimilarityScore());
            dd.setMatchedFieldsJson(dm.getMatchedFieldsJson());
            dto.setDuplicate(dd);
        }

        return dto;
    }

    public ApplicationSummaryDto mapToSummaryDto(Application a) {
        ApplicationSummaryDto dto = new ApplicationSummaryDto();
        dto.setId(a.getId());
        dto.setApplicationNumber(a.getApplicationNumber());
        dto.setStudentId(a.getStudent().getId());
        dto.setStudentName(a.getStudent().getFullName());
        dto.setStudentEmail(a.getStudent().getUser().getEmail());
        dto.setStudentCollege(a.getStudent().getCollege());
        dto.setScholarshipId(a.getScholarship().getId());
        dto.setScholarshipTitle(a.getScholarship().getTitle());
        dto.setScholarshipAmount(a.getScholarship().getAmount());
        dto.setStatus(a.getStatus());
        dto.setSubmissionDate(a.getSubmissionDate());
        dto.setDeclaredIncome(a.getDeclaredIncome());
        dto.setDeclaredPercentage(a.getDeclaredPercentage());
        dto.setReviewNotes(a.getReviewNotes());
        dto.setCreatedAt(a.getCreatedAt());

        if (a.getFraudRiskScore() != null) {
            dto.setFraudRiskScore(a.getFraudRiskScore().getRiskScore());
            dto.setFraudRiskLevel(a.getFraudRiskScore().getRiskLevel());
        } else {
            dto.setFraudRiskScore(15);
            dto.setFraudRiskLevel("LOW");
        }

        if (a.getVerificationResult() != null) {
            dto.setVerificationStatus(a.getVerificationResult().getOverallStatus());
            dto.setMismatchCount(a.getVerificationResult().getMismatchCount());
        }

        List<DuplicateMatch> dups = duplicateRepository.findByApplicationId(a.getId());
        if (!dups.isEmpty()) {
            dto.setDuplicateSimilarity(dups.get(0).getSimilarityScore());
        }

        return dto;
    }
}
