'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function Page() {
  const [stats, setStats] = useState({
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('velrya_user') || localStorage.getItem('user');

    if (!userStr) {
      router.push('/login');
      return;
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    );


    supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .then(({ count }) => {
        if (count!== null && count!== undefined) {
          setStats({ totalUsers: count });
        }
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('velrya_user');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-[#08080f] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#08080f] text-white">
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold">Velrya AI</Link>
        <div className="flex items-center gap-4">
          <Link href="/chat" className="text-gray-400 hover:text-white">← Chat</Link>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-sm text-gray-400">{new Date().toLocaleDateString()}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#12121f] rounded-2xl p-6 border border-gray-800">
            <div className="text-gray-400 text-sm">Total Users</div>
            <div className="text-3xl font-bold mt-2">{stats.totalUsers}</div>
          </div>
          <div className="bg-[#12121f] rounded-2xl p-6 border border-gray-800">
            <div className="text-gray-400 text-sm">Status</div>
            <div className="text-xl font-bold mt-2 text-green-400">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
