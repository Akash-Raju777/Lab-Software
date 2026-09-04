'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  User, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  Building2,
  Mail,
  UserCheck,
  Lock
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { UserProfile } from '@/types';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Load current user profile from Spring Boot Backend
  useEffect(() => {
    async function loadUserProfile() {
      setIsProfileLoading(true);
      try {
        const identifier = user?.email || 'admin@labtrack.com';
        const profile: UserProfile = await api.getProfile(identifier);
        if (profile) {
          setUsername(profile.username || 'admin');
          setEmail(profile.email || user?.email || 'admin@labtrack.com');
          setFullName(profile.fullName || user?.name || 'Dr. Sarah Mitchell');
          setDepartment(profile.department || 'Clinical Microbiology & Serology');
          setRole(profile.role || user?.role || 'ADMIN');
        }
      } catch (err: any) {
        console.error('Failed to load profile from backend:', err);
        // Fallback to local session
        if (user) {
          setUsername(user.username || user.email.split('@')[0]);
          setEmail(user.email);
          setFullName(user.name);
          setRole(user.role);
          setDepartment(user.department || 'Clinical Microbiology');
        }
      } finally {
        setIsProfileLoading(false);
      }
    }

    loadUserProfile();
  }, [user]);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!username.trim() || !email.trim() || !fullName.trim()) {
      setProfileError('Username, full name, and email are mandatory fields.');
      return;
    }

    setIsProfileSaving(true);
    try {
      const identifier = user?.email || email;
      const updated = await api.updateProfile(
        {
          username: username.trim(),
          email: email.trim(),
          fullName: fullName.trim(),
          department: department.trim(),
        },
        identifier
      );

      setProfileSuccess('Profile settings successfully saved and updated.');
      
      // Update global auth context session
      updateUser({
        name: updated.fullName,
        email: updated.email,
        username: updated.username,
        department: updated.department,
      });

      setTimeout(() => setProfileSuccess(null), 5000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile settings.');
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsPasswordSaving(true);
    try {
      const identifier = user?.email || email;
      await api.changePassword(
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        identifier
      );

      setPasswordSuccess('Password successfully changed. You can now use your new password.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 6000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password. Please verify current password.');
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <DashboardLayout title="Laboratory Settings">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header Title Section */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <User className="w-5 h-5 text-sky-600" />
              Laboratory Settings & Credentials
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure user account details, laboratory bench profile, and authentication credentials.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-t border-slate-100 mt-6 pt-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'profile'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              Staff Profile
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'security'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>

        {/* TAB 1: STAFF PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-600" />
                Staff Member Profile & Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your staff identification, username, and laboratory department assignment.
              </p>
            </div>

            {profileSuccess && (
              <div className="mb-6 p-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-6 p-4 rounded-md bg-rose-50 border border-rose-200 flex items-center gap-3 text-sm text-rose-800">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {isProfileLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600 mb-2" />
                <span className="text-xs font-medium">Loading user settings...</span>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin or dr_mitchell"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-900 font-medium"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Unique handle used for login and bench audit logs.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name & Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Priyadharshini, Ph.D."
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-900 font-medium"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Displayed on reagent audit trails and inventory signatures.
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Laboratory Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@labtrack.com"
                        className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-900 font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Primary contact for laboratory inventory alerts.
                    </p>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Department / Laboratory Section
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Clinical Microbiology & Quality Control"
                        className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-900 font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      e.g., Bacteriology, Mycology, Parasitology, Media Prep.
                    </p>
                  </div>
                </div>

                {/* Role Badge (Read Only) */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Assigned System Role
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wide">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                      {role}
                    </span>
                    <span className="text-xs text-slate-400">
                      Full administrative authorization for reagent disposal, edits, and system configuration.
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                <div className="border-t border-slate-100 pt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={isProfileSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
                  >
                    {isProfileSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Save Profile Settings
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: CHANGE PASSWORD */}
        {activeTab === 'security' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-sky-600" />
                Change Password & Authentication Credentials
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your laboratory account password. Must be at least 6 characters.
              </p>
            </div>

            {passwordSuccess && (
              <div className="mb-6 p-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-6 p-4 rounded-md bg-rose-50 border border-rose-200 flex items-center gap-3 text-sm text-rose-800">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-xl">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password (default: labpassword123)"
                    className="w-full pl-3.5 pr-10 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-3.5 pr-10 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ensure password is secure and not easily guessed by unauthorized bench staff.
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-900 font-medium"
                />
              </div>

              {/* Action Button */}
              <div className="border-t border-slate-100 pt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={isPasswordSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
                >
                  {isPasswordSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
