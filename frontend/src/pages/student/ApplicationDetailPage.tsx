import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ApplicationDetail, VerificationFieldReport } from '../../types';
import { ApplicationStatusBadge } from '../../components/common/ApplicationStatusBadge';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { DocumentCard } from '../../components/common/DocumentCard';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Award,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ShieldAlert,
  User,
  Info
} from 'lucide-react';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadDetail(Number(id));
  }, [id]);

  const loadDetail = async (appId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getApplicationById(appId);
      setApp(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20"><LoadingState message="Loading application submission record..." size="lg" /></div>;
  if (error || !app) return <div className="py-20 max-w-xl mx-auto"><ErrorState title="Application Not Found" message={error || 'Could not find the specified application.'} onRetry={() => id && loadDetail(Number(id))} /></div>;

  let comparisonReports: VerificationFieldReport[] = [];
  try {
    if (app.verification?.fieldComparisonJson) {
      comparisonReports = JSON.parse(app.verification.fieldComparisonJson);
    }
  } catch (e) {
    comparisonReports = [];
  }

  // Stepper milestones
  const steps = [
    { label: 'Draft', done: true },
    { label: 'Submitted', done: !!app.submissionDate },
    { label: 'Review Queued', done: app.status !== 'DRAFT' },
    { label: 'OCR Verified', done: app.status !== 'DRAFT' && app.status !== 'SUBMITTED' },
    { label: app.status === 'APPROVED' ? 'Approved' : (app.status === 'REJECTED' ? 'Rejected' : (app.status === 'CORRECTION_REQUIRED' ? 'Correction' : 'Final Decision')), done: app.status === 'APPROVED' || app.status === 'REJECTED' || app.status === 'CORRECTION_REQUIRED' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <Link
        to="/student/applications"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#464858] hover:text-[#0F3040]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Applications</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-[#0F3040]">
                {app.applicationNumber}
              </span>
              <ApplicationStatusBadge status={app.status} size="lg" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F3040]">
              {app.scholarship?.title || app.scholarshipTitle || 'Scholarship Application'}
            </h1>
            <p className="text-xs text-[#464858]">
              Submitted by <span className="font-bold text-[#0F3040]">{app.student?.fullName || app.studentName || 'Student'}</span> ({app.student?.college || app.college || 'Institution'})
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-50 p-4 rounded-xl border border-slate-200/80 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-500">Award Amount</span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#0F3040]">
              ₹{(app.scholarship?.amount ?? app.scholarshipAmount ?? 50000).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500">{app.scholarship?.category || 'Academic Aid'}</p>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                  s.done ? 'bg-[#0F3040] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {s.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[11px] font-semibold mt-1.5 ${s.done ? 'text-[#0F3040]' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviewer Feedback (if any) */}
      {app.reviewNotes && (
        <div className={`p-5 rounded-2xl border flex items-start gap-3 shadow-soft ${
          app.status === 'APPROVED'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : app.status === 'CORRECTION_REQUIRED'
            ? 'bg-[#A56F63]/10 border-[#A56F63]/30 text-[#A56F63]'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Reviewer Determination & Notes:</span>
              {app.reviewedByName && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/70">
                  Reviewed by {app.reviewedByName}
                </span>
              )}
            </div>
            <p className="leading-relaxed">{app.reviewNotes}</p>
          </div>
        </div>
      )}

      {/* OCR Field Verification Side-by-Side Comparison (Section 18) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#A56F63]" />
            <h3 className="text-sm font-bold text-[#0F3040] uppercase tracking-wide">
              Document Verification Report (Application vs OCR Extraction)
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            app.verification?.overallStatus === 'MATCHED'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          }`}>
            {app.verification?.overallStatus || 'PENDING'}
          </span>
        </div>

        {comparisonReports.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-4 text-center">
            Automated OCR field extraction completed with no flag discrepancies.
          </p>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            <div className="p-3 bg-slate-50 grid grid-cols-12 font-bold text-[#0F3040]">
              <span className="col-span-3">Field Name</span>
              <span className="col-span-3">Declared in Application</span>
              <span className="col-span-3">Extracted from Document</span>
              <span className="col-span-3 text-right">Verification Status</span>
            </div>
            {comparisonReports.map((r, i) => (
              <div key={i} className="p-3 grid grid-cols-12 items-center text-[#464858]">
                <span className="col-span-3 font-semibold text-[#0F3040]">{r.fieldName}</span>
                <span className="col-span-3 font-mono">{r.applicationValue}</span>
                <span className="col-span-3 font-mono font-semibold text-slate-800">{r.extractedValue}</span>
                <div className="col-span-3 flex items-center justify-end gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.status === 'MATCH' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {r.status === 'MATCH' ? '✓ MATCH' : '✗ MISMATCH'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#0F3040] flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#A56F63]" />
          <span>Uploaded Application Documents ({app.documents?.length || 0})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {app.documents && app.documents.length > 0 ? (
            app.documents.map((doc) => (
              <DocumentCard key={doc.id || doc.documentId} document={doc} allowDelete={false} />
            ))
          ) : (
            <p className="text-xs text-slate-400 col-span-2">No documents attached.</p>
          )}
        </div>
      </div>
    </div>
  );
};
