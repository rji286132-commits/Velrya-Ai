'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setMessage(null);
    setError(null);
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message || 'If your email is registered, you will receive a reset link');
      } else {
        setError(data.error || 'Failed to send reset link');
      }
    } catch (e: any) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-[#12121f] rounded-2xl p-7 border border-gray-800">
        <h1 className="text-[28px] font-bold text-center text-white">VELRYA AI</h1>
        <h2 className="text-center mt-2 mb-6 text-gray-400 text-[15px]">Forgot Password</h2>

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

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleReset()}
          placeholder="Enter your email address"
          type="email"
          className="w-full p-3 mb-4 rounded-xl bg-[#1c1c2e] text-white border border-gray-700 text-[14px] outline-none focus:border-gray-500"
        />
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full p-3 rounded-full bg-white text-black font-bold mb-4 text-[14px] disabled:opacity-50"
        >
          {loading ? 'Sending Link...' : 'Send Reset Link'}
        </button>

        <div className="text-center text-gray-400 text-[13px]">
          Remember your password?{' '}
          <Link href="/login" className="text-white font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
