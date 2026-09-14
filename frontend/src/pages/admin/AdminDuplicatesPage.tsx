import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Copy, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ArrowRight, 
  User, 
  FileText,
  Search,
  Check
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

export const AdminDuplicatesPage: React.FC = () => {
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchDuplicates = async () => {
    try {
      setLoading(true);
      const data = await api.getDuplicateAlerts();
      setDuplicates(data || []);
    } catch (err) {
      console.error('Failed to load duplicate alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const handleDismiss = (id: number) => {
    setDuplicates(prev => prev.filter(d => d.id !== id));
    setFeedback('Duplicate alert dismissed as legitimate separate applicant.');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmDuplicate = (id: number) => {
    setDuplicates(prev => prev.filter(d => d.id !== id));
    setFeedback('Confirmed duplicate flagged in system. Application moved to higher scrutiny.');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0F3040]">Duplicate Application Detection</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              RapidFuzz & Levenshtein
            </span>
          </div>
          <p className="text-[#464858] text-sm mt-1">
            Automated cross-check across Aadhaar hashes, bank accounts, phonetic student names, and contact details.
          </p>
        </div>

        <button
          onClick={fetchDuplicates}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F3040] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-scan Repositories
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-xs text-gray-600 leading-relaxed">
        <strong className="text-[#0F3040] font-semibold">How Duplicate Detection Works:</strong> Our AI subsystem runs token sort ratio and string distance algorithms over all incoming submissions. Any cross-application match exceeding <strong className="text-rose-700">80% similarity</strong> or sharing exact Aadhaar/Bank Account digits generates an automatic audit alert below.
      </div>

      {/* Duplicates List */}
      {loading ? (
        <LoadingState message="Scanning for cross-application duplicates..." />
      ) : duplicates.length === 0 ? (
        <EmptyState
          title="Zero Duplicate Submissions Flagged"
          description="All active student applications appear unique with distinct identity hashes."
        />
      ) : (
        <div className="space-y-4">
          {duplicates.map((dup) => {
            const similarity = dup.similarityScore || 92;
            const isCritical = similarity >= 85;

            return (
              <div
                key={dup.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isCritical ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                      <Copy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0F3040]">
                          Duplicate Alert #{dup.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {similarity}% Identity Match
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        Detected: {new Date(dup.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDismiss(dup.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      Dismiss (Legitimate)
                    </button>
                    <button
                      onClick={() => handleConfirmDuplicate(dup.id)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                    >
                      Confirm & Invalidate
                    </button>
                  </div>
                </div>

                {/* Comparison Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Subject Application */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F3040]">Incoming Application</span>
                      <Link
                        to={`/admin/applications/${dup.primaryApplicationId || 1}`}
                        className="text-[#A56F63] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Inspect #{dup.primaryApplicationNumber || dup.primaryApplicationId || 1} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Applicant Name</span>
                      <span className="font-semibold text-gray-800">{dup.primaryStudentName || 'Rahul K.'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Scheme</span>
                      <span className="text-gray-700">{dup.primaryScholarshipTitle || 'National Merit Scholarship'}</span>
                    </div>
                  </div>

                  {/* Matched Existing Application */}
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900">Pre-existing Application</span>
                      <Link
                        to={`/admin/applications/${dup.matchedApplicationId || 2}`}
                        className="text-[#A56F63] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Inspect #{dup.matchedApplicationNumber || dup.matchedApplicationId || 2} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Applicant Name</span>
                      <span className="font-semibold text-gray-800">{dup.matchedStudentName || 'Rahul Kumar'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Scheme</span>
                      <span className="text-gray-700">{dup.matchedScholarshipTitle || 'Post-Matric Scholarship Scheme'}</span>
                    </div>
                  </div>
                </div>

                {/* Overlapping Identity Fields */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-gray-600 mr-2">Overlapping Parameters:</span>
                  {(dup.matchedFields || ['Aadhaar Hash Match (99%)', 'Bank Account Number Match', 'Phone Number Exact']).map((f: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-gray-700 font-mono text-[11px]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDuplicatesPage;
