"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage(){
  const [email,setEmail]=useState("deepak21398d@gmail.com")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleLogin=async(e:any)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const res=await fetch("/api/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
      })
      if(res.ok){
        localStorage.setItem("velrya_user",JSON.stringify({email}))
        router.push("/chat")
      } else { alert("Login fail") }
    }catch{ alert("Error") }
    setLoading(false)
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black tracking-tighter">VELRYA AI</Link>
          <h1 className="text-[32px] font-semibold mt-8">Welcome back</h1>
          <p className="text-zinc-400">Login to Velrya AI</p>
        </div>
        <form onSubmit={handleLogin} className="bg-[#171717] border border-zinc-800 rounded-[20px] p-7 space-y-5">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 outline-none focus:border-white" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 outline-none focus:border-white" />
          <button disabled={loading} className="w-full bg-white text-black font-bold py-3.5 rounded-full hover:bg-zinc-200">{loading?"Logging...":"Continue"}</button>
          <div className="text-center"><Link href="/" className="text-sm text-zinc-500 hover:text-white">← Go to Home</Link></div>
        </form>
      </div>
    </div>
  )
}
