import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  Users, 
  Edit3, 
  ToggleLeft, 
  ToggleRight, 
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import { Scholarship } from '../../types';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

export const AdminScholarshipsPage: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const data = await api.getScholarships({
        search: searchQuery || undefined,
        category: categoryFilter || undefined,
      });
      setScholarships(data || []);
    } catch (err) {
      console.error('Failed to load scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchScholarships();
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await api.toggleScholarshipStatus(id);
      setScholarships(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
      setFeedback('Scholarship status updated successfully.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3040]">Scholarship Scheme Management</h1>
          <p className="text-[#464858] text-sm mt-1">
            Configure eligibility criteria, application quotas, and scheme statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchScholarships}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F3040] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <Link
            to="/admin/scholarships/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F3040] text-white text-xs font-bold rounded-lg hover:bg-[#1a4b63] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Scholarship
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scheme name, provider, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0F3040] text-white text-xs font-semibold rounded-lg hover:bg-[#1a4b63] transition-colors"
          >
            Search
          </button>
        </form>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040] bg-white text-gray-700"
        >
          <option value="">All Categories</option>
          <option value="MERIT">Merit-Based</option>
          <option value="NEED_BASED">Need-Based (EWS)</option>
          <option value="SPECIAL_CATEGORY">Reserved / Category</option>
          <option value="STEM">STEM Research</option>
          <option value="GIRL_CHILD">Girl Child Empowerment</option>
        </select>
      </div>

      {/* Scholarships Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8">
            <LoadingState message="Loading scholarships..." />
          </div>
        ) : scholarships.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No scholarships found"
              description="Click 'Add Scholarship' above to publish a new scheme."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/60">
                  <th className="py-3.5 px-4">Scheme & Provider</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Award Amount</th>
                  <th className="py-3.5 px-4">Key Eligibility Rule</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Active Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {scholarships.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-800 max-w-[240px] truncate" title={s.title}>
                        {s.title}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {s.provider} &bull; Code: {s.code || `SCH-${s.id}`}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                        {s.category.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-emerald-700">
                      ₹{s.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      {s.minPercentage ? `Min: ${s.minPercentage}%` : ''}
                      {s.maxIncome ? ` | Max Inc: ₹${(s.maxIncome / 100000).toFixed(1)}L` : ''}
                      {!s.minPercentage && !s.maxIncome ? 'Standard criteria' : ''}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(s.deadline).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(s.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          s.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {s.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/scholarships/${s.id}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-[#0F3040] rounded transition-colors"
                          title="Preview Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/scholarships/edit/${s.id}`}
                          className="p-1.5 text-[#0F3040] hover:bg-gray-100 rounded transition-colors font-semibold"
                          title="Edit Scheme"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScholarshipsPage;
