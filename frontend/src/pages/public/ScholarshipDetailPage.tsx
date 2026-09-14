import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Scholarship, EligibilityResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { Modal } from '../../components/common/Modal';
import { EligibilityBadge } from '../../components/common/EligibilityBadge';
import {
  Calendar,
  DollarSign,
  Award,
  ArrowLeft,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Shield,
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ScholarshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (id) loadScholarship(Number(id));
  }, [id]);

  const loadScholarship = async (scholarshipId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getScholarshipById(scholarshipId);
      setScholarship(data);
    } catch (e: any) {
      setError(e.message || 'Scholarship not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async () => {
    if (!scholarship) return;
    setEligibilityModalOpen(true);
    setChecking(true);
    try {
      const res = await api.checkEligibility(scholarship.id, user?.profileId);
      setEligibilityResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: `/student/scholarships/${scholarship?.id}` } });
    } else if (isStudent) {
      navigate(`/student/scholarships/${scholarship?.id}/apply`);
    } else {
      navigate('/student/dashboard');
    }
  };

  if (loading) return <div className="py-20"><LoadingState message="Loading scholarship details..." size="lg" /></div>;
  if (error || !scholarship) return <div className="py-20 max-w-xl mx-auto"><ErrorState title="Scholarship Not Found" message={error || 'The requested scholarship could not be found.'} onRetry={() => id && loadScholarship(Number(id))} /></div>;

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(scholarship.amount);

  const formattedDeadline = new Date(scholarship.deadline).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/scholarships"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#464858] hover:text-[#0F3040] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Scholarships</span>
      </Link>

      {/* Main Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D99B7F]/20 text-[#0F3040]">
              {scholarship.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3040] leading-tight">
              {scholarship.title}
            </h1>
            <p className="text-xs font-semibold text-[#464858]">
              Offered by <span className="text-[#0F3040] font-bold">{scholarship.provider}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 shrink-0 text-left sm:text-right space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Scholarship Value</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F3040]">{formattedAmount}</div>
            <p className="text-[11px] text-slate-500">Direct Benefit Transfer</p>
          </div>
        </div>

        {/* Highlight Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Application Deadline</span>
            <span className="font-bold text-[#0F3040]">{formattedDeadline}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Min Academic Score</span>
            <span className="font-bold text-[#0F3040]">
              {scholarship.minCgpaPercentage ? `${scholarship.minCgpaPercentage}% aggregate` : 'No minimum'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Family Income Ceiling</span>
            <span className="font-bold text-[#0F3040]">
              {scholarship.maxFamilyIncome ? `≤ ₹${(scholarship.maxFamilyIncome / 100000).toFixed(1)} Lakh` : 'Not restricted'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Verification Mode</span>
            <span className="font-bold text-[#0F3040] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#A56F63]" /> OCR Assistive
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleCheckEligibility}
            className="px-5 py-3 rounded-xl text-xs font-bold text-[#0F3040] bg-[#D99B7F]/25 hover:bg-[#D99B7F]/40 border border-[#D99B7F]/60 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#A56F63]" />
            <span>Check My Eligibility</span>
          </button>

          <button
            onClick={handleApply}
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] shadow-sm transition-all flex items-center gap-2"
          >
            <span>Proceed to Apply</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description & Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
            <h3 className="text-base font-bold text-[#0F3040] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#A56F63]" />
              <span>Program Overview</span>
            </h3>
            <p className="text-xs text-[#464858] leading-relaxed whitespace-pre-line">
              {scholarship.description}
            </p>
          </div>

          {/* Configurable Rules Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
            <h3 className="text-base font-bold text-[#0F3040] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#A56F63]" />
              <span>Configured Eligibility Criteria</span>
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="p-3 bg-slate-50 grid grid-cols-12 font-bold text-[#0F3040]">
                <span className="col-span-4">Criterion</span>
                <span className="col-span-3">Operator</span>
                <span className="col-span-5">Requirement Value</span>
              </div>
              {scholarship.minCgpaPercentage && (
                <div className="p-3 grid grid-cols-12 text-[#464858]">
                  <span className="col-span-4 font-semibold text-[#0F3040]">Academic Aggregate</span>
                  <span className="col-span-3 font-mono text-[11px]">Greater Than / Equal</span>
                  <span className="col-span-5 font-bold text-[#0F3040]">≥ {scholarship.minCgpaPercentage}%</span>
                </div>
              )}
              {scholarship.maxFamilyIncome && (
                <div className="p-3 grid grid-cols-12 text-[#464858]">
                  <span className="col-span-4 font-semibold text-[#0F3040]">Annual Family Income</span>
                  <span className="col-span-3 font-mono text-[11px]">Less Than / Equal</span>
                  <span className="col-span-5 font-bold text-[#0F3040]">≤ ₹{scholarship.maxFamilyIncome.toLocaleString('en-IN')}</span>
                </div>
              )}
              {scholarship.eligibleCourses && (
                <div className="p-3 grid grid-cols-12 text-[#464858]">
                  <span className="col-span-4 font-semibold text-[#0F3040]">Permitted Disciplines</span>
                  <span className="col-span-3 font-mono text-[11px]">In Scope</span>
                  <span className="col-span-5 font-bold text-[#0F3040]">{scholarship.eligibleCourses}</span>
                </div>
              )}
              {scholarship.eligibleStates && (
                <div className="p-3 grid grid-cols-12 text-[#464858]">
                  <span className="col-span-4 font-semibold text-[#0F3040]">Domicile Scope</span>
                  <span className="col-span-3 font-mono text-[11px]">Resident</span>
                  <span className="col-span-5 font-bold text-[#0F3040]">{scholarship.eligibleStates}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Required Documents */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-[#0F3040] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#A56F63]" />
              <span>Required Supporting Documents</span>
            </h3>
            <p className="text-[11px] text-[#464858]">
              All uploaded certificates will be analyzed using OCR extraction and compared directly with your profile.
            </p>

            <ul className="space-y-2 text-xs">
              {(scholarship.requiredDocuments ? scholarship.requiredDocuments.split(',') : ['Marksheet', 'Income Certificate']).map((doc, i) => (
                <li key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[#0F3040] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{doc.trim()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#0F3040] to-[#0A202B] text-white p-6 rounded-2xl shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-[#D99B7F]">
              <Shield className="w-5 h-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Human Decision Support</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              ScholarTrack AI assists with preliminary eligibility checks and anomaly scoring. All final scholarship awards are reviewed and approved by certified government administrators.
            </p>
          </div>
        </div>
      </div>

      {/* ELIGIBILITY MODAL */}
      <Modal
        isOpen={eligibilityModalOpen}
        onClose={() => setEligibilityModalOpen(false)}
        title={scholarship.title}
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

            {/* Criteria list */}
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
                  handleApply();
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
