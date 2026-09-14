package com.scholartrack.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ApplicationDtos {

    public static class CreateApplicationRequest {
        private Long scholarshipId;
        private BigDecimal declaredIncome;
        private BigDecimal declaredPercentage;

        public Long getScholarshipId() { return scholarshipId; }
        public void setScholarshipId(Long scholarshipId) { this.scholarshipId = scholarshipId; }
        public BigDecimal getDeclaredIncome() { return declaredIncome; }
        public void setDeclaredIncome(BigDecimal declaredIncome) { this.declaredIncome = declaredIncome; }
        public BigDecimal getDeclaredPercentage() { return declaredPercentage; }
        public void setDeclaredPercentage(BigDecimal declaredPercentage) { this.declaredPercentage = declaredPercentage; }
    }

    public static class ReviewDecisionRequest {
        private String decision; // APPROVE, REJECT, REQUEST_CORRECTION, FLAG_REVIEW
        private String reviewNotes;

        public String getDecision() { return decision; }
        public void setDecision(String decision) { this.decision = decision; }
        public String getReviewNotes() { return reviewNotes; }
        public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
    }

    public static class ApplicationSummaryDto {
        private Long id;
        private String applicationNumber;
        private Long studentId;
        private String studentName;
        private String studentEmail;
        private String studentCollege;
        private Long scholarshipId;
        private String scholarshipTitle;
        private BigDecimal scholarshipAmount;
        private String status;
        private LocalDateTime submissionDate;
        private BigDecimal declaredIncome;
        private BigDecimal declaredPercentage;
        private Integer fraudRiskScore;
        private String fraudRiskLevel;
        private BigDecimal duplicateSimilarity;
        private String verificationStatus;
        private Integer mismatchCount;
        private String reviewNotes;
        private LocalDateTime createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getApplicationNumber() { return applicationNumber; }
        public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
        public String getStudentEmail() { return studentEmail; }
        public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
        public String getStudentCollege() { return studentCollege; }
        public void setStudentCollege(String studentCollege) { this.studentCollege = studentCollege; }
        public Long getScholarshipId() { return scholarshipId; }
        public void setScholarshipId(Long scholarshipId) { this.scholarshipId = scholarshipId; }
        public String getScholarshipTitle() { return scholarshipTitle; }
        public void setScholarshipTitle(String scholarshipTitle) { this.scholarshipTitle = scholarshipTitle; }
        public BigDecimal getScholarshipAmount() { return scholarshipAmount; }
        public void setScholarshipAmount(BigDecimal scholarshipAmount) { this.scholarshipAmount = scholarshipAmount; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public LocalDateTime getSubmissionDate() { return submissionDate; }
        public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }
        public BigDecimal getDeclaredIncome() { return declaredIncome; }
        public void setDeclaredIncome(BigDecimal declaredIncome) { this.declaredIncome = declaredIncome; }
        public BigDecimal getDeclaredPercentage() { return declaredPercentage; }
        public void setDeclaredPercentage(BigDecimal declaredPercentage) { this.declaredPercentage = declaredPercentage; }
        public Integer getFraudRiskScore() { return fraudRiskScore; }
        public void setFraudRiskScore(Integer fraudRiskScore) { this.fraudRiskScore = fraudRiskScore; }
        public String getFraudRiskLevel() { return fraudRiskLevel; }
        public void setFraudRiskLevel(String fraudRiskLevel) { this.fraudRiskLevel = fraudRiskLevel; }
        public BigDecimal getDuplicateSimilarity() { return duplicateSimilarity; }
        public void setDuplicateSimilarity(BigDecimal duplicateSimilarity) { this.duplicateSimilarity = duplicateSimilarity; }
        public String getVerificationStatus() { return verificationStatus; }
        public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
        public Integer getMismatchCount() { return mismatchCount; }
        public void setMismatchCount(Integer mismatchCount) { this.mismatchCount = mismatchCount; }
        public String getReviewNotes() { return reviewNotes; }
        public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class ApplicationDetailDto {
        private Long id;
        private String applicationNumber;
        private StudentProfileDto student;
        private ScholarshipDto scholarship;
        private String status;
        private LocalDateTime submissionDate;
        private BigDecimal declaredIncome;
        private BigDecimal declaredPercentage;
        private String reviewNotes;
        private String reviewedByName;
        private LocalDateTime reviewedAt;
        private List<DocumentDto> documents;
        private VerificationDto verification;
        private DuplicateDto duplicate;
        private FraudRiskDto fraudRisk;
        private LocalDateTime createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getApplicationNumber() { return applicationNumber; }
        public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }
        public StudentProfileDto getStudent() { return student; }
        public void setStudent(StudentProfileDto student) { this.student = student; }
        public ScholarshipDto getScholarship() { return scholarship; }
        public void setScholarship(ScholarshipDto scholarship) { this.scholarship = scholarship; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public LocalDateTime getSubmissionDate() { return submissionDate; }
        public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }
        public BigDecimal getDeclaredIncome() { return declaredIncome; }
        public void setDeclaredIncome(BigDecimal declaredIncome) { this.declaredIncome = declaredIncome; }
        public BigDecimal getDeclaredPercentage() { return declaredPercentage; }
        public void setDeclaredPercentage(BigDecimal declaredPercentage) { this.declaredPercentage = declaredPercentage; }
        public String getReviewNotes() { return reviewNotes; }
        public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
        public String getReviewedByName() { return reviewedByName; }
        public void setReviewedByName(String reviewedByName) { this.reviewedByName = reviewedByName; }
        public LocalDateTime getReviewedAt() { return reviewedAt; }
        public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
        public List<DocumentDto> getDocuments() { return documents; }
        public void setDocuments(List<DocumentDto> documents) { this.documents = documents; }
        public VerificationDto getVerification() { return verification; }
        public void setVerification(VerificationDto verification) { this.verification = verification; }
        public DuplicateDto getDuplicate() { return duplicate; }
        public void setDuplicate(DuplicateDto duplicate) { this.duplicate = duplicate; }
        public FraudRiskDto getFraudRisk() { return fraudRisk; }
        public void setFraudRisk(FraudRiskDto fraudRisk) { this.fraudRisk = fraudRisk; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class DocumentDto {
        private Long id;
        private Long documentId;
        private String requiredDocType;
        private String documentType;
        private String fileName;
        private String fileUrl;
        private String fileType;
        private Long fileSize;
        private String detectedType;
        private BigDecimal classificationConfidence;
        private String status;
        private String rawOcrText;
        private String extractedDataJson;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getDocumentId() { return documentId; }
        public void setDocumentId(Long documentId) { this.documentId = documentId; }
        public String getRequiredDocType() { return requiredDocType; }
        public void setRequiredDocType(String requiredDocType) { this.requiredDocType = requiredDocType; }
        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }
        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
        public String getDetectedType() { return detectedType; }
        public void setDetectedType(String detectedType) { this.detectedType = detectedType; }
        public BigDecimal getClassificationConfidence() { return classificationConfidence; }
        public void setClassificationConfidence(BigDecimal classificationConfidence) { this.classificationConfidence = classificationConfidence; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getRawOcrText() { return rawOcrText; }
        public void setRawOcrText(String rawOcrText) { this.rawOcrText = rawOcrText; }
        public String getExtractedDataJson() { return extractedDataJson; }
        public void setExtractedDataJson(String extractedDataJson) { this.extractedDataJson = extractedDataJson; }
    }

    public static class VerificationDto {
        private String overallStatus;
        private String fieldComparisonJson;
        private Integer mismatchCount;
        private LocalDateTime verifiedAt;
        private String notes;

        public String getOverallStatus() { return overallStatus; }
        public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }
        public String getFieldComparisonJson() { return fieldComparisonJson; }
        public void setFieldComparisonJson(String fieldComparisonJson) { this.fieldComparisonJson = fieldComparisonJson; }
        public Integer getMismatchCount() { return mismatchCount; }
        public void setMismatchCount(Integer mismatchCount) { this.mismatchCount = mismatchCount; }
        public LocalDateTime getVerifiedAt() { return verifiedAt; }
        public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class DuplicateDto {
        private Long matchedApplicationId;
        private String matchedApplicationNumber;
        private String matchedStudentName;
        private BigDecimal similarityScore;
        private String matchedFieldsJson;

        public Long getMatchedApplicationId() { return matchedApplicationId; }
        public void setMatchedApplicationId(Long matchedApplicationId) { this.matchedApplicationId = matchedApplicationId; }
        public String getMatchedApplicationNumber() { return matchedApplicationNumber; }
        public void setMatchedApplicationNumber(String matchedApplicationNumber) { this.matchedApplicationNumber = matchedApplicationNumber; }
        public String getMatchedStudentName() { return matchedStudentName; }
        public void setMatchedStudentName(String matchedStudentName) { this.matchedStudentName = matchedStudentName; }
        public BigDecimal getSimilarityScore() { return similarityScore; }
        public void setSimilarityScore(BigDecimal similarityScore) { this.similarityScore = similarityScore; }
        public String getMatchedFieldsJson() { return matchedFieldsJson; }
        public void setMatchedFieldsJson(String matchedFieldsJson) { this.matchedFieldsJson = matchedFieldsJson; }
    }

    public static class FraudRiskDto {
        private Integer riskScore;
        private String riskLevel;
        private String signalsJson;
        private String explainableReasonsJson;

        public Integer getRiskScore() { return riskScore; }
        public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
        public String getRiskLevel() { return riskLevel; }
        public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
        public String getSignalsJson() { return signalsJson; }
        public void setSignalsJson(String signalsJson) { this.signalsJson = signalsJson; }
        public String getExplainableReasonsJson() { return explainableReasonsJson; }
        public void setExplainableReasonsJson(String explainableReasonsJson) { this.explainableReasonsJson = explainableReasonsJson; }
    }
}
