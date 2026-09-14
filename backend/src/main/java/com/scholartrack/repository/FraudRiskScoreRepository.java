package com.scholartrack.repository;

import com.scholartrack.entity.FraudRiskScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FraudRiskScoreRepository extends JpaRepository<FraudRiskScore, Long> {
    Optional<FraudRiskScore> findByApplicationId(Long applicationId);
    List<FraudRiskScore> findByRiskLevel(String riskLevel);
    List<FraudRiskScore> findAllByOrderByRiskScoreDesc();
}
