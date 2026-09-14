-- ==========================================================
-- SCHOLARTRACK: AI-Based Scholarship Management & Fraud Detection
-- Database Schema for MySQL 8.0
-- ==========================================================

CREATE DATABASE IF NOT EXISTS scholartrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scholartrack_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- STUDENT, ADMIN
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    dob DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    college VARCHAR(200),
    course VARCHAR(100),
    branch VARCHAR(100),
    academic_year INT,
    cgpa_percentage DECIMAL(5,2),
    family_income DECIMAL(12,2),
    income_source VARCHAR(100),
    category VARCHAR(50),
    domicile_state VARCHAR(100),
    disability_status VARCHAR(50) DEFAULT 'NONE',
    profile_completion_pct INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_student_income (family_income),
    INDEX idx_student_cgpa (cgpa_percentage)
) ENGINE=InnoDB;

-- 3. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    employee_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. SCHOLARSHIPS TABLE
CREATE TABLE IF NOT EXISTS scholarships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    deadline DATE NOT NULL,
    max_family_income DECIMAL(12,2),
    min_cgpa_percentage DECIMAL(5,2),
    eligible_courses TEXT,
    eligible_categories TEXT,
    eligible_states TEXT,
    required_documents TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_scholarship_deadline (deadline),
    INDEX idx_scholarship_category (category)
) ENGINE=InnoDB;

-- 5. ELIGIBILITY RULES TABLE
CREATE TABLE IF NOT EXISTS eligibility_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scholarship_id BIGINT NOT NULL,
    rule_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    operator VARCHAR(20) NOT NULL, -- LTE, GTE, EQ, IN, CONTAINS
    rule_value VARCHAR(255) NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rules_scholarship FOREIGN KEY (scholarship_id) REFERENCES scholarships (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(50) NOT NULL UNIQUE,
    student_id BIGINT NOT NULL,
    scholarship_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, UNDER_REVIEW, DOCUMENT_VERIFICATION, CORRECTION_REQUIRED, APPROVED, REJECTED
    submission_date TIMESTAMP NULL,
    declared_income DECIMAL(12,2),
    declared_percentage DECIMAL(5,2),
    review_notes TEXT,
    reviewed_by BIGINT,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
    CONSTRAINT fk_app_scholarship FOREIGN KEY (scholarship_id) REFERENCES scholarships (id) ON DELETE CASCADE,
    CONSTRAINT fk_app_reviewer FOREIGN KEY (reviewed_by) REFERENCES admins (id) ON DELETE SET NULL,
    INDEX idx_app_status (status),
    INDEX idx_app_student (student_id)
) ENGINE=InnoDB;

-- 7. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    detected_type VARCHAR(100),
    classification_confidence DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. APPLICATION DOCUMENTS LINK TABLE
CREATE TABLE IF NOT EXISTS application_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    document_id BIGINT NOT NULL,
    required_doc_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appdoc_app FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE,
    CONSTRAINT fk_appdoc_doc FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. DOCUMENT EXTRACTIONS (OCR) TABLE
CREATE TABLE IF NOT EXISTS document_extractions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT NOT NULL,
    raw_ocr_text MEDIUMTEXT,
    extracted_data_json TEXT,
    confidence_score DECIMAL(5,2),
    extraction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ocr_doc FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. VERIFICATION RESULTS TABLE
CREATE TABLE IF NOT EXISTS verification_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    overall_status VARCHAR(50) NOT NULL, -- MATCHED, MISMATCH_DETECTED, REQUIRES_REVIEW
    field_comparison_json TEXT,
    mismatch_count INT DEFAULT 0,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    CONSTRAINT fk_verif_app FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. DUPLICATE MATCHES TABLE
CREATE TABLE IF NOT EXISTS duplicate_matches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    matched_application_id BIGINT NOT NULL,
    similarity_score DECIMAL(5,2) NOT NULL,
    matched_fields_json TEXT,
    flagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dup_app1 FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE,
    CONSTRAINT fk_dup_app2 FOREIGN KEY (matched_application_id) REFERENCES applications (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. FRAUD RISK SCORES TABLE
CREATE TABLE IF NOT EXISTS fraud_risk_scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    risk_score INT NOT NULL, -- 0 to 100
    risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH
    signals_json TEXT,
    explainable_reasons_json TEXT,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fraud_app FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE,
    INDEX idx_fraud_risk_level (risk_level)
) ENGINE=InnoDB;

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- 14. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    user_email VARCHAR(150),
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100),
    entity_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_created (created_at),
    INDEX idx_audit_action (action)
) ENGINE=InnoDB;
