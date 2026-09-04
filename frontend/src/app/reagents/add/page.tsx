'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { ReagentFormData } from '@/types';
import { 
  FlaskConical, 
  Calendar, 
  Scale, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import Link from 'next/link';

const COMMON_LAB_UNITS = ['g', 'mg', 'kg', 'mL', 'L', 'vials', 'bottles', 'plates', 'tests'];

export default function AddReagentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ReagentFormData>({
    name: '',
    quantity: '',
    unit: 'g',
    expiryDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dynamic preview calculation based on input date
  const getCalculatedPreview = () => {
    if (!formData.expiryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(formData.expiryDate);
    exp.setHours(0, 0, 0, 0);

    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: 'EXPIRED',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
        text: `Expired ${Math.abs(diffDays)} day(s) ago`,
      };
    } else if (diffDays <= 7) {
      return {
        status: 'EXPIRING_SOON',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        text: diffDays === 0 ? 'Expires today' : `Expiring soon in ${diffDays} day(s)`,
      };
    } else {
      return {
        status: 'GOOD',
        badgeClass: 'bg-green-50 text-green-800 border-green-200',
        text: `Good condition (${diffDays} days remaining)`,
      };
    }
  };

  const preview = getCalculatedPreview();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Reagent name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Reagent name must be at least 2 characters.';
    }

    if (!formData.quantity) {
      errs.quantity = 'Quantity is required.';
    } else if (Number(formData.quantity) <= 0) {
      errs.quantity = 'Quantity must be greater than zero.';
    }

    if (!formData.unit.trim()) {
      errs.unit = 'Unit of measurement is required.';
    }

    if (!formData.expiryDate) {
      errs.expiryDate = 'Expiry date is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await api.createReagent(formData);
      setSuccessMessage('Reagent successfully registered into laboratory inventory!');
      setTimeout(() => {
        router.push('/reagents');
      }, 900);
    } catch (err: any) {
      console.error('Failed to create reagent:', err);
      setServerError(err?.message || 'Failed to record reagent. Please check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Add Reagent"
      subtitle="Register a new microbiology reagent and set reference inventory quantity"
      actions={
        <Link
          href="/reagents"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-subtle"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Inventory</span>
        </Link>
      }
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-slate-200 rounded shadow-card p-6 sm:p-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-sky-600" />
              <span>New Reagent Entry</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide the reagent details and expiry date. The system dynamically computes its safety threshold status.
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-3.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 rounded bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Reagent Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Reagent Name <span className="text-rose-600">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Nutrient Agar, Gram Crystal Violet, MacConkey Agar"
                className={`block w-full px-3 py-2 text-xs sm:text-sm border rounded bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.name
                    ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-slate-300 focus:ring-slate-900 focus:border-slate-900'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Quantity and Unit in 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Reference Quantity <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="quantity"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 500"
                    className={`block w-full px-3 py-2 text-xs sm:text-sm border rounded bg-white text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-1 ${
                      errors.quantity
                        ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                        : 'border-slate-300 focus:ring-slate-900 focus:border-slate-900'
                    }`}
                  />
                </div>
                {errors.quantity && (
                  <p className="text-xs text-rose-600 mt-1">{errors.quantity}</p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Initial quantity on record.
                </p>
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Unit of Measurement <span className="text-rose-600">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="unit"
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. g, mL, vials"
                    className={`block w-full px-3 py-2 text-xs sm:text-sm border rounded bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                      errors.unit
                        ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                        : 'border-slate-300 focus:ring-slate-900 focus:border-slate-900'
                    }`}
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {COMMON_LAB_UNITS.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setFormData({ ...formData, unit: u })}
                      className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                        formData.unit === u
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
                {errors.unit && (
                  <p className="text-xs text-rose-600 mt-1">{errors.unit}</p>
                )}
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <label
                htmlFor="expiryDate"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Expiry Date <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className={`block w-full px-3 py-2 text-xs sm:text-sm border rounded bg-white text-slate-900 font-mono focus:outline-none focus:ring-1 ${
                    errors.expiryDate
                      ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-slate-900 focus:border-slate-900'
                  }`}
                />
              </div>
              {errors.expiryDate && (
                <p className="text-xs text-rose-600 mt-1">{errors.expiryDate}</p>
              )}

              {/* Dynamic status preview based on date input */}
              {preview && (
                <div className="mt-3 p-3 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Calculated System Status:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${preview.badgeClass}`}>
                    {preview.text}
                  </span>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/reagents"
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors disabled:opacity-60 flex items-center gap-2 shadow-subtle"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <span>Save Reagent Record</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
