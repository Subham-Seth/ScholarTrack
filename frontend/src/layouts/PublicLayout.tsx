import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { AIChatPanel } from '../components/common/AIChatPanel';
import { GraduationCap, Shield, Heart, ExternalLink } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Modern Footer */}
      <footer className="bg-[#0F3040] text-white border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D99B7F] text-[#0F3040] flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-lg font-extrabold tracking-tight">Scholar<span className="text-[#D99B7F]">Track</span></span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Centralized AI-based scholarship management, verification and fraud detection platform. Empowering students and streamlining administrative oversight.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D99B7F] mb-3">Discovery</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link to="/scholarships" className="hover:text-white transition-colors">Browse Scholarships</Link></li>
                <li><Link to="/scholarships?category=Merit-cum-Means" className="hover:text-white transition-colors">Merit-cum-Means</Link></li>
                <li><Link to="/scholarships?category=Special%20Category" className="hover:text-white transition-colors">Women in STEM</Link></li>
                <li><Link to="/scholarships?category=Technical/STEM" className="hover:text-white transition-colors">Deep-Tech & AI Grants</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D99B7F] mb-3">Platform AI</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><span className="text-slate-400">OCR Field Extraction</span></li>
                <li><span className="text-slate-400">Document Classification</span></li>
                <li><span className="text-slate-400">Duplicate Similarity Engine</span></li>
                <li><span className="text-slate-400">Multi-Signal Fraud Scoring</span></li>
                <li><span className="text-slate-400">RAG Scholarship Assistant</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D99B7F] mb-3">Compliance</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                ScholarTrack operates as a decision-support system. Final scholarship approval and disbursement authorizations are reserved exclusively for certified human administrators.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#D99B7F]">
                <Shield className="w-4 h-4" />
                <span className="font-semibold text-[11px]">Human-in-the-Loop Verified</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} ScholarTrack Platform. Academic Project Prototype.</p>
            <div className="flex items-center space-x-4">
              <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/login" className="hover:text-white transition-colors">Portal Access</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant */}
      <AIChatPanel floating={true} />
    </div>
  );
};
