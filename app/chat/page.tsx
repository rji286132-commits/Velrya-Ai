'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Email and password required');
      return;
    }
    const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).single();
    
    if (error || !data) {
      alert('Invalid email or password');
      return;
    }

    localStorage.setItem('user', JSON.stringify(data));
    
    if (data.role === 'super_admin') {
      router.push('/admin');
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="bg-[#12121a] p-8 rounded-2xl w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white text-center mb-6">VELRYA AI</h1>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded bg-black text-white mb-3" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded bg-black text-white mb-4" />
        <button onClick={handleLogin} className="w-full bg-white text-black p-3 rounded font-bold">Login</button>
      </div>
    </div>
  );
}
