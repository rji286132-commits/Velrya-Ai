'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [show, setShow] = useState(false);
  const router = useRouter();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email, password}) });
    const data = await res.json();
    if(data.success){ localStorage.setItem('user', JSON.stringify(data)); if(data.role==='super_admin') router.push('/admin'); else router.push('/chat'); } else alert(data.error);
  };
  const handleGoogle = async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } }); };
  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-[#12121f] rounded-[24px] p-8">
        <h1 className="text-3xl font-bold text-center text-white">VELRYA AI</h1>
        <h2 className="text-center mt-2 mb-8 text-white opacity-70">Welcome back</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3.5 mb-4 rounded-xl bg-[#1c1c2e] text-white outline-none"/>
        <div className="relative mb-2"><input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} placeholder="Password" className="w-full p-3.5 pr-20 rounded-xl bg-[#1c1c2e] text-white outline-none"/><button onClick={()=>setShow(!show)} className="absolute right-2 top-2 bottom-2 px-4 bg-[#2a2a40] rounded-lg text-sm font-bold text-white">{show?'HIDE':'SHOW'}</button></div>
        <div onClick={()=>router.push('/forgot-password')} className="text-right text-sm text-gray-400 mb-6 cursor-pointer">Forgot Password?</div>
        <button onClick={handleLogin} className="w-full p-3.5 rounded-full bg-white text-black font-bold mb-3">Login</button>
        <button onClick={handleGoogle} className="w-full p-3.5 rounded-full bg-[#1e1e32] text-white mb-3">Continue with Google</button>
        <button onClick={()=>router.push('/register')} className="w-full p-3.5 rounded-full border border-[#333] text-white">Create New Account - Sign Up</button>
      </div>
    </div>
  );
}
