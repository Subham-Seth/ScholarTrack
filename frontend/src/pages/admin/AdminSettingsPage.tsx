import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Save, 
  Check, 
  AlertTriangle, 
  FileText, 
  Bell, 
  Download,
  RefreshCw,
  Cpu
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [highRiskThreshold, setHighRiskThreshold] = useState<number>(60);
  const [duplicateThreshold, setDuplicateThreshold] = useState<number>(80);
  const [incomeTolerance, setIncomeTolerance] = useState<number>(10);
  const [autoRejectUnder30, setAutoRejectUnder30] = useState<boolean>(false);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setFeedback('System operational thresholds and AI rules updated successfully.');
      setTimeout(() => setFeedback(null), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F3040]">System Configuration & AI Rules</h1>
        <p className="text-[#464858] text-sm mt-1">
          Calibrate fraud detection tolerances, RapidFuzz duplicate sensitivity, and platform operational modes.
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Fraud & Risk Model Thresholds */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-[#0F3040] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#A56F63]" /> AI Risk Engine Calibration
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Active Parameters
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-800">
                  High Risk Cutoff Score: <span className="text-rose-600 font-mono font-bold text-sm">{highRiskThreshold}/100</span>
                </label>
                <span className="text-[11px] text-gray-400">Scores &ge; this value trigger mandatory administrative review</span>
              </div>
              <input
                type="range"
                min="40"
                max="85"
                step="5"
                value={highRiskThreshold}
                onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
                className="w-full accent-[#0F3040] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-800">
                  Duplicate Similarity Cutoff: <span className="text-amber-600 font-mono font-bold text-sm">{duplicateThreshold}%</span>
                </label>
                <span className="text-[11px] text-gray-400">RapidFuzz token sort threshold across applicants</span>
              </div>
              <input
                type="range"
                min="65"
                max="95"
                step="5"
                value={duplicateThreshold}
                onChange={(e) => setDuplicateThreshold(Number(e.target.value))}
                className="w-full accent-[#0F3040] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-800">
                  Income OCR Discrepancy Tolerance: <span className="text-[#0F3040] font-mono font-bold text-sm">&plusmn;{incomeTolerance}%</span>
                </label>
                <span className="text-[11px] text-gray-400">Variances exceeding this percent flag an income anomaly</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={incomeTolerance}
                onChange={(e) => setIncomeTolerance(Number(e.target.value))}
                className="w-full accent-[#0F3040] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Human in the Loop Governance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-[#0F3040] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#A56F63]" /> Human-In-The-Loop Governance
          </h2>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 leading-relaxed">
            ScholarTrack adheres strictly to academic ethical guidelines: no scholarship award or final rejection can be executed automatically by an algorithm. AI components score, prioritize, and highlight anomalies, leaving all determinations to human officers.
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200">
            <div>
              <p className="text-xs font-bold text-[#0F3040]">Maintenance & Audit Mode</p>
              <p className="text-[11px] text-gray-500">Temporarily suspend new student submissions during annual audit reconciliations.</p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-4 h-4 text-[#0F3040] rounded focus:ring-[#0F3040]"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F3040] text-white text-xs font-bold rounded-lg hover:bg-[#1a4b63] disabled:opacity-50 transition-all shadow-sm"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
