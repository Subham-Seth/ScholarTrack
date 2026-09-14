package com.scholartrack.controller;

import com.scholartrack.dto.AiDtos.*;
import com.scholartrack.dto.ApiResponse;
import com.scholartrack.dto.ScholarshipDto;
import com.scholartrack.dto.StudentProfileDto;
import com.scholartrack.entity.Application;
import com.scholartrack.entity.Scholarship;
import com.scholartrack.entity.Student;
import com.scholartrack.repository.ApplicationRepository;
import com.scholartrack.repository.ScholarshipRepository;
import com.scholartrack.repository.StudentRepository;
import com.scholartrack.security.CustomUserDetails;
import com.scholartrack.service.AiService;
import com.scholartrack.service.EligibilityService;
import com.scholartrack.service.ScholarshipService;
import com.scholartrack.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;
    private final StudentService studentService;
    private final StudentRepository studentRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final ApplicationRepository applicationRepository;
    private final ScholarshipService scholarshipService;
    private final EligibilityService eligibilityService;

    public AiController(AiService aiService,
                        StudentService studentService,
                        StudentRepository studentRepository,
                        ScholarshipRepository scholarshipRepository,
                        ApplicationRepository applicationRepository,
                        ScholarshipService scholarshipService,
                        EligibilityService eligibilityService) {
        this.aiService = aiService;
        this.studentService = studentService;
        this.studentRepository = studentRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.applicationRepository = applicationRepository;
        this.scholarshipService = scholarshipService;
        this.eligibilityService = eligibilityService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "ScholarTrack AI Engine", "ragEnabled", true));
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<ChatResponse>> chat(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody ChatRequest request) {
        Student student = null;
        List<Application> studentApps = Collections.emptyList();

        if (user != null && "STUDENT".equals(user.getRole())) {
            student = studentRepository.findByUserId(user.getId()).orElse(null);
            if (student != null) {
                studentApps = applicationRepository.findByStudentOrderByCreatedAtDesc(student);
            }
        }

        List<Scholarship> activeScholarships = scholarshipRepository.findByIsActiveTrue();
        ChatResponse response = aiService.chatWithScholarTrack(request.getMessage(), student, activeScholarships, studentApps);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<ScholarshipDto>>> getRecommendations(
            @AuthenticationPrincipal CustomUserDetails user) {
        Student student = null;
        if (user != null && "STUDENT".equals(user.getRole())) {
            student = studentRepository.findByUserId(user.getId()).orElse(null);
        }

        List<Scholarship> all = scholarshipRepository.findByIsActiveTrue();
        final Student currentStudent = student;

        List<ScholarshipDto> dtos = all.stream().map(s -> {
            ScholarshipDto dto = scholarshipService.mapToDto(s);
            int matchPct = eligibilityService.estimateMatchScore(currentStudent, s);
            dto.setMatchPercentage(matchPct);
            return dto;
        })
        .sorted((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()))
        .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(dtos));
    }
}
