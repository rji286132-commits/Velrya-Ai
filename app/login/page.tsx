"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-[24px]">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-zinc-400 mb-8">Login to Velrya AI</p>

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl mb-3 outline-none" />
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl mb-6 outline-none" />

        <button className="w-full bg-white text-black p-3 rounded-xl font-bold hover:bg-zinc-200">Continue</button>
        <Link href="/" className="block text-center text-sm text-zinc-400 mt-6 hover:text-white">← Go to Home</Link>
      </div>
    </div>
  )
}
