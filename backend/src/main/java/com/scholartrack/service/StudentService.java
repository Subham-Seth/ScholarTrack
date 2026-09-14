package com.scholartrack.service;

import com.scholartrack.dto.StudentProfileDto;
import com.scholartrack.entity.Student;
import com.scholartrack.entity.User;
import com.scholartrack.exception.ResourceNotFoundException;
import com.scholartrack.repository.StudentRepository;
import com.scholartrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository, AuditLogService auditLogService) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    public StudentProfileDto getProfileByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));
        return mapToDto(student);
    }

    public StudentProfileDto getProfileById(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + studentId));
        return mapToDto(student);
    }

    @Transactional
    public StudentProfileDto updateProfile(Long userId, StudentProfileDto dto) {
        Student student = studentRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    Student s = new Student();
                    s.setUser(user);
                    return s;
                });

        if (dto.getFullName() != null) student.setFullName(dto.getFullName());
        if (dto.getDob() != null) student.setDob(dto.getDob());
        if (dto.getGender() != null) student.setGender(dto.getGender());
        if (dto.getPhone() != null) student.setPhone(dto.getPhone());
        if (dto.getCollege() != null) student.setCollege(dto.getCollege());
        if (dto.getCourse() != null) student.setCourse(dto.getCourse());
        if (dto.getBranch() != null) student.setBranch(dto.getBranch());
        if (dto.getAcademicYear() != null) student.setAcademicYear(dto.getAcademicYear());
        if (dto.getCgpaPercentage() != null) student.setCgpaPercentage(dto.getCgpaPercentage());
        if (dto.getFamilyIncome() != null) student.setFamilyIncome(dto.getFamilyIncome());
        if (dto.getIncomeSource() != null) student.setIncomeSource(dto.getIncomeSource());
        if (dto.getCategory() != null) student.setCategory(dto.getCategory());
        if (dto.getDomicileState() != null) student.setDomicileState(dto.getDomicileState());
        if (dto.getDisabilityStatus() != null) student.setDisabilityStatus(dto.getDisabilityStatus());

        student = studentRepository.save(student);

        auditLogService.log(userId, student.getUser().getEmail(), student.getUser().getRole(),
                "PROFILE_UPDATE", "STUDENT", student.getId().toString(), "Updated student academic & personal profile");

        return mapToDto(student);
    }

    public StudentProfileDto mapToDto(Student s) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(s.getId());
        dto.setUserId(s.getUser() != null ? s.getUser().getId() : null);
        dto.setEmail(s.getUser() != null ? s.getUser().getEmail() : null);
        dto.setFullName(s.getFullName());
        dto.setDob(s.getDob());
        dto.setGender(s.getGender());
        dto.setPhone(s.getPhone());
        dto.setCollege(s.getCollege());
        dto.setCourse(s.getCourse());
        dto.setBranch(s.getBranch());
        dto.setAcademicYear(s.getAcademicYear());
        dto.setCgpaPercentage(s.getCgpaPercentage());
        dto.setFamilyIncome(s.getFamilyIncome());
        dto.setIncomeSource(s.getIncomeSource());
        dto.setCategory(s.getCategory());
        dto.setDomicileState(s.getDomicileState());
        dto.setDisabilityStatus(s.getDisabilityStatus());
        dto.setProfileCompletionPct(s.getProfileCompletionPct());
        return dto;
    }
}
