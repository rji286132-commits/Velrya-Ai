"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/lib/auth-utils";
import type { User } from "@/types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#08080f] text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar user={user} onLogout={handleLogout} loading={loading} />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl w-full">
          <div className="inline-flex px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur text-xs md:text-sm text-gray-300">
            ✨ Next Gen AI Assistant
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
            Chat Smarter with<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              VELRYA AI
            </span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg mt-4 md:mt-6 max-w-xl mx-auto px-2 mb-8">
            Your intelligent assistant for coding, writing, and ideas. Build, chat, and create amazing things in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0 mb-12">
            <Link
              href={user ? "/chat" : "/login"}
              className="px-8 py-3.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {user ? "Go to Chat" : "Start Chatting"}
            </Link>
            {!user && (
              <Link
                href="/register"
                className="px-8 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition font-semibold transform hover:scale-105"
              >
                Get Started Free
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto w-full px-4 md:px-6">
            <div className="bg-[#12121f]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-purple-500/30 transition">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-400">
                Get instant responses with our optimized AI engine powered by Llama 3.3 70B
              </p>
            </div>

            <div className="bg-[#12121f]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-purple-500/30 transition">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-lg mb-2">Secure Auth</h3>
              <p className="text-sm text-gray-400">
                Your data is protected with enterprise-grade security via Supabase
              </p>
            </div>

            <div className="bg-[#12121f]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-purple-500/30 transition">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-lg mb-2">Deploy Ready</h3>
              <p className="text-sm text-gray-400">
                Export and deploy your ideas anywhere instantly with one click
              </p>
            </div>
          </div>

          <div className="mt-16 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Powerful Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl">🤖</span>
                <span>AI-Powered Responses</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl">💬</span>
                <span>Real-time Chat</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl">📁</span>
                <span>File Support</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl">🎨</span>
                <span>Dark Theme</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl">📋</span>
                <span>Code Export</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl">⚙️</span>
                <span>Full Customization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}