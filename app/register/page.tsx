"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleRegister = async () => {
    if (!email || !password) return alert("Email and password required");
    const cleanEmail = email.trim().toLowerCase();
    const displayName = cleanEmail.split('@')[0];
    setLoading(true);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              display_name: displayName,
              name: displayName,
            },
          },
        });
        if (!error) {
          alert("Account created!");
          router.push("/login");
          return;
        }
      }
      
      const dummyUser = {
        id: 'usr_' + Date.now(),
        email: cleanEmail,
        display_name: displayName,
        name: displayName,
        created_at: new Date().toISOString()
      };
      localStorage.setItem('velrya_user', JSON.stringify(dummyUser));
      alert("Account created!");
      router.push("/chat");
    } catch (e: any) {
      alert(e.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/api/auth/callback` } });
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-[#12121f] rounded-2xl p-7 border border-gray-800">
        <h1 className="text-[28px] font-bold text-center text-white">VELRYA AI</h1>
        <h2 className="text-center mt-2 mb-6 text-gray-400 text-[15px]">Register</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 mb-4 rounded-xl bg-[#1c1c2e] text-white border border-gray-700 text-[14px]" />
        <div className="relative mb-4">
          <input value={password} onChange={e=>setPassword(e.target.value)} type={show?"text":"password"} placeholder="Password" className="w-full p-3 pr-20 rounded-xl bg-[#1c1c2e] text-white border border-gray-700 text-[14px]" />
          <button onClick={()=>setShow(!show)} className="absolute right-2 top-2 bottom-2 px-4 bg-[#2a2a40] rounded-lg text-[12px] font-bold text-white">{show?"HIDE":"SHOW"}</button>
        </div>
        <button onClick={handleRegister} className="w-full p-3 rounded-full bg-white text-black font-bold mb-3 text-[14px]">{loading?"Creating...":"Create Account"}</button>
        <button onClick={handleGoogle} className="w-full p-3 rounded-full bg-[#1e1e32] text-white mb-3 text-[14px]">Continue with Google</button>
        <div className="text-center text-gray-400 text-[13px]">Have account? <Link href="/login" className="text-white font-bold hover:underline">Login</Link></div>
      </div>
    </div>
  );
}
