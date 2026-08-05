'use client';

import Link from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@/types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  loading?: boolean;
}

export default function Navbar({ user, onLogout, loading = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0a0a0f] border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tight text-white">
          ✨ VELRYA AI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 items-center">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#1e1e2e]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-300 max-w-[200px] truncate">
                  {user.email}
                </span>
              </div>
              <button
                onClick={onLogout}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 hover:bg-red-500/10 transition text-red-400 disabled:opacity-50"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 transition text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#12121f] border-t border-gray-800 px-4 py-4 space-y-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#1e1e2e]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-300 truncate">
                  {user.email}
                </span>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-red-500/30 hover:bg-red-500/10 transition text-red-400 disabled:opacity-50"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block w-full px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 transition text-center text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block w-full px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition text-center text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}