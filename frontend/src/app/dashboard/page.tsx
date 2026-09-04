'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { ReagentTable } from '@/components/ReagentTable';
import { AlertItem } from '@/components/AlertItem';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { api } from '@/lib/api';
import { InventorySummary, Reagent, AlertItem as AlertItemType } from '@/types';
import { 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Plus, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [recentReagents, setRecentReagents] = useState<Reagent[]>([]);
  const [alerts, setAlerts] = useState<AlertItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [summaryData, reagentsData, alertsData] = await Promise.all([
        api.getInventorySummary(),
        api.getReagents({ sortBy: 'expiryDate', sortDir: 'asc' }),
        api.getAlerts(),
      ]);

      setSummary(summaryData);
      setRecentReagents(reagentsData.slice(0, 6)); // Display top 6
      setAlerts(alertsData.slice(0, 4)); // Display top 4 recent alerts
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err?.message || 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteReagent = async (id: number) => {
    await api.deleteReagent(id);
    await loadDashboardData();
  };

  return (
    <DashboardLayout
      title="Laboratory Dashboard"
      subtitle="Overview of microbiology reagents, expiry thresholds, and inventory status"
      actions={
        <Link
          href="/reagents/add"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Reagent</span>
        </Link>
      }
    >
      {isLoading ? (
        <LoadingState message="Fetching live laboratory inventory and calculating expiry statuses..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadDashboardData} />
      ) : (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Reagents"
              value={summary?.totalReagents || 0}
              subtitle="Registered in inventory"
              icon={FlaskConical}
              variant="default"
            />
            <StatCard
              title="Good"
              value={summary?.goodCount || 0}
              subtitle="Expiry > 7 days"
              icon={CheckCircle2}
              variant="good"
            />
            <StatCard
              title="Expiring Soon"
              value={summary?.expiringSoonCount || 0}
              subtitle="Within 7-day window"
              icon={AlertTriangle}
              variant="warning"
            />
            <StatCard
              title="Expired"
              value={summary?.expiredCount || 0}
              subtitle="Requires immediate disposal"
              icon={AlertOctagon}
              variant="danger"
            />
          </div>

          {/* Grid: Recent Expiry Alerts & Recent Reagents */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Expiry Alerts Column */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-slate-700" />
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Recent Expiry Alerts
                  </h2>
                </div>
                <Link
                  href="/alerts"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {alerts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded p-6 text-center shadow-subtle">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-900">
                    No active expiry alerts
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    All reagents currently meet safety thresholds.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {alerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Reagents Inventory Table Column */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Upcoming Expirations / Reagent List
                </h2>
                <Link
                  href="/reagents"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                >
                  <span>View full inventory ({summary?.totalReagents || 0})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentReagents.length === 0 ? (
                <EmptyState
                  title="No reagents recorded"
                  description="Begin tracking your laboratory inventory by adding your first microbiology reagent."
                  actionText="Add First Reagent"
                  actionHref="/reagents/add"
                />
              ) : (
                <ReagentTable
                  reagents={recentReagents}
                  onDelete={handleDeleteReagent}
                  showActions={true}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
