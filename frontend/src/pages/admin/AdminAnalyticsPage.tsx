import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award, 
  CheckCircle, 
  Clock, 
  BarChart2, 
  PieChart as PieIcon,
  RefreshCw,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../../services/api';
import LoadingState from '../../components/common/LoadingState';

export const AdminAnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Demographic & category breakdown
  const categoryData = [
    { name: 'General', value: 45, color: '#0F3040' },
    { name: 'OBC', value: 28, color: '#464858' },
    { name: 'SC / ST', value: 18, color: '#A56F63' },
    { name: 'EWS', value: 9, color: '#D99B7F' }
  ];

  // Income bracket representation
  const incomeBracketData = [
    { bracket: '< ₹1.5 Lakhs', applicants: 38, approved: 32 },
    { bracket: '₹1.5L - ₹3.0L', applicants: 42, approved: 35 },
    { bracket: '₹3.0L - ₹5.0L', applicants: 26, approved: 18 },
    { bracket: '> ₹5.0 Lakhs', applicants: 14, approved: 6 }
  ];

  // Turnaround timeline
  const monthlyTrends = [
    { month: 'May', applications: 15, approved: 12, rejected: 2 },
    { month: 'Jun', applications: 28, approved: 22, rejected: 4 },
    { month: 'Jul', applications: 45, approved: 38, rejected: 5 },
    { month: 'Aug', applications: 62, approved: 50, rejected: 8 },
    { month: 'Sep', applications: 85, approved: 68, rejected: 11 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3040]">Scholarship Intelligence & Analytics</h1>
          <p className="text-[#464858] text-sm mt-1">
            Demographic equity metrics, verification throughput, and fund allocation insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F3040] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Insights
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Sanctioned Capital</span>
          <div className="text-2xl font-bold text-[#0F3040] mt-1">₹45,50,000</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">91% Fund Utilization</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Verification Turnaround</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">2.4 Days</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Reduced by 64% via AI-OCR</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Average Approval Rate</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">79.2%</div>
          <span className="text-[11px] text-gray-400 mt-1 block">Across 6 active schemes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Anomalies Prevented</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">14 Flagged</div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Est. ₹7.2L Misallocation Averted</span>
        </div>
      </div>

      {/* Monthly Pipeline Area Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-base font-bold text-[#0F3040] mb-1">Monthly Application Volume & Sanctions</h2>
        <p className="text-xs text-gray-500 mb-6">Historical trends across recent academic cycle months</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F3040" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0F3040" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorAppr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="applications" stroke="#0F3040" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" name="Total Inflow" />
              <Area type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorAppr)" name="Sanctioned" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-[#0F3040] mb-1">Income Bracket Analysis</h2>
          <p className="text-xs text-gray-500 mb-4">Applicant count vs approved awards by annual family income</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeBracketData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="bracket" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="applicants" fill="#0F3040" radius={[4, 4, 0, 0]} name="Applicants" />
                <Bar dataKey="approved" fill="#10B981" radius={[4, 4, 0, 0]} name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Equity Pie */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F3040] mb-1">Social Category Representation</h2>
            <p className="text-xs text-gray-500 mb-4">Distribution across affirmative action categories</p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100 text-center text-xs">
            {categoryData.map((cat, i) => (
              <div key={i}>
                <span className="block font-bold text-gray-800">{cat.value}%</span>
                <span className="text-gray-400 text-[10px]">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
