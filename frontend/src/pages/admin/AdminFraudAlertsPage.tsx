import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  User, 
  Eye, 
  CheckCircle2, 
  DollarSign, 
  Sparkles,
  ShieldCheck,
  Search
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

export const AdminFraudAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.getFraudAlerts();
      setAlerts(data || []);
    } catch (err) {
      console.error('Failed to load fraud alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0F3040]">Fraud & Anomaly Incident Queue</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
              High Priority
            </span>
          </div>
          <p className="text-[#464858] text-sm mt-1">
            Automated flag registry detecting document tampering, major income variances, and multi-scheme abuses.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F3040] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
        </button>
      </div>

      {/* Decision-Support Guideline Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold">Verification Advisory:</strong> High-risk scores reflect mathematical variances and optical extraction checks. Always inspect the raw uploaded PDF/certificate in the review pane before taking punitive action.
        </div>
      </div>

      {/* Alerts Grid */}
      {loading ? (
        <LoadingState message="Querying fraud intelligence pipeline..." />
      ) : alerts.length === 0 ? (
        <EmptyState
          title="No Active Fraud Incidents"
          description="All applications are currently within standard verification variance boundaries."
        />
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-2xl border-l-4 border-l-rose-600 border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Risk Score: {alert.riskScore || 78}/100
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-500">
                    App #{alert.applicationNumber || alert.applicationId || alert.id}
                  </span>
                  <span className="text-xs text-gray-400">
                    &bull; {new Date(alert.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0F3040]">
                  {alert.studentName || 'Student Applicant'} &bull; {alert.scholarshipTitle || 'Scholarship Scheme'}
                </h3>

                <p className="text-xs text-rose-700 font-medium leading-relaxed bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                  <strong className="font-semibold">Primary Flag:</strong> {alert.flagReason || 'Significant variance (> 15%) detected between declared family income and income extracted via OCR.'}
                </p>

                {alert.factors && alert.factors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {alert.factors.map((factor: string, idx: number) => (
                      <span key={idx} className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                        {factor}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-center">
                <Link
                  to={`/admin/applications/${alert.applicationId || alert.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F3040] text-white text-xs font-bold rounded-xl hover:bg-[#1a4b63] transition-all shadow-sm"
                >
                  <Eye className="w-4 h-4" /> Inspect Review Dossier <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFraudAlertsPage;
