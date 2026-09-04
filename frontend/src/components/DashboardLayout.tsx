'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { api } from '@/lib/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [alertsCount, setAlertsCount] = useState(0);

  useEffect(() => {
    // Fetch count of active alerts for sidebar badge
    const fetchBadgeCount = async () => {
      try {
        const alerts = await api.getAlerts();
        setAlertsCount(alerts.length);
      } catch (err) {
        // Silently ignore or use fallback
      }
    };
    fetchBadgeCount();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        alertsCount={alertsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          actions={actions}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
