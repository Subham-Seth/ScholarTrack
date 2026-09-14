import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Scholarship, EligibilityResult } from '../../types';
import { ScholarshipCard } from '../../components/common/ScholarshipCard';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { EligibilityBadge } from '../../components/common/EligibilityBadge';
import { Search, Filter, Sparkles, ArrowUpDown } from 'lucide-react';

export const StudentScholarshipsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('matchDesc');

  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [checking, setChecking] = useState(false);

  const categories = [
    'ALL',
    'Merit-cum-Means',
    'Special Category',
    'Technical/STEM',
    'Merit',
    'State Domicile',
    'Community Welfare',
    'Research',
  ];

  useEffect(() => {
    loadScholarships();
  }, [category]);

  const loadScholarships = async () => {
    setLoading(true);
    try {
      const data = await api.getRecommendations(); // Returns scholarships with personalized match percentage!
      const filtered = category === 'ALL' ? data : data.filter((s) => s.category === category);
      setScholarships(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async (s: Scholarship) => {
    setSelectedScholarship(s);
    setEligibilityModalOpen(true);
    setChecking(true);
    try {
      const res = await api.checkEligibility(s.id, user?.profileId);
      setEligibilityResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  const handleApply = (s: Scholarship) => {
    navigate(`/student/scholarships/${s.id}/apply`);
  };

  const filteredScholarships = scholarships.filter((s) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return s.title.toLowerCase().includes(term) || s.provider.toLowerCase().includes(term);
  });

  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    if (sortBy === 'matchDesc') return (b.matchPercentage || 0) - (a.matchPercentage || 0);
    if (sortBy === 'amountDesc') return b.amount - a.amount;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-2">
        <h1 className="text-2xl font-extrabold text-[#0F3040]">Scholarship Directory & Matches</h1>
        <p className="text-xs text-[#464858]">
          Explore schemes evaluated against your current academic percentage, degree program, and family income ceiling.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by scholarship title, ministry, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
            />
          </div>

          <div className="flex items-center gap-2 self-end text-xs text-[#464858]">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-[#0F3040] font-semibold focus:outline-none"
            >
              <option value="matchDesc">Highest Match Score (%)</option>
              <option value="amountDesc">Award Amount (High to Low)</option>
              <option value="deadline">Upcoming Deadline</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-[#0F3040] text-white shadow-xs'
                  : 'bg-slate-100 text-[#464858] hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingState message="Calculating candidate match scores and loading directory..." />
      ) : sortedScholarships.length === 0 ? (
        <EmptyState
          title="No scholarships found"
          description="Try broadening your search keywords or switching category filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setCategory('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedScholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              onCheckEligibility={handleCheckEligibility}
              onApply={handleApply}
              baseLink="/student/scholarships"
            />
          ))}
        </div>
      )}

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
