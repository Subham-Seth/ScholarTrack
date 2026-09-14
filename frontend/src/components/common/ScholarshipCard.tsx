import React from 'react';
import { Scholarship } from '../../types';
import { Calendar, DollarSign, Award, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  scholarship: Scholarship;
  onCheckEligibility?: (scholarship: Scholarship) => void;
  onApply?: (scholarship: Scholarship) => void;
  baseLink?: string;
  showApplyButton?: boolean;
}

export const ScholarshipCard: React.FC<Props> = ({
  scholarship,
  onCheckEligibility,
  onApply,
  baseLink = '/scholarships',
  showApplyButton = true,
}) => {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(scholarship.amount);

  const formattedDeadline = new Date(scholarship.deadline).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const isClosingSoon = () => {
    const diffDays = (new Date(scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return diffDays > 0 && diffDays <= 20;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft hover:shadow-premium transition-all flex flex-col justify-between overflow-hidden group">
      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0F3040] via-[#A56F63] to-[#D99B7F]" />

      <div className="p-5 space-y-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D99B7F]/20 text-[#0F3040]">
              {scholarship.category}
            </span>
            <h3 className="text-lg font-bold text-[#0F3040] group-hover:text-[#A56F63] transition-colors line-clamp-2">
              <Link to={`${baseLink}/${scholarship.id}`}>
                {scholarship.title}
              </Link>
            </h3>
            <p className="text-xs font-medium text-[#464858]">
              Offered by <span className="font-semibold text-[#0F3040]">{scholarship.provider}</span>
            </p>
          </div>

          {scholarship.matchPercentage !== undefined && (
            <div className="shrink-0 flex flex-col items-end">
              <div className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 ${
                scholarship.matchPercentage >= 85
                  ? 'bg-emerald-100 text-emerald-800'
                  : scholarship.matchPercentage >= 70
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                <span>{scholarship.matchPercentage}%</span>
                <span className="text-[10px] font-medium">Match</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-[#0F3040]">
            <Award className="w-4 h-4 text-[#A56F63]" />
            <span className="font-bold">{formattedAmount}</span>
            <span className="text-[10px] text-slate-500">/ award</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#464858]">
            <Calendar className="w-4 h-4 text-[#D99B7F]" />
            <span>{formattedDeadline}</span>
            {isClosingSoon() && (
              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded">
                Soon
              </span>
            )}
          </div>
        </div>

        {/* Quick Criteria Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-[#464858]">
          {scholarship.minCgpaPercentage && (
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              Min {scholarship.minCgpaPercentage}%
            </span>
          )}
          {scholarship.maxFamilyIncome && (
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              Income &lt; ₹{(scholarship.maxFamilyIncome / 100000).toFixed(1)}L
            </span>
          )}
          {scholarship.eligibleCourses && (
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 truncate max-w-[150px]">
              {scholarship.eligibleCourses}
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        {onCheckEligibility && (
          <button
            onClick={() => onCheckEligibility(scholarship)}
            className="text-xs font-semibold text-[#0F3040] hover:text-[#A56F63] transition-colors flex items-center gap-1 py-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Check Eligibility</span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Link
            to={`${baseLink}/${scholarship.id}`}
            className="text-xs font-semibold text-[#464858] hover:text-[#0F3040] px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Details
          </Link>

          {showApplyButton && (
            <button
              onClick={() => onApply ? onApply(scholarship) : null}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] shadow-sm transition-all flex items-center gap-1"
            >
              <span>Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
