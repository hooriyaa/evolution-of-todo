'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, Settings, Calendar, BarChart2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../../images/todo-image.png';

interface SidebarProps {
  userId: string;
}

export const Sidebar = ({ userId }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isLoggingOut } = useAuth();
  const pathname = usePathname(); // To determine active link

  const handleLogout = () => {
    logout();
  };

  // Function to check if a link is active
  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-brand-lime text-brand-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 h-screen bg-gradient-to-b from-gray-900 to-black text-gray-400 p-6 rounded-r-3xl border-r border-white/10 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 max-w-xs md:w-64`}
      >
        <div className="flex md:hidden justify-between items-center mb-8">
          <div className="flex flex-row items-center gap-2">
            <Image src={logo} width={40} height={40} alt="Logo" />
            <h1 className="text-lg font-bold text-white tracking-tight">Todo App</h1>
          </div>
        </div>
        <div className="hidden md:flex flex-row items-center gap-2 mb-8">
          <Image src={logo} width={60} height={60} alt="Logo" />
          <h1 className="text-xl font-bold text-white tracking-tight">Todo App</h1>
        </div>

        <nav>
          <ul>
            <li className="mb-2 relative">
              <Link
                href={`/dashboard`}
                className={`flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out hover:pl-4 ${
                  isActiveLink('/dashboard')
                    ? 'bg-white/10 backdrop-blur-md text-white font-bold'
                    : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                {isActiveLink('/dashboard') && (
                  <span className="absolute left-1 w-1 h-8 bg-brand-lime rounded-full"></span>
                )}
                <LayoutDashboard size={20} className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="mb-2 relative">
              <Link
                href="/analytics"
                className={`flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out hover:pl-4 ${
                  isActiveLink('/analytics')
                    ? 'bg-white/10 backdrop-blur-md text-white font-bold'
                    : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                {isActiveLink('/analytics') && (
                  <span className="absolute left-1 w-1 h-8 bg-brand-lime rounded-full"></span>
                )}
                <BarChart2 size={20} className="w-5 h-5 mr-3" />
                <span>Analytics</span>
              </Link>
            </li>
            <li className="mb-2 relative">
              <Link
                href="/schedule"
                className={`flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out hover:pl-4 ${
                  isActiveLink('/schedule')
                    ? 'bg-white/10 backdrop-blur-md text-white font-bold'
                    : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                {isActiveLink('/schedule') && (
                  <span className="absolute left-1 w-1 h-8 bg-brand-lime rounded-full"></span>
                )}
                <Calendar size={20} className="w-5 h-5 mr-3" />
                <span>Schedule</span>
              </Link>
            </li>
            <li className="mb-2 relative">
              <Link
                href="/settings"
                className={`flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out hover:pl-4 ${
                  isActiveLink('/settings')
                    ? 'bg-white/10 backdrop-blur-md text-white font-bold'
                    : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                {isActiveLink('/settings') && (
                  <span className="absolute left-1 w-1 h-8 bg-brand-lime rounded-full"></span>
                )}
                <Settings size={20} className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center justify-center p-3 font-bold rounded-xl transition-all active:scale-95 ${
              isLoggingOut
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-brand-lime text-brand-black hover:brightness-105'
            }`}
          >
            {isLoggingOut ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging Out...
              </div>
            ) : (
              <>
                <LogOut className="w-5 h-5 mr-2" />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};