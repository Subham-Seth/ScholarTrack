import React from 'react';
import { ApplicationStatus } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, XCircle, FileSearch, RefreshCw } from 'lucide-react';

interface Props {
  status: ApplicationStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const ApplicationStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const normalized = status?.toUpperCase() || 'DRAFT';

  const configs: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    DRAFT: {
      label: 'Draft',
      bg: 'bg-slate-100',
      text: 'text-[#464858]',
      border: 'border-slate-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    SUBMITTED: {
      label: 'Submitted',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    DOCUMENT_VERIFICATION: {
      label: 'Doc Verification',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      icon: <FileSearch className="w-3.5 h-3.5" />,
    },
    CORRECTION_REQUIRED: {
      label: 'Correction Required',
      bg: 'bg-[#A56F63]/10',
      text: 'text-[#A56F63]',
      border: 'border-[#A56F63]/30',
      icon: <RefreshCw className="w-3.5 h-3.5" />,
    },
    APPROVED: {
      label: 'Approved',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[normalized] || configs['DRAFT'];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : (size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs');

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default ApplicationStatusBadge;

