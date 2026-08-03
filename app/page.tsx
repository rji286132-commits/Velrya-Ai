import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-wider">VELRYA AI</h1>
        <Link href="/login" className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-zinc-200">Login</Link>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center mt-24 px-4">
        <div className="border border-zinc-800 rounded-full px-4 py-1 text-sm text-zinc-400 mb-6">✨ The Future of Intelligence</div>
        <h1 className="text-6xl md:text-8xl font-bold leading-tight">Think Faster.<br/><span className="text-zinc-500">Create Smarter.</span></h1>
        <p className="text-zinc-400 mt-6 max-w-xl text-lg">Velrya AI is your personal superintelligence for writing, coding, and ideas. Chat, build, and deploy in seconds.</p>
        <div className="flex gap-4 mt-10">
          <Link href="/login" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg">Start Chatting - Free</Link>
          <Link href="/login" className="border border-zinc-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-900">View Demo</Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32 px-6 pb-20">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><h3 className="font-bold text-xl">⚡ Lightning Fast</h3><p className="text-zinc-400 mt-2">Powered by Next.js 14 & Vercel Edge</p></div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><h3 className="font-bold text-xl">🔒 Secure Auth</h3><p className="text-zinc-400 mt-2">Supabase auth with full security</p></div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><h3 className="font-bold text-xl">🚀 Deploy Ready</h3><p className="text-zinc-400 mt-2">Already live on Vercel Production</p></div>
      </div>
    </div>
  )
}
