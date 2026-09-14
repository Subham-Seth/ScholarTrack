import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  ArrowRight, 
  ShieldAlert, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { ApplicationSummary } from '../../types';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import ApplicationStatusBadge from '../../components/common/ApplicationStatusBadge';

export const AdminApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminApplications({
        status: statusFilter || undefined,
        riskLevel: riskFilter || undefined,
        search: searchQuery || undefined
      });
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, riskFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setRiskFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3040]">Application Management</h1>
          <p className="text-[#464858] text-sm mt-1">
            Search, filter, and inspect scholarship applications with automated AI risk indicators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchApplications}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F3040] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, application number, or scholarship..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040] bg-white text-gray-700"
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CORRECTION_REQUIRED">Correction Required</option>
              <option value="FLAGGED">Flagged / Anomaly</option>
            </select>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040] bg-white text-gray-700"
            >
              <option value="">All Risk Tiers</option>
              <option value="LOW">Low Risk (&lt; 30)</option>
              <option value="MEDIUM">Medium Risk (30-60)</option>
              <option value="HIGH">High Risk (&gt; 60)</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-[#0F3040] text-white text-xs font-semibold rounded-lg hover:bg-[#1a4b63] transition-colors"
            >
              Search
            </button>

            {(searchQuery || statusFilter || riskFilter) && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-800 font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span>Showing <strong>{applications.length}</strong> applications</span>
          <span className="text-[11px] text-gray-400">Decision-support flags (OCR / Duplicates) are highlighted automatically</span>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8">
            <LoadingState message="Fetching application records..." />
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No applications match the criteria"
              description="Try adjusting your filters or search keywords."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600 font-semibold bg-gray-50/70">
                  <th className="py-3.5 px-4">Application ID</th>
                  <th className="py-3.5 px-4">Student Details</th>
                  <th className="py-3.5 px-4">Scholarship Scheme</th>
                  <th className="py-3.5 px-4">AI Risk Score</th>
                  <th className="py-3.5 px-4">Discrepancy / Flags</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => {
                  const isHighRisk = app.riskLevel === 'HIGH';
                  const isMediumRisk = app.riskLevel === 'MEDIUM';

                  return (
                    <tr 
                      key={app.id} 
                      className={`hover:bg-gray-50/60 transition-colors ${
                        isHighRisk ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F3040]">
                        #{app.applicationNumber || app.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-800">{app.studentName}</div>
                        <div className="text-[11px] text-gray-400">Roll: {app.studentRollNumber || 'N/A'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-gray-800 block max-w-[220px] truncate" title={app.scholarshipTitle}>
                          {app.scholarshipTitle}
                        </span>
                        <span className="text-[11px] text-[#A56F63]">
                          ₹{(app.scholarshipAmount || 50000).toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            isHighRisk 
                              ? 'bg-rose-100 text-rose-800' 
                              : isMediumRisk
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {app.riskScore ?? 0} / 100
                          </span>
                          <span className="text-[10px] text-gray-500">{app.riskLevel}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {app.flagReason ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                            <AlertTriangle className="w-3 h-3" /> {app.flagReason}
                          </span>
                        ) : isHighRisk ? (
                          <span className="text-[11px] text-rose-600 font-medium">Anomaly Detected</span>
                        ) : (
                          <span className="text-[11px] text-gray-400">Clear</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {new Date(app.submissionDate || app.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/admin/applications/${app.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3040] text-white text-xs font-semibold rounded-lg hover:bg-[#1a4b63] transition-colors"
                        >
                          Review <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplicationsPage;
