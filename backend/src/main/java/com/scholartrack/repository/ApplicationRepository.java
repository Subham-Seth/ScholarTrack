package com.scholartrack.repository;

import com.scholartrack.entity.Application;
import com.scholartrack.entity.Scholarship;
import com.scholartrack.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByStudentOrderByCreatedAtDesc(Student student);
    List<Application> findByScholarship(Scholarship scholarship);
    List<Application> findByStatus(String status);
    Optional<Application> findByApplicationNumber(String applicationNumber);
    boolean existsByStudentIdAndScholarshipId(Long studentId, Long scholarshipId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.status = :status")
    long countByStatus(@Param("status") String status);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countGroupedByStatus();

    @Query("SELECT a.scholarship.title, COUNT(a) FROM Application a GROUP BY a.scholarship.title")
    List<Object[]> countGroupedByScholarship();
}
