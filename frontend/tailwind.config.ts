import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Standard indigo color palette
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Standard slate color palette
        slate: {
          50: '#f8fafc',   // Default background color
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',   // Heading text color
          900: '#0f172a',   // Body text color
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',  // Indigo-600 as primary
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        background: {
          DEFAULT: '#f8fafc',  // slate-50 as background
        },
        card: {
          DEFAULT: '#ffffff',  // White for cards
        },
        text: {
          heading: '#1e293b',   // slate-800 for headings
          body: '#64748b',      // slate-500 for body text
        },
        status: {
          completed: '#22c55e',  // green-500 for completed tasks
          pending: '#f59e0b',    // amber-500 for pending tasks
          error: '#ef4444',      // red-500 for errors/delete
        },
        // Brand colors for "Modern Pastel & Dark" theme
        'brand-black': '#111111',       // For Sidebar & Headings
        'brand-lime': '#D4E76C',        // For Primary Buttons & Active States
        'brand-purple': '#B9B0E4',      // For Tags & Accents
        'brand-bg': '#F3F3F1',          // Light Gray App Background
        'brand-card': '#FFFFFF',        // White Cards
        'brand-gray': '#8E8E93',        // For Secondary Text
      },
    },
  },
  plugins: [],
};
export default config;