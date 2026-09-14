# ScholarTrack Database Design & ER Specification

The ScholarTrack database architecture comprises **14 normalized tables** engineered for referential integrity, relational query performance, and audit compliance.

---

## 1. Entity Relationship Overview

```
                                  +------------------+
                                  |      users       |
                                  +--------+---------+
                                           |
                    +----------------------+----------------------+
                    | 1:1                                         | 1:1
                    v                                             v
           +------------------+                          +------------------+
           |     students     |                          |      admins      |
           +--------+---------+                          +--------+---------+
                    |                                             |
         +----------+----------+                                  |
         | 1:N                 | 1:N                              |
         v                     v                                  |
  +--------------+      +--------------+                          |
  |  documents   |      | applications |<-------------------------+ (Reviewed By)
  +-------+------+      +-------+------+
          |                     |
          +----------+----------+
                     | N:M
                     v
        +--------------------------+
        |  application_documents   |
        +--------------------------+
                     |
       +-------------+-------------+
       | 1:1                       | 1:1
       v                           v
+--------------------+      +----------------------+
|document_extractions|      | verification_results |
+--------------------+      +----------------------+

  +------------------+      +----------------------+
  | duplicate_matches|      |   fraud_risk_scores  |
  +------------------+      +----------------------+

  +------------------+      +----------------------+
  |   scholarships   |      |  eligibility_rules   |
  +------------------+      +----------------------+

  +------------------+      +----------------------+
  |  notifications   |      |      audit_logs      |
  +------------------+      +----------------------+
```

---

## 2. Table Specifications

### 1. `users`
Core authentication and role credential entity.
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `email` VARCHAR(150) UNIQUE NOT NULL
- `password` VARCHAR(255) NOT NULL (BCrypt encrypted)
- `role` ENUM('STUDENT', 'ADMIN') NOT NULL
- `status` ENUM('ACTIVE', 'SUSPENDED', 'PENDING') DEFAULT 'ACTIVE'
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 2. `students`
Extended demographic and academic profile for candidates.
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `user_id` BIGINT UNIQUE FOREIGN KEY -> `users(id)`
- `full_name` VARCHAR(120) NOT NULL
- `roll_number` VARCHAR(50)
- `aadhaar_hash` VARCHAR(64) (SHA-256 for privacy-preserving duplicate checks)
- `phone` VARCHAR(20)
- `college` VARCHAR(200)
- `course` VARCHAR(100)
- `cgpa_percentage` DECIMAL(5,2)
- `family_income` DECIMAL(12,2)
- `category` VARCHAR(50) (GENERAL, SC, ST, OBC, EWS)
- `domicile_state` VARCHAR(80)

### 3. `scholarships`
Scholarship schemes published on the platform.
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `code` VARCHAR(50) UNIQUE NOT NULL
- `title` VARCHAR(200) NOT NULL
- `provider` VARCHAR(150) NOT NULL
- `category` VARCHAR(60) NOT NULL
- `amount` DECIMAL(10,2) NOT NULL
- `max_family_income` DECIMAL(12,2)
- `min_cgpa_percentage` DECIMAL(5,2)
- `deadline` TIMESTAMP NOT NULL
- `is_active` BOOLEAN DEFAULT TRUE

### 4. `eligibility_rules`
Deterministic predicates attached to scholarships.
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `scholarship_id` BIGINT FOREIGN KEY -> `scholarships(id)`
- `rule_type` VARCHAR(50) (MIN_MARKS, MAX_INCOME, GENDER, CATEGORY, STATE)
- `operator` VARCHAR(10) ('>=', '<=', '==', 'IN')
- `rule_value` VARCHAR(255) NOT NULL
- `is_mandatory` BOOLEAN DEFAULT TRUE

### 5. `applications`
Application instances submitted by students.
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `application_number` VARCHAR(60) UNIQUE NOT NULL
- `student_id` BIGINT FOREIGN KEY -> `students(id)`
- `scholarship_id` BIGINT FOREIGN KEY -> `scholarships(id)`
- `declared_income` DECIMAL(12,2)
- `declared_percentage` DECIMAL(5,2)
- `status` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CORRECTION_REQUIRED', 'FLAGGED')
- `reviewed_by` BIGINT FOREIGN KEY -> `admins(id)`
- `review_notes` TEXT
- `submission_date` TIMESTAMP

### 6. `documents`
Uploaded candidate files.
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `student_id` BIGINT FOREIGN KEY -> `students(id)`
- `document_type` VARCHAR(60) NOT NULL
- `file_name` VARCHAR(255) NOT NULL
- `file_url` VARCHAR(500) NOT NULL
- `file_size` BIGINT NOT NULL
- `verification_status` ENUM('PENDING', 'VERIFIED', 'MISMATCH') DEFAULT 'PENDING'

### 7. `application_documents`
Join table associating documents to specific applications.

### 8. `document_extractions`
Structured key-value pairs extracted by the OCR pipeline.
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `document_id` BIGINT FOREIGN KEY -> `documents(id)`
- `extracted_data_json` TEXT (Contains extracted income, marks, names, cert numbers)
- `confidence_score` DECIMAL(4,2)

### 9. `verification_results`
Field-by-field verification verdicts between declared values and OCR data.
- `declared_value` VARCHAR(255)
- `extracted_value` VARCHAR(255)
- `variance_percentage` DECIMAL(6,2)
- `status` ENUM('MATCH', 'MISMATCH')

### 10. `duplicate_matches`
RapidFuzz detection alerts.
- `primary_application_id` BIGINT FOREIGN KEY -> `applications(id)`
- `matched_application_id` BIGINT FOREIGN KEY -> `applications(id)`
- `similarity_score` INT NOT NULL (0–100)
- `matched_fields_json` TEXT

### 11. `fraud_risk_scores`
Composite risk score calculation.
- `application_id` BIGINT FOREIGN KEY -> `applications(id)`
- `risk_score` INT NOT NULL (0–100)
- `risk_level` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL
- `signals_json` TEXT
- `explainable_reasons_json` TEXT

### 12. `notifications`
User notifications and critical action requests.

### 13. `audit_logs`
Immutable compliance ledger.
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `user_id` BIGINT
- `performed_by` VARCHAR(150)
- `action` VARCHAR(100) NOT NULL
- `entity_name` VARCHAR(80)
- `entity_id` VARCHAR(50)
- `details` TEXT
- `ip_address` VARCHAR(50)
- `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 14. `admins`
Staff and administrative officer directory.
