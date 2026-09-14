package com.scholartrack.service;

import com.scholartrack.dto.EligibilityDtos.*;
import com.scholartrack.entity.EligibilityRule;
import com.scholartrack.entity.Scholarship;
import com.scholartrack.entity.Student;
import com.scholartrack.repository.ScholarshipRepository;
import com.scholartrack.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.*;

@Service
public class EligibilityService {

    private final ScholarshipRepository scholarshipRepository;
    private final StudentRepository studentRepository;

    public EligibilityService(ScholarshipRepository scholarshipRepository, StudentRepository studentRepository) {
        this.scholarshipRepository = scholarshipRepository;
        this.studentRepository = studentRepository;
    }

    public EligibilityResult evaluate(Long studentId, Long scholarshipId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        Scholarship scholarship = scholarshipRepository.findById(scholarshipId).orElse(null);

        if (scholarship == null) {
            EligibilityResult res = new EligibilityResult();
            res.setStatus("NOT_ELIGIBLE");
            res.setAiExplanation("Scholarship record not found.");
            return res;
        }

        return evaluate(student, scholarship);
    }

    public EligibilityResult evaluate(Student student, Scholarship scholarship) {
        EligibilityResult result = new EligibilityResult();
        result.setScholarshipId(scholarship.getId());
        result.setScholarshipTitle(scholarship.getTitle());

        List<CriterionEvaluation> criteria = new ArrayList<>();
        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        if (student == null) {
            result.setStatus("REQUIRES_REVIEW");
            result.setMatchScorePercentage(0);
            result.setAiExplanation("Please sign in and complete your student profile to evaluate eligibility.");
            actions.add("Register or sign in as a student.");
            actions.add("Complete your academic and financial profile.");
            result.setSuggestedActions(actions);
            return result;
        }

        int totalChecks = 0;
        int passedChecks = 0;

        // 1. Academic Percentage Check
        if (scholarship.getMinCgpaPercentage() != null) {
            totalChecks++;
            String reqStr = scholarship.getMinCgpaPercentage() + "%";
            if (student.getCgpaPercentage() == null) {
                missing.add("Academic Percentage / CGPA");
                criteria.add(new CriterionEvaluation("Academic Performance", "≥ " + reqStr, "Not Provided", false, "Missing academic percentage in profile"));
                actions.add("Update your CGPA/Percentage in your student profile.");
            } else {
                String studStr = student.getCgpaPercentage() + "%";
                boolean pass = student.getCgpaPercentage().compareTo(scholarship.getMinCgpaPercentage()) >= 0;
                if (pass) {
                    passedChecks++;
                    passed.add("Academic Performance (" + studStr + " ≥ " + reqStr + ")");
                    criteria.add(new CriterionEvaluation("Academic Performance", "≥ " + reqStr, studStr, true, "Meets academic merit standard"));
                } else {
                    failed.add("Academic Performance (" + studStr + " < " + reqStr + ")");
                    criteria.add(new CriterionEvaluation("Academic Performance", "≥ " + reqStr, studStr, false, "Requires minimum " + reqStr + "; your current score is " + studStr));
                }
            }
        }

        // 2. Family Income Ceiling Check
        if (scholarship.getMaxFamilyIncome() != null) {
            totalChecks++;
            String reqIncStr = formatCurrency(scholarship.getMaxFamilyIncome());
            if (student.getFamilyIncome() == null) {
                missing.add("Annual Family Income");
                criteria.add(new CriterionEvaluation("Family Income Ceiling", "≤ " + reqIncStr, "Not Declared", false, "Missing annual income in profile"));
                actions.add("Declare your verified annual family income in your profile.");
            } else {
                String studIncStr = formatCurrency(student.getFamilyIncome());
                boolean pass = student.getFamilyIncome().compareTo(scholarship.getMaxFamilyIncome()) <= 0;
                if (pass) {
                    passedChecks++;
                    passed.add("Annual Family Income (" + studIncStr + " ≤ " + reqIncStr + ")");
                    criteria.add(new CriterionEvaluation("Family Income Ceiling", "≤ " + reqIncStr, studIncStr, true, "Satisfies economic means ceiling"));
                } else {
                    failed.add("Annual Family Income (" + studIncStr + " > " + reqIncStr + ")");
                    criteria.add(new CriterionEvaluation("Family Income Ceiling", "≤ " + reqIncStr, studIncStr, false, "Family income of " + studIncStr + " exceeds limit of " + reqIncStr));
                }
            }
        }

        // 3. Eligible Courses Check
        if (scholarship.getEligibleCourses() != null && !scholarship.getEligibleCourses().equalsIgnoreCase("ALL")) {
            totalChecks++;
            String reqCourses = scholarship.getEligibleCourses();
            if (student.getCourse() == null || student.getCourse().isBlank()) {
                missing.add("Enrolled Degree / Course");
                criteria.add(new CriterionEvaluation("Course Eligibility", reqCourses, "Not Specified", false, "Course not specified"));
                actions.add("Specify your ongoing course and degree.");
            } else {
                boolean courseMatch = Arrays.stream(reqCourses.split(","))
                        .map(String::trim)
                        .anyMatch(c -> student.getCourse().toLowerCase().contains(c.toLowerCase()) || c.equalsIgnoreCase("ALL"));
                if (courseMatch) {
                    passedChecks++;
                    passed.add("Course Enrolled (" + student.getCourse() + ")");
                    criteria.add(new CriterionEvaluation("Course Eligibility", reqCourses, student.getCourse(), true, "Eligible academic discipline"));
                } else {
                    failed.add("Course Enrolled (" + student.getCourse() + " not in " + reqCourses + ")");
                    criteria.add(new CriterionEvaluation("Course Eligibility", reqCourses, student.getCourse(), false, "This scheme is designated for: " + reqCourses));
                }
            }
        }

        // 4. Eligible Categories Check
        if (scholarship.getEligibleCategories() != null && !scholarship.getEligibleCategories().equalsIgnoreCase("ALL")) {
            totalChecks++;
            String reqCategories = scholarship.getEligibleCategories();
            if (student.getCategory() == null || student.getCategory().isBlank()) {
                missing.add("Social Category");
                criteria.add(new CriterionEvaluation("Category Eligibility", reqCategories, "Not Provided", false, "Social category missing"));
                actions.add("Provide your category (General, OBC, SC, ST, EWS).");
            } else {
                boolean catMatch = Arrays.stream(reqCategories.split(","))
                        .map(String::trim)
                        .anyMatch(c -> c.equalsIgnoreCase(student.getCategory()) || c.equalsIgnoreCase("ALL"));
                if (catMatch) {
                    passedChecks++;
                    passed.add("Category (" + student.getCategory() + ")");
                    criteria.add(new CriterionEvaluation("Category Eligibility", reqCategories, student.getCategory(), true, "Category criteria met"));
                } else {
                    failed.add("Category (" + student.getCategory() + " not in " + reqCategories + ")");
                    criteria.add(new CriterionEvaluation("Category Eligibility", reqCategories, student.getCategory(), false, "Designated for: " + reqCategories));
                }
            }
        }

        // 5. State Domicile Check
        if (scholarship.getEligibleStates() != null && !scholarship.getEligibleStates().equalsIgnoreCase("ALL")) {
            totalChecks++;
            String reqStates = scholarship.getEligibleStates();
            if (student.getDomicileState() == null || student.getDomicileState().isBlank()) {
                missing.add("Domicile State");
                criteria.add(new CriterionEvaluation("Domicile State", reqStates, "Not Specified", false, "Domicile state missing"));
                actions.add("Specify your home state in your profile.");
            } else {
                boolean stateMatch = Arrays.stream(reqStates.split(","))
                        .map(String::trim)
                        .anyMatch(s -> s.equalsIgnoreCase(student.getDomicileState()) || s.equalsIgnoreCase("ALL"));
                if (stateMatch) {
                    passedChecks++;
                    passed.add("Domicile (" + student.getDomicileState() + ")");
                    criteria.add(new CriterionEvaluation("Domicile State", reqStates, student.getDomicileState(), true, "State domicile matched"));
                } else {
                    failed.add("Domicile (" + student.getDomicileState() + " not in " + reqStates + ")");
                    criteria.add(new CriterionEvaluation("Domicile State", reqStates, student.getDomicileState(), false, "Designated for residents of: " + reqStates));
                }
            }
        }

        // 6. Configurable Rules in DB
        if (scholarship.getRules() != null && !scholarship.getRules().isEmpty()) {
            for (EligibilityRule rule : scholarship.getRules()) {
                totalChecks++;
                boolean rulePassed = evaluateCustomRule(student, rule);
                if (rulePassed) {
                    passedChecks++;
                    passed.add(rule.getDescription() != null ? rule.getDescription() : rule.getRuleType() + " check");
                    criteria.add(new CriterionEvaluation(rule.getRuleType(), rule.getRuleValue(), "Verified", true, rule.getDescription()));
                } else {
                    failed.add(rule.getDescription() != null ? rule.getDescription() : rule.getRuleType() + " check");
                    criteria.add(new CriterionEvaluation(rule.getRuleType(), rule.getRuleValue(), "Mismatch", false, rule.getDescription()));
                }
            }
        }

        int matchScore = totalChecks > 0 ? (int) Math.round(((double) passedChecks / totalChecks) * 100.0) : 100;
        result.setMatchScorePercentage(matchScore);
        result.setCriteria(criteria);
        result.setPassedCriteria(passed);
        result.setFailedCriteria(failed);
        result.setMissingFields(missing);

        // Determine Final Eligibility Status
        if (!missing.isEmpty()) {
            result.setStatus("REQUIRES_REVIEW");
        } else if (failed.isEmpty()) {
            result.setStatus("ELIGIBLE");
        } else {
            result.setStatus("NOT_ELIGIBLE");
        }

        // Generate Human-Explainable AI Description
        StringBuilder aiExp = new StringBuilder();
        if ("ELIGIBLE".equals(result.getStatus())) {
            aiExp.append("Outstanding! Your academic profile meets 100% of the mandatory criteria for ")
                 .append(scholarship.getTitle())
                 .append(". You have passed all academic benchmarks, financial ceilings, and domicile requirements.");
            actions.add("Ensure supporting documents (marksheet, income certificate) are ready for upload.");
            actions.add("Proceed to complete the application stepper.");
        } else if ("REQUIRES_REVIEW".equals(result.getStatus())) {
            aiExp.append("Your eligibility could not be fully verified because some information is missing from your profile: ")
                 .append(String.join(", ", missing))
                 .append(". Please update these details in your profile to obtain a definitive assessment.");
        } else {
            aiExp.append("Your application does not currently meet all the eligibility criteria. ");
            if (!failed.isEmpty()) {
                aiExp.append("Specifically: ").append(String.join("; ", failed)).append(". ");
            }
            aiExp.append("Review alternative opportunities below that match your academic and financial background.");
            actions.add("Review alternative scholarships below that have broader income or academic criteria.");
        }
        result.setAiExplanation(aiExp.toString());
        result.setSuggestedActions(actions);

        // Find Alternative Scholarships if NOT_ELIGIBLE or score < 80
        if (!"ELIGIBLE".equals(result.getStatus())) {
            List<Scholarship> all = scholarshipRepository.findByIsActiveTrue();
            List<AlternativeScholarship> alternatives = new ArrayList<>();
            for (Scholarship alt : all) {
                if (!alt.getId().equals(scholarship.getId())) {
                    int altScore = estimateMatchScore(student, alt);
                    if (altScore >= 70) {
                        alternatives.add(new AlternativeScholarship(alt.getId(), alt.getTitle(), alt.getProvider(), altScore));
                    }
                }
            }
            alternatives.sort((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()));
            result.setAlternativeScholarships(alternatives.stream().limit(3).toList());
        }

        return result;
    }

    private boolean evaluateCustomRule(Student student, EligibilityRule rule) {
        if ("GENDER".equalsIgnoreCase(rule.getRuleType())) {
            return student.getGender() != null && student.getGender().equalsIgnoreCase(rule.getRuleValue());
        }
        return true;
    }

    public int estimateMatchScore(Student student, Scholarship s) {
        if (student == null) return 50;
        int score = 0;
        int factors = 0;

        if (s.getMinCgpaPercentage() != null && student.getCgpaPercentage() != null) {
            factors++;
            if (student.getCgpaPercentage().compareTo(s.getMinCgpaPercentage()) >= 0) score += 100;
            else if (student.getCgpaPercentage().add(BigDecimal.valueOf(5)).compareTo(s.getMinCgpaPercentage()) >= 0) score += 60;
        }

        if (s.getMaxFamilyIncome() != null && student.getFamilyIncome() != null) {
            factors++;
            if (student.getFamilyIncome().compareTo(s.getMaxFamilyIncome()) <= 0) score += 100;
            else if (student.getFamilyIncome().compareTo(s.getMaxFamilyIncome().multiply(BigDecimal.valueOf(1.2))) <= 0) score += 50;
        }

        if (s.getEligibleCourses() != null && !s.getEligibleCourses().equalsIgnoreCase("ALL") && student.getCourse() != null) {
            factors++;
            boolean match = Arrays.stream(s.getEligibleCourses().split(","))
                    .anyMatch(c -> student.getCourse().toLowerCase().contains(c.trim().toLowerCase()));
            if (match) score += 100;
        }

        if (s.getEligibleStates() != null && !s.getEligibleStates().equalsIgnoreCase("ALL") && student.getDomicileState() != null) {
            factors++;
            boolean match = Arrays.stream(s.getEligibleStates().split(","))
                    .anyMatch(st -> st.trim().equalsIgnoreCase(student.getDomicileState()));
            if (match) score += 100;
        }

        return factors > 0 ? score / factors : 85;
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "N/A";
        double val = amount.doubleValue();
        if (val >= 100000) {
            return String.format("₹%.2f Lakh", val / 100000.0);
        }
        return "₹" + NumberFormat.getNumberInstance(new Locale("en", "IN")).format(amount);
    }
}
