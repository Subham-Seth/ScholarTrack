-- ==========================================================
-- SCHOLARTRACK: Realistic Demo Seed Data
-- ==========================================================

USE scholartrack_db;

-- Passwords hashed with BCrypt (Cost 10):
-- Admin@123 -> $2a$10$7Q7c9VzXq/J4Z.Jc.sZ3.u8Jm9v7F0xM1K0eZ1o8w5t2P1Q8R3K2y (or standard BCrypt)
-- Student@123 -> $2a$10$8R8d0W0Yr/K5a.Kd.tA4.v9Kn0w8G1yN2L1fa2p9x6u3Q2R9S4L3z

-- 1. SEED USERS
INSERT INTO users (id, email, password_hash, role, is_active) VALUES
(1, 'admin@scholartrack.edu', '$2a$10$e88n72wB1wZ97pQ9nF1nIe0P87.u0j.r1h9q4M3e2k1z8y7w6v5u4', 'ADMIN', TRUE),
(2, 'rahul.kumar@scholartrack.edu', '$2a$10$e88n72wB1wZ97pQ9nF1nIe0P87.u0j.r1h9q4M3e2k1z8y7w6v5u4', 'STUDENT', TRUE),
(3, 'priya.sharma@scholartrack.edu', '$2a$10$e88n72wB1wZ97pQ9nF1nIe0P87.u0j.r1h9q4M3e2k1z8y7w6v5u4', 'STUDENT', TRUE),
(4, 'amit.patel@scholartrack.edu', '$2a$10$e88n72wB1wZ97pQ9nF1nIe0P87.u0j.r1h9q4M3e2k1z8y7w6v5u4', 'STUDENT', TRUE),
(5, 'ananya.verma@scholartrack.edu', '$2a$10$e88n72wB1wZ97pQ9nF1nIe0P87.u0j.r1h9q4M3e2k1z8y7w6v5u4', 'STUDENT', TRUE),
(6, 'rahul.k@scholartrack.edu', '$2a$10$e88n72wB1wZ97pQ9nF1nIe0P87.u0j.r1h9q4M3e2k1z8y7w6v5u4', 'STUDENT', TRUE),
(7, 'vikram.singh@scholartrack.edu', '$2a$10$e88n72wB1wZ97pQ9nF1nIe0P87.u0j.r1h9q4M3e2k1z8y7w6v5u4', 'STUDENT', TRUE);

-- 2. SEED ADMINS
INSERT INTO admins (id, user_id, full_name, department, designation, employee_id) VALUES
(1, 1, 'Dr. Aris Thorne', 'Scholarship & Welfare Directorate', 'Chief Verification Officer', 'ADM-2024-001');

-- 3. SEED STUDENTS
INSERT INTO students (id, user_id, full_name, dob, gender, phone, college, course, branch, academic_year, cgpa_percentage, family_income, income_source, category, domicile_state, disability_status, profile_completion_pct) VALUES
(1, 2, 'Rahul Kumar', '2004-05-14', 'Male', '+91 98765 43210', 'National Institute of Technology', 'B.Tech', 'Computer Science and Engineering', 3, 86.50, 240000.00, 'Agriculture & Small Business', 'OBC', 'Maharashtra', 'NONE', 95),
(2, 3, 'Priya Sharma', '2003-11-22', 'Female', '+91 98123 45678', 'Indian Institute of Information Technology', 'B.Tech', 'Electronics and Communication', 4, 92.40, 180000.00, 'Private Service', 'GENERAL', 'Delhi', 'NONE', 100),
(3, 4, 'Amit Patel', '2002-08-19', 'Male', '+91 97234 56789', 'Gujarat Technological University', 'M.Tech', 'Artificial Intelligence', 1, 78.00, 420000.00, 'Business', 'GENERAL', 'Gujarat', 'NONE', 85),
(4, 5, 'Ananya Verma', '2004-02-10', 'Female', '+91 96345 67890', 'All India Institute of Medical Sciences', 'MBBS', 'Medicine', 2, 89.20, 210000.00, 'Teaching', 'EWS', 'Uttar Pradesh', 'NONE', 90),
(5, 6, 'Rahul K.', '2004-05-14', 'Male', '+91 98765 43210', 'National Inst of Tech', 'B.Tech', 'CSE', 3, 85.00, 240000.00, 'Agriculture', 'OBC', 'Maharashtra', 'NONE', 75),
(6, 7, 'Vikram Singh', '2003-07-04', 'Male', '+91 95456 78901', 'Delhi Technological University', 'B.Tech', 'Mechanical Engineering', 3, 74.50, 250000.00, 'Daily Wage Labor', 'SC', 'Delhi', 'NONE', 90);

-- 4. SEED SCHOLARSHIPS
INSERT INTO scholarships (id, title, provider, description, category, amount, deadline, max_family_income, min_cgpa_percentage, eligible_courses, eligible_categories, eligible_states, required_documents, is_active) VALUES
(1, 'National Merit-cum-Means Scholarship', 'Ministry of Education', 'Flagship central scholarship program providing financial assistance to meritorious students from economically weaker sections to arrest drop-out at stage VIII and encourage study at secondary stage.', 'Merit-cum-Means', 75000.00, '2026-11-30', 300000.00, 75.00, 'B.Tech,B.Sc,B.Com,B.A,MBBS', 'ALL', 'ALL', 'Marksheet,Income Certificate,Domicile Certificate,Aadhaar Card', TRUE),
(2, 'Women in STEM Excellence Fellowship', 'Council of Scientific & Industrial Research', 'Dedicated empowerment fellowship designed to support exceptional female scholars enrolled in Science, Technology, Engineering, and Mathematics degree programs.', 'Special Category', 120000.00, '2026-10-15', 600000.00, 80.00, 'B.Tech,M.Tech,B.Sc,M.Sc,PhD', 'ALL', 'ALL', 'Marksheet,College ID,Identity Proof,Income Certificate', TRUE),
(3, 'Pragati Deep-Tech & AI Innovation Grant', 'National Technology Board', 'Supports undergraduate and postgraduate engineering scholars developing innovative projects in Artificial Intelligence, Robotics, Quantum Computing, and Embedded Systems.', 'Technical/STEM', 100000.00, '2026-12-05', 800000.00, 82.00, 'B.Tech,M.Tech,MCA', 'ALL', 'ALL', 'Marksheet,Project Synopsis,Income Certificate,College Recommendation', TRUE),
(4, 'Central Sector Scheme for College & University Students', 'Department of Higher Education', 'Financial assistance to meritorious students belonging to families whose annual income is less than ₹4.5 Lakh to cover day-to-day college expenses.', 'Merit', 50000.00, '2026-11-15', 450000.00, 80.00, 'ALL', 'ALL', 'ALL', 'Marksheet,Income Certificate,Bank Passbook,Aadhaar Card', TRUE),
(5, 'State Domicile Technical Education Merit Award', 'State Directorate of Technical Education', 'Scholarship honoring outstanding technical students having domicile in Maharashtra, Delhi, or Karnataka to subsidize semester tuition fees.', 'State Domicile', 60000.00, '2026-10-31', 400000.00, 70.00, 'B.Tech,B.Arch,B.Pharm,Diploma', 'ALL', 'Maharashtra,Delhi,Karnataka', 'Domicile Certificate,Marksheet,Income Certificate,Fee Receipt', TRUE),
(6, 'Post-Matric Financial Support for SC/ST/OBC Scholars', 'Ministry of Social Justice & Empowerment', 'Government scholarship to uplift historically underrepresented communities across professional higher education courses.', 'Community Welfare', 85000.00, '2026-12-31', 250000.00, 60.00, 'ALL', 'SC,ST,OBC', 'ALL', 'Caste Certificate,Income Certificate,Marksheet,Aadhaar Card', TRUE),
(7, 'Divyangjan Higher Education Fellowship', 'Department of Empowerment of Persons with Disabilities', 'Special financial grant providing accessible learning aids, books, and tuition waivers for students with benchmark physical or visual disabilities.', 'Special Category', 90000.00, '2026-11-20', 600000.00, 55.00, 'ALL', 'ALL', 'ALL', 'Disability Certificate,Marksheet,Income Certificate,College ID', TRUE),
(8, 'Clean Energy & Green Technology Research Grant', 'Renewable Energy Mission', 'Grant for final-year engineering students and postgraduate scholars conducting original research on solar photovoltaics, EV battery tech, and green hydrogen.', 'Research', 110000.00, '2026-10-25', 1000000.00, 75.00, 'B.Tech,M.Tech,M.Sc', 'ALL', 'ALL', 'Marksheet,Research Proposal,College Recommendation,Identity Proof', TRUE);

-- 5. SEED ELIGIBILITY RULES
INSERT INTO eligibility_rules (scholarship_id, rule_type, field_name, operator, rule_value, is_mandatory, description) VALUES
(1, 'ACADEMIC', 'cgpa_percentage', 'GTE', '75.00', TRUE, 'Minimum academic percentage of 75% or equivalent CGPA'),
(1, 'FINANCIAL', 'family_income', 'LTE', '300000.00', TRUE, 'Annual family income must not exceed ₹3,00,000'),
(2, 'GENDER', 'gender', 'EQ', 'Female', TRUE, 'Applicant must identify as female'),
(2, 'ACADEMIC', 'cgpa_percentage', 'GTE', '80.00', TRUE, 'Minimum academic percentage of 80%'),
(3, 'ACADEMIC', 'cgpa_percentage', 'GTE', '82.00', TRUE, 'Minimum academic score of 82% in STEM stream'),
(5, 'STATE', 'domicile_state', 'IN', 'Maharashtra,Delhi,Karnataka', TRUE, 'Applicant must hold valid domicile in designated states');

-- 6. SEED APPLICATIONS
INSERT INTO applications (id, application_number, student_id, scholarship_id, status, submission_date, declared_income, declared_percentage, review_notes) VALUES
(1, 'ST-2026-1024', 1, 1, 'UNDER_REVIEW', '2026-09-02 10:15:00', 240000.00, 86.50, 'Preliminary criteria matched. Document verification queued.'),
(2, 'ST-2026-1048', 2, 2, 'APPROVED', '2026-08-28 14:30:00', 180000.00, 92.40, 'All documents verified successfully with 100% OCR fidelity. Approved by Chief Verification Officer.'),
(3, 'ST-2026-1072', 3, 1, 'REJECTED', '2026-08-20 09:10:00', 420000.00, 78.00, 'Ineligible: Family income ₹4,20,000 exceeds maximum allowable ceiling of ₹3,00,000.'),
(4, 'ST-2026-1098', 6, 1, 'DOCUMENT_VERIFICATION', '2026-09-08 11:20:00', 250000.00, 74.50, 'Income certificate indicates annual income of ₹5,50,000 against declared ₹2,50,000. Flagged for review.'),
(5, 'ST-2026-1102', 5, 1, 'UNDER_REVIEW', '2026-09-05 16:45:00', 240000.00, 85.00, 'High similarity detected with existing application ST-2026-1024 (Rahul Kumar). Possible duplicate submission.'),
(6, 'ST-2026-1115', 4, 4, 'CORRECTION_REQUIRED', '2026-09-04 13:00:00', 210000.00, 89.20, 'Marksheet scan blurred; semester 2 aggregate not legible. Please re-upload high-resolution scan.'),
(7, 'ST-2026-1120', 2, 3, 'SUBMITTED', '2026-09-10 08:40:00', 180000.00, 92.40, 'Submitted for Pragati AI Innovation Grant. Awaiting review.');

-- 7. SEED DOCUMENTS
INSERT INTO documents (id, student_id, document_type, file_name, file_url, file_type, file_size, detected_type, classification_confidence) VALUES
(1, 1, 'Income Certificate', 'rahul_income_cert_2026.pdf', '/uploads/docs/rahul_income_cert.pdf', 'application/pdf', 412000, 'Income Certificate', 96.50),
(2, 1, 'Marksheet', 'rahul_btech_sem4_marksheet.pdf', '/uploads/docs/rahul_sem4.pdf', 'application/pdf', 580000, 'Marksheet', 98.20),
(3, 2, 'Marksheet', 'priya_sharma_btech_consolidated.pdf', '/uploads/docs/priya_marks.pdf', 'application/pdf', 720000, 'Marksheet', 99.10),
(4, 2, 'Income Certificate', 'priya_income_revenue_office.pdf', '/uploads/docs/priya_income.pdf', 'application/pdf', 380000, 'Income Certificate', 97.40),
(5, 6, 'Income Certificate', 'vikram_singh_tehsildar_income.jpg', '/uploads/docs/vikram_income.jpg', 'image/jpeg', 650000, 'Income Certificate', 94.00),
(6, 5, 'Marksheet', 'rahul_k_marksheet_duplicate.pdf', '/uploads/docs/rahul_k_dup.pdf', 'application/pdf', 420000, 'Marksheet', 95.00);

-- 8. SEED APPLICATION DOCUMENTS
INSERT INTO application_documents (id, application_id, document_id, required_doc_type, status) VALUES
(1, 1, 1, 'Income Certificate', 'VERIFIED'),
(2, 1, 2, 'Marksheet', 'VERIFIED'),
(3, 2, 3, 'Marksheet', 'VERIFIED'),
(4, 2, 4, 'Income Certificate', 'VERIFIED'),
(5, 4, 5, 'Income Certificate', 'MISMATCH'),
(6, 5, 6, 'Marksheet', 'PENDING');

-- 9. SEED DOCUMENT EXTRACTIONS (OCR)
INSERT INTO document_extractions (id, document_id, raw_ocr_text, extracted_data_json, confidence_score) VALUES
(1, 1, 'GOVERNMENT OF MAHARASHTRA\nREVENUE DEPARTMENT\nINCOME CERTIFICATE\nCertificate No: MH/INC/2026/88921\nThis is to certify that Rahul Kumar S/O Ramesh Kumar resident of Pune has an annual family income of Rs. 2,40,000 (Rupees Two Lakh Forty Thousand only) from Agriculture & Small Enterprise.\nDate of Issue: 12/04/2026\nIssuing Authority: Tehsildar Pune', '{"applicantName": "Rahul Kumar", "annualIncome": 240000, "certificateNumber": "MH/INC/2026/88921", "issueDate": "2026-04-12", "issuingAuthority": "Tehsildar Pune"}', 96.80),
(2, 5, 'GOVERNMENT OF NCT OF DELHI\nREVENUE DEPARTMENT\nANNUAL INCOME CERTIFICATE\nRef: DL-REV-2026-44109\nCertified that the total annual household income of Vikram Singh residing at Shahdara, Delhi is Rs. 5,50,000/- (Five Lakh Fifty Thousand Rupees) from commercial enterprise and employment.\nDate: 15/05/2026\nSub-Divisional Magistrate', '{"applicantName": "Vikram Singh", "annualIncome": 550000, "certificateNumber": "DL-REV-2026-44109", "issueDate": "2026-05-15", "issuingAuthority": "Sub-Divisional Magistrate"}', 93.40);

-- 10. SEED VERIFICATION RESULTS
INSERT INTO verification_results (id, application_id, overall_status, field_comparison_json, mismatch_count, notes) VALUES
(1, 1, 'MATCHED', '[{"fieldName": "Applicant Name", "applicationValue": "Rahul Kumar", "extractedValue": "Rahul Kumar", "status": "MATCH"}, {"fieldName": "Annual Income", "applicationValue": "₹2,40,000", "extractedValue": "₹2,40,000", "status": "MATCH"}]', 0, '100% field consistency between declared data and OCR verified income certificate.'),
(2, 4, 'MISMATCH_DETECTED', '[{"fieldName": "Applicant Name", "applicationValue": "Vikram Singh", "extractedValue": "Vikram Singh", "status": "MATCH"}, {"fieldName": "Annual Income", "applicationValue": "₹2,50,000", "extractedValue": "₹5,50,000", "status": "MISMATCH", "severity": "HIGH", "note": "Declared income ₹2,50,000 vs document certified income ₹5,50,000. Exceeds scholarship eligibility ceiling."}]', 1, 'Critical financial mismatch: Document extracted income ₹5,50,000 violates eligibility rule of max ₹3,00,000.');

-- 11. SEED DUPLICATE MATCHES
INSERT INTO duplicate_matches (id, application_id, matched_application_id, similarity_score, matched_fields_json) VALUES
(1, 5, 1, 94.20, '{"nameSimilarity": 91.5, "phoneMatch": true, "dobMatch": true, "institutionMatch": true, "matchedAttributes": ["Phone (+91 98765 43210)", "Date of Birth (14/05/2004)", "College (NIT)"]}');

-- 12. SEED FRAUD RISK SCORES
INSERT INTO fraud_risk_scores (id, application_id, risk_score, risk_level, signals_json, explainable_reasons_json) VALUES
(1, 1, 12, 'LOW', '{"duplicateSimilarity": 5.0, "documentMismatch": "NONE", "multipleApplications": false, "profileConsistency": "HIGH"}', '["Verified income certificate matches declared amount", "Single active submission", "High academic pedigree"]'),
(2, 4, 84, 'HIGH', '{"duplicateSimilarity": 12.0, "documentMismatch": "CRITICAL", "multipleApplications": false, "profileConsistency": "LOW"}', '["Document income (₹5.5L) significantly exceeds declared amount (₹2.5L)", "Document value breaches scholarship ceiling (₹3.0L)", "Requires human reviewer investigation"]'),
(3, 5, 91, 'HIGH', '{"duplicateSimilarity": 94.2, "documentMismatch": "NONE", "multipleApplications": true, "profileConsistency": "MEDIUM"}', '["Near-identical application profile detected with ST-2026-1024", "Same mobile number and birth date registered under slight name abbreviation (Rahul K. vs Rahul Kumar)", "Potential duplicate claim attempt"]');

-- 13. SEED NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(2, 'Application Submitted', 'Your application ST-2026-1024 for National Merit-cum-Means Scholarship is under review.', 'INFO', TRUE),
(2, 'Document Verified', 'Your Income Certificate has been verified successfully via OCR extraction.', 'SUCCESS', TRUE),
(3, 'Scholarship Approved! 🎉', 'Congratulations Priya! Your application ST-2026-1048 has been approved. Disbursement will commence shortly.', 'SUCCESS', FALSE),
(7, 'Document Mismatch Alert', 'A mismatch was detected between your declared income and uploaded certificate. Please review your submission.', 'WARNING', FALSE),
(1, 'High Risk Application Flagged', 'Application ST-2026-1098 flagged with Risk Score 84 (Critical Income Mismatch).', 'ALERT', FALSE),
(1, 'Potential Duplicate Alert', 'Application ST-2026-1102 flagged with 94% similarity to ST-2026-1024.', 'ALERT', FALSE);

-- 14. SEED AUDIT LOGS
INSERT INTO audit_logs (user_id, user_email, user_role, action, entity_name, entity_id, details) VALUES
(1, 'admin@scholartrack.edu', 'ADMIN', 'SYSTEM_INIT', 'DATABASE', 'SCHEMA', 'ScholarTrack database initialized with demo configuration'),
(2, 'rahul.kumar@scholartrack.edu', 'STUDENT', 'APPLICATION_SUBMITTED', 'APPLICATION', 'ST-2026-1024', 'Applied for National Merit-cum-Means Scholarship'),
(1, 'admin@scholartrack.edu', 'ADMIN', 'DOCUMENT_VERIFIED', 'DOCUMENT', 'DOC-1', 'Automated OCR verification passed with 96.8% confidence'),
(1, 'admin@scholartrack.edu', 'ADMIN', 'APPLICATION_APPROVED', 'APPLICATION', 'ST-2026-1048', 'Approved application for Priya Sharma with reviewer note'),
(1, 'admin@scholartrack.edu', 'ADMIN', 'FRAUD_FLAG_RAISED', 'APPLICATION', 'ST-2026-1098', 'AI Fraud Risk Analysis generated score 84/100 (Income Discrepancy)');
