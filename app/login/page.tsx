"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const router = useRouter();

  const handleLogin = async (e:any)=>{
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) alert(error.message);
    else router.push("/chat");
  }

  const handleGoogle = async ()=>{
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white p-4">
      <form onSubmit={handleLogin} className="bg-white/5 p-8 rounded-2xl w-full max-w-md border border-white/10">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>
        <input className="w-full p-3 mb-4 rounded bg-black/50 border border-white/10" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full p-3 mb-4 rounded bg-black/50 border border-white/10" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="w-full bg-violet-600 p-3 rounded font-bold">Login</button>
        <button type="button" onClick={handleGoogle} className="w-full mt-3 bg-white text-black p-3 rounded font-bold">Continue with Google</button>
        <p className="text-center mt-4 text-sm">No account? <Link href="/register" className="text-violet-400">Register</Link></p>
      </form>
    </div>
  )
}
