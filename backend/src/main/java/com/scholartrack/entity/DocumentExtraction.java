package com.scholartrack.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_extractions")
public class DocumentExtraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false, unique = true)
    @JsonIgnore
    private Document document;

    @Column(name = "raw_ocr_text", columnDefinition = "TEXT")
    private String rawOcrText;

    @Column(name = "extracted_data_json", columnDefinition = "TEXT")
    private String extractedDataJson; // JSON string with fields: applicantName, annualIncome, certNumber, etc.

    @Column(name = "confidence_score", precision = 5, scale = 2)
    private BigDecimal confidenceScore;

    @Column(name = "extraction_date")
    private LocalDateTime extractionDate = LocalDateTime.now();

    public DocumentExtraction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Document getDocument() { return document; }
    public void setDocument(Document document) { this.document = document; }

    public String getRawOcrText() { return rawOcrText; }
    public void setRawOcrText(String rawOcrText) { this.rawOcrText = rawOcrText; }

    public String getExtractedDataJson() { return extractedDataJson; }
    public void setExtractedDataJson(String extractedDataJson) { this.extractedDataJson = extractedDataJson; }

    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }

    public LocalDateTime getExtractionDate() { return extractionDate; }
    public void setExtractionDate(LocalDateTime extractionDate) { this.extractionDate = extractionDate; }
}
