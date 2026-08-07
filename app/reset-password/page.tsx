'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleResetPassword = async () => {
    setError(null);
    setMessage(null);

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        });

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
      }

      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (e: any) {
      setError(e.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-[#12121f] rounded-2xl p-7 border border-gray-800">
        <h1 className="text-[28px] font-bold text-center text-white">VELRYA AI</h1>
        <h2 className="text-center mt-2 mb-6 text-gray-400 text-[15px]">Reset Password</h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-[13px]">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-[13px]">
            {message}
          </div>
        )}

        <div className="relative mb-4">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? 'text' : 'password'}
            placeholder="New Password"
            className="w-full p-3 pr-20 rounded-xl bg-[#1c1c2e] text-white border border-gray-700 text-[14px] outline-none focus:border-gray-500"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 top-2 bottom-2 px-4 bg-[#2a2a40] rounded-lg text-[12px] font-bold text-white"
          >
            {show ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type={show ? 'text' : 'password'}
          placeholder="Confirm New Password"
          className="w-full p-3 mb-4 rounded-xl bg-[#1c1c2e] text-white border border-gray-700 text-[14px] outline-none focus:border-gray-500"
        />

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full p-3 rounded-full bg-white text-black font-bold mb-4 text-[14px] disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>

        <div className="text-center text-gray-400 text-[13px]">
          <Link href="/login" className="text-white font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
