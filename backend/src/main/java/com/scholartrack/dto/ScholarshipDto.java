package com.scholartrack.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ScholarshipDto {
    private Long id;
    private String title;
    private String provider;
    private String description;
    private String category;
    private BigDecimal amount;
    private LocalDate deadline;
    private BigDecimal maxFamilyIncome;
    private BigDecimal minCgpaPercentage;
    private String eligibleCourses;
    private String eligibleCategories;
    private String eligibleStates;
    private String requiredDocuments;
    private Boolean isActive;
    private Integer matchPercentage;
    private List<RuleDto> rules;

    public static class RuleDto {
        private Long id;
        private String ruleType;
        private String fieldName;
        private String operator;
        private String ruleValue;
        private Boolean isMandatory;
        private String description;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getRuleType() { return ruleType; }
        public void setRuleType(String ruleType) { this.ruleType = ruleType; }
        public String getFieldName() { return fieldName; }
        public void setFieldName(String fieldName) { this.fieldName = fieldName; }
        public String getOperator() { return operator; }
        public void setOperator(String operator) { this.operator = operator; }
        public String getRuleValue() { return ruleValue; }
        public void setRuleValue(String ruleValue) { this.ruleValue = ruleValue; }
        public Boolean getIsMandatory() { return isMandatory; }
        public void setIsMandatory(Boolean isMandatory) { this.isMandatory = isMandatory; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public BigDecimal getMaxFamilyIncome() { return maxFamilyIncome; }
    public void setMaxFamilyIncome(BigDecimal maxFamilyIncome) { this.maxFamilyIncome = maxFamilyIncome; }
    public BigDecimal getMinCgpaPercentage() { return minCgpaPercentage; }
    public void setMinCgpaPercentage(BigDecimal minCgpaPercentage) { this.minCgpaPercentage = minCgpaPercentage; }
    public String getEligibleCourses() { return eligibleCourses; }
    public void setEligibleCourses(String eligibleCourses) { this.eligibleCourses = eligibleCourses; }
    public String getEligibleCategories() { return eligibleCategories; }
    public void setEligibleCategories(String eligibleCategories) { this.eligibleCategories = eligibleCategories; }
    public String getEligibleStates() { return eligibleStates; }
    public void setEligibleStates(String eligibleStates) { this.eligibleStates = eligibleStates; }
    public String getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(String requiredDocuments) { this.requiredDocuments = requiredDocuments; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Integer getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(Integer matchPercentage) { this.matchPercentage = matchPercentage; }
    public List<RuleDto> getRules() { return rules; }
    public void setRules(List<RuleDto> rules) { this.rules = rules; }
}
