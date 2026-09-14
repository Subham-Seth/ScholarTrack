import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ApplicationSummary } from '../../types';
import { ApplicationStatusBadge } from '../../components/common/ApplicationStatusBadge';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { FileCheck, ArrowRight, Clock, AlertTriangle, ChevronRight, Eye } from 'lucide-react';

export const StudentApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getStudentApplications();
      setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20"><LoadingState message="Loading your scholarship applications..." size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F3040]">My Scholarship Applications</h1>
          <p className="text-xs text-[#464858] mt-1">
            Track verification progress, OCR validation reports, and reviewer determinations for all active submissions.
          </p>
        </div>

        <Link
          to="/student/scholarships"
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] shadow-sm transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <span>Apply for Scholarship</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications submitted yet"
          description="You have not submitted any scholarship applications. Browse available schemes to get started."
          actionLabel="Explore Scholarships"
          onAction={() => (window.location.href = '/student/scholarships')}
          icon={<FileCheck className="w-8 h-8 text-slate-400" />}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-premium transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-[#0F3040]">
                      {app.applicationNumber}
                    </span>
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                  <h3 className="text-base font-bold text-[#0F3040]">{app.scholarshipTitle}</h3>
                  <p className="text-xs text-slate-500">
                    Award Value: <span className="font-bold text-[#0F3040]">₹{app.scholarshipAmount.toLocaleString('en-IN')}</span>
                  </p>
                </div>

                <Link
                  to={`/student/applications/${app.id}`}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#0F3040] bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details & Timeline</span>
                </Link>
              </div>

              {/* Declared Values & Verification Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Submission Date</span>
                  <span className="font-semibold text-slate-800">
                    {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : 'Draft'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Declared Income</span>
                  <span className="font-semibold text-slate-800">
                    {app.declaredIncome ? `₹${app.declaredIncome.toLocaleString('en-IN')}` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Declared Aggregate</span>
                  <span className="font-semibold text-slate-800">
                    {app.declaredPercentage ? `${app.declaredPercentage}%` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">OCR Verification</span>
                  <span className={`font-bold ${app.verificationStatus === 'MATCHED' ? 'text-emerald-700' : (app.verificationStatus === 'MISMATCH_DETECTED' ? 'text-rose-700' : 'text-slate-600')}`}>
                    {app.verificationStatus || 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Reviewer Note Warning (if any) */}
              {app.reviewNotes && (
                <div className={`p-3 rounded-xl text-xs border flex items-start gap-2 ${
                  app.status === 'CORRECTION_REQUIRED'
                    ? 'bg-[#A56F63]/10 border-[#A56F63]/30 text-[#A56F63]'
                    : app.status === 'REJECTED'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Reviewer Note: </span>
                    <span>{app.reviewNotes}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
