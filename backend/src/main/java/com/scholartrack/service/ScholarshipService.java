package com.scholartrack.service;

import com.scholartrack.dto.ScholarshipDto;
import com.scholartrack.dto.ScholarshipDto.RuleDto;
import com.scholartrack.entity.EligibilityRule;
import com.scholartrack.entity.Scholarship;
import com.scholartrack.exception.ResourceNotFoundException;
import com.scholartrack.repository.EligibilityRuleRepository;
import com.scholartrack.repository.ScholarshipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;
    private final EligibilityRuleRepository ruleRepository;
    private final AuditLogService auditLogService;

    public ScholarshipService(ScholarshipRepository scholarshipRepository,
                              EligibilityRuleRepository ruleRepository,
                              AuditLogService auditLogService) {
        this.scholarshipRepository = scholarshipRepository;
        this.ruleRepository = ruleRepository;
        this.auditLogService = auditLogService;
    }

    public List<ScholarshipDto> getAllActiveScholarships(String search, String category) {
        List<Scholarship> list;
        if (search != null && !search.isBlank()) {
            list = scholarshipRepository.searchScholarships(search.trim());
        } else if (category != null && !category.equalsIgnoreCase("ALL") && !category.isBlank()) {
            list = scholarshipRepository.findByCategory(category);
        } else {
            list = scholarshipRepository.findByIsActiveTrue();
        }

        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ScholarshipDto> getAllScholarshipsAdmin() {
        return scholarshipRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ScholarshipDto getScholarshipById(Long id) {
        Scholarship s = scholarshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found with id: " + id));
        return mapToDto(s);
    }

    public Scholarship getEntityById(Long id) {
        return scholarshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found with id: " + id));
    }

    @Transactional
    public ScholarshipDto createScholarship(ScholarshipDto dto, Long adminUserId) {
        Scholarship s = new Scholarship();
        mapFromDto(dto, s);
        s = scholarshipRepository.save(s);

        if (dto.getRules() != null) {
            for (RuleDto ruleDto : dto.getRules()) {
                EligibilityRule rule = new EligibilityRule();
                rule.setScholarship(s);
                rule.setRuleType(ruleDto.getRuleType());
                rule.setFieldName(ruleDto.getFieldName());
                rule.setOperator(ruleDto.getOperator());
                rule.setRuleValue(ruleDto.getRuleValue());
                rule.setIsMandatory(ruleDto.getIsMandatory() != null ? ruleDto.getIsMandatory() : true);
                rule.setDescription(ruleDto.getDescription());
                ruleRepository.save(rule);
                s.getRules().add(rule);
            }
        }

        auditLogService.log(adminUserId, "admin", "ADMIN", "CREATE_SCHOLARSHIP", "SCHOLARSHIP", s.getId().toString(), "Created scholarship: " + s.getTitle());
        return mapToDto(s);
    }

    @Transactional
    public ScholarshipDto updateScholarship(Long id, ScholarshipDto dto, Long adminUserId) {
        Scholarship s = getEntityById(id);
        mapFromDto(dto, s);
        s = scholarshipRepository.save(s);

        auditLogService.log(adminUserId, "admin", "ADMIN", "UPDATE_SCHOLARSHIP", "SCHOLARSHIP", s.getId().toString(), "Updated scholarship: " + s.getTitle());
        return mapToDto(s);
    }

    @Transactional
    public void toggleActiveStatus(Long id, Long adminUserId) {
        Scholarship s = getEntityById(id);
        s.setIsActive(!Boolean.TRUE.equals(s.getIsActive()));
        scholarshipRepository.save(s);

        auditLogService.log(adminUserId, "admin", "ADMIN", "TOGGLE_SCHOLARSHIP", "SCHOLARSHIP", s.getId().toString(), "Changed active status to: " + s.getIsActive());
    }

    private void mapFromDto(ScholarshipDto dto, Scholarship s) {
        if (dto.getTitle() != null) s.setTitle(dto.getTitle());
        if (dto.getProvider() != null) s.setProvider(dto.getProvider());
        if (dto.getDescription() != null) s.setDescription(dto.getDescription());
        if (dto.getCategory() != null) s.setCategory(dto.getCategory());
        if (dto.getAmount() != null) s.setAmount(dto.getAmount());
        if (dto.getDeadline() != null) s.setDeadline(dto.getDeadline());
        if (dto.getMaxFamilyIncome() != null) s.setMaxFamilyIncome(dto.getMaxFamilyIncome());
        if (dto.getMinCgpaPercentage() != null) s.setMinCgpaPercentage(dto.getMinCgpaPercentage());
        if (dto.getEligibleCourses() != null) s.setEligibleCourses(dto.getEligibleCourses());
        if (dto.getEligibleCategories() != null) s.setEligibleCategories(dto.getEligibleCategories());
        if (dto.getEligibleStates() != null) s.setEligibleStates(dto.getEligibleStates());
        if (dto.getRequiredDocuments() != null) s.setRequiredDocuments(dto.getRequiredDocuments());
        if (dto.getIsActive() != null) s.setIsActive(dto.getIsActive());
    }

    public ScholarshipDto mapToDto(Scholarship s) {
        ScholarshipDto dto = new ScholarshipDto();
        dto.setId(s.getId());
        dto.setTitle(s.getTitle());
        dto.setProvider(s.getProvider());
        dto.setDescription(s.getDescription());
        dto.setCategory(s.getCategory());
        dto.setAmount(s.getAmount());
        dto.setDeadline(s.getDeadline());
        dto.setMaxFamilyIncome(s.getMaxFamilyIncome());
        dto.setMinCgpaPercentage(s.getMinCgpaPercentage());
        dto.setEligibleCourses(s.getEligibleCourses());
        dto.setEligibleCategories(s.getEligibleCategories());
        dto.setEligibleStates(s.getEligibleStates());
        dto.setRequiredDocuments(s.getRequiredDocuments());
        dto.setIsActive(s.getIsActive());

        if (s.getRules() != null) {
            dto.setRules(s.getRules().stream().map(r -> {
                RuleDto rd = new RuleDto();
                rd.setId(r.getId());
                rd.setRuleType(r.getRuleType());
                rd.setFieldName(r.getFieldName());
                rd.setOperator(r.getOperator());
                rd.setRuleValue(r.getRuleValue());
                rd.setIsMandatory(r.getIsMandatory());
                rd.setDescription(r.getDescription());
                return rd;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}
