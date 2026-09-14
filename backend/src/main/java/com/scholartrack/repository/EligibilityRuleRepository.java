package com.scholartrack.repository;

import com.scholartrack.entity.EligibilityRule;
import com.scholartrack.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EligibilityRuleRepository extends JpaRepository<EligibilityRule, Long> {
    List<EligibilityRule> findByScholarship(Scholarship scholarship);
    List<EligibilityRule> findByScholarshipId(Long scholarshipId);
}
