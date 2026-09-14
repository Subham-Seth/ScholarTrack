import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'REQUIRES_REVIEW' | string;
  size?: 'sm' | 'md' | 'lg';
  score?: number;
}

export const EligibilityBadge: React.FC<Props> = ({ status, size = 'md', score }) => {
  const normalized = status?.toUpperCase() || 'REQUIRES_REVIEW';

  const configs: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    ELIGIBLE: {
      label: 'Eligible',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
    },
    NOT_ELIGIBLE: {
      label: 'Not Eligible',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
    },
    REQUIRES_REVIEW: {
      label: 'Requires Review',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
    },
  };

  const config = configs[normalized] || configs['REQUIRES_REVIEW'];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : (size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs');

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-1 px-1.5 py-0.2 bg-white/70 rounded text-[10px] font-bold">
          {score}%
        </span>
      )}
    </span>
  );
};
