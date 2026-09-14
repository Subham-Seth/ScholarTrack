package com.scholartrack.config;

import com.scholartrack.entity.*;
import com.scholartrack.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final EligibilityRuleRepository ruleRepository;
    private final ApplicationRepository applicationRepository;
    private final DocumentRepository documentRepository;
    private final ApplicationDocumentRepository appDocRepository;
    private final DocumentExtractionRepository extractionRepository;
    private final VerificationResultRepository verificationRepository;
    private final DuplicateMatchRepository duplicateRepository;
    private final FraudRiskScoreRepository fraudRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           AdminRepository adminRepository,
                           ScholarshipRepository scholarshipRepository,
                           EligibilityRuleRepository ruleRepository,
                           ApplicationRepository applicationRepository,
                           DocumentRepository documentRepository,
                           ApplicationDocumentRepository appDocRepository,
                           DocumentExtractionRepository extractionRepository,
                           VerificationResultRepository verificationRepository,
                           DuplicateMatchRepository duplicateRepository,
                           FraudRiskScoreRepository fraudRepository,
                           NotificationRepository notificationRepository,
                           AuditLogRepository auditLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.ruleRepository = ruleRepository;
        this.applicationRepository = applicationRepository;
        this.documentRepository = documentRepository;
        this.appDocRepository = appDocRepository;
        this.extractionRepository = extractionRepository;
        this.verificationRepository = verificationRepository;
        this.duplicateRepository = duplicateRepository;
        this.fraudRepository = fraudRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already present
        }

        String studentPass = passwordEncoder.encode("Student@123");
        String adminPass = passwordEncoder.encode("Admin@123");

        // 1. Seed Admin
        User adminUser = userRepository.save(new User("admin@scholartrack.edu", adminPass, "ADMIN"));
        Admin admin = new Admin();
        admin.setUser(adminUser);
        admin.setFullName("Dr. Aris Thorne");
        admin.setDepartment("Scholarship & Welfare Directorate");
        admin.setDesignation("Chief Verification Officer");
        admin.setEmployeeId("ADM-2024-001");
        admin = adminRepository.save(admin);

        // 2. Seed Students
        User u1 = userRepository.save(new User("rahul.kumar@scholartrack.edu", studentPass, "STUDENT"));
        Student s1 = new Student();
        s1.setUser(u1);
        s1.setFullName("Rahul Kumar");
        s1.setDob(LocalDate.of(2004, 5, 14));
        s1.setGender("Male");
        s1.setPhone("+91 98765 43210");
        s1.setCollege("National Institute of Technology");
        s1.setCourse("B.Tech");
        s1.setBranch("Computer Science and Engineering");
        s1.setAcademicYear(3);
        s1.setCgpaPercentage(BigDecimal.valueOf(86.50));
        s1.setFamilyIncome(BigDecimal.valueOf(240000.00));
        s1.setIncomeSource("Agriculture & Small Business");
        s1.setCategory("OBC");
        s1.setDomicileState("Maharashtra");
        s1.setDisabilityStatus("NONE");
        s1 = studentRepository.save(s1);

        User u2 = userRepository.save(new User("priya.sharma@scholartrack.edu", studentPass, "STUDENT"));
        Student s2 = new Student();
        s2.setUser(u2);
        s2.setFullName("Priya Sharma");
        s2.setDob(LocalDate.of(2003, 11, 22));
        s2.setGender("Female");
        s2.setPhone("+91 98123 45678");
        s2.setCollege("Indian Institute of Information Technology");
        s2.setCourse("B.Tech");
        s2.setBranch("Electronics and Communication");
        s2.setAcademicYear(4);
        s2.setCgpaPercentage(BigDecimal.valueOf(92.40));
        s2.setFamilyIncome(BigDecimal.valueOf(180000.00));
        s2.setIncomeSource("Private Service");
        s2.setCategory("GENERAL");
        s2.setDomicileState("Delhi");
        s2.setDisabilityStatus("NONE");
        s2 = studentRepository.save(s2);

        User u3 = userRepository.save(new User("amit.patel@scholartrack.edu", studentPass, "STUDENT"));
        Student s3 = new Student();
        s3.setUser(u3);
        s3.setFullName("Amit Patel");
        s3.setDob(LocalDate.of(2002, 8, 19));
        s3.setGender("Male");
        s3.setPhone("+91 97234 56789");
        s3.setCollege("Gujarat Technological University");
        s3.setCourse("M.Tech");
        s3.setBranch("Artificial Intelligence");
        s3.setAcademicYear(1);
        s3.setCgpaPercentage(BigDecimal.valueOf(78.00));
        s3.setFamilyIncome(BigDecimal.valueOf(420000.00));
        s3.setIncomeSource("Business");
        s3.setCategory("GENERAL");
        s3.setDomicileState("Gujarat");
        s3.setDisabilityStatus("NONE");
        s3 = studentRepository.save(s3);

        User u4 = userRepository.save(new User("ananya.verma@scholartrack.edu", studentPass, "STUDENT"));
        Student s4 = new Student();
        s4.setUser(u4);
        s4.setFullName("Ananya Verma");
        s4.setDob(LocalDate.of(2004, 2, 10));
        s4.setGender("Female");
        s4.setPhone("+91 96345 67890");
        s4.setCollege("All India Institute of Medical Sciences");
        s4.setCourse("MBBS");
        s4.setBranch("Medicine");
        s4.setAcademicYear(2);
        s4.setCgpaPercentage(BigDecimal.valueOf(89.20));
        s4.setFamilyIncome(BigDecimal.valueOf(210000.00));
        s4.setIncomeSource("Teaching");
        s4.setCategory("EWS");
        s4.setDomicileState("Uttar Pradesh");
        s4.setDisabilityStatus("NONE");
        s4 = studentRepository.save(s4);

        User u5 = userRepository.save(new User("rahul.k@scholartrack.edu", studentPass, "STUDENT"));
        Student s5 = new Student();
        s5.setUser(u5);
        s5.setFullName("Rahul K.");
        s5.setDob(LocalDate.of(2004, 5, 14));
        s5.setGender("Male");
        s5.setPhone("+91 98765 43210");
        s5.setCollege("National Inst of Tech");
        s5.setCourse("B.Tech");
        s5.setBranch("CSE");
        s5.setAcademicYear(3);
        s5.setCgpaPercentage(BigDecimal.valueOf(85.00));
        s5.setFamilyIncome(BigDecimal.valueOf(240000.00));
        s5.setIncomeSource("Agriculture");
        s5.setCategory("OBC");
        s5.setDomicileState("Maharashtra");
        s5.setDisabilityStatus("NONE");
        s5 = studentRepository.save(s5);

        User u6 = userRepository.save(new User("vikram.singh@scholartrack.edu", studentPass, "STUDENT"));
        Student s6 = new Student();
        s6.setUser(u6);
        s6.setFullName("Vikram Singh");
        s6.setDob(LocalDate.of(2003, 7, 4));
        s6.setGender("Male");
        s6.setPhone("+91 95456 78901");
        s6.setCollege("Delhi Technological University");
        s6.setCourse("B.Tech");
        s6.setBranch("Mechanical Engineering");
        s6.setAcademicYear(3);
        s6.setCgpaPercentage(BigDecimal.valueOf(74.50));
        s6.setFamilyIncome(BigDecimal.valueOf(250000.00));
        s6.setIncomeSource("Daily Wage Labor");
        s6.setCategory("SC");
        s6.setDomicileState("Delhi");
        s6.setDisabilityStatus("NONE");
        s6 = studentRepository.save(s6);

        // 3. Seed Scholarships
        Scholarship sc1 = new Scholarship();
        sc1.setTitle("National Merit-cum-Means Scholarship");
        sc1.setProvider("Ministry of Education");
        sc1.setDescription("Flagship central scholarship program providing assistance to meritorious students from economically weaker sections.");
        sc1.setCategory("Merit-cum-Means");
        sc1.setAmount(BigDecimal.valueOf(75000.00));
        sc1.setDeadline(LocalDate.of(2026, 11, 30));
        sc1.setMaxFamilyIncome(BigDecimal.valueOf(300000.00));
        sc1.setMinCgpaPercentage(BigDecimal.valueOf(75.00));
        sc1.setEligibleCourses("B.Tech,B.Sc,B.Com,B.A,MBBS");
        sc1.setEligibleCategories("ALL");
        sc1.setEligibleStates("ALL");
        sc1.setRequiredDocuments("Marksheet,Income Certificate,Domicile Certificate,Aadhaar Card");
        sc1.setIsActive(true);
        sc1 = scholarshipRepository.save(sc1);

        Scholarship sc2 = new Scholarship();
        sc2.setTitle("Women in STEM Excellence Fellowship");
        sc2.setProvider("Council of Scientific & Industrial Research");
        sc2.setDescription("Dedicated empowerment fellowship designed to support exceptional female scholars enrolled in STEM degree programs.");
        sc2.setCategory("Special Category");
        sc2.setAmount(BigDecimal.valueOf(120000.00));
        sc2.setDeadline(LocalDate.of(2026, 10, 15));
        sc2.setMaxFamilyIncome(BigDecimal.valueOf(600000.00));
        sc2.setMinCgpaPercentage(BigDecimal.valueOf(80.00));
        sc2.setEligibleCourses("B.Tech,M.Tech,B.Sc,M.Sc,PhD");
        sc2.setEligibleCategories("ALL");
        sc2.setEligibleStates("ALL");
        sc2.setRequiredDocuments("Marksheet,College ID,Identity Proof,Income Certificate");
        sc2.setIsActive(true);
        sc2 = scholarshipRepository.save(sc2);

        Scholarship sc3 = new Scholarship();
        sc3.setTitle("Pragati Deep-Tech & AI Innovation Grant");
        sc3.setProvider("National Technology Board");
        sc3.setDescription("Supports undergraduate and postgraduate engineering scholars developing innovative projects in AI, Robotics, and Embedded Systems.");
        sc3.setCategory("Technical/STEM");
        sc3.setAmount(BigDecimal.valueOf(100000.00));
        sc3.setDeadline(LocalDate.of(2026, 12, 5));
        sc3.setMaxFamilyIncome(BigDecimal.valueOf(800000.00));
        sc3.setMinCgpaPercentage(BigDecimal.valueOf(82.00));
        sc3.setEligibleCourses("B.Tech,M.Tech,MCA");
        sc3.setEligibleCategories("ALL");
        sc3.setEligibleStates("ALL");
        sc3.setRequiredDocuments("Marksheet,Project Synopsis,Income Certificate,College Recommendation");
        sc3.setIsActive(true);
        sc3 = scholarshipRepository.save(sc3);

        Scholarship sc4 = new Scholarship();
        sc4.setTitle("Central Sector Scheme for College & University Students");
        sc4.setProvider("Department of Higher Education");
        sc4.setDescription("Financial assistance to meritorious students belonging to families whose annual income is less than ₹4.5 Lakh.");
        sc4.setCategory("Merit");
        sc4.setAmount(BigDecimal.valueOf(50000.00));
        sc4.setDeadline(LocalDate.of(2026, 11, 15));
        sc4.setMaxFamilyIncome(BigDecimal.valueOf(450000.00));
        sc4.setMinCgpaPercentage(BigDecimal.valueOf(80.00));
        sc4.setEligibleCourses("ALL");
        sc4.setEligibleCategories("ALL");
        sc4.setEligibleStates("ALL");
        sc4.setRequiredDocuments("Marksheet,Income Certificate,Bank Passbook,Aadhaar Card");
        sc4.setIsActive(true);
        sc4 = scholarshipRepository.save(sc4);

        Scholarship sc5 = new Scholarship();
        sc5.setTitle("State Domicile Technical Education Merit Award");
        sc5.setProvider("State Directorate of Technical Education");
        sc5.setDescription("Honors outstanding technical students having domicile in Maharashtra, Delhi, or Karnataka to subsidize tuition fees.");
        sc5.setCategory("State Domicile");
        sc5.setAmount(BigDecimal.valueOf(60000.00));
        sc5.setDeadline(LocalDate.of(2026, 10, 31));
        sc5.setMaxFamilyIncome(BigDecimal.valueOf(400000.00));
        sc5.setMinCgpaPercentage(BigDecimal.valueOf(70.00));
        sc5.setEligibleCourses("B.Tech,B.Arch,B.Pharm,Diploma");
        sc5.setEligibleCategories("ALL");
        sc5.setEligibleStates("Maharashtra,Delhi,Karnataka");
        sc5.setRequiredDocuments("Domicile Certificate,Marksheet,Income Certificate,Fee Receipt");
        sc5.setIsActive(true);
        sc5 = scholarshipRepository.save(sc5);

        Scholarship sc6 = new Scholarship();
        sc6.setTitle("Post-Matric Financial Support for SC/ST/OBC Scholars");
        sc6.setProvider("Ministry of Social Justice & Empowerment");
        sc6.setDescription("Government scholarship to uplift underrepresented communities across professional higher education courses.");
        sc6.setCategory("Community Welfare");
        sc6.setAmount(BigDecimal.valueOf(85000.00));
        sc6.setDeadline(LocalDate.of(2026, 12, 31));
        sc6.setMaxFamilyIncome(BigDecimal.valueOf(250000.00));
        sc6.setMinCgpaPercentage(BigDecimal.valueOf(60.00));
        sc6.setEligibleCourses("ALL");
        sc6.setEligibleCategories("SC,ST,OBC");
        sc6.setEligibleStates("ALL");
        sc6.setRequiredDocuments("Caste Certificate,Income Certificate,Marksheet,Aadhaar Card");
        sc6.setIsActive(true);
        sc6 = scholarshipRepository.save(sc6);

        // 4. Seed Documents & Extractions
        Document doc1 = new Document();
        doc1.setStudent(s1);
        doc1.setDocumentType("Income Certificate");
        doc1.setFileName("rahul_income_cert_2026.pdf");
        doc1.setFileUrl("/uploads/rahul_income_cert.pdf");
        doc1.setFileType("application/pdf");
        doc1.setFileSize(412000L);
        doc1.setDetectedType("Income Certificate");
        doc1.setClassificationConfidence(BigDecimal.valueOf(96.50));
        doc1 = documentRepository.save(doc1);

        DocumentExtraction ext1 = new DocumentExtraction();
        ext1.setDocument(doc1);
        ext1.setRawOcrText("GOVERNMENT OF MAHARASHTRA\nREVENUE DEPARTMENT\nINCOME CERTIFICATE\nCertificate No: MH/INC/2026/88921\nThis is to certify that Rahul Kumar has annual family income of Rs. 2,40,000.\nDate: 12/04/2026\nTehsildar");
        ext1.setExtractedDataJson("{\"applicantName\": \"Rahul Kumar\", \"annualIncome\": 240000, \"certificateNumber\": \"MH/INC/2026/88921\", \"issueDate\": \"2026-04-12\", \"issuingAuthority\": \"Tehsildar\"}");
        ext1.setConfidenceScore(BigDecimal.valueOf(96.80));
        extractionRepository.save(ext1);

        Document doc2 = new Document();
        doc2.setStudent(s6);
        doc2.setDocumentType("Income Certificate");
        doc2.setFileName("vikram_singh_tehsildar_income.jpg");
        doc2.setFileUrl("/uploads/vikram_income.jpg");
        doc2.setFileType("image/jpeg");
        doc2.setFileSize(650000L);
        doc2.setDetectedType("Income Certificate");
        doc2.setClassificationConfidence(BigDecimal.valueOf(94.00));
        doc2 = documentRepository.save(doc2);

        DocumentExtraction ext2 = new DocumentExtraction();
        ext2.setDocument(doc2);
        ext2.setRawOcrText("GOVERNMENT OF NCT OF DELHI\nREVENUE DEPARTMENT\nANNUAL INCOME CERTIFICATE\nRef: DL-REV-2026-44109\nCertified that total annual household income of Vikram Singh is Rs. 5,50,000/-.\nDate: 15/05/2026\nSub-Divisional Magistrate");
        ext2.setExtractedDataJson("{\"applicantName\": \"Vikram Singh\", \"annualIncome\": 550000, \"certificateNumber\": \"DL-REV-2026-44109\", \"issueDate\": \"2026-05-15\", \"issuingAuthority\": \"Sub-Divisional Magistrate\"}");
        ext2.setConfidenceScore(BigDecimal.valueOf(93.40));
        extractionRepository.save(ext2);

        // 5. Seed Applications
        // App 1: Rahul Kumar (Under Review, Low Risk)
        Application app1 = new Application();
        app1.setApplicationNumber("ST-2026-1024");
        app1.setStudent(s1);
        app1.setScholarship(sc1);
        app1.setStatus("UNDER_REVIEW");
        app1.setSubmissionDate(LocalDateTime.now().minusDays(12));
        app1.setDeclaredIncome(BigDecimal.valueOf(240000.00));
        app1.setDeclaredPercentage(BigDecimal.valueOf(86.50));
        app1.setReviewNotes("All eligibility parameters met. Automated OCR verified.");
        app1 = applicationRepository.save(app1);

        ApplicationDocument ad1 = new ApplicationDocument(app1, doc1, "Income Certificate");
        ad1.setStatus("VERIFIED");
        appDocRepository.save(ad1);

        VerificationResult vr1 = new VerificationResult();
        vr1.setApplication(app1);
        vr1.setOverallStatus("MATCHED");
        vr1.setFieldComparisonJson("[{\"fieldName\": \"Applicant Name\", \"applicationValue\": \"Rahul Kumar\", \"extractedValue\": \"Rahul Kumar\", \"status\": \"MATCH\"}, {\"fieldName\": \"Annual Income\", \"applicationValue\": \"₹2,40,000\", \"extractedValue\": \"₹2,40,000\", \"status\": \"MATCH\"}]");
        vr1.setMismatchCount(0);
        vr1.setNotes("100% field match with revenue certificate.");
        verificationRepository.save(vr1);

        FraudRiskScore fr1 = new FraudRiskScore();
        fr1.setApplication(app1);
        fr1.setRiskScore(12);
        fr1.setRiskLevel("LOW");
        fr1.setSignalsJson("{\"duplicateSimilarity\": 5.0, \"documentMismatch\": \"NONE\", \"multipleApplications\": false, \"profileConsistency\": \"HIGH\"}");
        fr1.setExplainableReasonsJson("[\"Verified income certificate matches declared amount\", \"Single active submission\", \"High academic merit\"]");
        fraudRepository.save(fr1);

        // App 2: Priya Sharma (Approved)
        Application app2 = new Application();
        app2.setApplicationNumber("ST-2026-1048");
        app2.setStudent(s2);
        app2.setScholarship(sc2);
        app2.setStatus("APPROVED");
        app2.setSubmissionDate(LocalDateTime.now().minusDays(18));
        app2.setDeclaredIncome(BigDecimal.valueOf(180000.00));
        app2.setDeclaredPercentage(BigDecimal.valueOf(92.40));
        app2.setReviewNotes("Exceptional academic record (92.4%). Approved by Chief Verification Officer.");
        app2.setReviewedBy(admin);
        app2.setReviewedAt(LocalDateTime.now().minusDays(5));
        app2 = applicationRepository.save(app2);

        FraudRiskScore fr2 = new FraudRiskScore();
        fr2.setApplication(app2);
        fr2.setRiskScore(8);
        fr2.setRiskLevel("LOW");
        fr2.setSignalsJson("{\"duplicateSimilarity\": 0.0, \"documentMismatch\": \"NONE\", \"multipleApplications\": false, \"profileConsistency\": \"HIGH\"}");
        fr2.setExplainableReasonsJson("[\"Outstanding academic credentials\", \"Verified low family income\", \"Zero duplicate similarity\"]");
        fraudRepository.save(fr2);

        // App 3: Vikram Singh (Document Mismatch - High Risk)
        Application app3 = new Application();
        app3.setApplicationNumber("ST-2026-1098");
        app3.setStudent(s6);
        app3.setScholarship(sc1);
        app3.setStatus("DOCUMENT_VERIFICATION");
        app3.setSubmissionDate(LocalDateTime.now().minusDays(6));
        app3.setDeclaredIncome(BigDecimal.valueOf(250000.00));
        app3.setDeclaredPercentage(BigDecimal.valueOf(74.50));
        app3.setReviewNotes("Income certificate indicates annual income of ₹5,50,000 against declared ₹2,50,000.");
        app3 = applicationRepository.save(app3);

        ApplicationDocument ad2 = new ApplicationDocument(app3, doc2, "Income Certificate");
        ad2.setStatus("MISMATCH");
        appDocRepository.save(ad2);

        VerificationResult vr2 = new VerificationResult();
        vr2.setApplication(app3);
        vr2.setOverallStatus("MISMATCH_DETECTED");
        vr2.setFieldComparisonJson("[{\"fieldName\": \"Applicant Name\", \"applicationValue\": \"Vikram Singh\", \"extractedValue\": \"Vikram Singh\", \"status\": \"MATCH\"}, {\"fieldName\": \"Annual Income\", \"applicationValue\": \"₹2,50,000\", \"extractedValue\": \"₹5,50,000\", \"status\": \"MISMATCH\", \"severity\": \"HIGH\", \"note\": \"Declared income ₹2,50,000 vs document certified income ₹5,50,000\"}]");
        vr2.setMismatchCount(1);
        vr2.setNotes("Critical financial discrepancy: Document extracted income ₹5,50,000 breaches scholarship ceiling.");
        verificationRepository.save(vr2);

        FraudRiskScore fr3 = new FraudRiskScore();
        fr3.setApplication(app3);
        fr3.setRiskScore(84);
        fr3.setRiskLevel("HIGH");
        fr3.setSignalsJson("{\"duplicateSimilarity\": 10.0, \"documentMismatch\": \"HIGH\", \"multipleApplications\": false, \"profileConsistency\": \"LOW\"}");
        fr3.setExplainableReasonsJson("[\"Document certified income (₹5.5L) significantly exceeds declared amount (₹2.5L)\", \"Document income breaches maximum eligibility ceiling of ₹3.0L\", \"Requires administrative review before proceeding\"]");
        fraudRepository.save(fr3);

        // App 4: Rahul K. (Potential Duplicate with Rahul Kumar - High Risk)
        Application app4 = new Application();
        app4.setApplicationNumber("ST-2026-1102");
        app4.setStudent(s5);
        app4.setScholarship(sc1);
        app4.setStatus("UNDER_REVIEW");
        app4.setSubmissionDate(LocalDateTime.now().minusDays(8));
        app4.setDeclaredIncome(BigDecimal.valueOf(240000.00));
        app4.setDeclaredPercentage(BigDecimal.valueOf(85.00));
        app4.setReviewNotes("High similarity detected with ST-2026-1024 (Rahul Kumar). Possible duplicate submission.");
        app4 = applicationRepository.save(app4);

        DuplicateMatch dup = new DuplicateMatch(app4, app1, BigDecimal.valueOf(94.20),
                "{\"nameSimilarity\": 91.5, \"phoneMatch\": true, \"dobMatch\": true, \"institutionMatch\": true, \"matchedAttributes\": [\"Phone (+91 98765 43210)\", \"DOB (14/05/2004)\", \"College (NIT)\"]}");
        duplicateRepository.save(dup);

        FraudRiskScore fr4 = new FraudRiskScore();
        fr4.setApplication(app4);
        fr4.setRiskScore(91);
        fr4.setRiskLevel("HIGH");
        fr4.setSignalsJson("{\"duplicateSimilarity\": 94.2, \"documentMismatch\": \"NONE\", \"multipleApplications\": true, \"profileConsistency\": \"MEDIUM\"}");
        fr4.setExplainableReasonsJson("[\"Near-identical applicant profile detected with ST-2026-1024\", \"Same registered phone number and birth date under slight name variant (Rahul K. vs Rahul Kumar)\", \"Flagged for reviewer cross-check\"]");
        fraudRepository.save(fr4);

        // 6. Notifications
        notificationRepository.save(new Notification(u1, "Application Submitted", "Your application ST-2026-1024 for National Merit Scholarship is under review.", "INFO"));
        notificationRepository.save(new Notification(u2, "Scholarship Approved! 🎉", "Congratulations Priya! Your application ST-2026-1048 has been approved.", "SUCCESS"));
        notificationRepository.save(new Notification(u6, "Document Mismatch Alert", "A mismatch was detected between your declared income and uploaded certificate.", "WARNING"));
        notificationRepository.save(new Notification(adminUser, "High Risk Application Flagged", "Application ST-2026-1098 flagged with Risk Score 84 (Critical Income Mismatch).", "ALERT"));
        notificationRepository.save(new Notification(adminUser, "Potential Duplicate Alert", "Application ST-2026-1102 flagged with 94% similarity to ST-2026-1024.", "ALERT"));

        // 7. Audit Logs
        auditLogRepository.save(new AuditLog(adminUser.getId(), adminUser.getEmail(), "ADMIN", "SYSTEM_INIT", "DATABASE", "SCHEMA", "ScholarTrack demo data initialized successfully."));
        auditLogRepository.save(new AuditLog(u1.getId(), u1.getEmail(), "STUDENT", "APPLICATION_SUBMITTED", "APPLICATION", "ST-2026-1024", "Applied for National Merit Scholarship."));
        auditLogRepository.save(new AuditLog(adminUser.getId(), adminUser.getEmail(), "ADMIN", "APPLICATION_APPROVED", "APPLICATION", "ST-2026-1048", "Approved application for Priya Sharma."));
        auditLogRepository.save(new AuditLog(adminUser.getId(), adminUser.getEmail(), "ADMIN", "FRAUD_FLAG_RAISED", "APPLICATION", "ST-2026-1098", "AI Fraud Risk Analysis generated score 84/100 (Income Discrepancy)."));
    }
}
