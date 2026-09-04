import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'good' | 'warning' | 'danger';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'good':
        return 'border-l-4 border-l-emerald-600 bg-white hover:border-l-emerald-700';
      case 'warning':
        return 'border-l-4 border-l-amber-500 bg-white hover:border-l-amber-600';
      case 'danger':
        return 'border-l-4 border-l-rose-600 bg-white hover:border-l-rose-700';
      default:
        return 'border-l-4 border-l-slate-700 bg-white hover:border-l-slate-900';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'good':
        return 'bg-emerald-50 text-emerald-700';
      case 'warning':
        return 'bg-amber-50 text-amber-700';
      case 'danger':
        return 'bg-rose-50 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`border border-slate-200 rounded p-4 sm:p-5 shadow-subtle transition-all duration-150 ${getVariantStyles()} ${
        onClick ? 'cursor-pointer hover:shadow-card' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5 font-mono">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded ${getIconStyles()}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
