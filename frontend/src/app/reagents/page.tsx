'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ReagentTable } from '@/components/ReagentTable';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { api } from '@/lib/api';
import { Reagent, ReagentStatus } from '@/types';
import { Search, Filter, Plus, RotateCw, FlaskConical, Download } from 'lucide-react';
import Link from 'next/link';

export default function ReagentsPage() {
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState('expiryDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReagents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getReagents({
        search: searchQuery,
        status: statusFilter,
        sortBy,
        sortDir,
      });
      setReagents(data);
    } catch (err: any) {
      console.error('Failed to load reagents:', err);
      setError(err?.message || 'Could not fetch reagents from backend.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy, sortDir]);

  useEffect(() => {
    // Debounce search/filter fetch
    const timer = setTimeout(() => {
      fetchReagents();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchReagents]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteReagent(id);
    await fetchReagents();
  };

  return (
    <DashboardLayout
      title="Reagents Inventory"
      subtitle="Complete list of laboratory reagents with dynamic expiry status"
      actions={
        <Link
          href="/reagents/add"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Reagent</span>
        </Link>
      }
    >
      <div className="space-y-4">
        {/* Filter and Search Controls Bar */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reagents by name (e.g. Agar, Violet, Ethanol)..."
              className="block w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Dropdown & Refresh */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium border border-slate-300 rounded py-1.5 pl-2 pr-7 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              >
                <option value="ALL">All Statuses</option>
                <option value="GOOD">Good Only</option>
                <option value="EXPIRING_SOON">Expiring Soon Only</option>
                <option value="EXPIRED">Expired Only</option>
              </select>
            </div>

            <button
              onClick={fetchReagents}
              className="p-1.5 border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
              title="Refresh inventory"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reagents Table or Status views */}
        {isLoading ? (
          <LoadingState message="Filtering reagents list..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchReagents} />
        ) : reagents.length === 0 ? (
          <EmptyState
            title={searchQuery || statusFilter !== 'ALL' ? 'No matching reagents found' : 'No reagents added yet'}
            description={
              searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search terms or status filter to see other inventory records.'
                : 'Your laboratory inventory is currently empty. Add your first reagent.'
            }
            actionText="Add New Reagent"
            actionHref="/reagents/add"
          />
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-slate-500 flex items-center justify-between px-1">
              <span>
                Showing <strong className="text-slate-800 font-mono">{reagents.length}</strong> reagent{reagents.length === 1 ? '' : 's'}
              </span>
              <span className="text-[11px] text-slate-400">
                Sorted by {sortBy === 'expiryDate' ? 'Expiry Date' : sortBy} ({sortDir.toUpperCase()})
              </span>
            </div>

            <ReagentTable
              reagents={reagents}
              onDelete={handleDelete}
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={handleSort}
              showActions={true}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
