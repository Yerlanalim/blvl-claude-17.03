'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to BizLevel</h1>
            {/* Notifications, settings, etc. can be added here */}
          </div>
        </header>

        {/* Page Content */}
        <div className="rounded-lg bg-white p-6 shadow-sm">{children}</div>
      </main>
    </div>
  );
}
