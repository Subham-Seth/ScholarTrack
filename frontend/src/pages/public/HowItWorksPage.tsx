import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Search, CheckCircle2, UploadCloud, Cpu, Award, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Create Your Academic Profile',
      desc: 'Sign up and complete your comprehensive student profile, including your enrolled degree, branch, CGPA aggregate, family annual income, category, and state domicile.',
      icon: <UserCheck className="w-6 h-6 text-[#0F3040]" />,
    },
    {
      num: '02',
      title: 'Intelligent Discovery & Recommendations',
      desc: 'Browse scholarships matched to your academic stream. Our weighted recommendation engine ranks scholarships by fit, deadline, and eligibility percentage.',
      icon: <Search className="w-6 h-6 text-[#A56F63]" />,
    },
    {
      num: '03',
      title: 'Pre-Application Eligibility Evaluation',
      desc: 'Click "Check Eligibility" on any scholarship to view an instant criterion-by-criterion breakdown with AI explanations before filling out applications.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    },
    {
      num: '04',
      title: 'Document Upload & AI Classification',
      desc: 'Upload income certificates and marksheets in PDF or JPG format. The system classifies document types and extracts structured fields using optical character recognition.',
      icon: <UploadCloud className="w-6 h-6 text-sky-600" />,
    },
    {
      num: '05',
      title: 'Cross-Validation & Duplicate Check',
      desc: 'Upon submission, the platform cross-compares declared values with document certificate values and screens against cross-applicant similarity records.',
      icon: <Cpu className="w-6 h-6 text-[#A56F63]" />,
    },
    {
      num: '06',
      title: 'Human Review & Award Authorization',
      desc: 'Verified files and explainable risk scores are reviewed by scholarship administrators. Once approved, notification alerts and disbursement records are generated.',
      icon: <Award className="w-6 h-6 text-[#D99B7F]" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#A56F63]">Workflow Guide</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F3040]">
          How ScholarTrack Works
        </h1>
        <p className="text-sm text-[#464858]">
          Follow the transparent 6-step lifecycle from profile creation to scholarship award authorization.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-start gap-6 hover:shadow-premium transition-all"
          >
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-3xl font-extrabold text-[#D99B7F] font-mono w-10 text-center">
                {s.num}
              </span>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-2xs">
                {s.icon}
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-base font-bold text-[#0F3040]">{s.title}</h3>
              <p className="text-xs text-[#464858] leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] shadow-md transition-all"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
