// frontend/src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/api";
import logo from "../../images/todo-image.png"

export default function LoginPage(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Login via our API
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });

      // Extract token from response
      const { access_token } = response.data;

      // Use the auth context to login the user
      login(access_token);
    } catch (err: any) {
      console.error("Email sign-in error:", err);
      setError(err.response?.data?.detail || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-brand-black to-gray-900 text-brand-lime items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,231,108,0.1)_0%,rgba(0,0,0,0)_70%)]"></div>
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-brand-lime/10 blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-indigo-500/10 blur-2xl"></div>

        {/* Content with glass card effect */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center ">
          <div>
            <Image
              src={logo}
              alt="Todo App Logo"
              width={120}
              height={120}
              className="object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-white mb-4">Todo App</h1>
          <p className="text-xl text-gray-400 font-light tracking-wide">Stay organized with style</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-brand-bg">
        <div className="bg-brand-card p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-brand-black mb-6">
            Sign in to your account
          </h1>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-brand-black mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border-0 p-4 rounded-2xl focus:ring-2 focus:ring-brand-lime"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-brand-black mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border-0 p-4 rounded-2xl focus:ring-2 focus:ring-brand-lime"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-lime text-brand-black font-bold px-6 py-3 rounded-full shadow-sm hover:brightness-105 transition-all active:scale-95"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/signup"
              className="text-brand-lime hover:text-brand-purple text-sm font-medium"
            >
              Don't have an account? Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
