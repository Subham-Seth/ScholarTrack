package com.scholartrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "duplicate_matches")
public class DuplicateMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "matched_application_id", nullable = false)
    private Application matchedApplication;

    @Column(name = "similarity_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal similarityScore;

    @Column(name = "matched_fields_json", columnDefinition = "TEXT")
    private String matchedFieldsJson;

    @Column(name = "flagged_at")
    private LocalDateTime flaggedAt = LocalDateTime.now();

    public DuplicateMatch() {}

    public DuplicateMatch(Application application, Application matchedApplication, BigDecimal similarityScore, String matchedFieldsJson) {
        this.application = application;
        this.matchedApplication = matchedApplication;
        this.similarityScore = similarityScore;
        this.matchedFieldsJson = matchedFieldsJson;
        this.flaggedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public Application getMatchedApplication() { return matchedApplication; }
    public void setMatchedApplication(Application matchedApplication) { this.matchedApplication = matchedApplication; }

    public BigDecimal getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(BigDecimal similarityScore) { this.similarityScore = similarityScore; }

    public String getMatchedFieldsJson() { return matchedFieldsJson; }
    public void setMatchedFieldsJson(String matchedFieldsJson) { this.matchedFieldsJson = matchedFieldsJson; }

    public LocalDateTime getFlaggedAt() { return flaggedAt; }
    public void setFlaggedAt(LocalDateTime flaggedAt) { this.flaggedAt = flaggedAt; }
}
