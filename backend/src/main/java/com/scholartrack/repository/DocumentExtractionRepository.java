package com.scholartrack.repository;

import com.scholartrack.entity.DocumentExtraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentExtractionRepository extends JpaRepository<DocumentExtraction, Long> {
    Optional<DocumentExtraction> findByDocumentId(Long documentId);
}
