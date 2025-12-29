'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
}

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleSignOut = () => {
    logout();
  };

  // Function to get user's initials
  const getUserInitials = (name: string) => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part[0]).join('');
    return initials.substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 pl-16 md:pl-0">Settings</h1>
      </div>

      {/* Compact Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card - Spans 2 columns */}
        <div className="md:col-span-2 bg-gradient-to-r from-brand-black to-gray-900 rounded-3xl p-4 sm:p-6 text-white border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-brand-lime flex items-center justify-center text-brand-black text-xl font-bold">
              {userData ? getUserInitials(userData.name) : '?'}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-lg sm:text-xl font-bold">{userData?.name || 'User Name'}</h2>
              <p className="text-gray-300 mt-1 text-sm">{userData?.email || 'email@example.com'}</p>

              <div className="mt-2 flex flex-wrap gap-1 justify-center md:justify-start">
                <span className="bg-gray-800 px-2 py-1 rounded-full text-xs">User ID: {userData?.id || '0'}</span>
                <span className="bg-gray-800 px-2 py-1 rounded-full text-xs">Premium</span>
                <span className="bg-gray-800 px-2 py-1 rounded-full text-xs">Member since 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Card - Spans 1 column */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Appearance</h3>
          <div className="flex items-center justify-center md:justify-start">
            <div className="bg-brand-lime text-brand-black px-3 py-1 rounded-full text-sm font-medium">
              Theme: Modern Pastel
            </div>
          </div>
          {/* Adding a visual representation of the theme */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-center md:justify-start space-x-1">
              <div className="w-5 h-5 rounded-full bg-brand-lime"></div>
              <div className="w-5 h-5 rounded-full bg-brand-purple"></div>
              <div className="w-5 h-5 rounded-full bg-brand-pink"></div>
              <div className="w-5 h-5 rounded-full bg-brand-cyan"></div>
            </div>
          </div>
        </div>

        {/* About App Card - Spans 1 column */}
        <div className="bg-brand-purple/20 rounded-3xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">About App</h3>
          <p className="text-gray-800 text-sm">Todo App v2.0 - Hackathon Edition</p>
          <p className="text-gray-700 mt-1 text-xs">Built with Next.js, Tailwind CSS, and TypeScript</p>
          <div className="mt-2 flex flex-wrap gap-1 justify-center md:justify-start">
            <span className="bg-brand-purple/20 text-brand-purple px-2 py-1 rounded-full text-xs font-medium">
              v2.0
            </span>
            <span className="bg-brand-purple/20 text-brand-purple px-2 py-1 rounded-full text-xs font-medium">
              Hackathon
            </span>
          </div>
        </div>

        {/* Danger Zone Card - Spans 2 columns */}
        <div className="md:col-span-2 bg-red-50 rounded-3xl p-4 sm:p-6 border border-red-100">
          <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-4">Danger Zone</h3>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-red-700 text-sm">Sign out of your account</p>
              <p className="text-red-600 text-xs mt-1">You will need to log back in to access your account</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm w-full md:w-auto"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;