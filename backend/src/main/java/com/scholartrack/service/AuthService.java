package com.scholartrack.service;

import com.scholartrack.dto.AuthDtos.*;
import com.scholartrack.entity.Admin;
import com.scholartrack.entity.Student;
import com.scholartrack.entity.User;
import com.scholartrack.exception.BadRequestException;
import com.scholartrack.repository.AdminRepository;
import com.scholartrack.repository.StudentRepository;
import com.scholartrack.repository.UserRepository;
import com.scholartrack.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository,
                       StudentRepository studentRepository,
                       AdminRepository adminRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils,
                       AuditLogService auditLogService,
                       NotificationService notificationService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered: " + req.getEmail());
        }

        String role = (req.getRole() != null && req.getRole().equalsIgnoreCase("ADMIN")) ? "ADMIN" : "STUDENT";
        String encodedPass = passwordEncoder.encode(req.getPassword());

        User user = new User(req.getEmail(), encodedPass, role);
        user = userRepository.save(user);

        Long profileId = null;
        if ("STUDENT".equals(role)) {
            Student student = new Student();
            student.setUser(user);
            student.setFullName(req.getFullName());
            student.setPhone(req.getPhone());
            student.setCollege(req.getCollege());
            student.setCourse(req.getCourse());
            student = studentRepository.save(student);
            profileId = student.getId();

            notificationService.sendNotification(user, "Welcome to ScholarTrack!", "Your student account has been created. Complete your academic profile to discover scholarships.", "INFO");
        } else {
            Admin admin = new Admin();
            admin.setUser(user);
            admin.setFullName(req.getFullName());
            admin.setDepartment(req.getDepartment() != null ? req.getDepartment() : "Scholarship Administration");
            admin.setEmployeeId("ADM-" + System.currentTimeMillis() % 10000);
            admin = adminRepository.save(admin);
            profileId = admin.getId();
        }

        auditLogService.log(user.getId(), user.getEmail(), user.getRole(), "USER_REGISTER", "USER", user.getId().toString(), "Registered new " + role);

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole(), req.getFullName(), profileId);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password.");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new BadRequestException("Account is deactivated. Please contact support.");
        }

        String fullName = user.getEmail();
        Long profileId = null;
        if ("STUDENT".equals(user.getRole())) {
            Student student = studentRepository.findByUserId(user.getId()).orElse(null);
            if (student != null) {
                fullName = student.getFullName();
                profileId = student.getId();
            }
        } else if ("ADMIN".equals(user.getRole())) {
            Admin admin = adminRepository.findByUserId(user.getId()).orElse(null);
            if (admin != null) {
                fullName = admin.getFullName();
                profileId = admin.getId();
            }
        }

        auditLogService.log(user.getId(), user.getEmail(), user.getRole(), "USER_LOGIN", "USER", user.getId().toString(), "User logged in successfully");

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole(), fullName, profileId);
    }
}
