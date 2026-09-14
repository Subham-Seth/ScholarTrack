package com.scholartrack.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_risk_scores")
public class FraudRiskScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    @JsonIgnore
    private Application application;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore; // 0 to 100

    @Column(name = "risk_level", nullable = false, length = 20)
    private String riskLevel; // LOW, MEDIUM, HIGH

    @Column(name = "signals_json", columnDefinition = "TEXT")
    private String signalsJson;

    @Column(name = "explainable_reasons_json", columnDefinition = "TEXT")
    private String explainableReasonsJson;

    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt = LocalDateTime.now();

    public FraudRiskScore() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getSignalsJson() { return signalsJson; }
    public void setSignalsJson(String signalsJson) { this.signalsJson = signalsJson; }

    public String getExplainableReasonsJson() { return explainableReasonsJson; }
    public void setExplainableReasonsJson(String explainableReasonsJson) { this.explainableReasonsJson = explainableReasonsJson; }

    public LocalDateTime getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(LocalDateTime evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
