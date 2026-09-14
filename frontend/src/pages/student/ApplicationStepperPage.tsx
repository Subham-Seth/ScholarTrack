import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Scholarship, StudentProfile, DocumentDto, ApplicationDetail } from '../../types';
import { ProgressStepper } from '../../components/common/ProgressStepper';
import { LoadingState } from '../../components/common/LoadingState';
import { DocumentCard } from '../../components/common/DocumentCard';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  Award,
  AlertCircle
} from 'lucide-react';

export const ApplicationStepperPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [studentDocs, setStudentDocs] = useState<DocumentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Stepper state
  const [declaredIncome, setDeclaredIncome] = useState<number>(0);
  const [declaredPercentage, setDeclaredPercentage] = useState<number>(0);
  const [createdApp, setCreatedApp] = useState<ApplicationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 1, label: 'Scheme Review' },
    { id: 2, label: 'Declared Metrics' },
    { id: 3, label: 'Upload Proofs' },
    { id: 4, label: 'Verify & Submit' },
    { id: 5, label: 'Submitted' },
  ];

  useEffect(() => {
    if (id) loadData(Number(id));
  }, [id]);

  const loadData = async (scholarshipId: number) => {
    setLoading(true);
    try {
      const [sData, pData, docs] = await Promise.all([
        api.getScholarshipById(scholarshipId),
        api.getProfile(),
        api.getStudentDocuments(),
      ]);
      setScholarship(sData);
      setProfile(pData);
      setStudentDocs(docs);
      setDeclaredIncome(pData.familyIncome || 240000);
      setDeclaredPercentage(pData.cgpaPercentage || 85.0);
    } catch (e: any) {
      setError(e.message || 'Failed to initialize application.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDraftAndNext = async () => {
    if (!scholarship) return;
    setError(null);
    setSubmitting(true);
    try {
      const draft = await api.createDraftApplication(scholarship.id, declaredIncome, declaredPercentage);
      setCreatedApp(draft);
      setCurrentStep(3);
    } catch (e: any) {
      setError(e.message || 'Failed to initialize draft.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    setError(null);
    try {
      const uploaded = await api.uploadDocument(file, docType);
      // Refresh documents
      const docs = await api.getStudentDocuments();
      setStudentDocs(docs);

      // If draft exists, attach it
      if (createdApp) {
        const updated = await api.attachDocumentToApplication(createdApp.id, uploaded.documentId || 0, docType);
        setCreatedApp(updated);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitFinal = async () => {
    if (!createdApp) return;
    setSubmitting(true);
    setError(null);
    try {
      const submitted = await api.submitApplication(createdApp.id);
      setCreatedApp(submitted);
      setCurrentStep(5);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e: any) {
      setError(e.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !scholarship || !profile) {
    return <div className="py-20"><LoadingState message="Preparing your application stepper..." size="lg" /></div>;
  }

  const requiredDocList = scholarship.requiredDocuments
    ? scholarship.requiredDocuments.split(',').map((s) => s.trim())
    : ['Marksheet', 'Income Certificate'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#A56F63] uppercase tracking-wider">Application Stepper</span>
            <h1 className="text-2xl font-extrabold text-[#0F3040]">{scholarship.title}</h1>
            <p className="text-xs text-[#464858]">Award: ₹{scholarship.amount.toLocaleString('en-IN')} • Deadline: {scholarship.deadline}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D99B7F]/20 text-[#0F3040] self-start sm:self-auto">
            {scholarship.category}
          </span>
        </div>

        {/* Stepper Indicator */}
        <ProgressStepper steps={steps} currentStep={currentStep} />
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SCHOLARSHIP REVIEW */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-[#0F3040]">Step 1: Confirm Scheme Parameters & Mandatory Criteria</h3>
            <p className="text-xs text-[#464858]">Please verify the criteria before starting your formal scholarship submission.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-bold block mb-1">Academic Requirement</span>
              <p className="font-semibold text-[#0F3040]">
                Minimum {scholarship.minCgpaPercentage || 75}% aggregate aggregate in ongoing degree program.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-bold block mb-1">Financial Ceiling</span>
              <p className="font-semibold text-[#0F3040]">
                Annual family income must not exceed ₹{scholarship.maxFamilyIncome ? (scholarship.maxFamilyIncome / 100000).toFixed(1) + ' Lakh' : '3.0 Lakh'}.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-bold block mb-1">Permitted Disciplines</span>
              <p className="font-semibold text-[#0F3040]">{scholarship.eligibleCourses || 'Open to all academic streams'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-bold block mb-1">Domicile Eligibility</span>
              <p className="font-semibold text-[#0F3040]">{scholarship.eligibleStates || 'All-India eligible candidates'}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] transition-all flex items-center gap-2"
            >
              <span>Accept & Proceed to Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CONFIRM DECLARED METRICS */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-[#0F3040]">Step 2: Confirm Declared Academic & Financial Metrics</h3>
            <p className="text-xs text-[#464858]">These values will be cross-checked against your OCR uploaded certificates.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Declared Annual Family Income (in ₹) *</label>
              <input
                type="number"
                required
                value={declaredIncome}
                onChange={(e) => setDeclaredIncome(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
              <p className="text-[10px] text-slate-500">Must exactly match your Revenue Department Income Certificate.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Declared Aggregate Academic Percentage (%) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={declaredPercentage}
                onChange={(e) => setDeclaredPercentage(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
              <p className="text-[10px] text-slate-500">Cumulative marks aggregate as printed on your consolidated marksheet.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#464858] bg-slate-100 hover:bg-slate-200"
            >
              Back
            </button>
            <button
              onClick={handleCreateDraftAndNext}
              disabled={submitting}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <span>{submitting ? 'Creating Draft...' : 'Create Draft & Proceed'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: UPLOAD PROOFS */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-[#0F3040]">Step 3: Upload Supporting Documents</h3>
            <p className="text-xs text-[#464858]">Upload required certificates. Automated AI document classification and OCR field extraction run instantly.</p>
          </div>

          <div className="space-y-4">
            {requiredDocList.map((docType, idx) => {
              const existing = studentDocs.find(
                (d) => d.documentType.toLowerCase().includes(docType.toLowerCase()) || docType.toLowerCase().includes(d.documentType.toLowerCase())
              );

              return (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0F3040]">{docType}</span>
                      {existing ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Attached
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {existing ? `File: ${existing.fileName} (${(existing.fileSize / 1024).toFixed(0)} KB)` : 'Accepted formats: PDF, JPG, PNG (Max 15MB)'}
                    </p>
                  </div>

                  <div>
                    <label className="px-4 py-2 rounded-xl text-xs font-bold text-[#0F3040] bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4" />
                      <span>{existing ? 'Replace File' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, docType)}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          {uploading && (
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
              <span>Analyzing document with AI classifier and OCR field extraction...</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#464858] bg-slate-100 hover:bg-slate-200"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] transition-all flex items-center gap-2"
            >
              <span>Review Final Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SUBMIT */}
      {currentStep === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-[#0F3040]">Step 4: Review Declaration & Submit</h3>
            <p className="text-xs text-[#464858]">Confirm all details before submitting. Automated OCR and duplicate analysis will run immediately upon submission.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">Applicant:</span>
              <span className="font-bold text-[#0F3040]">{profile.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">Institution:</span>
              <span className="font-semibold text-slate-800">{profile.college}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">Declared Income:</span>
              <span className="font-bold text-[#0F3040]">₹{declaredIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">Declared Aggregate:</span>
              <span className="font-bold text-[#0F3040]">{declaredPercentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">Attached Documents:</span>
              <span className="font-semibold text-emerald-700">{studentDocs.length} certificates attached</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
            <span className="font-bold">Applicant Declaration:</span>
            <p className="text-[11px] leading-relaxed">
              I certify that the information declared above is true and verifiable. I acknowledge that ScholarTrack uses optical character recognition and cross-application similarity scoring to flag discrepancies for administrative review.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#464858] bg-slate-100 hover:bg-slate-200"
            >
              Back to Documents
            </button>
            <button
              onClick={handleSubmitFinal}
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D99B7F]" />
              <span>{submitting ? 'Submitting & Triggering AI Checks...' : 'Submit Application'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUBMITTED SUCCESS CELEBRATION */}
      {currentStep === 5 && createdApp && (
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-premium text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-extrabold text-[#0F3040]">Application Submitted Successfully!</h2>
            <p className="text-xs text-[#464858] leading-relaxed">
              Your application for <span className="font-bold text-[#0F3040]">{scholarship.title}</span> has been securely received and queued for administrative review.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Tracking Reference ID</span>
            <div className="text-xl font-mono font-extrabold text-[#0F3040]">
              {createdApp.applicationNumber}
            </div>
            <p className="text-[11px] text-slate-500">Automated OCR verification and anomaly screening initialized.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate(`/student/applications/${createdApp.id}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>View Application Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-[#464858] bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
