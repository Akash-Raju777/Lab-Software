import React from 'react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading inventory data...',
  rows = 5,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded p-6 shadow-subtle">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        <span className="text-xs font-medium text-slate-600">{message}</span>
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-slate-100/70 rounded animate-pulse"
            style={{ opacity: 1 - i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
};
