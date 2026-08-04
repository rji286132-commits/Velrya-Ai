"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push("/chat");
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-[#070711] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-[#13132b]/90 backdrop-blur rounded-[28px] p-8 border border-white/10">
        <h1 className="text-[34px] font-extrabold text-center text-white tracking-wide">VELRYA AI</h1>
        <p className="text-center mt-1 mb-8 text-[#9a9ac0] text-[15px]">Login</p>

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full h-[56px] px-5 mb-4 rounded-2xl bg-[#1f1f45]/80 border border-[#2a2a60] text-white placeholder:text-[#6b6b9a] outline-none focus:border-violet-500" />

        <div className="relative mb-7">
          <input value={password} onChange={e=>setPassword(e.target.value)} type={show?"text":"password"} placeholder="Password" className="w-full h-[56px] px-5 pr-24 rounded-2xl bg-[#1f1f45]/80 border border-[#2a2a60] text-white placeholder:text-[#6b6b9a] outline-none focus:border-violet-500" />
          <button onClick={()=>setShow(!show)} className="absolute right-2 top-2 bottom-2 px-5 bg-[#2e2e7a] rounded-xl text-[13px] font-bold text-white">{show?"HIDE":"SHOW"}</button>
        </div>

        <button onClick={handleLogin} className="w-full h-[52px] rounded-full bg-white text-black font-bold text-[15px]">Login</button>
        <button onClick={handleGoogle} className="w-full h-[52px] rounded-full bg-[#2a2a5a] text-white mt-3">Continue with Google</button>

        <p className="text-center text-sm text-[#7a7aa0] mt-6">No account? <Link href="/register" className="text-white font-semibold underline">Register</Link></p>
      </div>
    </div>
  );
}
