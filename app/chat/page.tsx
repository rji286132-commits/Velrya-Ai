'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Email and password required');
      return;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();
    
    if (error || !data) {
      alert('Invalid email or password - Supabase me check karo user hai ya nahi');
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
      <div className="bg-[#12121a] border border-gray-800 p-8 rounded-2xl w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white text-center">VELRYA AI</h1>
        <p className="text-center text-gray-500 mt-2 mb-6">Login</p>
        
        <input 
          value={email} 
          onChange={(e)=>setEmail(e.target.value)} 
          placeholder="Email" 
          className="w-full p-3.5 rounded-xl bg-[#1e2d] border border-gray-700 text-white mb-3 outline-none" 
        />
        <div className="relative mb-4">
          <input 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
            type="password" 
            placeholder="Password" 
            className="w-full p-3.5 rounded-xl bg-[#1e1e2d] border border-gray-700 text-white outline-none" 
          />
        </div>
        
        <button onClick={handleLogin} className="w-full bg-white text-black p-3.5 rounded-full font-bold">
          Login
        </button>

        <button className="w-full bg-[#1e1e2d] text-white p-3.5 rounded-full font-medium mt-3 border border-gray-700">
          Continue with Google
        </button>

        <p className="text-center text-gray-500 mt-4 text-sm">
          No account? <span onClick={()=>router.push('/register')} className="text-white font-bold cursor-pointer">Register</span>
        </p>
      </div>
    </div>
  );
}
