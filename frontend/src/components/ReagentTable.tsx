'use client';

import React, { useState } from 'react';
import { Reagent } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2, Eye, Calendar, FlaskConical, Clock, X } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

interface ReagentTableProps {
  reagents: Reagent[];
  onDelete?: (id: number) => Promise<void>;
  isLoading?: boolean;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  showActions?: boolean;
}

export const ReagentTable: React.FC<ReagentTableProps> = ({
  reagents,
  onDelete,
  isLoading = false,
  sortBy = 'expiryDate',
  sortDir = 'asc',
  onSort,
  showActions = true,
}) => {
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteId || !onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(deleteId);
      setDeleteId(null);
    } catch (e) {
      console.error('Delete failed', e);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderSortIcon = (field: string) => {
    if (!onSort) return null;
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-sky-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-sky-600" />
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th
                  scope="col"
                  className={`py-3 px-4 sm:px-5 ${
                    onSort ? 'cursor-pointer hover:bg-slate-100 select-none group' : ''
                  }`}
                  onClick={() => onSort && onSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Reagent Name</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th
                  scope="col"
                  className={`py-3 px-4 ${
                    onSort ? 'cursor-pointer hover:bg-slate-100 select-none group' : ''
                  }`}
                  onClick={() => onSort && onSort('quantity')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Quantity</span>
                    {renderSortIcon('quantity')}
                  </div>
                </th>
                <th scope="col" className="py-3 px-4">
                  Unit
                </th>
                <th
                  scope="col"
                  className={`py-3 px-4 sm:px-5 ${
                    onSort ? 'cursor-pointer hover:bg-slate-100 select-none group' : ''
                  }`}
                  onClick={() => onSort && onSort('expiryDate')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Expiry Date</span>
                    {renderSortIcon('expiryDate')}
                  </div>
                </th>
                <th scope="col" className="py-3 px-4">
                  Status
                </th>
                {showActions && (
                  <th scope="col" className="py-3 px-4 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {reagents.map((reagent) => (
                <tr
                  key={reagent.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3 px-4 sm:px-5 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-xs sm:max-w-md">{reagent.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {reagent.quantity}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {reagent.unit}
                  </td>
                  <td className="py-3 px-4 sm:px-5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-800 font-mono text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(reagent.expiryDate)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={reagent.status} />
                  </td>
                  {showActions && (
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedReagent(reagent)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          title="View Reagent Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => setDeleteId(reagent.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Reagent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reagent Details Modal */}
      {selectedReagent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-none animate-in fade-in duration-100">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-md w-full p-5 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Reagent Information</h3>
              </div>
              <button
                onClick={() => setSelectedReagent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Reagent Name:</span>
                <span className="font-semibold text-slate-900 text-right">{selectedReagent.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Initial / Reference Quantity:</span>
                <span className="font-mono font-medium text-slate-900">
                  {selectedReagent.quantity} {selectedReagent.unit}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Expiry Date:</span>
                <span className="font-mono font-medium text-slate-900">
                  {formatDate(selectedReagent.expiryDate)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 items-center">
                <span className="text-slate-500 font-medium">Current Expiry Status:</span>
                <StatusBadge status={selectedReagent.status} />
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Expiry Calculation:</span>
                <span className="font-medium text-slate-800">{selectedReagent.statusMessage || 'Calculated dynamically'}</span>
              </div>
              {selectedReagent.createdAt && (
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Registered On:</span>
                  <span className="text-slate-600">{new Date(selectedReagent.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReagent(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Remove Reagent from Inventory"
        message="Are you sure you want to delete this reagent record? This action cannot be undone."
        confirmText="Delete Reagent"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
};
