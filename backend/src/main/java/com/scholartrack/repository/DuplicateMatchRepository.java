package com.scholartrack.repository;

import com.scholartrack.entity.DuplicateMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DuplicateMatchRepository extends JpaRepository<DuplicateMatch, Long> {
    List<DuplicateMatch> findByApplicationId(Long applicationId);
    List<DuplicateMatch> findAllByOrderBySimilarityScoreDesc();
}
