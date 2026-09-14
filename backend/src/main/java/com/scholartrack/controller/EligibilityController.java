package com.scholartrack.controller;

import com.scholartrack.dto.ApiResponse;
import com.scholartrack.dto.EligibilityDtos.EligibilityResult;
import com.scholartrack.dto.StudentProfileDto;
import com.scholartrack.security.CustomUserDetails;
import com.scholartrack.service.EligibilityService;
import com.scholartrack.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    private final EligibilityService eligibilityService;
    private final StudentService studentService;

    public EligibilityController(EligibilityService eligibilityService, StudentService studentService) {
        this.eligibilityService = eligibilityService;
        this.studentService = studentService;
    }

    @PostMapping("/check")
    public ResponseEntity<ApiResponse<EligibilityResult>> checkEligibility(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, Long> payload) {
        Long scholarshipId = payload.get("scholarshipId");
        Long studentId = null;
        if (user != null && "STUDENT".equals(user.getRole())) {
            StudentProfileDto prof = studentService.getProfileByUserId(user.getId());
            studentId = prof.getId();
        } else if (payload.containsKey("studentId")) {
            studentId = payload.get("studentId");
        }

        EligibilityResult result = eligibilityService.evaluate(studentId, scholarshipId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
