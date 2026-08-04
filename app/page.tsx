"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("velrya_user") || localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("velrya_user");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="min-h- w-screen bg-[#08080f] text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w- h- bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur- pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w- h- bg-blue-600/10 rounded-full blur- pointer-events-none" />

      <nav className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto w-full relative z-10">
        <h1 className="text-xl md:text-2xl font-black tracking-tight">VELRYA AI</h1>
        <div className="flex gap-2 md:gap-3 items-center">
          {user? (
            <>
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
                {user.email? user.email[0].toUpperCase() : "D"}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 md:px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 transition text-sm md:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 md:px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 transition text-sm md:text-base">Login</Link>
              <Link href="/register" className="px-4 md:px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition text-sm md:text-base">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl w-full">
          <div className="inline-flex px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur text-xs md:text-sm text-gray-300">✨ Next Gen AI Assistant</div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
            Chat Smarter with<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">VELRYA AI</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg mt-4 md:mt-6 max-w-xl mx-auto px-2">Your intelligent assistant for coding, writing, and ideas. Build, chat, and deploy in seconds.</p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 justify-center px-4 sm:px-0">
            <Link href={user? "/chat" : "/login"} className="px-8 py-3.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition shadow-[0_8px_24px_rgba(255,255,255,0.2)]">Start Chatting →</Link>
            {!user && <Link href="/register" className="px-8 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition font-semibold">Get Started Free</Link>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto mt-12 md:mt-20 w-full px-4 md:px-6">
          <div className="bg-[#12121f]/60 backdrop-blur-xl border border-white/10 rounded- p-6 text-center"><div className="text-3xl mb-3">⚡</div><h3 className="font-bold text-lg">Lightning Fast</h3><p className="text-gray-400 text-sm mt-1">Powered by Next.js 14</p></div>
          <div className="bg-[#12121f]/60 backdrop-blur-xl border border-white/10 rounded- p-6 text-center"><div className="text-3xl mb-3">🔒</div><h3 className="font-bold text-lg">Secure Auth</h3><p className="text-gray-400 text-sm mt-1">Supabase with Google Login</p></div>
          <div className="bg-[#12121f]/60 backdrop-blur-xl border border-white/10 rounded- p-6 text-center"><div className="text-3xl mb-3">🚀</div><h3 className="font-bold text-lg">Deploy Ready</h3><p className="text-gray-400 text-sm mt-1">Live on Vercel Production</p></div>
        </div>
      </div>
    </div>
  );
}
