package com.scholartrack.dto;

import java.util.ArrayList;
import java.util.List;

public class EligibilityDtos {

    public static class CriterionEvaluation {
        private String criterionName;
        private String requiredValue;
        private String studentValue;
        private boolean passed;
        private String message;

        public CriterionEvaluation() {}

        public CriterionEvaluation(String criterionName, String requiredValue, String studentValue, boolean passed, String message) {
            this.criterionName = criterionName;
            this.requiredValue = requiredValue;
            this.studentValue = studentValue;
            this.passed = passed;
            this.message = message;
        }

        public String getCriterionName() { return criterionName; }
        public void setCriterionName(String criterionName) { this.criterionName = criterionName; }
        public String getRequiredValue() { return requiredValue; }
        public void setRequiredValue(String requiredValue) { this.requiredValue = requiredValue; }
        public String getStudentValue() { return studentValue; }
        public void setStudentValue(String studentValue) { this.studentValue = studentValue; }
        public boolean isPassed() { return passed; }
        public void setPassed(boolean passed) { this.passed = passed; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class EligibilityResult {
        private Long scholarshipId;
        private String scholarshipTitle;
        private String status; // "ELIGIBLE", "NOT_ELIGIBLE", "REQUIRES_REVIEW"
        private int matchScorePercentage;
        private List<CriterionEvaluation> criteria = new ArrayList<>();
        private List<String> passedCriteria = new ArrayList<>();
        private List<String> failedCriteria = new ArrayList<>();
        private List<String> missingFields = new ArrayList<>();
        private String aiExplanation;
        private List<String> suggestedActions = new ArrayList<>();
        private List<AlternativeScholarship> alternativeScholarships = new ArrayList<>();

        public Long getScholarshipId() { return scholarshipId; }
        public void setScholarshipId(Long scholarshipId) { this.scholarshipId = scholarshipId; }
        public String getScholarshipTitle() { return scholarshipTitle; }
        public void setScholarshipTitle(String scholarshipTitle) { this.scholarshipTitle = scholarshipTitle; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public int getMatchScorePercentage() { return matchScorePercentage; }
        public void setMatchScorePercentage(int matchScorePercentage) { this.matchScorePercentage = matchScorePercentage; }
        public List<CriterionEvaluation> getCriteria() { return criteria; }
        public void setCriteria(List<CriterionEvaluation> criteria) { this.criteria = criteria; }
        public List<String> getPassedCriteria() { return passedCriteria; }
        public void setPassedCriteria(List<String> passedCriteria) { this.passedCriteria = passedCriteria; }
        public List<String> getFailedCriteria() { return failedCriteria; }
        public void setFailedCriteria(List<String> failedCriteria) { this.failedCriteria = failedCriteria; }
        public List<String> getMissingFields() { return missingFields; }
        public void setMissingFields(List<String> missingFields) { this.missingFields = missingFields; }
        public String getAiExplanation() { return aiExplanation; }
        public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }
        public List<String> getSuggestedActions() { return suggestedActions; }
        public void setSuggestedActions(List<String> suggestedActions) { this.suggestedActions = suggestedActions; }
        public List<AlternativeScholarship> getAlternativeScholarships() { return alternativeScholarships; }
        public void setAlternativeScholarships(List<AlternativeScholarship> alternativeScholarships) { this.alternativeScholarships = alternativeScholarships; }
    }

    public static class AlternativeScholarship {
        private Long id;
        private String title;
        private String provider;
        private int matchPercentage;

        public AlternativeScholarship() {}

        public AlternativeScholarship(Long id, String title, String provider, int matchPercentage) {
            this.id = id;
            this.title = title;
            this.provider = provider;
            this.matchPercentage = matchPercentage;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        public int getMatchPercentage() { return matchPercentage; }
        public void setMatchPercentage(int matchPercentage) { this.matchPercentage = matchPercentage; }
    }
}
