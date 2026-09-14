package com.scholartrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scholarships")
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 200)
    private String provider;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String category; // Merit-cum-Means, Special Category, Technical/STEM, etc.

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate deadline;

    @Column(name = "max_family_income", precision = 12, scale = 2)
    private BigDecimal maxFamilyIncome;

    @Column(name = "min_cgpa_percentage", precision = 5, scale = 2)
    private BigDecimal minCgpaPercentage;

    @Column(name = "eligible_courses", columnDefinition = "TEXT")
    private String eligibleCourses; // comma separated: B.Tech,M.Tech,MBBS or ALL

    @Column(name = "eligible_categories", columnDefinition = "TEXT")
    private String eligibleCategories; // comma separated: GENERAL,OBC,SC,ST,EWS or ALL

    @Column(name = "eligible_states", columnDefinition = "TEXT")
    private String eligibleStates; // comma separated or ALL

    @Column(name = "required_documents", columnDefinition = "TEXT")
    private String requiredDocuments; // comma separated doc types

    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "scholarship", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EligibilityRule> rules = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Scholarship() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public List<EligibilityRule> getRules() { return rules; }
    public void setRules(List<EligibilityRule> rules) { this.rules = rules; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
