'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Redirect will happen via useEffect
  }

  return (
    <div className="flex h-screen overflow-hidden flex-row bg-brand-bg">
      <Sidebar userId={user.id.toString()} />
      <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 relative scroll-smooth">
        {children}
      </div>
    </div>
  );
}