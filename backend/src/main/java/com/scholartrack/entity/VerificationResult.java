package com.scholartrack.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_results")
public class VerificationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    @JsonIgnore
    private Application application;

    @Column(name = "overall_status", nullable = false, length = 50)
    private String overallStatus; // MATCHED, MISMATCH_DETECTED, REQUIRES_REVIEW

    @Column(name = "field_comparison_json", columnDefinition = "TEXT")
    private String fieldComparisonJson;

    @Column(name = "mismatch_count")
    private Integer mismatchCount = 0;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String notes;

    public VerificationResult() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

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
