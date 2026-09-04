import React from 'react';
import { ReagentStatus } from '@/types';

interface StatusBadgeProps {
  status: ReagentStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'GOOD':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-green-50 text-green-800 border border-green-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          Good
        </span>
      );
    case 'EXPIRING_SOON':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
          Expiring Soon
        </span>
      );
    case 'EXPIRED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-red-50 text-red-800 border border-red-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          Expired
        </span>
      );
    default:
      return null;
  }
};
