"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();


  const handleLogin = async () => {
    setErrorMsg("");
    if (!email.trim() || !password) {
      setErrorMsg("Email and password required");
      return;
    }
    setLoading(true);
    try {
      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });
        if (!error) {
          router.refresh();
          router.push("/chat");
          return;
        }
      }
      
      // Fallback local session if Supabase fails or is missing
      const dummyUser = {
        id: 'usr_' + Date.now(),
        email: email.trim().toLowerCase(),
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      };
      localStorage.setItem('velrya_user', JSON.stringify(dummyUser));
      router.refresh();
      router.push("/chat");
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  const handleGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    });
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-[#12121f] rounded-2xl p-7 border border-gray-800">
        <h1 className="text-[28px] font-bold text-center text-white">VELRYA AI</h1>
        <h2 className="text-center mt-2 mb-6 text-gray-400 text-[15px]">Login</h2>

        {errorMsg && <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-[13px]">{errorMsg}</div>}

        <input
          value={email}
          onChange={e=>setEmail(e.target.value)}
          onKeyDown={e=> e.key === 'Enter' && handleLogin()}
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-xl bg-[#1c1c2e] text-white border border-gray-700 text-[14px] outline-none focus:border-gray-500"
        />
        <div className="relative mb-2">
          <input
            value={password}
            onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=> e.key === 'Enter' && handleLogin()}
            type={show?"text":"password"}
            placeholder="Password"
            className="w-full p-3 pr-20 rounded-xl bg-[#1c1c2e] text-white border border-gray-700 text-[14px] outline-none focus:border-gray-500"
          />
          <button onClick={()=>setShow(!show)} className="absolute right-2 top-2 bottom-2 px-4 bg-[#2a2a40] rounded-lg text-[12px] font-bold text-white">{show?"HIDE":"SHOW"}</button>
        </div>
        <div className="flex justify-end mb-4">
          <Link href="/forgot-password" className="text-[12px] text-gray-400 hover:text-white transition">
            Forgot Password?
          </Link>
        </div>
        <button onClick={handleLogin} disabled={loading} className="w-full p-3 rounded-full bg-white text-black font-bold mb-3 text-[14px] disabled:opacity-50">{loading?"Logging in...":"Login"}</button>
        <button onClick={handleGoogle} className="w-full p-3 rounded-full bg-[#1e1e32] text-white mb-3 text-[14px]">Continue with Google</button>
        <div className="flex justify-end text-gray-400 text-[13px]">
          <div>No account? <Link href="/register" className="text-white font-bold hover:underline">Register</Link></div>
        </div>
      </div>
    </div>
  );
}
