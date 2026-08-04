"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e:any)=>{
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) alert(error.message);
    else router.push("/chat");
    setLoading(false);
  }

  const handleGoogle = async ()=>{
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback` }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
      <form onSubmit={handleLogin} className="bg-white/5 p-8 rounded-2xl w-[90%] max-w-md border border-white/10">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>
        <input className="w-full p-3 mb-4 rounded bg-black/50 border border-white/10" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full p-3 mb-4 rounded bg-black/50 border border-white/10" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full bg-violet-600 p-3 rounded font-bold">{loading?"Logging in...":"Login"}</button>
        <button type="button" onClick={handleGoogle} className="w-full mt-3 bg-white text-black p-3 rounded font-bold">Continue with Google</button>
        <p className="text-center mt-4 text-sm">No account? <Link href="/register" className="text-violet-400">Register</Link></p>
      </form>
    </div>
  )
}
