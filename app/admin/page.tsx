'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is admin
    const userStr = localStorage.getItem('velrya_user') || localStorage.getItem('user');
    
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'super_admin') {
        router.push('/login');
        return;
      }
    } catch {
      router.push('/login');
      return;
    }

    // Fetch all users
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setUsers(data);
          const admins = data.filter((u: any) => u.role === 'super_admin');
          setStats({
            totalUsers: data.length,
            totalAdmins: admins.length,
          });
        }
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('velrya_user');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080f] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold">👑 VELRYA AI</Link>
        <div className="flex items-center gap-4">
          <Link href="/chat" className="text-gray-400 hover:text-white">
            ← Chat
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#12121f] rounded-2xl p-6 border border-gray-800">
            <div className="text-gray-400 text-sm">Total Users</div>
            <div className="text-3xl font-bold mt-2">{stats.totalUsers}</div>
          </div>
          <div className="bg-[#12121f] rounded-2xl p-6 border border-gray-800">
            <div className="text-gray-400 text-sm">Super Admins</div>
            <div className="text-3xl font-bold mt-2 text-yellow-400">{stats.totalAdmins}</div>
          </div>
          <div className="bg-[#12121f] rounded-2xl p-6 border border-gray-800">
            <div className="text-gray-400 text-sm">Regular Users</div>
            <div className="text-3xl font-bold mt-2">{stats.totalUsers - stats.totalAdmins}</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#12121f] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                  <th className="p-4">#</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition"
                    >
                      <td className="p-4 text-gray-400">{index + 1}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === 'super_admin'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
