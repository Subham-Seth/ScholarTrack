import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { ScholarshipsPage } from './pages/public/ScholarshipsPage';
import { ScholarshipDetailPage } from './pages/public/ScholarshipDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentScholarshipsPage } from './pages/student/StudentScholarshipsPage';
import { StudentRecommendationsPage } from './pages/student/StudentRecommendationsPage';
import { StudentApplicationsPage } from './pages/student/StudentApplicationsPage';
import { ApplicationDetailPage } from './pages/student/ApplicationDetailPage';
import { ApplicationStepperPage } from './pages/student/ApplicationStepperPage';
import { StudentDocumentsPage } from './pages/student/StudentDocumentsPage';
import { StudentAssistantPage } from './pages/student/StudentAssistantPage';
import { StudentNotificationsPage } from './pages/student/StudentNotificationsPage';
import { StudentSettingsPage } from './pages/student/StudentSettingsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminApplicationReviewPage } from './pages/admin/AdminApplicationReviewPage';
import { AdminScholarshipsPage } from './pages/admin/AdminScholarshipsPage';
import { ScholarshipFormPage } from './pages/admin/ScholarshipFormPage';
import { AdminDuplicatesPage } from './pages/admin/AdminDuplicatesPage';
import { AdminFraudAlertsPage } from './pages/admin/AdminFraudAlertsPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route path="/scholarships/:id" element={<ScholarshipDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Student Protected Routes */}
          <Route element={<DashboardLayout allowedRoles={['STUDENT']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/scholarships" element={<StudentScholarshipsPage />} />
            <Route path="/student/recommendations" element={<StudentRecommendationsPage />} />
            <Route path="/student/applications" element={<StudentApplicationsPage />} />
            <Route path="/student/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/student/apply/:id" element={<ApplicationStepperPage />} />
            <Route path="/student/documents" element={<StudentDocumentsPage />} />
            <Route path="/student/assistant" element={<StudentAssistantPage />} />
            <Route path="/student/notifications" element={<StudentNotificationsPage />} />
            <Route path="/student/settings" element={<StudentSettingsPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<DashboardLayout allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminApplicationsPage />} />
            <Route path="/admin/applications/:id" element={<AdminApplicationReviewPage />} />
            <Route path="/admin/scholarships" element={<AdminScholarshipsPage />} />
            <Route path="/admin/scholarships/new" element={<ScholarshipFormPage />} />
            <Route path="/admin/scholarships/edit/:id" element={<ScholarshipFormPage />} />
            <Route path="/admin/duplicates" element={<AdminDuplicatesPage />} />
            <Route path="/admin/fraud-alerts" element={<AdminFraudAlertsPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
