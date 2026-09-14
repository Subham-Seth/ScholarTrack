package com.scholartrack.repository;

import com.scholartrack.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {
    List<Scholarship> findByIsActiveTrue();
    List<Scholarship> findByCategory(String category);
    
    @Query("SELECT s FROM Scholarship s WHERE s.isActive = true AND " +
           "(LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(s.provider) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Scholarship> searchScholarships(@Param("query") String query);

    List<Scholarship> findByIsActiveTrueAndDeadlineGreaterThanEqual(LocalDate date);
}
