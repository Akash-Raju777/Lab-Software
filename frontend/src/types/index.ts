export type ReagentStatus = 'GOOD' | 'EXPIRING_SOON' | 'EXPIRED';

export interface Reagent {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string; // ISO format YYYY-MM-DD
  createdAt?: string;
  status: ReagentStatus;
  statusDisplayName?: string;
  daysUntilExpiry: number;
  statusMessage?: string;
}

export interface ReagentFormData {
  name: string;
  quantity: number | string;
  unit: string;
  expiryDate: string;
}

export interface InventorySummary {
  totalReagents: number;
  goodCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  calculationDate: string;
  thresholdDays: number;
}

export interface AlertItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  status: ReagentStatus;
  daysDifference: number;
  alertMessage: string;
}

export interface User {
  token: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF';
  username?: string;
  department?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'STAFF';
  department: string;
  expiryThresholdDays: number;
  enableEmailAlerts: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  username: string;
  email: string;
  fullName: string;
  department?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LabSettingsData {
  expiryThresholdDays: number;
  enableEmailAlerts: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

