import React from 'react';
import { FolderOpen } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
      <div className="p-4 rounded-2xl bg-slate-100 text-[#464858]">
        {icon || <FolderOpen className="w-8 h-8 text-slate-400" />}
      </div>
      <div className="max-w-md space-y-1">
        <h4 className="text-sm font-bold text-[#0F3040]">{title}</h4>
        <p className="text-xs text-[#464858] leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
