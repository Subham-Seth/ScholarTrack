import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StudentProfile } from '../../types';
import { LoadingState } from '../../components/common/LoadingState';
import { User, BookOpen, DollarSign, Award, CheckCircle2, Save, Sparkles, AlertCircle } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: name === 'academicYear' || name === 'familyIncome' || name === 'cgpaPercentage'
        ? (value === '' ? undefined : Number(value))
        : value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage(null);
    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      setMessage({ type: 'success', text: 'Student profile updated successfully!' });
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return <div className="py-20"><LoadingState message="Loading your profile credentials..." size="lg" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F3040]">Student Profile & Credentials</h1>
          <p className="text-xs text-[#464858] mt-1">
            Maintain accurate academic and financial metrics for automated eligibility evaluation and OCR verification.
          </p>
        </div>

        {/* Profile Completion Bar */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shrink-0 w-full sm:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-[#0F3040]">
            <span>Profile Completion</span>
            <span className="text-[#A56F63]">{profile.profileCompletionPct}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-[#0F3040] via-[#A56F63] to-[#D99B7F] transition-all duration-500"
              style={{ width: `${profile.profileCompletionPct}%` }}
            />
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. PERSONAL DETAILS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-[#A56F63]" />
            <h3 className="text-sm font-bold text-[#0F3040] uppercase tracking-wide">Personal Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Full Legal Name *</label>
              <input
                type="text"
                required
                name="fullName"
                value={profile.fullName || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Email Address</label>
              <input
                type="email"
                disabled
                value={profile.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={profile.dob || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Gender</label>
              <select
                name="gender"
                value={profile.gender || 'Male'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0F3040] font-semibold focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#0F3040]">Mobile Contact Phone *</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone || ''}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
            </div>
          </div>
        </div>

        {/* 2. ACADEMIC CREDENTIALS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="w-5 h-5 text-[#A56F63]" />
            <h3 className="text-sm font-bold text-[#0F3040] uppercase tracking-wide">Academic Credentials</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#0F3040]">College / University Name *</label>
              <input
                type="text"
                required
                name="college"
                value={profile.college || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Enrolled Course / Degree *</label>
              <input
                type="text"
                required
                name="course"
                value={profile.course || ''}
                onChange={handleChange}
                placeholder="e.g. B.Tech, MBBS, M.Tech"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Branch / Specialization *</label>
              <input
                type="text"
                name="branch"
                value={profile.branch || ''}
                onChange={handleChange}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Current Academic Year</label>
              <select
                name="academicYear"
                value={profile.academicYear || 1}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0F3040] font-semibold focus:outline-none"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
                <option value={5}>5th Year / Postgrad</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Academic Aggregate Score (%) / CGPA *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                required
                name="cgpaPercentage"
                value={profile.cgpaPercentage !== undefined ? profile.cgpaPercentage : ''}
                onChange={handleChange}
                placeholder="e.g. 86.50"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
            </div>
          </div>
        </div>

        {/* 3. FINANCIAL & SOCIO-ECONOMIC INFORMATION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-5 h-5 text-[#A56F63]" />
            <h3 className="text-sm font-bold text-[#0F3040] uppercase tracking-wide">Financial & Domicile Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Annual Family Income (in ₹) *</label>
              <input
                type="number"
                min="0"
                step="1000"
                required
                name="familyIncome"
                value={profile.familyIncome !== undefined ? profile.familyIncome : ''}
                onChange={handleChange}
                placeholder="e.g. 240000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
              <p className="text-[10px] text-slate-500">Must match the certificate issued by the Revenue Authority.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Primary Income Source</label>
              <input
                type="text"
                name="incomeSource"
                value={profile.incomeSource || ''}
                onChange={handleChange}
                placeholder="e.g. Agriculture, Small Enterprise, Service"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">Social Category</label>
              <select
                name="category"
                value={profile.category || 'GENERAL'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0F3040] font-semibold focus:outline-none"
              >
                <option value="GENERAL">General</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040]">State of Domicile *</label>
              <input
                type="text"
                name="domicileState"
                value={profile.domicileState || ''}
                onChange={handleChange}
                placeholder="e.g. Maharashtra, Delhi, Gujarat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#0F3040]">Disability / Divyangjan Status</label>
              <select
                name="disabilityStatus"
                value={profile.disabilityStatus || 'NONE'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0F3040] font-semibold focus:outline-none"
              >
                <option value="NONE">No Benchmark Disability (General)</option>
                <option value="VISUAL_IMPAIRMENT">Visual Impairment (≥ 40%)</option>
                <option value="LOCOMOTOR_DISABILITY">Locomotor Disability (≥ 40%)</option>
                <option value="HEARING_IMPAIRMENT">Hearing Impairment (≥ 40%)</option>
                <option value="OTHER">Other Benchmark Disability</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Credentials'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
