'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AlertItem } from '@/components/AlertItem';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { api } from '@/lib/api';
import { AlertItem as AlertItemType } from '@/types';
import { 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  RotateCw, 
  ShieldAlert,
  Info
} from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (err: any) {
      console.error('Failed to load alerts:', err);
      setError(err?.message || 'Could not fetch alerts from backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const expiringSoonAlerts = alerts.filter((a) => a.status === 'EXPIRING_SOON');
  const expiredAlerts = alerts.filter((a) => a.status === 'EXPIRED');

  return (
    <DashboardLayout
      title="Expiry Alerts"
      subtitle="Critical inventory alerts for reagents requiring replenishment or laboratory disposal"
      actions={
        <button
          onClick={fetchAlerts}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-subtle"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh Alerts</span>
        </button>
      }
    >
      {isLoading ? (
        <LoadingState message="Scanning laboratory inventory for expiry thresholds..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAlerts} />
      ) : alerts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No expiry alerts</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            All registered microbiology reagents are in good standing and exceed the 7-day threshold.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Threshold Banner */}
          <div className="bg-slate-100/80 border border-slate-200 rounded p-3.5 flex items-start gap-3 text-xs text-slate-700">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Configured Safety Protocol: </span>
              Reagents within <strong className="font-mono">7 days</strong> of expiry are flagged for review. Expired items are strictly prohibited for microbiological assays and should be quarantined immediately.
            </div>
          </div>

          {/* Section 1: EXPIRED Reagents (High Priority) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-rose-200 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <h2 className="text-sm font-bold text-rose-950 uppercase tracking-wider flex items-center gap-2">
                  <span>Expired Items</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono">
                    {expiredAlerts.length}
                  </span>
                </h2>
              </div>
              <span className="text-[11px] text-rose-700 font-medium">Immediate Quarantine Required</span>
            </div>

            {expiredAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No expired reagents on record.</p>
            ) : (
              <div className="space-y-2.5">
                {expiredAlerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </div>

          {/* Section 2: EXPIRING SOON Reagents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                  <span>Expiring Soon (Within 7 Days)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                    {expiringSoonAlerts.length}
                  </span>
                </h2>
              </div>
              <span className="text-[11px] text-amber-700 font-medium">Restock / Schedule Usage</span>
            </div>

            {expiringSoonAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No reagents expiring within the next 7 days.</p>
            ) : (
              <div className="space-y-2.5">
                {expiringSoonAlerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
