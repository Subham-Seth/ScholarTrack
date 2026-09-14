import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  description?: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const ProgressStepper: React.FC<Props> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Continuous connector line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0F3040] transition-all duration-300 -z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center relative z-10 ${onStepClick && isCompleted ? 'cursor-pointer' : ''}`}
              onClick={() => onStepClick && isCompleted && onStepClick(step.id)}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isCompleted
                    ? 'bg-[#0F3040] text-white'
                    : isCurrent
                    ? 'bg-[#A56F63] text-white ring-4 ring-[#D99B7F]/30'
                    : 'bg-white text-[#464858] border-2 border-slate-300'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span
                className={`text-[11px] font-semibold mt-2 text-center max-w-[80px] sm:max-w-none ${
                  isCurrent ? 'text-[#0F3040] font-bold' : isCompleted ? 'text-[#464858]' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
