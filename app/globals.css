"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Account created! Role: " + data.user.role);
        router.push("/login");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch {
      alert("Server error");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-[#12121f] rounded-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-center text-white">VELRYA AI</h1>
        <h2 className="text-center mt-2 mb-6 text-gray-400">Create Account</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3.5 mb-4 rounded-xl bg-[#1c1c2e] text-white outline-none border border-gray-700 focus:border-white"
        />

        <div className="relative mb-4">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Password (min 8 chars)"
            className="w-full p-3.5 pr-20 rounded-xl bg-[#1c1c2e] text-white outline-none border border-gray-700 focus:border-white"
          />
          <button
            onClick={() => setShow(!show)}
            className="absolute right-2 top-2 bottom-2 px-4 bg-[#2a2a40] rounded-lg text-sm font-bold text-white hover:bg-[#3a3a50]"
          >
            {show ? "HIDE" : "SHOW"}
          </button>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full p-3.5 rounded-full bg-white text-black font-bold mb-3 hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <button
          onClick={handleGoogle}
          className="w-full p-3.5 rounded-full bg-[#1e1e32] text-white mb-3 hover:bg-[#2e2e42]"
        >
          Continue with Google
        </button>

        <div className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
