'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Register() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const router = useRouter();
  const handleRegister = async () => {
    const res = await fetch('/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email, password}) });
    const data = await res.json();
    if(data.success){ alert('Account ban gaya! Role: '+data.role); router.push('/login'); } else alert(data.error);
  };
  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-[#12121f] rounded-[24px] p-8">
        <h1 className="text-3xl font-bold text-center text-white">VELRYA AI</h1>
        <h2 className="text-center mt-2 mb-8 text-white opacity-70">Create Account</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3.5 mb-4 rounded-xl bg-[#1c1c2e] text-white outline-none"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3.5 mb-6 rounded-xl bg-[#1c1c2e] text-white outline-none"/>
        <button onClick={handleRegister} className="w-full p-3.5 rounded-full bg-white text-black font-bold">Sign Up</button>
        <div onClick={()=>router.push('/login')} className="text-center text-gray-400 mt-4 cursor-pointer">Already have account? Login</div>
      </div>
    </div>
  );
}
