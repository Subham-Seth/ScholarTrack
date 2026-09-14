import {
  User,
  StudentProfile,
  Scholarship,
  ApplicationSummary,
  ApplicationDetail,
  EligibilityResult,
  DocumentDto,
  NotificationItem,
  StudentDashboardData,
  AdminDashboardData,
  AuditLogItem,
  DuplicateDto,
  FraudRiskDto
} from '../types';

const API_BASE = '/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('scholartrack_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    localStorage.removeItem('scholartrack_token');
    localStorage.removeItem('scholartrack_user');
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
      window.location.href = '/login?expired=true';
    }
  }

  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Request failed');
  }
  return json.data;
}

export const api = {
  // Auth
  async login(payload: { email: string; password: string }): Promise<{ token: string; userId: number; email: string; role: 'STUDENT' | 'ADMIN'; fullName: string; profileId?: number }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async register(payload: any): Promise<{ token: string; userId: number; email: string; role: 'STUDENT' | 'ADMIN'; fullName: string; profileId?: number }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Student Profile
  async getProfile(): Promise<StudentProfile> {
    const res = await fetch(`${API_BASE}/students/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async updateProfile(payload: Partial<StudentProfile>): Promise<StudentProfile> {
    const res = await fetch(`${API_BASE}/students/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getStudentDashboard(): Promise<StudentDashboardData> {
    const res = await fetch(`${API_BASE}/students/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getStudentDocuments(): Promise<DocumentDto[]> {
    const res = await fetch(`${API_BASE}/students/documents`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async uploadDocument(file: File, documentType?: string): Promise<DocumentDto> {
    const token = localStorage.getItem('scholartrack_token');
    const formData = new FormData();
    formData.append('file', file);
    if (documentType) {
      formData.append('documentType', documentType);
    }

    const res = await fetch(`${API_BASE}/students/documents/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return handleResponse(res);
  },

  async deleteDocument(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/students/documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getStudentApplications(): Promise<ApplicationSummary[]> {
    const res = await fetch(`${API_BASE}/students/applications`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Scholarships
  async getScholarships(params?: { search?: string; category?: string }): Promise<Scholarship[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);

    const res = await fetch(`${API_BASE}/scholarships?${query.toString()}`);
    return handleResponse(res);
  },

  async getScholarshipById(id: number): Promise<Scholarship> {
    const res = await fetch(`${API_BASE}/scholarships/${id}`);
    return handleResponse(res);
  },

  async createScholarship(payload: Partial<Scholarship>): Promise<Scholarship> {
    const res = await fetch(`${API_BASE}/scholarships`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async updateScholarship(id: number, payload: Partial<Scholarship>): Promise<Scholarship> {
    const res = await fetch(`${API_BASE}/scholarships/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async toggleScholarshipStatus(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/scholarships/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Eligibility
  async checkEligibility(scholarshipId: number, studentId?: number): Promise<EligibilityResult> {
    const res = await fetch(`${API_BASE}/eligibility/check`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ scholarshipId, studentId }),
    });
    return handleResponse(res);
  },

  // Applications
  async createDraftApplication(scholarshipId: number, declaredIncome?: number, declaredPercentage?: number): Promise<ApplicationDetail> {
    const res = await fetch(`${API_BASE}/applications/draft`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ scholarshipId, declaredIncome, declaredPercentage }),
    });
    return handleResponse(res);
  },

  async attachDocumentToApplication(applicationId: number, documentId: number, requiredDocType: string): Promise<ApplicationDetail> {
    const res = await fetch(`${API_BASE}/applications/${applicationId}/attach-document`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ documentId, requiredDocType }),
    });
    return handleResponse(res);
  },

  async submitApplication(applicationId: number): Promise<ApplicationDetail> {
    const res = await fetch(`${API_BASE}/applications/${applicationId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getApplicationById(id: number): Promise<ApplicationDetail> {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Admin
  async getAdminDashboard(): Promise<AdminDashboardData> {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getAdminApplications(params?: { status?: string; riskLevel?: string; search?: string }): Promise<ApplicationSummary[]> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.riskLevel) query.set('riskLevel', params.riskLevel);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/admin/applications?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getAdminApplicationDetail(id: number): Promise<ApplicationDetail> {
    const res = await fetch(`${API_BASE}/admin/applications/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async reviewApplication(id: number, decision: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION' | 'FLAG_REVIEW', reviewNotes: string): Promise<ApplicationDetail> {
    const res = await fetch(`${API_BASE}/admin/applications/${id}/review`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ decision, reviewNotes }),
    });
    return handleResponse(res);
  },

  async getDuplicateAlerts(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/duplicates`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getFraudAlerts(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/fraud-alerts`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getAllStudents(): Promise<StudentProfile[]> {
    const res = await fetch(`${API_BASE}/admin/students`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // AI & RAG
  async chatWithAI(message: string, studentId?: number, applicationId?: number): Promise<{ answer: string; sources: string[]; suggestions: string[] }> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, studentId, applicationId }),
    });
    return handleResponse(res);
  },

  async getRecommendations(): Promise<Scholarship[]> {
    const res = await fetch(`${API_BASE}/ai/recommendations`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async markNotificationAsRead(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
