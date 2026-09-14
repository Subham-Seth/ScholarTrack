package com.scholartrack.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "eligibility_rules")
public class EligibilityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scholarship_id", nullable = false)
    @JsonIgnore
    private Scholarship scholarship;

    @Column(name = "rule_type", nullable = false, length = 50)
    private String ruleType; // ACADEMIC, FINANCIAL, GENDER, STATE, CATEGORY, COURSE

    @Column(name = "field_name", nullable = false, length = 50)
    private String fieldName; // cgpa_percentage, family_income, gender, domicile_state, etc.

    @Column(nullable = false, length = 20)
    private String operator; // LTE, GTE, EQ, IN, CONTAINS

    @Column(name = "rule_value", nullable = false, length = 255)
    private String ruleValue;

    @Column(name = "is_mandatory")
    private Boolean isMandatory = true;

    @Column(length = 255)
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public EligibilityRule() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Scholarship getScholarship() { return scholarship; }
    public void setScholarship(Scholarship scholarship) { this.scholarship = scholarship; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
