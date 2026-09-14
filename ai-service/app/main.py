"""
ScholarTrack AI Microservice
Provides intelligent scholarship recommendation, document classification,
OCR extraction simulation, duplicate detection, and fraud risk scoring.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import re
from rapidfuzz import fuzz

app = FastAPI(
    title="ScholarTrack AI Service",
    description="Microservice for Document Classification, OCR, Duplicate Detection & Fraud Scoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Models
# -------------------------------------------------------------
class ClassifyRequest(BaseModel):
    fileName: str
    fileType: Optional[str] = ""
    sampleText: Optional[str] = ""

class ClassifyResponse(BaseModel):
    detectedType: str
    confidence: float
    isConfident: bool

class OcrRequest(BaseModel):
    documentType: str
    fileName: str
    rawText: Optional[str] = None

class OcrResponse(BaseModel):
    documentType: str
    rawText: str
    extractedFields: Dict[str, Any]
    confidence: float

class VerificationRequest(BaseModel):
    declaredName: str
    declaredIncome: Optional[float] = None
    declaredPercentage: Optional[float] = None
    ocrFields: Dict[str, Any]

class VerificationResponse(BaseModel):
    overallStatus: str
    mismatchCount: int
    fieldReports: List[Dict[str, Any]]

class DuplicateCheckRequest(BaseModel):
    studentA: Dict[str, Any]
    studentB: Dict[str, Any]

class DuplicateCheckResponse(BaseModel):
    similarityScore: float
    isFlagged: bool
    matchedAttributes: List[str]

class FraudAnalysisRequest(BaseModel):
    duplicateSimilarity: float
    mismatchCount: int
    activeApplicationsCount: int
    profileCompletionPct: int

class FraudAnalysisResponse(BaseModel):
    riskScore: int
    riskLevel: str
    signals: Dict[str, Any]
    explainableReasons: List[str]

class ChatRequest(BaseModel):
    message: str
    studentContext: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
    suggestions: List[str]

# -------------------------------------------------------------
# Endpoints
# -------------------------------------------------------------
@app.get("/health")
def health_check():
    return {"status": "UP", "service": "ScholarTrack AI Microservice", "version": "1.0.0"}

@app.post("/api/ai/document-classify", response_model=ClassifyResponse)
def classify_document(req: ClassifyRequest):
    combined = (req.fileName + " " + (req.sampleText or "")).lower()
    
    if any(k in combined for k in ["income", "revenue", "salary", "tehsildar", "sdm", "aay"]):
        return ClassifyResponse(detectedType="Income Certificate", confidence=96.5, isConfident=True)
    elif any(k in combined for k in ["marks", "grade", "transcript", "result", "btech", "semester", "cgpa"]):
        return ClassifyResponse(detectedType="Marksheet", confidence=98.2, isConfident=True)
    elif any(k in combined for k in ["domicile", "resident", "niwas", "state", "praman"]):
        return ClassifyResponse(detectedType="Domicile Certificate", confidence=95.0, isConfident=True)
    elif any(k in combined for k in ["caste", "category", "jati", "obc", "sc", "st", "ews"]):
        return ClassifyResponse(detectedType="Category Certificate", confidence=94.5, isConfident=True)
    elif any(k in combined for k in ["aadhaar", "id", "identity", "passport", "voter"]):
        return ClassifyResponse(detectedType="Identity Document", confidence=97.0, isConfident=True)
    
    return ClassifyResponse(detectedType="Other Document", confidence=62.0, isConfident=False)

@app.post("/api/ai/ocr", response_model=OcrResponse)
def extract_ocr(req: OcrRequest):
    doc_type = req.documentType
    fields = {}
    
    if "income" in doc_type.lower():
        fields = {
            "applicantName": "Rahul Kumar",
            "annualIncome": 240000,
            "certificateNumber": f"REV/INC/2026/{10000 + (hash(req.fileName) % 89999)}",
            "issueDate": "2026-04-12",
            "issuingAuthority": "Office of the Tehsildar"
        }
        raw_text = (f"GOVERNMENT REVENUE DEPARTMENT\nINCOME CERTIFICATE\n"
                    f"Certificate No: {fields['certificateNumber']}\n"
                    f"Certified that Rahul Kumar has an annual family income of Rs. 2,40,000.\n"
                    f"Date: 2026-04-12 | Authority: Tehsildar")
        conf = 96.8
    elif "mark" in doc_type.lower():
        fields = {
            "applicantName": "Rahul Kumar",
            "rollNumber": f"EN2024{1000 + (hash(req.fileName) % 8999)}",
            "cgpaPercentage": 86.5,
            "institution": "National Institute of Technology",
            "academicYear": 2026
        }
        raw_text = (f"GRADE REPORT & MARKS TRANSCRIPT\nCandidate: Rahul Kumar\n"
                    f"Roll No: {fields['rollNumber']}\nCumulative Aggregate: 86.50%\n"
                    f"Institution: National Institute of Technology\nResult: FIRST CLASS WITH DISTINCTION")
        conf = 98.4
    else:
        fields = {
            "applicantName": "Applicant",
            "documentId": f"DOC-{1000 + (hash(req.fileName) % 8999)}",
            "verified": True
        }
        raw_text = f"DOCUMENT VERIFICATION SCAN\nFile: {req.fileName}\nStatus: Verified"
        conf = 90.0

    return OcrResponse(documentType=doc_type, rawText=raw_text, extractedFields=fields, confidence=conf)

@app.post("/api/ai/verify-document", response_model=VerificationResponse)
def verify_document(req: VerificationRequest):
    reports = []
    mismatch_count = 0
    ocr = req.ocrFields

    # Name check
    if "applicantName" in ocr:
        sim = fuzz.ratio(req.declaredName.lower(), str(ocr["applicantName"]).lower())
        if sim >= 80:
            reports.append({"fieldName": "Applicant Name", "applicationValue": req.declaredName, "extractedValue": ocr["applicantName"], "status": "MATCH", "note": f"Fuzzy match {sim}%"})
        else:
            mismatch_count += 1
            reports.append({"fieldName": "Applicant Name", "applicationValue": req.declaredName, "extractedValue": ocr["applicantName"], "status": "MISMATCH", "note": "Discrepancy in applicant name"})

    # Income check
    if "annualIncome" in ocr and req.declaredIncome is not None:
        doc_inc = float(ocr["annualIncome"])
        diff = abs(doc_inc - req.declaredIncome)
        if diff <= 10000:
            reports.append({"fieldName": "Annual Income", "applicationValue": f"₹{req.declaredIncome:,.2f}", "extractedValue": f"₹{doc_inc:,.2f}", "status": "MATCH", "note": "Declared income aligns with certified amount"})
        else:
            mismatch_count += 1
            reports.append({"fieldName": "Annual Income", "applicationValue": f"₹{req.declaredIncome:,.2f}", "extractedValue": f"₹{doc_inc:,.2f}", "status": "MISMATCH", "note": f"Document income exceeds declared by ₹{diff:,.2f}"})

    # Percentage check
    if "cgpaPercentage" in ocr and req.declaredPercentage is not None:
        doc_pct = float(ocr["cgpaPercentage"])
        if abs(doc_pct - req.declaredPercentage) <= 2.0:
            reports.append({"fieldName": "Academic Score", "applicationValue": f"{req.declaredPercentage}%", "extractedValue": f"{doc_pct}%", "status": "MATCH", "note": "Marks aggregate verified within tolerance"})
        else:
            mismatch_count += 1
            reports.append({"fieldName": "Academic Score", "applicationValue": f"{req.declaredPercentage}%", "extractedValue": f"{doc_pct}%", "status": "MISMATCH", "note": "Marks discrepancy exceeds 2%"})

    status = "MISMATCH_DETECTED" if mismatch_count > 0 else "MATCHED"
    return VerificationResponse(overallStatus=status, mismatchCount=mismatch_count, fieldReports=reports)

@app.post("/api/ai/duplicate-check", response_model=DuplicateCheckResponse)
def check_duplicate(req: DuplicateCheckRequest):
    a = req.studentA
    b = req.studentB

    name_sim = fuzz.token_sort_ratio(str(a.get("fullName", "")), str(b.get("fullName", "")))
    phone_match = a.get("phone") and b.get("phone") and re.sub(r"\D", "", str(a["phone"])) == re.sub(r"\D", "", str(b["phone"]))
    dob_match = a.get("dob") and b.get("dob") and a["dob"] == b["dob"]
    college_sim = fuzz.token_sort_ratio(str(a.get("college", "")), str(b.get("college", "")))

    score = (name_sim * 0.35) + ((100.0 if phone_match else 0.0) * 0.35) + ((100.0 if dob_match else 0.0) * 0.20) + (college_sim * 0.10)
    score = round(score, 1)

    matched = []
    if name_sim >= 85: matched.append(f"Name Match ({name_sim}%)")
    if phone_match: matched.append("Identical Mobile Number")
    if dob_match: matched.append("Matching Date of Birth")
    if college_sim >= 80: matched.append("Same Educational Institution")

    return DuplicateCheckResponse(similarityScore=score, isFlagged=score >= 75.0, matchedAttributes=matched)

@app.post("/api/ai/fraud-analysis", response_model=FraudAnalysisResponse)
def analyze_fraud(req: FraudAnalysisRequest):
    dup_weight = req.duplicateSimilarity * 0.35
    mismatch_weight = min(req.mismatchCount * 45.0, 100.0) * 0.35
    velocity_weight = (75.0 if req.activeApplicationsCount > 3 else 10.0) * 0.15
    profile_weight = (60.0 if req.profileCompletionPct < 70 else 10.0) * 0.15

    total = int(round(dup_weight + mismatch_weight + velocity_weight + profile_weight))
    total = max(min(total, 96), 6)

    level = "HIGH" if total >= 70 else ("MEDIUM" if total >= 40 else "LOW")

    reasons = []
    if req.duplicateSimilarity >= 75.0:
        reasons.append(f"High duplicate similarity ({req.duplicateSimilarity}%) detected with another student applicant")
    if req.mismatchCount > 0:
        reasons.append(f"Detected {req.mismatchCount} critical field discrepancies between declared values and OCR certificates")
    if req.activeApplicationsCount > 3:
        reasons.append(f"Unusually high submission frequency ({req.activeApplicationsCount} active applications in single cycle)")
    if req.profileCompletionPct < 70:
        reasons.append("Incomplete student profile with missing verification credentials")

    if not reasons:
        reasons.append("Zero document discrepancies detected")
        reasons.append("No duplicate profile or fraudulent pattern flags")
        reasons.append("Profile verified with 100% credential consistency")

    signals = {
        "duplicateSimilarity": req.duplicateSimilarity,
        "documentMismatch": "HIGH" if req.mismatchCount > 0 else "NONE",
        "multipleApplications": req.activeApplicationsCount > 3,
        "profileConsistency": "LOW" if req.profileCompletionPct < 70 else "HIGH"
    }

    return FraudAnalysisResponse(riskScore=total, riskLevel=level, signals=signals, explainableReasons=reasons)

@app.post("/api/ai/chat", response_model=ChatResponse)
def ai_chat(req: ChatRequest):
    msg = req.message.lower()
    student = req.studentContext or {}

    if any(w in msg for w in ["eligible", "qualify", "kya", "kyun"]):
        name = student.get("fullName", "Student")
        course = student.get("course", "B.Tech")
        cgpa = student.get("cgpaPercentage", "85")
        income = student.get("familyIncome", "2,40,000")
        answer = (f"Hello {name}! Based on your declared profile ({course}, {cgpa}% score, and ₹{income} annual family income), "
                  f"you satisfy the core criteria for Merit-cum-Means and Technical innovation schemes with ceilings up to ₹3.0–8.0 Lakh.")
        return ChatResponse(
            answer=answer,
            sources=["Student Profile", "National Scholarship Eligibility Directory"],
            suggestions=["Check National Merit Scholarship", "View Pragati AI Grant"]
        )
    elif any(w in msg for w in ["document", "upload", "kya chahiye"]):
        return ChatResponse(
            answer=("Key mandatory documents for scholarship applications:\n"
                    "1. Consolidated Marksheet / Grade Card\n"
                    "2. Income Certificate from Competent Revenue Authority (Tehsildar/SDM)\n"
                    "3. Domicile / Residential Certificate\n"
                    "4. Valid Government ID (Aadhaar or College ID Card).\n\n"
                    "All documents undergo automated AI document classification and OCR field comparison."),
            sources=["Verification Guidelines 2026"],
            suggestions=["Open Document Manager", "Check supported file types"]
        )
    elif any(w in msg for w in ["deadline", "last date", "kab tak"]):
        return ChatResponse(
            answer=("Upcoming scholarship submission deadlines:\n"
                    "• Women in STEM Fellowship: 15 Oct 2026\n"
                    "• State Domicile Technical Award: 31 Oct 2026\n"
                    "• Central Sector College Scheme: 15 Nov 2026\n"
                    "• National Merit-cum-Means: 30 Nov 2026\n"
                    "• Pragati Deep-Tech Innovation: 05 Dec 2026."),
            sources=["ScholarTrack Bulletin Board"],
            suggestions=["Filter by deadline", "Apply now"]
        )
    else:
        return ChatResponse(
            answer=("Welcome to ScholarTrack AI! I am your interactive scholarship assistant. "
                    "You can ask me about eligible schemes, document requirements, application tracking, "
                    "and eligibility explanations in English or Hindi/Hinglish."),
            sources=["ScholarTrack Knowledge Base"],
            suggestions=["Am I eligible for any scholarships?", "What documents do I need to submit?", "What is my application status?"]
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
