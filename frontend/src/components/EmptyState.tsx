import React from 'react';
import { FlaskConical, Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No reagents added yet',
  description = 'Add reagents to the laboratory inventory to track dynamic expiry dates and alerts.',
  actionText = 'Add Reagent',
  actionHref = '/reagents/add',
  onAction,
  icon,
}) => {
  return (
    <div className="bg-white border border-slate-200 border-dashed rounded p-8 sm:p-12 text-center max-w-lg mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-4">
        {icon || <FlaskConical className="w-6 h-6 text-slate-400" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
        {description}
      </p>
      <div className="mt-6 flex justify-center">
        {actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-subtle"
          >
            <Plus className="w-4 h-4" />
            {actionText}
          </Link>
        ) : onAction ? (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-subtle"
          >
            <Plus className="w-4 h-4" />
            {actionText}
          </button>
        ) : null}
      </div>
    </div>
  );
};
