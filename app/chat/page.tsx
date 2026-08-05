'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Chat() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem('user')||'{}');
    if(!u.email) router.push('/login');
  },[]);

  return (
    <div className="min-h-screen bg-[#08080f] text-white p-8">
      <h1 className="text-3xl font-bold">Velrya AI - Chat</h1>
      <p className="mt-4 text-gray-400">Chat page is working now!</p>
    </div>
  )
}
