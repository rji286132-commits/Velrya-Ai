'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Chat() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    if (!u.email) {
      router.push('/login');
    } else {
      setUser(u);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen bg-[#08080f] text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#08080f] text-white p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Velrya AI - Chat</h1>
        <button onClick={logout} className="bg-white text-black px-4 py-2 rounded">Logout</button>
      </div>
      <p className="mt-4 text-gray-400">Welcome {user.email} - Chat is working now!</p>

      <div className="mt-8 border border-gray-700 rounded p-4">
        <p>Yahan tumhara AI chat ka code ayega</p>
      </div>
    </div>
  );
}
