'use client';
import { useState } from 'react';
export default function Forgot() {
  const [email, setEmail] = useState('');
  const handle = async () => {
    const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email}) });
    const data = await res.json();
    alert(data.message || data.error);
  };
  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-[#12121f] rounded-[24px] p-8">
        <h1 className="text-2xl font-bold text-center text-white">Forgot Password</h1>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Apna Email dalo" className="w-full p-3.5 mt-6 mb-4 rounded-xl bg-[#1c1c2e] text-white outline-none"/>
        <button onClick={handle} className="w-full p-3.5 rounded-full bg-white text-black font-bold">Send Reset Link</button>
      </div>
    </div>
  );
}
