import React from 'react';
import { Shield, Sparkles, Cpu, Award, Users, CheckCircle, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#A56F63]">About ScholarTrack</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F3040]">
          Revolutionizing Higher Education Scholarships
        </h1>
        <p className="text-sm text-[#464858] leading-relaxed">
          ScholarTrack is an academic project prototype designed to address the critical friction points in contemporary scholarship distribution: fragmented discovery, document verification bottlenecks, and identity fraud.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F3040]/10 text-[#0F3040] flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0F3040]">Access & Inclusion</h3>
          <p className="text-xs text-[#464858] leading-relaxed">
            Eliminating information asymmetry by ensuring students from low-income, rural, and underrepresented demographics discover all government and philanthropic schemes for which they qualify.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#A56F63]/10 text-[#A56F63] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0F3040]">Intelligent Automation</h3>
          <p className="text-xs text-[#464858] leading-relaxed">
            Employing optical character recognition (OCR) and fuzzy field verification to eliminate weeks of manual document screening by institutional scholarship committees.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0F3040]">Zero-Trust Fraud Defense</h3>
          <p className="text-xs text-[#464858] leading-relaxed">
            Preventing duplicate application submissions and altered income certificates through cross-application token similarity and multi-signal fraud scoring.
          </p>
        </div>
      </div>

      {/* Human in the loop commitment */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0F3040] to-[#0A202B] text-white space-y-4">
        <div className="flex items-center gap-2 text-[#D99B7F]">
          <Shield className="w-6 h-6" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Governing AI Principle</h3>
        </div>
        <h4 className="text-xl font-bold">Assistive Decision-Support — Never Autonomous Rejection</h4>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          ScholarTrack is explicitly engineered as a human-in-the-loop decision-support platform. The AI surfaces duplicate similarity alerts, document income discrepancies, and risk scores, but never issues final rejections or approvals autonomously. All final determinations remain with authorized institutional administrators.
        </p>
      </div>
    </div>
  );
};
