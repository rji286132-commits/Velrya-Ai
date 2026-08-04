"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async () => {
    if (!email ||!password) {
      alert("Email and password required");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      // alert ke baad router.push fail hota hai, isiliye direct redirect
      window.location.href = "/";
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-[#12121f] rounded-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-center text-white">VELRYA AI</h1>
        <h2 className="text-center mt-2 mb-6 text-gray-400">Login</h2>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3.5 mb-4 rounded-xl bg-[#1c1c2e] text-white border border-gray-700 outline-none" />
        <div className="relative mb-4">
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type={show?"text":"password"} placeholder="Password" className="w-full p-3.5 pr-20 rounded-xl bg-[#1c1c2e] text-white border border-gray-700 outline-none" />
          <button onClick={()=>setShow(!show)} className="absolute right-2 top-2 bottom-2 px-4 bg-[#2a2a40] rounded-lg text-sm font-bold text-white">{show?"HIDE":"SHOW"}</button>
        </div>
        <button onClick={handleLogin} disabled={loading} className="w-full p-3.5 rounded-full bg-white text-black font-bold mb-3">{loading?"Logging in...":"Login"}</button>
        <button onClick={handleGoogle} className="w-full p-3.5 rounded-full bg-[#1e1e32] text-white mb-3">Continue with Google</button>
        <div className="text-center text-gray-400 text-sm">No account? <Link href="/register" className="text-white hover:underline">Sign Up</Link></div>
      </div>
    </div>
  );
}
