export type Role = 'STUDENT' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: Role;
  fullName?: string;
  profileId?: number;
}

export interface StudentProfile {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  rollNumber?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  college?: string;
  course?: string;
  branch?: string;
  academicYear?: number;
  cgpaPercentage?: number;
  tenthPercentage?: number;
  familyIncome?: number;
  annualFamilyIncome?: number;
  incomeSource?: string;
  category?: string;
  domicileState?: string;
  disabilityStatus?: string;
  profileCompletionPct: number;
  createdAt?: string;
}

export interface RuleDto {
  id?: number;
  ruleType: string;
  fieldName: string;
  operator: string;
  ruleValue: string;
  isMandatory?: boolean;
  description?: string;
}

export interface Scholarship {
  id: number;
  title: string;
  provider: string;
  description: string;
  category: string;
  amount: number;
  deadline: string;
  code?: string;
  maxFamilyIncome?: number;
  maxIncome?: number;
  minCgpaPercentage?: number;
  minPercentage?: number;
  eligibleCourses?: string;
  eligibleCategories?: string;
  eligibleCategory?: string;
  eligibleGender?: string;
  eligibleStates?: string;
  requiredDocuments?: string;
  isActive: boolean;
  matchPercentage?: number;
  rules?: RuleDto[];
}

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'DOCUMENT_VERIFICATION'
  | 'CORRECTION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'FLAGGED';

export interface DocumentDto {
  id: number;
  documentId?: number;
  requiredDocType?: string;
  documentType: string;
  fileName: string;
  fileUrl?: string;
  fileType?: string;
  fileSize: number;
  detectedType?: string;
  classificationConfidence?: number;
  status?: string;
  verificationStatus?: string;
  rawOcrText?: string;
  extractedDataJson?: string;
  extractedData?: string;
  extractedIncome?: number;
  extractedPercentage?: number;
  createdAt?: string;
}

export interface VerificationFieldReport {
  fieldName: string;
  applicationValue: string;
  extractedValue: string;
  status: 'MATCH' | 'MISMATCH' | 'NOT_FOUND';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  note?: string;
}

export interface VerificationDto {
  overallStatus: 'MATCHED' | 'MISMATCH_DETECTED' | 'REQUIRES_REVIEW';
  fieldComparisonJson?: string;
  mismatchCount: number;
  verifiedAt?: string;
  notes?: string;
}

export interface DuplicateDto {
  id?: number;
  primaryApplicationId?: number;
  primaryApplicationNumber?: string;
  primaryStudentName?: string;
  primaryScholarshipTitle?: string;
  matchedApplicationId: number;
  matchedApplicationNumber: string;
  matchedStudentName: string;
  matchedScholarshipTitle?: string;
  similarityScore: number;
  matchedFieldsJson?: string;
  matchedFields?: string[];
  createdAt?: string;
}

export interface FraudRiskDto {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  signalsJson?: string;
  explainableReasonsJson?: string;
}

export interface ApplicationSummary {
  id: number;
  applicationNumber: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentCollege?: string;
  studentRollNumber?: string;
  scholarshipId: number;
  scholarshipTitle: string;
  scholarshipAmount: number;
  status: ApplicationStatus;
  submissionDate?: string;
  declaredIncome?: number;
  declaredPercentage?: number;
  fraudRiskScore?: number;
  fraudRiskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  flagReason?: string;
  duplicateSimilarity?: number;
  verificationStatus?: string;
  mismatchCount?: number;
  reviewNotes?: string;
  createdAt: string;
}

export interface ApplicationDetail {
  id: number;
  applicationNumber: string;
  student?: StudentProfile;
  scholarship?: Scholarship;
  studentName?: string;
  studentRollNumber?: string;
  college?: string;
  course?: string;
  category?: string;
  scholarshipTitle?: string;
  scholarshipAmount?: number;
  status: ApplicationStatus;
  submissionDate?: string;
  declaredIncome?: number;
  declaredPercentage?: number;
  riskScore?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  riskBreakdown?: {
    incomeDiscrepancyScore?: number;
    academicDiscrepancyScore?: number;
    duplicateSimilarityScore?: number;
    tamperingAnomalyScore?: number;
  };
  flagReason?: string;
  duplicateAlert?: any;
  reviewNotes?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  documents?: DocumentDto[];
  verification?: VerificationDto;
  duplicate?: DuplicateDto;
  fraudRisk?: FraudRiskDto;
  createdAt: string;
}

export interface CriterionEvaluation {
  criterionName: string;
  requiredValue: string;
  studentValue: string;
  passed: boolean;
  message: string;
}

export interface AlternativeScholarship {
  id: number;
  title: string;
  provider: string;
  matchPercentage: number;
}

export interface EligibilityResult {
  scholarshipId: number;
  scholarshipTitle: string;
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'REQUIRES_REVIEW';
  matchScorePercentage: number;
  criteria: CriterionEvaluation[];
  passedCriteria: string[];
  failedCriteria: string[];
  missingFields: string[];
  aiExplanation: string;
  suggestedActions: string[];
  alternativeScholarships: AlternativeScholarship[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  read?: boolean;
  isRead?: boolean;
  link?: string;
  createdAt: string;
}

export interface StudentDashboardData {
  studentName: string;
  profileCompletionPct: number;
  totalRecommended: number;
  totalEligible: number;
  activeApplications: number;
  pendingDocuments: number;
  unreadNotifications: number;
  recentApplications: ApplicationSummary[];
  recommendedScholarships: Scholarship[];
  recentAlerts: NotificationItem[];
}

export interface AdminDashboardData {
  totalApplications: number;
  pendingReview: number;
  pendingReviewApplications: number;
  underReviewApplications: number;
  flaggedApplications: number;
  duplicateAlertsCount: number;
  activeScholarships: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  totalDisbursedAmount: number;
  verifiedApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  potentialDuplicates: number;
  highRiskAlerts: number;
  statusDistribution: Record<string, number>;
  scholarshipPopularity: Record<string, number>;
  riskDistribution: Record<string, number>;
  highPriorityQueue: ApplicationSummary[];
  recentApplications?: ApplicationSummary[];
}

export interface AuditLogItem {
  id: number;
  userId?: number;
  userEmail?: string;
  userRole?: string;
  performedBy?: string;
  action: string;
  entityName?: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  timestamp?: string;
  createdAt: string;
}
