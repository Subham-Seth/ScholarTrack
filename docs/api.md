# ScholarTrack REST API Specification

Base URL: `http://localhost:8080/api`  
All authenticated endpoints require an `Authorization: Bearer <jwt_token>` header.

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/login`
Authenticates user credentials and returns JWT bearer token and role.
```json
// Request
{
  "email": "admin@scholartrack.edu",
  "password": "Admin@123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userId": 1,
    "email": "admin@scholartrack.edu",
    "role": "ADMIN",
    "fullName": "System Administrator",
    "profileId": 1
  }
}
```

### `POST /api/auth/register`
Registers a new student account and initializes baseline profile.
```json
// Request
{
  "email": "new.student@scholartrack.edu",
  "password": "Student@123",
  "fullName": "New Student",
  "role": "STUDENT"
}
```

---

## 2. Student Endpoints (`/api/students`)

### `GET /api/students/profile`
Retrieves current student's full academic and socio-economic profile.

### `PUT /api/students/profile`
Updates current student's profile details.

### `GET /api/students/dashboard`
Aggregated metrics including profile completion, recommended count, active applications, and unread notifications.

### `GET /api/students/documents`
Lists all documents stored in the student repository along with OCR extraction statuses.

### `POST /api/students/documents/upload`
Multipart form upload of document file (`file`) and optional `documentType`. Automatically executes OCR key-value extraction.

### `DELETE /api/students/documents/{id}`
Deletes a document from repository.

---

## 3. Scholarship Endpoints (`/api/scholarships`)

### `GET /api/scholarships`
Publicly browse active scholarships with optional search and category filters:
- Parameters: `search` (string), `category` (string)

### `GET /api/scholarships/{id}`
Detailed public information and requirements for a scholarship.

### `POST /api/scholarships` *(Admin Only)*
Creates a new scholarship scheme with deterministic eligibility criteria.

### `PUT /api/scholarships/{id}` *(Admin Only)*
Updates existing scholarship scheme.

### `PATCH /api/scholarships/{id}/toggle-status` *(Admin Only)*
Toggles active / inactive status of scholarship scheme.

---

## 4. Eligibility Engine (`/api/eligibility`)

### `POST /api/eligibility/check`
Evaluates a student against a specific scholarship's rule predicates without submitting an application.
```json
// Request
{
  "scholarshipId": 1,
  "studentId": 2
}

// Response
{
  "success": true,
  "data": {
    "scholarshipId": 1,
    "scholarshipTitle": "National Merit Scholarship for Higher Education",
    "status": "ELIGIBLE",
    "matchScorePercentage": 95,
    "criteria": [
      {
        "criterionName": "Academic Marks",
        "requiredValue": ">= 75%",
        "studentValue": "84.5%",
        "passed": true,
        "message": "Qualifies academic criteria."
      }
    ],
    "passedCriteria": ["Academic Marks", "Income Threshold"],
    "failedCriteria": [],
    "aiExplanation": "Student meets all required academic and financial criteria."
  }
}
```

---

## 5. Applications (`/api/applications`)

### `POST /api/applications/draft`
Creates a draft scholarship application with declared income and marks.

### `POST /api/applications/{id}/attach-document`
Attaches an uploaded repository document to the application.

### `POST /api/applications/{id}/submit`
Submits application for review, automatically triggering duplicate scan and fraud risk assessment.

### `GET /api/applications/{id}`
Retrieves full application dossier.

---

## 6. Administrative Operations (`/api/admin`)

### `GET /api/admin/dashboard`
High-level administrative metrics, lifecycle counts, and high-priority review queue.

### `GET /api/admin/applications`
Filterable table of applications with status and risk query parameters.

### `POST /api/admin/applications/{id}/review`
Executes human reviewer decision:
```json
// Request
{
  "decision": "APPROVE", // "APPROVE" | "REJECT" | "REQUEST_CORRECTION" | "FLAG_REVIEW"
  "reviewNotes": "All income certificates and marksheet OCR comparisons match declared parameters."
}
```

### `GET /api/admin/duplicates`
Lists all cross-application duplicate alerts flagged by RapidFuzz.

### `GET /api/admin/fraud-alerts`
Lists high-risk anomaly incidents requiring priority triage.

### `GET /api/admin/audit-logs`
Immutable compliance audit logs of all platform decisions.

---

## 7. AI Microservice Endpoints (`http://localhost:8000/api/ai`)

- `POST /api/ai/ocr`: Extracts structured fields from uploaded document.
- `POST /api/ai/verify-document`: Side-by-side comparison between declared and OCR extracted values.
- `POST /api/ai/duplicate-check`: RapidFuzz similarity assessment across application identifiers.
- `POST /api/ai/fraud-analysis`: Multi-signal composite fraud risk calculation.
- `POST /api/ai/chat`: RAG assistant Q&A with scholarship rule citation.
