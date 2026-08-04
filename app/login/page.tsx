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
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-[#12121f] rounded-2xl p-8 border border-white/10">
        <h1 className="text-3xl font-bold text-center text-white tracking-wider">VELRYA AI</h1>
        <p className="text-center mt-2 mb-6 text-gray-400">Login</p>

        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-3.5 mb-4 rounded-xl bg-[#E8F0FE] text-black outline-none" />

        <div className="relative mb-5">
          <input value={password} onChange={(e) => setPassword(e.target.value)} type={show? "text" : "password"} placeholder="Password" className="w-full p-3.5 pr-20 rounded-xl bg-[#E8F0FE] text-black outline-none" />
          <button onClick={() => setShow(!show)} className="absolute right-2 top-2 bottom-2 px-4 bg-[#2a3a8c] rounded-lg text-sm font-bold text-white">{show? "HIDE" : "SHOW"}</button>
        </div>

        <button onClick={handleLogin} className="w-full p-3.5 rounded-full bg-white text-black font-bold mb-3">Login</button>
        <button onClick={handleGoogle} className="w-full p-3.5 rounded-full bg-[#2a2a5a] text-white">Continue with Google</button>

        <div className="text-center text-gray-400 text-sm mt-4">No account? <Link href="/register" className="text-white font-bold">Register</Link></div>
      </div>
    </div>
  );
}
