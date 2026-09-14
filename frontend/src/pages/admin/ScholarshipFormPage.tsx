import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Award, 
  Calendar, 
  DollarSign, 
  Building, 
  Check, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { Scholarship } from '../../types';
import LoadingState from '../../components/common/LoadingState';

export const ScholarshipFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState<boolean>(isEditing);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [provider, setProvider] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(50000);
  const [category, setCategory] = useState('MERIT');
  const [deadline, setDeadline] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Eligibility Rules
  const [minPercentage, setMinPercentage] = useState<number>(75);
  const [maxIncome, setMaxIncome] = useState<number>(500000);
  const [eligibleGender, setEligibleGender] = useState('ANY');
  const [eligibleCategory, setEligibleCategory] = useState('ANY');
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([
    'INCOME_CERTIFICATE',
    'MARKSHEET'
  ]);

  useEffect(() => {
    if (isEditing && id) {
      const loadScholarship = async () => {
        try {
          setLoading(true);
          const s = await api.getScholarshipById(Number(id));
          setTitle(s.title);
          setCode(s.code || '');
          setProvider(s.provider);
          setDescription(s.description);
          setAmount(s.amount);
          setCategory(s.category);
          setDeadline(s.deadline ? s.deadline.split('T')[0] : '');
          setIsActive(s.isActive);
          if (s.minPercentage) setMinPercentage(s.minPercentage);
          if (s.maxIncome) setMaxIncome(s.maxIncome);
          if (s.eligibleGender) setEligibleGender(s.eligibleGender);
          if (s.eligibleCategory) setEligibleCategory(s.eligibleCategory);
        } catch (err: any) {
          setError('Failed to load scholarship details.');
        } finally {
          setLoading(false);
        }
      };
      loadScholarship();
    }
  }, [id, isEditing]);

  const handleDocumentToggle = (docType: string) => {
    setRequiredDocuments(prev =>
      prev.includes(docType) ? prev.filter(d => d !== docType) : [...prev, docType]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !provider.trim() || !deadline) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        title,
        code: code || `SCH-${Math.floor(1000 + Math.random() * 9000)}`,
        provider,
        description,
        amount: Number(amount),
        category,
        deadline,
        isActive,
        minPercentage: Number(minPercentage),
        maxIncome: Number(maxIncome),
        eligibleGender,
        eligibleCategory,
      };

      if (isEditing && id) {
        await api.updateScholarship(Number(id), payload);
      } else {
        await api.createScholarship(payload);
      }

      navigate('/admin/scholarships');
    } catch (err: any) {
      setError(err.message || 'Failed to save scholarship.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading scholarship configuration..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/scholarships')}
          className="p-2 text-gray-500 hover:text-[#0F3040] hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0F3040]">
            {isEditing ? 'Edit Scholarship Scheme' : 'Create New Scholarship'}
          </h1>
          <p className="text-[#464858] text-sm mt-0.5">
            Configure scheme metadata and deterministic eligibility constraints evaluated by the AI engine.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Scheme Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-[#0F3040] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#A56F63]" /> Scheme Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Scholarship Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. National Merit Scholarship for Higher Education"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Scheme Code (Unique)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. NMS-2026-UG"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Provider / Ministry / Agency *</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Ministry of Education"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category / Domain *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040] bg-white"
              >
                <option value="MERIT">Merit-Based</option>
                <option value="NEED_BASED">Need-Based (EWS)</option>
                <option value="SPECIAL_CATEGORY">Reserved / Category</option>
                <option value="STEM">STEM Research</option>
                <option value="GIRL_CHILD">Girl Child Empowerment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Award Amount (₹ INR) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1000"
                step="1000"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Application Deadline *</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="is-active-check"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#0F3040] rounded focus:ring-[#0F3040]"
              />
              <label htmlFor="is-active-check" className="text-xs font-semibold text-gray-800 cursor-pointer">
                Publish as Active (Accept Applications immediately)
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Description & Benefits</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe coverage, objective, and disbursement terms..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
              />
            </div>
          </div>
        </div>

        {/* Deterministic Eligibility Engine Rules */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-[#0F3040] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#A56F63]" /> AI & Rule-Based Eligibility Gates
          </h2>
          <p className="text-xs text-[#464858]">
            These thresholds are automatically verified against student profiles and extracted OCR certificate values.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Minimum Qualifying Academic Score (%)</label>
              <input
                type="number"
                value={minPercentage}
                onChange={(e) => setMinPercentage(Number(e.target.value))}
                min="0"
                max="100"
                step="0.5"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Cross-verified against Marksheet OCR</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Maximum Family Annual Income (₹ INR)</label>
              <input
                type="number"
                value={maxIncome}
                onChange={(e) => setMaxIncome(Number(e.target.value))}
                min="0"
                step="10000"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Cross-verified against Income Certificate OCR</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Eligible Gender</label>
              <select
                value={eligibleGender}
                onChange={(e) => setEligibleGender(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040] bg-white"
              >
                <option value="ANY">All Genders</option>
                <option value="FEMALE">Female Only</option>
                <option value="MALE">Male Only</option>
                <option value="OTHER">Transgender / Non-Binary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category / Reservation Requirement</label>
              <select
                value={eligibleCategory}
                onChange={(e) => setEligibleCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040] bg-white"
              >
                <option value="ANY">Open to All Categories</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/scholarships"
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F3040] text-white text-xs font-bold rounded-lg hover:bg-[#1a4b63] disabled:opacity-50 transition-all shadow-sm"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving Scheme...' : isEditing ? 'Update Scholarship' : 'Publish Scholarship'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScholarshipFormPage;
