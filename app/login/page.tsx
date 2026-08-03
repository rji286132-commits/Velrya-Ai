'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data));
      if (data.role === 'super_admin') router.push('/admin');
      else router.push('/chat');
    } else alert(data.error);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-2">VELRYA AI</h1>
      <h2 className="mb-6">Welcome back</h2>
      <input className="w-full max-w-sm p-3 mb-3 rounded bg-gray-900" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full max-w-sm p-3 mb-3 rounded bg-gray-900" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={handleLogin} className="w-full max-w-sm bg-white text-black p-3 rounded-full font-bold mb-3">Login</button>
      <button onClick={handleGoogle} className="w-full max-w-sm bg-gray-800 p-3 rounded-full mb-3">Continue with Google</button>
      <button onClick={()=>router.push('/register')} className="w-full max-w-sm border p-3 rounded-full">Create New Account - Sign Up</button>
    </div>
  );
}
