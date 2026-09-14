import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<Props> = ({
  title = 'An error occurred',
  message = 'Failed to fetch information from the server. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-3">
      <div className="p-3 rounded-xl bg-rose-100 text-rose-600">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="max-w-md space-y-1">
        <h4 className="text-sm font-bold text-rose-900">{title}</h4>
        <p className="text-xs text-rose-700 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 transition-all shadow-sm flex items-center gap-1.5"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};
