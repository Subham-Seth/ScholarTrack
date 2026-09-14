import React from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<Props> = ({ message = 'Loading scholarship data...', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
      <Loader2 className={`${iconSizes[size]} text-[#0F3040] animate-spin`} />
      <p className="text-xs sm:text-sm font-medium text-[#464858]">{message}</p>
    </div>
  );
};

export default LoadingState;
