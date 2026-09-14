import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StudentDashboardData, Scholarship } from '../../types';
import { DashboardCard } from '../../components/common/DashboardCard';
import { ApplicationStatusBadge } from '../../components/common/ApplicationStatusBadge';
import { ScholarshipCard } from '../../components/common/ScholarshipCard';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';
import { EligibilityBadge } from '../../components/common/EligibilityBadge';
import { EligibilityResult } from '../../types';
import {
  Sparkles,
  Award,
  FileCheck,
  FolderOpen,
  Bell,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const stats = await api.getStudentDashboard();
      setData(stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async (s: Scholarship) => {
    setSelectedScholarship(s);
    setEligibilityModalOpen(true);
    setChecking(true);
    try {
      const res = await api.checkEligibility(s.id, user?.profileId);
      setEligibilityResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  const handleApply = (s: Scholarship) => {
    navigate(`/student/scholarships/${s.id}/apply`);
  };

  if (loading || !data) {
    return <div className="py-20"><LoadingState message="Loading your personalized dashboard..." size="lg" /></div>;
  }

  // Determine time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0F3040]">
              {greeting}, {data.studentName || user?.fullName || 'Student'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D99B7F]/20 text-[#0F3040]">
              Candidate
            </span>
          </div>
          <p className="text-xs text-[#464858]">
            Here is your daily scholarship application and document verification digest.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/student/scholarships"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Browse Schemes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Critical Alert Notice (if any) */}
      {data.recentAlerts && data.recentAlerts.length > 0 && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5 text-xs">
            <h4 className="font-bold text-amber-900">{data.recentAlerts[0].title}</h4>
            <p className="text-amber-800 leading-relaxed">{data.recentAlerts[0].message}</p>
          </div>
          <Link
            to="/student/notifications"
            className="text-xs font-bold text-amber-900 hover:underline shrink-0"
          >
            View Alerts
          </Link>
        </div>
      )}

      {/* 5 Key Metric Cards (Section 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Recommended"
          value={data.totalRecommended}
          subtitle="AI fit matched"
          icon={<Sparkles className="w-5 h-5 text-[#A56F63]" />}
          variant="warning"
        />
        <DashboardCard
          title="Eligible"
          value={data.totalEligible}
          subtitle="Rules satisfied"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
          variant="accent"
        />
        <DashboardCard
          title="Active Applications"
          value={data.activeApplications}
          subtitle="In pipeline"
          icon={<FileCheck className="w-5 h-5 text-[#0F3040]" />}
          variant="primary"
        />
        <DashboardCard
          title="Documents Needed"
          value={data.pendingDocuments}
          subtitle="Pending upload"
          icon={<FolderOpen className="w-5 h-5 text-amber-600" />}
          variant="neutral"
        />
        <DashboardCard
          title="Alerts"
          value={data.unreadNotifications}
          subtitle="Unread notifications"
          icon={<Bell className="w-5 h-5 text-rose-600" />}
          variant="warning"
        />
      </div>

      {/* Profile Completion & Progress Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#0F3040] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#A56F63]" />
              <span>Your Scholarship Profile Readiness</span>
            </h3>
            <p className="text-xs text-slate-500">
              Higher profile completion improves automated OCR verification accuracy and recommendation scoring.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-[#0F3040]">
              {data.profileCompletionPct}%
            </span>
            <Link
              to="/student/profile"
              className="text-xs font-bold text-[#A56F63] hover:underline"
            >
              Update Profile →
            </Link>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-[#0F3040] via-[#A56F63] to-[#D99B7F] transition-all duration-700"
            style={{ width: `${data.profileCompletionPct}%` }}
          />
        </div>
      </div>

      {/* Grid: Recent Applications & Recommended Scholarships */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Applications (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0F3040]">Your Submitted Applications</h3>
            <Link to="/student/applications" className="text-xs font-bold text-[#A56F63] hover:underline">
              View All ({data.recentApplications.length})
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden divide-y divide-slate-100">
            {data.recentApplications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <p>You haven't submitted any applications yet.</p>
                <Link
                  to="/student/scholarships"
                  className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F3040]"
                >
                  Discover Scholarships
                </Link>
              </div>
            ) : (
              data.recentApplications.map((app) => (
                <div key={app.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#0F3040]">
                        {app.applicationNumber}
                      </span>
                      <ApplicationStatusBadge status={app.status} size="sm" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{app.scholarshipTitle}</h4>
                    <p className="text-[11px] text-slate-500">
                      Amount: ₹{app.scholarshipAmount.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <Link
                    to={`/student/applications/${app.id}`}
                    className="p-2 text-slate-400 hover:text-[#0F3040] hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                    title="View Application Details"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0F3040] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#A56F63]" />
              <span>AI Top Recommendations</span>
            </h3>
            <Link to="/student/recommendations" className="text-xs font-bold text-[#A56F63] hover:underline">
              Explore All
            </Link>
          </div>

          <div className="space-y-3">
            {data.recommendedScholarships.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-soft hover:shadow-premium transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#0F3040] line-clamp-1">{s.title}</h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                    {s.matchPercentage}% Match
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  ₹{s.amount.toLocaleString('en-IN')} / award • Deadline: {s.deadline}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                  <button
                    onClick={() => handleCheckEligibility(s)}
                    className="text-[11px] font-bold text-[#A56F63] hover:underline"
                  >
                    Check Rules
                  </button>
                  <button
                    onClick={() => handleApply(s)}
                    className="px-3 py-1 rounded-lg text-[11px] font-bold text-white bg-[#0F3040] hover:bg-[#0A202B]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ELIGIBILITY MODAL */}
      <Modal
        isOpen={eligibilityModalOpen}
        onClose={() => setEligibilityModalOpen(false)}
        title={selectedScholarship ? selectedScholarship.title : 'Eligibility Evaluation'}
        subtitle="Automated criterion-by-criterion assessment"
        maxWidth="xl"
      >
        {checking ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Evaluating student profile against eligibility rules...
          </div>
        ) : eligibilityResult ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Assessment:</span>
                <div className="mt-1">
                  <EligibilityBadge status={eligibilityResult.status} score={eligibilityResult.matchScorePercentage} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Match Score</span>
                <p className="text-xl font-extrabold text-[#0F3040]">{eligibilityResult.matchScorePercentage}%</p>
              </div>
            </div>

            <div className="p-3 bg-[#0F3040]/5 rounded-xl border border-[#0F3040]/10 text-xs text-[#0F3040] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#A56F63]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Eligibility Explanation</span>
              </div>
              <p className="leading-relaxed">{eligibilityResult.aiExplanation}</p>
            </div>

            <div className="space-y-1.5">
              <h5 className="text-xs font-bold text-[#0F3040]">Criterion Breakdown:</h5>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {eligibilityResult.criteria.map((c, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#0F3040]">{c.criterionName}</p>
                      <p className="text-[11px] text-slate-500">Req: {c.requiredValue} • Profile: {c.studentValue}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {c.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setEligibilityModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#464858] bg-slate-100 hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setEligibilityModalOpen(false);
                  if (selectedScholarship) handleApply(selectedScholarship);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B]"
              >
                Proceed to Apply
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
