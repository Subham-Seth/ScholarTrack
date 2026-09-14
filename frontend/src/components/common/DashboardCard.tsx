import React from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  variant?: 'primary' | 'warning' | 'accent' | 'neutral';
}

export const DashboardCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'neutral',
}) => {
  const borderStyles = {
    primary: 'border-l-4 border-l-[#0F3040]',
    warning: 'border-l-4 border-l-[#A56F63]',
    accent: 'border-l-4 border-l-[#D99B7F]',
    neutral: 'border-l-4 border-l-slate-300',
  };

  const iconBgStyles = {
    primary: 'bg-[#0F3040]/10 text-[#0F3040]',
    warning: 'bg-[#A56F63]/10 text-[#A56F63]',
    accent: 'bg-[#D99B7F]/20 text-[#0F3040]',
    neutral: 'bg-slate-100 text-[#464858]',
  };

  return (
    <div className={`bg-white rounded-xl p-5 border border-slate-200/80 shadow-soft hover:shadow-premium transition-all ${borderStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#464858] mb-1">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-[#0F3040]">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${iconBgStyles[variant]}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center text-xs text-slate-500">
          <span className="font-medium text-emerald-600 mr-1">{trend}</span>
          <span>vs previous period</span>
        </div>
      )}
    </div>
  );
};
