import React from 'react';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, Info } from 'lucide-react';

interface Props {
  score: number;
  level?: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  signalsJson?: string;
  explainableReasonsJson?: string;
  breakdown?: any;
}

export const RiskScoreCard: React.FC<Props> = ({ score, level, riskLevel, signalsJson, explainableReasonsJson, breakdown }) => {
  const normLevel = (riskLevel || level || 'LOW').toUpperCase();

  let reasons: string[] = [];
  try {
    if (explainableReasonsJson) {
      reasons = JSON.parse(explainableReasonsJson);
    }
  } catch (e) {
    reasons = [explainableReasonsJson || ''];
  }

  let signals: Record<string, any> = {};
  try {
    if (signalsJson) {
      signals = JSON.parse(signalsJson);
    }
  } catch (e) {
    signals = {};
  }

  const levelColor =
    normLevel === 'HIGH'
      ? { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-600', badge: 'bg-rose-100 text-rose-800' }
      : normLevel === 'MEDIUM'
      ? { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800' }
      : { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-800' };

  return (
    <div className={`p-5 rounded-xl border ${levelColor.border} ${levelColor.bg} shadow-sm space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {normLevel === 'HIGH' ? (
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          ) : normLevel === 'MEDIUM' ? (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          )}
          <h4 className="font-semibold text-[#0F3040] text-sm tracking-wide uppercase">AI Fraud & Anomaly Risk Score</h4>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${levelColor.badge}`}>
          {normLevel} RISK
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-extrabold text-[#0F3040]">{score} <span className="text-xs font-normal text-slate-500">/ 100</span></span>
          <span className="text-xs font-medium text-[#464858]">
            {normLevel === 'HIGH' ? '⚠ Admin Review Mandatory' : (normLevel === 'MEDIUM' ? 'Verification Recommended' : 'Low Anomaly Probability')}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div className={`h-2.5 rounded-full transition-all duration-500 ${levelColor.bar}`} style={{ width: `${Math.min(score, 100)}%` }} />
        </div>
      </div>

      {/* Signal Attributes */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
        <div className="flex justify-between py-1 px-2 rounded bg-white/60">
          <span className="text-slate-600">Duplicate Similarity:</span>
          <span className="font-bold text-[#0F3040]">
            {signals.duplicateSimilarity !== undefined ? `${signals.duplicateSimilarity}%` : '5%'}
          </span>
        </div>
        <div className="flex justify-between py-1 px-2 rounded bg-white/60">
          <span className="text-slate-600">Document Mismatch:</span>
          <span className={`font-bold ${signals.documentMismatch === 'HIGH' ? 'text-rose-600' : 'text-emerald-600'}`}>
            {signals.documentMismatch || 'NONE'}
          </span>
        </div>
        <div className="flex justify-between py-1 px-2 rounded bg-white/60">
          <span className="text-slate-600">Multiple Applications:</span>
          <span className="font-bold text-[#0F3040]">
            {signals.multipleApplications ? 'YES' : 'NO'}
          </span>
        </div>
        <div className="flex justify-between py-1 px-2 rounded bg-white/60">
          <span className="text-slate-600">Profile Consistency:</span>
          <span className={`font-bold ${signals.profileConsistency === 'LOW' ? 'text-amber-600' : 'text-emerald-600'}`}>
            {signals.profileConsistency || 'HIGH'}
          </span>
        </div>
      </div>

      {/* Explainable Reasons */}
      {reasons.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-xs font-semibold text-[#0F3040]">Risk Assessment Signals:</p>
          <ul className="space-y-1">
            {reasons.map((r, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                <span className="text-[#A56F63] font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Decision-support indicator only. Final approval or rejection decisions rest exclusively with authorized human reviewers.</span>
      </div>
    </div>
  );
};

export default RiskScoreCard;

