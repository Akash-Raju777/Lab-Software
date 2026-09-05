import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load laboratory data',
  message = 'Unable to communicate with the Spring Boot backend service. Please check that the API service is active.',
  onRetry,
}) => {
  return (
    <div className="bg-white border border-rose-200 rounded p-6 sm:p-8 max-w-lg mx-auto my-6 text-center shadow-subtle">
      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-3">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
        {typeof message === 'object' ? JSON.stringify(message) : String(message || 'An unexpected error occurred.')}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};
