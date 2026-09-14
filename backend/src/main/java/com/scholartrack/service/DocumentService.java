package com.scholartrack.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholartrack.dto.AiDtos.ClassificationResult;
import com.scholartrack.dto.AiDtos.OcrResult;
import com.scholartrack.dto.ApplicationDtos.DocumentDto;
import com.scholartrack.entity.*;
import com.scholartrack.exception.BadRequestException;
import com.scholartrack.exception.ResourceNotFoundException;
import com.scholartrack.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Value("${scholartrack.storage.upload-dir:uploads}")
    private String uploadDir;

    private final DocumentRepository documentRepository;
    private final DocumentExtractionRepository extractionRepository;
    private final StudentRepository studentRepository;
    private final AiService aiService;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public DocumentService(DocumentRepository documentRepository,
                           DocumentExtractionRepository extractionRepository,
                           StudentRepository studentRepository,
                           AiService aiService,
                           AuditLogService auditLogService) {
        this.documentRepository = documentRepository;
        this.extractionRepository = extractionRepository;
        this.studentRepository = studentRepository;
        this.aiService = aiService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public Document uploadDocument(Long studentId, MultipartFile file, String selectedDocType) throws IOException {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty.");
        }

        String origName = file.getOriginalFilename();
        String ext = "";
        if (origName != null && origName.contains(".")) {
            ext = origName.substring(origName.lastIndexOf(".")).toLowerCase();
        }

        if (!List.of(".pdf", ".jpg", ".jpeg", ".png").contains(ext)) {
            throw new BadRequestException("Unsupported file type: " + ext + ". Only PDF, JPG, and PNG files are allowed.");
        }

        if (file.getSize() > 15 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds maximum allowed threshold of 15MB.");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // Create storage directory if missing
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String savedFileName = System.currentTimeMillis() + "_" + (origName != null ? origName.replaceAll("[^a-zA-Z0-9._-]", "_") : "doc" + ext);
        Path targetPath = uploadPath.resolve(savedFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // AI Document Classification
        ClassificationResult classResult = aiService.classifyDocument(origName, file.getContentType(), "");
        String docType = (selectedDocType != null && !selectedDocType.isBlank()) ? selectedDocType : classResult.getDetectedType();

        Document doc = new Document();
        doc.setStudent(student);
        doc.setFileName(origName);
        doc.setFileUrl("/uploads/" + savedFileName);
        doc.setFileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        doc.setFileSize(file.getSize());
        doc.setDocumentType(docType);
        doc.setDetectedType(classResult.getDetectedType());
        doc.setClassificationConfidence(classResult.getConfidence());

        doc = documentRepository.save(doc);

        // Perform AI OCR and structured data extraction
        OcrResult ocrResult = aiService.extractOcrData(docType, origName, student);
        DocumentExtraction extraction = new DocumentExtraction();
        extraction.setDocument(doc);
        extraction.setRawOcrText(ocrResult.getRawText());
        try {
            extraction.setExtractedDataJson(objectMapper.writeValueAsString(ocrResult.getExtractedFields()));
        } catch (Exception e) {
            extraction.setExtractedDataJson("{}");
        }
        extraction.setConfidenceScore(ocrResult.getConfidence());
        extractionRepository.save(extraction);
        doc.setExtraction(extraction);

        auditLogService.log(student.getUser().getId(), student.getUser().getEmail(), "STUDENT",
                "DOCUMENT_UPLOAD", "DOCUMENT", doc.getId().toString(), "Uploaded document: " + origName + " (AI classified as: " + classResult.getDetectedType() + ")");

        return doc;
    }

    public List<DocumentDto> getStudentDocuments(Long studentId) {
        return documentRepository.findByStudentId(studentId).stream().map(doc -> {
            DocumentDto dto = new DocumentDto();
            dto.setDocumentId(doc.getId());
            dto.setDocumentType(doc.getDocumentType());
            dto.setFileName(doc.getFileName());
            dto.setFileUrl(doc.getFileUrl());
            dto.setFileType(doc.getFileType());
            dto.setFileSize(doc.getFileSize());
            dto.setDetectedType(doc.getDetectedType());
            dto.setClassificationConfidence(doc.getClassificationConfidence());
            if (doc.getExtraction() != null) {
                dto.setRawOcrText(doc.getExtraction().getRawOcrText());
                dto.setExtractedDataJson(doc.getExtraction().getExtractedDataJson());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void deleteDocument(Long documentId, Long studentId) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        if (!doc.getStudent().getId().equals(studentId)) {
            throw new BadRequestException("Unauthorized access to document.");
        }
        documentRepository.delete(doc);
    }
}
