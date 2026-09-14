import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Scholarship } from '../../types';
import { ScholarshipCard } from '../../components/common/ScholarshipCard';
import { Modal } from '../../components/common/Modal';
import { EligibilityBadge } from '../../components/common/EligibilityBadge';
import { EligibilityResult } from '../../types';
import {
  Search,
  Sparkles,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  GraduationCap,
  Award,
  Users,
  CheckCircle,
  HelpCircle,
  Cpu,
  Fingerprint,
  Zap,
  TrendingUp,
  FileSearch,
  Info
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      const data = await api.getScholarships();
      setScholarships(data.slice(0, 6));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckEligibility = async (s: Scholarship) => {
    setSelectedScholarship(s);
    setEligibilityModalOpen(true);
    setChecking(true);
    try {
      const res = await api.checkEligibility(s.id);
      setEligibilityResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  const handleApply = (s: Scholarship) => {
    navigate('/login', { state: { redirectTo: `/student/scholarships/${s.id}` } });
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F3040]/5 via-white to-transparent pt-12 sm:pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D99B7F]/20 border border-[#D99B7F]/40 text-[#0F3040] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#A56F63]" />
                <span>Next-Gen Academic Scholarship Infrastructure</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F3040] tracking-tight leading-[1.15]">
                Find the Right Scholarship. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A56F63] to-[#D99B7F]">
                  Apply with Confidence.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#464858] max-w-2xl leading-relaxed mx-auto lg:mx-0">
                ScholarTrack uses intelligent eligibility assessment, automated document verification, OCR extraction, and AI-powered recommendations to simplify higher education scholarship discovery.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/scholarships"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Scholarships</span>
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold text-[#0F3040] bg-[#D99B7F]/20 hover:bg-[#D99B7F]/30 border border-[#D99B7F]/50 transition-all flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#464858]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Rule-Based Eligibility</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-[#A56F63]" />
                  <span>Duplicate & Fraud Defense</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileSearch className="w-4 h-4 text-[#0F3040]" />
                  <span>Assistive OCR Verification</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-200/90 relative space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0F3040] text-white flex items-center justify-center font-bold text-xs">
                      ST
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F3040]">AI Eligibility Preview</h4>
                      <p className="text-[10px] text-slate-500">Live Decision-Support Engine</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    94% MATCH
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-[#A56F63] uppercase">Scholarship</span>
                    <h5 className="font-bold text-[#0F3040]">National Merit-cum-Means Grant</h5>
                    <p className="text-slate-600 text-[11px]">Award: ₹75,000 / year • Deadline: 30 Nov 2026</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-600">Academic Score (86.5% ≥ 75%)</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> PASS
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-600">Annual Income (₹2.4L ≤ ₹3.0L)</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> PASS
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-600">Course (B.Tech CSE)</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> PASS
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-600">Document OCR Cross-Check</span>
                      <span className="text-sky-700 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> VERIFIED (96%)
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 border border-emerald-200">
                    <p className="font-semibold">AI Recommendation:</p>
                    <p className="mt-0.5">High probability of award consideration. All prerequisite documents verified.</p>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="block w-full py-2.5 rounded-xl text-xs font-bold text-center text-white bg-[#0F3040] hover:bg-[#0A202B] transition-all shadow-xs"
                >
                  Create Student Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A56F63]">Comprehensive Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F3040]">
            Engineered for Transparency, Fairness & Security
          </h2>
          <p className="text-sm text-[#464858]">
            ScholarTrack bridges the gap between deserving students and complex government scholarship criteria using intelligent automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F3040]/10 text-[#0F3040] flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F3040]">Smart Scholarship Discovery</h3>
            <p className="text-xs text-[#464858] leading-relaxed">
              Explore centralized scholarships across Central Ministries, State Governments, and Private Fellowships with multi-tier filters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D99B7F]/25 text-[#0F3040] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#A56F63]" />
            </div>
            <h3 className="text-base font-bold text-[#0F3040]">AI Recommendations</h3>
            <p className="text-xs text-[#464858] leading-relaxed">
              Weighted matching algorithms calculate personalized match percentages and explain why a student qualifies for specific schemes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F3040]">Rule-Based Eligibility Engine</h3>
            <p className="text-xs text-[#464858] leading-relaxed">
              Real-time criterion evaluation evaluates academic scores, income brackets, course requirements, and state domicile automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <FileSearch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F3040]">Document Classification & OCR</h3>
            <p className="text-xs text-[#464858] leading-relaxed">
              Upload certificates in PDF/JPG. Automated OCR extracts structured data and detects discrepancies between forms and documents.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F3040]">Duplicate & Fraud Detection</h3>
            <p className="text-xs text-[#464858] leading-relaxed">
              Levenshtein cross-application similarity and multi-signal anomaly modeling prevent fraudulent double-dipping and fake certificates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F3040]">Application Lifecycle Tracking</h3>
            <p className="text-xs text-[#464858] leading-relaxed">
              Track progress from Draft to Review, Document Verification, and Approval with timestamped audit trails and live notifications.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A56F63]">Step-by-Step Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F3040]">
              How ScholarTrack Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Create Profile', desc: 'Add academic and financial details once' },
              { step: '02', title: 'Discover Grants', desc: 'Browse matched government scholarships' },
              { step: '03', title: 'Check Eligibility', desc: 'Instant criterion-by-criterion evaluation' },
              { step: '04', title: 'Upload Proofs', desc: 'Submit marksheets and income certificates' },
              { step: '05', title: 'AI Verification', desc: 'OCR extracts and cross-validates data' },
              { step: '06', title: 'Track Decision', desc: 'Receive human-in-the-loop admin approval' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <span className="text-xl font-extrabold text-[#D99B7F] font-mono">{item.step}</span>
                <h4 className="text-xs font-bold text-[#0F3040]">{item.title}</h4>
                <p className="text-[11px] text-[#464858] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ACTIVE SCHOLARSHIPS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A56F63]">Open Opportunities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3040]">Featured Scholarships</h2>
            <p className="text-xs text-[#464858] mt-1">Explore currently active government and research fellowships.</p>
          </div>
          <Link
            to="/scholarships"
            className="text-xs font-bold text-[#0F3040] hover:text-[#A56F63] flex items-center gap-1"
          >
            <span>View All ({scholarships.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              onCheckEligibility={handleCheckEligibility}
              onApply={handleApply}
            />
          ))}
        </div>
      </section>

      {/* 5. SAMPLE STATISTICS WITH CLEAR DEMO DISCLAIMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F3040] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Platform Scale & Impact</h3>
            <p className="text-xs text-slate-300">Demonstrating verification throughput and fraud prevention benchmarks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center pt-4">
            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#D99B7F]">10K+</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Scholarship Schemes</p>
            </div>
            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#D99B7F]">25K+</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Applications Processed</p>
            </div>
            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#D99B7F]">98%</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">OCR Extraction Accuracy</p>
            </div>
          </div>

          {/* Explicit Demo Disclaimer as required by Section 7 */}
          <div className="pt-4 border-t border-slate-700/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-[#D99B7F] shrink-0" />
            <span>Note: The statistics displayed above represent demo prototype benchmark values for academic demonstration purposes.</span>
          </div>
        </div>
      </section>

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
                <span className="text-[10px] font-bold text-slate-500 uppercase">Assessment Result:</span>
                <div className="mt-1">
                  <EligibilityBadge status={eligibilityResult.status} score={eligibilityResult.matchScorePercentage} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Match Score</span>
                <p className="text-xl font-extrabold text-[#0F3040]">{eligibilityResult.matchScorePercentage}%</p>
              </div>
            </div>

            {/* AI Explanation Text */}
            <div className="p-3 bg-[#0F3040]/5 rounded-xl border border-[#0F3040]/10 text-xs text-[#0F3040] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#A56F63]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Eligibility Explanation</span>
              </div>
              <p className="leading-relaxed">{eligibilityResult.aiExplanation}</p>
            </div>

            {/* Criterion table */}
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
