'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, Settings, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../../images/todo-image.png';

interface SidebarProps {
  userId: string;
}

export const Sidebar = ({ userId }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
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
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}
      >
        <div className="flex flex-row items-center gap-0 mb-8 px-2">
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
            className="w-full flex items-center justify-center p-3 bg-brand-lime text-brand-black font-bold rounded-xl hover:brightness-105 transition-all active:scale-95"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};