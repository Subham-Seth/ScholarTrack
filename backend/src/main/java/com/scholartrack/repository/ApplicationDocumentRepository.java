package com.scholartrack.repository;

import com.scholartrack.entity.ApplicationDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, Long> {
    List<ApplicationDocument> findByApplicationId(Long applicationId);
    Optional<ApplicationDocument> findByApplicationIdAndRequiredDocType(Long applicationId, String requiredDocType);
}
