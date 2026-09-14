import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  GraduationCap, 
  Building, 
  Mail, 
  Phone, 
  FileText,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { api } from '../../services/api';
import { StudentProfile } from '../../types';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await api.getAllStudents();
      setStudents(data || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.rollNumber && s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.college && s.college.toLowerCase().includes(searchQuery.toLowerCase())) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3040]">Student Registry</h1>
          <p className="text-[#464858] text-sm mt-1">
            Directory of registered student profiles, institutional affiliations, and baseline metrics.
          </p>
        </div>

        <button
          onClick={fetchStudents}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F3040] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Registry
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name, roll number, college, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
          />
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {filteredStudents.length} students found
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8">
            <LoadingState message="Fetching student registry..." />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No students found"
              description="No registered students match your query."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/60">
                  <th className="py-3.5 px-4">Student Name & Contact</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Institution & Course</th>
                  <th className="py-3.5 px-4">Academic Score</th>
                  <th className="py-3.5 px-4">Family Annual Income</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-800">{st.fullName}</div>
                      <div className="text-[11px] text-gray-400">{st.email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-[#0F3040]">
                      {st.rollNumber || 'N/A'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800">{st.college || 'Not Provided'}</div>
                      <div className="text-[11px] text-[#A56F63]">{st.course || 'Undergraduate'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-800">
                        {st.tenthPercentage ? `${st.tenthPercentage}%` : 'N/A'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-700">
                      ₹{(st.annualFamilyIncome || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                        {st.category || 'GENERAL'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-400 text-right">
                      {new Date(st.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudentsPage;
