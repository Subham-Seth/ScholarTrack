# SCHOLARTRACK

> **AI-Based Scholarship Management, Verification, and Fraud Detection Platform**  
> *A Production-Quality Academic Project Prototype*

ScholarTrack is an enterprise-grade full-stack scholarship platform engineered to automate scheme discovery, deterministic eligibility checking, AI-assisted OCR document verification, multi-application duplicate detection, and composite fraud anomaly scoring.

---

## 1. System Architecture Overview

ScholarTrack implements a clean, decoupled **three-tier architecture** designed for high auditability and clear decision boundaries:

```
                                  +---------------------------------------------------+
                                  |         React 19 + TypeScript + Vite 8            |
                                  |     (Tailwind CSS 3.4, Recharts, Lucide React)    |
                                  |                     Port: 5173                    |
                                  +-------------------------+-------------------------+
                                                            |
                                                   REST API / JWT Bearer
                                                            |
                                                            v
                                  +---------------------------------------------------+
                                  |            Spring Boot 3.3.4 Backend              |
                                  |    (Java 22, Spring Security 6, Spring Data JPA)  |
                                  |                     Port: 8080                    |
                                  +------------+------------------------+-------------+
                                               |                        |
                         Internal Microservice |                        | Persistence Layer
                                HTTP / JSON    |                        | (H2 Dev / MySQL 8.0)
                                               v                        v
            +--------------------------------------+      +-----------------------------------+
            |       Python AI Microservice         |      |    Database Storage & Schemas     |
            | (FastAPI, RapidFuzz, Uvicorn, OCR)   |      |  14 Normalized Relational Tables  |
            |              Port: 8000              |      |         Ports: 3306 / H2          |
            +--------------------------------------+      +-----------------------------------+
```

### Core Design Principle: Human-in-the-Loop Decision Support
> **Important Advisory:** All automated AI outputs—including composite fraud risk scores (0–100), duplicate similarity percentages, and OCR certificate discrepancies—are **strictly assistive indicators**. Final scholarship approval, sanctioning, rejection, or revocation is executed exclusively by authorized human administrative officers and recorded in an immutable audit ledger.

---

## 2. Visual Identity & Design System

The platform strictly adheres to the specified enterprise academic palette:
- **Primary Navy / Deep Teal**: `#0F3040` (Navigation headers, primary action buttons, primary branding)
- **Secondary Slate**: `#464858` (Body typography, secondary headings, muted icons)
- **Muted Terracotta**: `#A56F63` (Scheme badge accents, category tags, attention chips)
- **Warm Peach / Sand**: `#D99B7F` (Highlights, recommendation stars, subtle borders)
- **Surface Canvas**: `#F8FAFC` (Clean slate background, high contrast cards)

---

## 3. Technology Stack

| Component | Technologies |
|:---|:---|
| **Frontend UI** | React 19, TypeScript 5, Vite 8, Tailwind CSS 3.4, React Router 7, Recharts, Lucide React, Canvas-Confetti |
| **Backend Core** | Java 22, Spring Boot 3.3.4, Spring Security 6, JJWT 0.12.6, Spring Data JPA, Hibernate Validator |
| **AI Subsystem** | Python 3.12, FastAPI, Uvicorn, RapidFuzz 3.14 (Levenshtein & Token Sort), Pydantic v2 |
| **Database** | H2 Embedded Database (zero-friction dev profile) + MySQL 8.0 support (14 relational tables) |
| **Build Tools** | Portable Apache Maven 3.9.6 wrapper (`mvnw.cmd`), npm / Node.js |

---

## 4. Quick Start & Execution Guide

### Prerequisites
- **Java**: JDK 21 or 22 installed (checked via `java -version`)
- **Node.js**: v18+ with npm installed (checked via `node -v`)
- **Python**: Python 3.10+ installed (checked via `python --version`)

### One-Click Startup (Windows)
Run the provided automated script to launch all three services in parallel:
```powershell
.\start-all.bat
```

Or run each service independently:

#### A. Spring Boot Backend (Port 8080)
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
*Note: The backend starts in `dev` profile by default using embedded H2 in MySQL mode and automatically seeds all demo users, scholarships, applications, and risk reports.*
*H2 Web Console available at: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:scholartrackdb`, User: `sa`, Password: blank)*

#### B. Python AI Microservice (Port 8000)
```powershell
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*Swagger API Docs available at: `http://localhost:8000/docs`*

#### C. React Frontend (Port 5173)
```powershell
cd frontend
npm install
npm run dev
```
*Access the web application at: `http://localhost:5173`*

---

## 5. Pre-seeded Demo Accounts

| Role | Email Address | Password | Scenario / Characteristics |
|:---|:---|:---|:---|
| **Administrator** | `admin@scholartrack.edu` | `Admin@123` | Full access to review queue, fraud flags, duplicate matches, scheme creation, and audit logs. |
| **Student (Standard)** | `rahul.kumar@scholartrack.edu` | `Student@123` | 84.5% marks, ₹2,40,000 family income. Has active application under review. |
| **Student (Approved)** | `priya.sharma@scholartrack.edu` | `Student@123` | 92.0% marks, ₹1,80,000 income. Disbursed award with clean verification dossier. |
| **Student (Mismatch Test)** | `vikram.singh@scholartrack.edu` | `Student@123` | Declared ₹1,80,000 income; OCR extracted certificate shows ₹4,50,000 (+150% variance, Risk Score 78). |
| **Student (Duplicate Test)** | `rahul.k@scholartrack.edu` | `Student@123` | 92% RapidFuzz identity similarity match with Rahul Kumar. |

*Quick-Fill demo buttons are provided on the Login page for 1-click credential population.*

---

## 6. Functional Workflows

### Student Workflows
1. **Explore Schemes**: Public and student-specific search, filtering by category (Merit, STEM, Need-Based, Women Empowerment), award amounts, and deadlines.
2. **Deterministic Pre-Assessment**: Before applying, the engine verifies candidate CGPA, maximum income threshold, domicile state, and gender constraints without submitting an application.
3. **AI Recommendations**: Personalized scheme matching scores (0–100%) based on academic profile and background.
4. **4-Step Application Stepper**:
   - Step 1: Self-declaration of income and academic marks.
   - Step 2: Document upload (Income Certificate, Marksheet, Category Certificate, ID proof).
   - Step 3: Instant AI-OCR simulated extraction & variance preview.
   - Step 4: Final verification review and submission.
5. **Real-time Status Tracking**: Color-coded lifecycle badges (`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `CORRECTION_REQUIRED`, `REJECTED`).
6. **AI Assistant (RAG Chat)**: Ask questions regarding scheme deadlines, minimum criteria, document requirements, or grievance instructions.

### Administrator Workflows
1. **Operations Command Center**:
   - KPI metrics: Total applications, pending reviews, flagged anomalies, total disbursed aid.
   - Recharts visual charts: Status breakdown, AI risk score distribution, monthly application velocity.
   - High-priority attention queue.
2. **Review & Decision Dossier**:
   - **Side-by-Side OCR Verification**: Automatic comparison between declared values and OCR extracted data with red flags when variance exceeds &plusmn;10%.
   - **Composite Fraud Risk Card**: Breakdown of income discrepancy score, marks variance, duplicate similarity, and tampering index.
   - **Document Viewer**: Inspect raw OCR JSON payloads and extraction confidence.
   - **Action Bar**: Approve & Disburse, Request Correction (with student notes), Reject (with justification), or Flag for High-Level Investigation.
3. **Duplicate Detection Center**:
   - RapidFuzz token sort matching across applicant Aadhaar hashes, bank account numbers, phonetic names, and contact details.
   - Dismiss false positives or confirm duplicate invalidation.
4. **Fraud & Anomaly Queue**:
   - Prioritized triage of applications exceeding the high-risk cutoff (&gt; 60/100).
5. **Scheme Management & Configuration**:
   - Create, edit, activate/deactivate scholarship schemes and adjust deterministic eligibility criteria.
6. **Compliance Audit Trail**:
   - Immutable log of all administrative decisions, document uploads, and system events with timestamps, actor emails, and IP tracking.

---

## 7. AI & Verification Logic

### A. Composite Fraud Risk Calculation
The platform computes an assistive risk score \( R \in [0, 100] \) via weighted multi-signal aggregation:
\[
R = w_{\text{inc}} \cdot S_{\text{income\_mismatch}} + w_{\text{acad}} \cdot S_{\text{marks\_mismatch}} + w_{\text{dup}} \cdot S_{\text{duplicate}} + w_{\text{anom}} \cdot S_{\text{tampering}}
\]
- **Low Risk** (\( 0 \le R < 30 \)): Verified data matches declarations within nominal tolerance.
- **Medium Risk** (\( 30 \le R \le 60 \)): Moderate variance or incomplete field extraction; standard officer review.
- **High Risk** (\( R > 60 \)): Significant income variance (&gt; 15%), marks discrepancy, or duplicate Aadhaar detection; highlighted for urgent scrutiny.

### B. Duplicate Detection (RapidFuzz)
Uses Levenshtein and token sort ratios to cross-match candidate submissions against the entire historical registry, catching minor spelling variations (e.g. "Rahul Kumar" vs "Rahul K.") and shared bank/Aadhaar details.

---

## 8. Database Schema Summary

The database consists of **14 normalized relational tables**:
1. `users`: Credentials, role (`STUDENT`, `ADMIN`), status.
2. `students`: Extended student profiles (CGPA, income, caste, domicile, college).
3. `admins`: Administrative officer credentials and department.
4. `scholarships`: Scholarship schemes, award amounts, quotas, deadlines.
5. `eligibility_rules`: Structured rule constraints evaluated by the engine.
6. `applications`: Application lifecycle records, submission timestamps, review status.
7. `documents`: Document repository metadata, storage paths, file sizes.
8. `application_documents`: Many-to-many link between applications and uploaded files.
9. `document_extractions`: Extracted OCR key-value pairs and confidence scores.
10. `verification_results`: Field-by-field declared vs extracted verification verdicts.
11. `duplicate_matches`: Cross-application similarity findings and matched identifiers.
12. `fraud_risk_scores`: Multi-signal composite score and explainable reasons.
13. `notifications`: In-app user notifications and action-required alerts.
14. `audit_logs`: Immutable compliance audit trail.

---

## 9. Verification & Build Confirmation

Both frontend and backend have been compiled and verified with zero errors:
- **Backend**: `mvnw compile` &rarr; `BUILD SUCCESS` (65 compiled Java classes)
- **Frontend**: `npm run build` &rarr; `vite build` completed cleanly (2,498 modules transformed, zero TypeScript errors)

---

## 10. License & Academic Disclaimer
Developed as a comprehensive Academic Project Prototype for scholarship management and verification. All demo data, institutional names, and simulated OCR outputs are synthetic and intended for academic demonstration.
