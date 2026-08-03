"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold">🔥 VELRYA AI</h1>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full border border-gray-700 hover:bg-gray-800 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="max-w-3xl">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-gray-700 text-sm text-gray-400">
            ✨ Next Gen AI Assistant
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Chat Smarter with
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              VELRYA AI
            </span>
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto">
            Your intelligent assistant for coding, writing, and ideas. Build, chat, and deploy in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Link
              href="/chat"
              className="px-8 py-3.5 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              Start Chatting →
            </Link>
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-full border border-gray-700 hover:bg-gray-800 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 w-full">
          <div className="bg-[#12121f] border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">Powered by Next.js 14</p>
          </div>
          <div className="bg-[#12121f] border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-lg">Secure Auth</h3>
            <p className="text-gray-400 text-sm">Supabase with Google Login</p>
          </div>
          <div className="bg-[#12121f] border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-bold text-lg">Deploy Ready</h3>
            <p className="text-gray-400 text-sm">Live on Vercel Production</p>
          </div>
        </div>
      </div>
    </div>
  );
}
