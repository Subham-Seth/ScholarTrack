import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Award, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  RefreshCw, 
  Check, 
  DollarSign, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { api } from '../../services/api';
import { AdminDashboardData } from '../../types';
import LoadingState from '../../components/common/LoadingState';
import RiskScoreCard from '../../components/common/RiskScoreCard';
import ApplicationStatusBadge from '../../components/common/ApplicationStatusBadge';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return <LoadingState message="Loading administrative dashboard & analytics..." />;
  }

  // Visual chart data
  const statusChartData = [
    { name: 'Approved', count: data.approvedApplications, color: '#10B981' },
    { name: 'Pending Review', count: data.pendingReviewApplications, color: '#F59E0B' },
    { name: 'Under Review', count: data.underReviewApplications, color: '#3B82F6' },
    { name: 'High Risk / Alert', count: data.flaggedApplications, color: '#EF4444' },
    { name: 'Draft / Incomplete', count: Math.max(0, data.totalApplications - (data.approvedApplications + data.pendingReviewApplications + data.underReviewApplications + data.flaggedApplications)), color: '#9CA3AF' }
  ].filter(d => d.count > 0);

  const riskDistributionData = [
    { name: 'Low Risk (<30)', value: data.lowRiskCount || 12, color: '#10B981' },
    { name: 'Medium Risk (30-60)', value: data.mediumRiskCount || 4, color: '#F59E0B' },
    { name: 'High Risk (>60)', value: data.highRiskCount || 2, color: '#EF4444' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0F3040]">Scholarship Operations Command Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0F3040] text-white">
              Admin Portal
            </span>
          </div>
          <p className="text-[#464858] text-sm mt-1">
            Real-time verification metrics, AI-assisted anomaly detection, and decision-support pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#0F3040] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
          <Link
            to="/admin/scholarships/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F3040] text-white text-sm font-semibold rounded-lg hover:bg-[#1a4b63] transition-colors shadow-sm"
          >
            + Create Scholarship
          </Link>
        </div>
      </div>

      {/* Decision Support Disclaimer Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold">Decision-Support Principle:</strong> Automated fraud risk scores, duplicate matching percentages, and OCR discrepancy warnings serve solely as assistive indicators to prioritize human review. Final scholarship determinations remain strictly with authorized administrative officers.
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Applications</span>
            <div className="text-2xl font-bold text-[#0F3040] mt-1">{data.totalApplications}</div>
            <span className="text-[11px] text-gray-400 mt-0.5 block">{data.activeScholarships} Active Schemes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0F3040]/5 flex items-center justify-center text-[#0F3040]">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pending Review</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{data.pendingReviewApplications}</div>
            <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">Requires Officer Action</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Flagged Anomaly / High Risk</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">{data.flaggedApplications}</div>
            <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">{data.duplicateAlertsCount} Potential Duplicates</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Approved & Disbursed</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{data.approvedApplications}</div>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">₹{(data.totalDisbursedAmount || 450000).toLocaleString('en-IN')} Total Aid</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#0F3040]">Application Lifecycle Distribution</h2>
              <p className="text-xs text-gray-500">Current volume across workflow stages</p>
            </div>
            <Link to="/admin/applications" className="text-xs font-semibold text-[#A56F63] hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(15, 48, 64, 0.05)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Breakdown Pie */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-[#0F3040]">AI Risk Distribution</h2>
              <span className="text-[10px] uppercase font-bold text-[#A56F63] bg-[#A56F63]/10 px-2 py-0.5 rounded">
                RapidFuzz + OCR
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Composite risk level categorization across submissions</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-risk-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center text-xs">
            <div>
              <span className="block font-bold text-emerald-600">{riskDistributionData[0].value}</span>
              <span className="text-gray-400 text-[10px]">Low Risk</span>
            </div>
            <div>
              <span className="block font-bold text-amber-600">{riskDistributionData[1].value}</span>
              <span className="text-gray-400 text-[10px]">Medium Risk</span>
            </div>
            <div>
              <span className="block font-bold text-rose-600">{riskDistributionData[2].value}</span>
              <span className="text-gray-400 text-[10px]">High Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* High-Priority Attention Queue */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#0F3040] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> High-Priority Review Queue
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Applications requiring immediate officer inspection due to OCR mismatches or duplicate identity flags.
            </p>
          </div>
          <Link
            to="/admin/fraud-alerts"
            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            View Full Fraud Queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data.recentApplications && data.recentApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Scholarship</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#0F3040]">
                      #{app.applicationNumber || app.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      {app.studentName}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 max-w-[200px] truncate" title={app.scholarshipTitle}>
                      {app.scholarshipTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        app.riskLevel === 'HIGH' 
                          ? 'bg-rose-100 text-rose-800'
                          : app.riskLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Score: {app.riskScore ?? 0}/100 ({app.riskLevel})
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(app.submissionDate || app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/applications/${app.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0F3040] text-white text-xs font-semibold rounded-lg hover:bg-[#1a4b63] transition-colors"
                      >
                        Inspect <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-gray-500">
            No high-priority alerts pending at this time. All queue items are processed.
          </div>
        )}
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/applications"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:border-[#0F3040] hover:shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#0F3040]">Review Applications</h3>
            <p className="text-[11px] text-gray-500">Inspect queue and issue decisions</p>
          </div>
        </Link>

        <Link
          to="/admin/duplicates"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:border-[#0F3040] hover:shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#0F3040]">Duplicate Matcher</h3>
            <p className="text-[11px] text-gray-500">{data.duplicateAlertsCount} cross-entity alerts</p>
          </div>
        </Link>

        <Link
          to="/admin/analytics"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:border-[#0F3040] hover:shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#0F3040]">Advanced Analytics</h3>
            <p className="text-[11px] text-gray-500">Demographic & disbursement trends</p>
          </div>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:border-[#0F3040] hover:shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#0F3040]">Compliance Audit Trail</h3>
            <p className="text-[11px] text-gray-500">Immutable governance logs</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
