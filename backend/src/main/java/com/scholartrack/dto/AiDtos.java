package com.scholartrack.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AiDtos {

    public static class ClassificationResult {
        private String detectedType;
        private BigDecimal confidence;
        private boolean isConfident;

        public ClassificationResult() {}

        public ClassificationResult(String detectedType, BigDecimal confidence, boolean isConfident) {
            this.detectedType = detectedType;
            this.confidence = confidence;
            this.isConfident = isConfident;
        }

        public String getDetectedType() { return detectedType; }
        public void setDetectedType(String detectedType) { this.detectedType = detectedType; }
        public BigDecimal getConfidence() { return confidence; }
        public void setConfidence(BigDecimal confidence) { this.confidence = confidence; }
        public boolean isConfident() { return isConfident; }
        public void setConfident(boolean confident) { isConfident = confident; }
    }

    public static class OcrResult {
        private String documentType;
        private String rawText;
        private Map<String, Object> extractedFields;
        private BigDecimal confidence;

        public OcrResult() {}

        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }
        public String getRawText() { return rawText; }
        public void setRawText(String rawText) { this.rawText = rawText; }
        public Map<String, Object> getExtractedFields() { return extractedFields; }
        public void setExtractedFields(Map<String, Object> extractedFields) { this.extractedFields = extractedFields; }
        public BigDecimal getConfidence() { return confidence; }
        public void setConfidence(BigDecimal confidence) { this.confidence = confidence; }
    }

    public static class VerificationFieldReport {
        private String fieldName;
        private String applicationValue;
        private String extractedValue;
        private String status; // MATCH, MISMATCH, NOT_FOUND
        private String severity; // LOW, MEDIUM, HIGH
        private String note;

        public VerificationFieldReport() {}

        public VerificationFieldReport(String fieldName, String applicationValue, String extractedValue, String status, String severity, String note) {
            this.fieldName = fieldName;
            this.applicationValue = applicationValue;
            this.extractedValue = extractedValue;
            this.status = status;
            this.severity = severity;
            this.note = note;
        }

        public String getFieldName() { return fieldName; }
        public void setFieldName(String fieldName) { this.fieldName = fieldName; }
        public String getApplicationValue() { return applicationValue; }
        public void setApplicationValue(String applicationValue) { this.applicationValue = applicationValue; }
        public String getExtractedValue() { return extractedValue; }
        public void setExtractedValue(String extractedValue) { this.extractedValue = extractedValue; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }

    public static class FraudRiskEvaluation {
        private int riskScore;
        private String riskLevel; // LOW, MEDIUM, HIGH
        private Map<String, Object> signals;
        private List<String> explainableReasons;

        public FraudRiskEvaluation() {}

        public FraudRiskEvaluation(int riskScore, String riskLevel, Map<String, Object> signals, List<String> explainableReasons) {
            this.riskScore = riskScore;
            this.riskLevel = riskLevel;
            this.signals = signals;
            this.explainableReasons = explainableReasons;
        }

        public int getRiskScore() { return riskScore; }
        public void setRiskScore(int riskScore) { this.riskScore = riskScore; }
        public String getRiskLevel() { return riskLevel; }
        public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
        public Map<String, Object> getSignals() { return signals; }
        public void setSignals(Map<String, Object> signals) { this.signals = signals; }
        public List<String> getExplainableReasons() { return explainableReasons; }
        public void setExplainableReasons(List<String> explainableReasons) { this.explainableReasons = explainableReasons; }
    }

    public static class ChatRequest {
        private String message;
        private Long studentId;
        private Long applicationId;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public Long getApplicationId() { return applicationId; }
        public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    }

    public static class ChatResponse {
        private String answer;
        private List<String> sources;
        private List<String> suggestions;

        public ChatResponse() {}

        public ChatResponse(String answer, List<String> sources, List<String> suggestions) {
            this.answer = answer;
            this.sources = sources;
            this.suggestions = suggestions;
        }

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
        public List<String> getSources() { return sources; }
        public void setSources(List<String> sources) { this.sources = sources; }
        public List<String> getSuggestions() { return suggestions; }
        public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    }
}
