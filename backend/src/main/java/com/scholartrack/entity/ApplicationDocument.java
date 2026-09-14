package com.scholartrack.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "application_documents")
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @JsonIgnore
    private Application application;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "required_doc_type", length = 100)
    private String requiredDocType;

    @Column(length = 50)
    private String status = "PENDING"; // PENDING, VERIFIED, MISMATCH, REJECTED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ApplicationDocument() {}

    public ApplicationDocument(Application application, Document document, String requiredDocType) {
        this.application = application;
        this.document = document;
        this.requiredDocType = requiredDocType;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public Document getDocument() { return document; }
    public void setDocument(Document document) { this.document = document; }

    public String getRequiredDocType() { return requiredDocType; }
    public void setRequiredDocType(String requiredDocType) { this.requiredDocType = requiredDocType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
