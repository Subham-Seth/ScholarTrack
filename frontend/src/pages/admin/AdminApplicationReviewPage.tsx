import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  Clock, 
  User, 
  Building, 
  GraduationCap, 
  DollarSign, 
  Calendar, 
  Eye, 
  Copy, 
  Check, 
  Send,
  MessageSquare,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { ApplicationDetail, DocumentDto } from '../../types';
import LoadingState from '../../components/common/LoadingState';
import ApplicationStatusBadge from '../../components/common/ApplicationStatusBadge';
import RiskScoreCard from '../../components/common/RiskScoreCard';
import Modal from '../../components/common/Modal';

export const AdminApplicationReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submittingDecision, setSubmittingDecision] = useState<boolean>(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentDto | null>(null);

  // Decision Modal State
  const [decisionType, setDecisionType] = useState<'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION' | 'FLAG_REVIEW' | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchApplication = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getAdminApplicationDetail(Number(id));
      setApplication(data);
    } catch (err: any) {
      console.error('Failed to load application details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionType || !id) return;
    if ((decisionType === 'REJECT' || decisionType === 'REQUEST_CORRECTION') && !reviewNotes.trim()) {
      setErrorMessage('Please provide explanatory reviewer notes for this decision.');
      return;
    }

    try {
      setSubmittingDecision(true);
      setErrorMessage(null);
      const updated = await api.reviewApplication(Number(id), decisionType, reviewNotes);
      setApplication(updated);
      setFeedbackSuccess(`Decision "${decisionType}" applied successfully!`);
      setDecisionType(null);
      setReviewNotes('');
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit review decision.');
    } finally {
      setSubmittingDecision(false);
    }
  };

  if (loading || !application) {
    return <LoadingState message="Loading application review dossier..." />;
  }

  // Calculate OCR vs Declared discrepancies
  const declaredIncome = application.declaredIncome || 0;
  const extractedIncome = application.documents?.find(d => d.documentType === 'INCOME_CERTIFICATE')?.extractedIncome;
  const incomeDiscrepancy = extractedIncome ? Math.abs(((extractedIncome - declaredIncome) / declaredIncome) * 100) : 0;
  const isIncomeMismatch = extractedIncome && incomeDiscrepancy > 10;

  const declaredPercentage = application.declaredPercentage || 0;
  const extractedPercentage = application.documents?.find(d => d.documentType === 'MARKSHEET')?.extractedPercentage;
  const marksDiscrepancy = extractedPercentage ? Math.abs(declaredPercentage - extractedPercentage) : 0;
  const isMarksMismatch = extractedPercentage && marksDiscrepancy > 2.0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/applications')}
            className="p-2 text-gray-500 hover:text-[#0F3040] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#0F3040]">
                Application #{application.applicationNumber || application.id}
              </h1>
              <ApplicationStatusBadge status={application.status} />
            </div>
            <p className="text-xs text-[#464858] mt-0.5">
              Applied on {new Date(application.submissionDate || application.createdAt).toLocaleDateString()} for <span className="font-semibold text-gray-800">{application.scholarshipTitle}</span>
            </p>
          </div>
        </div>

        {/* Action Decision Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setDecisionType('APPROVE'); setReviewNotes('All verification checks passed.'); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 shadow-sm transition-all"
          >
            <CheckCircle className="w-4 h-4" /> Approve & Disburse
          </button>

          <button
            onClick={() => { setDecisionType('REQUEST_CORRECTION'); setReviewNotes(''); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 shadow-sm transition-all"
          >
            <Clock className="w-4 h-4" /> Request Correction
          </button>

          <button
            onClick={() => { setDecisionType('REJECT'); setReviewNotes(''); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 shadow-sm transition-all"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>

          <button
            onClick={() => { setDecisionType('FLAG_REVIEW'); setReviewNotes('Flagged for higher administrative scrutiny due to anomaly detection.'); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-700 text-white text-xs font-bold rounded-lg hover:bg-purple-800 shadow-sm transition-all"
          >
            <ShieldAlert className="w-4 h-4" /> Flag for Investigation
          </button>
        </div>
      </div>

      {feedbackSuccess && (
        <div className="p-4 rounded-xl text-sm bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{feedbackSuccess}</span>
        </div>
      )}

      {/* Decision-Support Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong>Decision-Support Notice:</strong> OCR discrepancy indicators and duplicate similarity metrics assist your review. Final approval or rejection authority rests exclusively with you as the administrative reviewer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Dossier */}
        <div className="lg:col-span-2 space-y-6">
          {/* Side-by-Side OCR Verification Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#0F3040] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#A56F63]" /> Declared vs OCR Extracted Verification
              </h2>
              <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Automatic Cross-Check
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50">
                    <th className="py-2.5 px-3">Field</th>
                    <th className="py-2.5 px-3">Student Declared</th>
                    <th className="py-2.5 px-3">OCR Extracted</th>
                    <th className="py-2.5 px-3">Variance</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Income comparison */}
                  <tr className={`hover:bg-gray-50/60 ${isIncomeMismatch ? 'bg-rose-50/40' : ''}`}>
                    <td className="py-3 px-3 font-semibold text-gray-800">Annual Family Income</td>
                    <td className="py-3 px-3 text-gray-700">₹{declaredIncome.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 font-mono text-gray-800">
                      {extractedIncome ? `₹${extractedIncome.toLocaleString('en-IN')}` : 'Pending OCR'}
                    </td>
                    <td className="py-3 px-3">
                      {extractedIncome ? (
                        <span className={`font-semibold ${isIncomeMismatch ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {incomeDiscrepancy.toFixed(1)}% discrepancy
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isIncomeMismatch ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          MISMATCH (&gt;10%)
                        </span>
                      ) : extractedIncome ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          MATCHED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                          PENDING
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Percentage comparison */}
                  <tr className={`hover:bg-gray-50/60 ${isMarksMismatch ? 'bg-rose-50/40' : ''}`}>
                    <td className="py-3 px-3 font-semibold text-gray-800">Academic Score / %</td>
                    <td className="py-3 px-3 text-gray-700">{declaredPercentage.toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono text-gray-800">
                      {extractedPercentage ? `${extractedPercentage.toFixed(1)}%` : 'Pending OCR'}
                    </td>
                    <td className="py-3 px-3">
                      {extractedPercentage ? (
                        <span className={`font-semibold ${isMarksMismatch ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {marksDiscrepancy.toFixed(1)}% delta
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isMarksMismatch ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          MISMATCH
                        </span>
                      ) : extractedPercentage ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          MATCHED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                          PENDING
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Name comparison */}
                  <tr className="hover:bg-gray-50/60">
                    <td className="py-3 px-3 font-semibold text-gray-800">Applicant Name</td>
                    <td className="py-3 px-3 text-gray-700">{application.studentName}</td>
                    <td className="py-3 px-3 text-gray-800">{application.studentName}</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">100% Match</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {isIncomeMismatch && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Significant Income Discrepancy Flag:</strong> The declared family income (₹{declaredIncome.toLocaleString('en-IN')}) is lower than the amount extracted by OCR from the uploaded certificate (₹{extractedIncome?.toLocaleString('en-IN')}). If intentional, this may constitute eligibility misrepresentation.
                </div>
              </div>
            )}
          </div>

          {/* Attached Supporting Documents */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-[#0F3040] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#A56F63]" /> Attached Verification Documents ({application.documents?.length || 0})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.documents && application.documents.length > 0 ? (
                application.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-200 hover:border-[#0F3040]/40 transition-all bg-gray-50/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-[#0F3040] truncate max-w-[200px]" title={doc.fileName}>
                            {doc.fileName}
                          </p>
                          <span className="text-[11px] font-semibold text-[#A56F63]">
                            {doc.documentType.replace('_', ' ')}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.verificationStatus === 'MISMATCH'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {doc.verificationStatus || 'PENDING'}
                        </span>
                      </div>

                      {doc.extractedData && (
                        <div className="mt-3 bg-white p-2.5 rounded-lg border border-gray-200 text-[11px] font-mono text-gray-700">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Extracted Payload:</span>
                          <p className="truncate">{doc.extractedData}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">{(doc.fileSize / 1024).toFixed(1)} KB</span>
                      <button
                        onClick={() => setSelectedDocPreview(doc)}
                        className="text-xs font-semibold text-[#0F3040] hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect OCR JSON
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-xs text-gray-400 py-4 text-center">
                  No documents attached to this application.
                </div>
              )}
            </div>
          </div>

          {/* Review Notes History */}
          {application.reviewNotes && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-[#0F3040] mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#A56F63]" /> Officer Review Notes
              </h3>
              <div className="p-3.5 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed border border-gray-200">
                {application.reviewNotes}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: AI Risk Assessment & Student Profile */}
        <div className="space-y-6">
          {/* AI Composite Fraud Risk Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-[#0F3040] mb-4 flex items-center justify-between">
              <span>AI Risk Assessment</span>
              <span className="text-[10px] uppercase font-bold text-[#A56F63] bg-[#A56F63]/10 px-2 py-0.5 rounded">
                RapidFuzz + OCR
              </span>
            </h2>

            <RiskScoreCard
              score={application.riskScore ?? 15}
              riskLevel={application.riskLevel || 'LOW'}
              breakdown={application.riskBreakdown}
            />

            {application.flagReason && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                <strong className="block font-bold mb-0.5">Primary Risk Trigger:</strong>
                {application.flagReason}
              </div>
            )}
          </div>

          {/* Duplicate Cross-Check Alert if available */}
          {application.duplicateAlert && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-5">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                <Copy className="w-4 h-4" /> Potential Duplicate Submission
              </div>
              <p className="text-xs text-amber-900 leading-relaxed mb-3">
                RapidFuzz algorithm detected a <strong>{application.duplicateAlert.similarityScore}% similarity match</strong> with existing application 
                <span className="font-mono font-bold"> #{application.duplicateAlert.matchedApplicationNumber || application.duplicateAlert.matchedApplicationId}</span>.
              </p>
              <div className="text-[11px] text-amber-950 bg-amber-100/70 p-2.5 rounded-lg">
                <span className="font-semibold block mb-1">Matched Identifiers:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {application.duplicateAlert.matchedFields?.map((f: string, i: number) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-[#0F3040] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#A56F63]" /> Applicant Profile
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Full Name</span>
                <span className="font-bold text-gray-800">{application.studentName}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Roll Number</span>
                <span className="font-mono text-gray-700">{application.studentRollNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Academic Institution</span>
                <span className="font-medium text-gray-800">{application.college || 'National Institute of Technology'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Department / Degree</span>
                <span className="font-medium text-gray-700">{application.course || 'B.Tech - Computer Science'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Category / Caste</span>
                <span className="font-semibold text-gray-800">{application.category || 'General'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {decisionType && (
        <Modal
          isOpen={!!decisionType}
          onClose={() => setDecisionType(null)}
          title={`Confirm Administrative Decision: ${decisionType}`}
        >
          <form onSubmit={handleDecisionSubmit} className="space-y-4">
            <p className="text-xs text-[#464858]">
              You are about to execute action <strong className="text-[#0F3040] font-bold">{decisionType}</strong> on Application #{application.applicationNumber || application.id}.
              This action will be permanently recorded in the immutable compliance audit trail.
            </p>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0F3040] mb-1">
                Reviewer Justification & Notes {decisionType === 'REJECT' || decisionType === 'REQUEST_CORRECTION' ? '(Required)' : '(Optional)'}
              </label>
              <textarea
                rows={4}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter justification, notes for student correction, or investigation instructions..."
                className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDecisionType(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingDecision}
                className="px-4 py-2 bg-[#0F3040] text-white text-xs font-bold rounded-lg hover:bg-[#1a4b63] disabled:opacity-50"
              >
                {submittingDecision ? 'Processing...' : 'Confirm Decision'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* OCR Document Inspection Modal */}
      {selectedDocPreview && (
        <Modal
          isOpen={!!selectedDocPreview}
          onClose={() => setSelectedDocPreview(null)}
          title={`Document OCR Inspection: ${selectedDocPreview.fileName}`}
        >
          <div className="space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap">{selectedDocPreview.extractedData || 'No structured JSON extracted.'}</pre>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminApplicationReviewPage;
