package com.scholartrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    private LocalDate dob;

    @Column(length = 20)
    private String gender;

    @Column(length = 20)
    private String phone;

    @Column(length = 200)
    private String college;

    @Column(length = 100)
    private String course;

    @Column(length = 100)
    private String branch;

    @Column(name = "academic_year")
    private Integer academicYear;

    @Column(name = "cgpa_percentage", precision = 5, scale = 2)
    private BigDecimal cgpaPercentage;

    @Column(name = "family_income", precision = 12, scale = 2)
    private BigDecimal familyIncome;

    @Column(name = "income_source", length = 100)
    private String incomeSource;

    @Column(length = 50)
    private String category; // GENERAL, OBC, SC, ST, EWS

    @Column(name = "domicile_state", length = 100)
    private String domicileState;

    @Column(name = "disability_status", length = 50)
    private String disabilityStatus = "NONE";

    @Column(name = "profile_completion_pct")
    private Integer profileCompletionPct = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Student() {}

    @PrePersist
    @PreUpdate
    public void calculateCompletionAndTimestamps() {
        this.updatedAt = LocalDateTime.now();
        int score = 0;
        if (fullName != null && !fullName.isBlank()) score += 10;
        if (dob != null) score += 10;
        if (gender != null && !gender.isBlank()) score += 10;
        if (phone != null && !phone.isBlank()) score += 10;
        if (college != null && !college.isBlank()) score += 10;
        if (course != null && !course.isBlank()) score += 10;
        if (branch != null && !branch.isBlank()) score += 10;
        if (cgpaPercentage != null) score += 10;
        if (familyIncome != null) score += 10;
        if (category != null && !category.isBlank()) score += 5;
        if (domicileState != null && !domicileState.isBlank()) score += 5;
        this.profileCompletionPct = Math.min(score, 100);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public Integer getAcademicYear() { return academicYear; }
    public void setAcademicYear(Integer academicYear) { this.academicYear = academicYear; }

    public BigDecimal getCgpaPercentage() { return cgpaPercentage; }
    public void setCgpaPercentage(BigDecimal cgpaPercentage) { this.cgpaPercentage = cgpaPercentage; }

    public BigDecimal getFamilyIncome() { return familyIncome; }
    public void setFamilyIncome(BigDecimal familyIncome) { this.familyIncome = familyIncome; }

    public String getIncomeSource() { return incomeSource; }
    public void setIncomeSource(String incomeSource) { this.incomeSource = incomeSource; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDomicileState() { return domicileState; }
    public void setDomicileState(String domicileState) { this.domicileState = domicileState; }

    public String getDisabilityStatus() { return disabilityStatus; }
    public void setDisabilityStatus(String disabilityStatus) { this.disabilityStatus = disabilityStatus; }

    public Integer getProfileCompletionPct() { return profileCompletionPct; }
    public void setProfileCompletionPct(Integer profileCompletionPct) { this.profileCompletionPct = profileCompletionPct; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
