import React from 'react';
import { AlertItem as AlertItemType } from '@/types';
import { StatusBadge } from './StatusBadge';
import { AlertCircle, AlertTriangle, Calendar, Clock, FlaskConical } from 'lucide-react';
import Link from 'next/link';

interface AlertItemProps {
  alert: AlertItemType;
  onActionClick?: (alert: AlertItemType) => void;
}

export const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const isExpired = alert.status === 'EXPIRED';
  const formattedDate = new Date(alert.expiryDate).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className={`border rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
        isExpired
          ? 'bg-rose-50/40 border-rose-200 hover:bg-rose-50/70'
          : 'bg-amber-50/40 border-amber-200 hover:bg-amber-50/70'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`p-2 rounded mt-0.5 shrink-0 ${
            isExpired ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {isExpired ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
              {alert.name}
            </h4>
            <StatusBadge status={alert.status} />
          </div>

          <div className="flex items-center gap-4 mt-1 text-xs text-slate-600 flex-wrap">
            <span className="flex items-center gap-1 font-mono">
              <FlaskConical className="w-3.5 h-3.5 text-slate-400" />
              Initial Qty: {alert.quantity} {alert.unit}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Expiry: <span className="font-medium text-slate-800">{formattedDate}</span>
            </span>
          </div>

          <p
            className={`text-xs mt-1.5 font-medium ${
              isExpired ? 'text-rose-800' : 'text-amber-800'
            }`}
          >
            {alert.alertMessage}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <Link
          href={`/reagents?search=${encodeURIComponent(alert.name)}`}
          className="text-xs font-medium px-3 py-1.5 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-subtle"
        >
          View in Inventory
        </Link>
      </div>
    </div>
  );
};
