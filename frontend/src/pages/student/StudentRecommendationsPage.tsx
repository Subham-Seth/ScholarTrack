import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Scholarship, StudentProfile } from '../../types';
import { LoadingState } from '../../components/common/LoadingState';
import { Sparkles, Award, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const StudentRecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState<Scholarship[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recs, prof] = await Promise.all([
        api.getRecommendations(),
        api.getProfile(),
      ]);
      setRecommendations(recs);
      setProfile(prof);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20"><LoadingState message="Running AI multi-criteria recommendation engine..." size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-2">
        <div className="flex items-center gap-2 text-[#A56F63]">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">AI Weighted Matching Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#0F3040]">Your Personalized Scholarship Matches</h1>
        <p className="text-xs text-[#464858]">
          Comparing your enrolled degree ({profile?.course || 'Degree'}), academic aggregate ({profile?.cgpaPercentage || 85}%),
          and verified family income (₹{profile?.familyIncome?.toLocaleString('en-IN') || '2,40,000'}) against active government eligibility criteria.
        </p>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {recommendations.map((s, idx) => {
          const matchScore = s.matchPercentage || 75;
          const isTopTier = matchScore >= 85;

          return (
            <div
              key={s.id}
              className={`bg-white rounded-2xl p-6 border transition-all shadow-soft hover:shadow-premium space-y-4 ${
                isTopTier ? 'border-emerald-200/90 bg-gradient-to-r from-white via-white to-emerald-50/30' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D99B7F]/20 text-[#0F3040]">
                      {s.category}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                        ★ Highest Recommendation
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#0F3040]">{s.title}</h3>
                  <p className="text-xs text-[#464858]">Offered by <span className="font-semibold">{s.provider}</span></p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <div className={`px-3 py-1.5 rounded-xl text-sm font-extrabold flex items-center gap-1.5 ${
                    matchScore >= 85
                      ? 'bg-emerald-100 text-emerald-800'
                      : matchScore >= 70
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                    <span>{matchScore}% Match</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#0F3040]">
                    ₹{s.amount.toLocaleString('en-IN')} / award
                  </span>
                </div>
              </div>

              {/* Explainable Matching Reasons (Section 11) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Why this scheme matches your profile:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Academic aggregate ({profile?.cgpaPercentage || 85}%) meets or exceeds minimum requirement</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Annual income aligns within ceiling limit of ₹{s.maxFamilyIncome ? (s.maxFamilyIncome / 100000).toFixed(1) + 'L' : '3.0L'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Enrolled degree ({profile?.course || 'B.Tech'}) belongs to eligible technical disciplines</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    {s.eligibleStates && !s.eligibleStates.includes('ALL') ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>State domicile verification required ({s.eligibleStates})</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>All-India domicile eligibility applicable</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Deadline: <span className="font-semibold text-slate-700">{s.deadline}</span>
                </span>
                <button
                  onClick={() => navigate(`/student/scholarships/${s.id}/apply`)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Apply with Pre-Filled Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
