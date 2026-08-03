"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage(){
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleRegister=async(e:any)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const res=await fetch("/api/auth/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
      })
      if(res.ok){
        alert("Account ban gaya! Ab login karo")
        router.push("/login")
      } else { alert("Fail") }
    }catch{ alert("Error") }
    setLoading(false)
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black tracking-tighter">VELRYA AI</Link>
          <h1 className="text-[32px] font-semibold mt-8">Create account</h1>
          <p className="text-zinc-400">Sign up for Velrya AI</p>
        </div>
        <form onSubmit={handleRegister} className="bg-[#171717] border border-zinc-800 rounded-[20px] p-7 space-y-5">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 outline-none" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 outline-none" />
          <button disabled={loading} className="w-full bg-white text-black font-bold py-3.5 rounded-full">{loading?"Creating...":"Sign Up"}</button>
          <p className="text-center text-sm text-zinc-400">Already have account? <Link href="/login" className="text-white hover:underline">Log in</Link></p>
        </form>
      </div>
    </div>
  )
}
